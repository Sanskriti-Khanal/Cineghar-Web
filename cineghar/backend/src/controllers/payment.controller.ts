import type { Request, Response } from "express";
import axios from "axios";
import {
  FRONTEND_URL,
  KHALTI_BASE_URL,
  KHALTI_SECRET_KEY,
  KHALTI_WEBSITE_URL,
} from "../configs";
import { HttpError } from "../errors/http-error";
import { PendingPaymentModel } from "../models/pending-payment.model";
import { OrderModel } from "../models/order.model";
import { UserModel } from "../models/user.model";
import { LoyaltyTransactionModel } from "../models/loyalty-transaction.model";
import { OfferModel } from "../models/offer.model";
import { BookingModel } from "../models/booking.model";

const POINTS_PER_SEAT = 5;
/** 1 loyalty point = 1 NPR discount when redeeming */
const LOYALTY_POINTS_PER_NPR = 1;

interface InitiateKhaltiRequestBody {
  amount?: number; // in NPR (rupees) – subtotal before discount
  purchaseOrderId?: string;
  purchaseOrderName?: string;
  metadata?: Record<string, unknown> & {
    seats?: string[];
    total?: number;
    ticketSubtotal?: number;
    movieTitle?: string;
    movieId?: string;
  };
  offerCode?: string;
  loyaltyPointsToRedeem?: number;
  source?: "web" | "mobile";
}

export class PaymentController {
  async initiateKhaltiEpayment(req: Request, res: Response) {
    try {
      const secretKey = (KHALTI_SECRET_KEY || "").trim();
      if (!secretKey) {
        throw new HttpError(
          500,
          "Khalti configuration missing. Set KHALTI_SECRET_KEY in backend .env (get it from test-admin.khalti.com for sandbox)."
        );
      }

      const body = req.body as InitiateKhaltiRequestBody;
      const subtotal = body.amount;
      const purchaseOrderId = body.purchaseOrderId;
      const purchaseOrderName = body.purchaseOrderName;
      const offerCode = typeof body.offerCode === "string" ? body.offerCode.trim() || undefined : undefined;
      const loyaltyPointsToRedeem = typeof body.loyaltyPointsToRedeem === "number" && body.loyaltyPointsToRedeem > 0 ? body.loyaltyPointsToRedeem : undefined;

      if (!subtotal || Number.isNaN(subtotal) || subtotal <= 0) {
        throw new HttpError(400, "Valid amount (in NPR) is required");
      }
      if (!purchaseOrderId || !purchaseOrderName) {
        throw new HttpError(400, "purchaseOrderId and purchaseOrderName are required");
      }

      const user = req.user as { _id: string };
      if (!user?._id) {
        throw new HttpError(401, "Unauthorized");
      }

      const metadata = body.metadata || {};
      const seats = Array.isArray(metadata.seats) ? metadata.seats : [];
      const showtimeId = typeof metadata.showtimeId === "string" ? metadata.showtimeId : undefined;
      const showtime = typeof metadata.showtime === "string" ? metadata.showtime : undefined;

      if (!showtimeId || !showtime) {
        throw new HttpError(400, "showtimeId and showtime are required in metadata");
      }

      const subtotalFromMeta = Number(metadata.total) ?? Number(metadata.ticketSubtotal) ?? subtotal;

      let totalPrice = subtotalFromMeta;
      let discountApplied = 0;
      let appliedOfferCode: string | undefined;
      let appliedLoyaltyPoints = 0;

      if (offerCode && loyaltyPointsToRedeem) {
        throw new HttpError(400, "Use either an offer code or loyalty points, not both");
      }

      if (offerCode) {
        const now = new Date();
        const offer = await OfferModel.findOne({
          code: offerCode,
          isActive: true,
          type: { $in: ["percentage_discount", "fixed_discount"] },
          startDate: { $lte: now },
          $or: [{ endDate: { $exists: false } }, { endDate: null }, { endDate: { $gte: now } }],
        }).lean();
        if (!offer) {
          throw new HttpError(400, "Invalid or expired offer code");
        }
        const minSpend = offer.minSpend ?? 0;
        if (subtotalFromMeta < minSpend) {
          throw new HttpError(400, `Minimum spend for this offer is NPR ${minSpend}`);
        }
        if (offer.type === "percentage_discount" && offer.discountPercent != null) {
          discountApplied = Math.min((subtotalFromMeta * offer.discountPercent) / 100, subtotalFromMeta);
        } else if (offer.type === "fixed_discount" && offer.discountAmount != null) {
          discountApplied = Math.min(offer.discountAmount, subtotalFromMeta);
        }
        totalPrice = Math.max(0, subtotalFromMeta - discountApplied);
        appliedOfferCode = offer.code;
      } else if (loyaltyPointsToRedeem) {
        const dbUser = await UserModel.findById(user._id).select("loyaltyPoints").lean();
        const userPoints = dbUser?.loyaltyPoints ?? 0;
        if (loyaltyPointsToRedeem > userPoints) {
          throw new HttpError(400, "Insufficient loyalty points");
        }
        const maxDiscountFromPoints = loyaltyPointsToRedeem * LOYALTY_POINTS_PER_NPR;
        discountApplied = Math.min(maxDiscountFromPoints, subtotalFromMeta);
        appliedLoyaltyPoints = Math.min(loyaltyPointsToRedeem, Math.floor(discountApplied / LOYALTY_POINTS_PER_NPR));
        totalPrice = Math.max(0, subtotalFromMeta - discountApplied);
      }

      if (totalPrice <= 0) {
        throw new HttpError(400, "Amount after discount must be greater than zero");
      }

      const amountPaisa = Math.round(totalPrice * 100);

      await PendingPaymentModel.findOneAndUpdate(
        { purchaseOrderId },
        {
          purchaseOrderId,
          user: user._id,
          seats,
          totalPrice,
          showtimeId,
          showtime,
          metadata: body.metadata,
          discountApplied,
          offerCode: appliedOfferCode,
          loyaltyPointsToRedeem: appliedLoyaltyPoints,
        },
        { upsert: true, returnDocument: "after" }
      );

      const source = body.source || "web";

      let returnUrl = `${FRONTEND_URL}/auth/payment/khalti/return?po=${encodeURIComponent(purchaseOrderId)}`;
      if (source === "mobile") {
        const host = req.get("host") || "localhost:5050";
        // Normally Express behind a proxy might need trust proxy to get correct protocol, 
        // but typically doing a relative fallback is enough, or just rely on req.protocol
        const protocol = req.headers["x-forwarded-proto"] || req.protocol || "http";
        const baseUrl = `${protocol}://${host}`;
        returnUrl = `${baseUrl}/api/payment/khalti/mobile-return?po=${encodeURIComponent(purchaseOrderId)}`;
      }

      const payload: Record<string, unknown> = {
        return_url: returnUrl,
        website_url: KHALTI_WEBSITE_URL,
        amount: amountPaisa,
        purchase_order_id: purchaseOrderId,
        purchase_order_name: purchaseOrderName,
      };

      if (body.metadata) {
        payload.merchant_extra = JSON.stringify(body.metadata);
      }

      const { data } = await axios.post(
        `${KHALTI_BASE_URL}/epayment/initiate/`,
        payload,
        {
          headers: {
            Authorization: `key ${secretKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status ?? 500;
        let message =
          (error.response?.data as any)?.detail ||
          (error.response?.data as any)?.message ||
          error.message ||
          "Failed to initiate Khalti payment";
        if (status === 401 && /invalid token/i.test(String(message))) {
          message =
            "Khalti secret key is invalid. Check KHALTI_SECRET_KEY in backend .env (get live_secret_key from test-admin.khalti.com for sandbox).";
        }
        return res.status(status).json({
          success: false,
          message,
        });
      }

      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async lookupKhaltiPayment(req: Request, res: Response) {
    try {
      const secretKey = (KHALTI_SECRET_KEY || "").trim();
      if (!secretKey) {
        throw new HttpError(
          500,
          "Khalti configuration missing. Set KHALTI_SECRET_KEY in backend .env"
        );
      }

      const pidx =
        (req.body?.pidx as string | undefined) ||
        (req.query?.pidx as string | undefined);

      if (!pidx) {
        throw new HttpError(400, "pidx is required");
      }

      const { data } = await axios.post(
        `${KHALTI_BASE_URL}/epayment/lookup/`,
        { pidx },
        {
          headers: {
            Authorization: `key ${secretKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status ?? 500;
        const message =
          (error.response?.data as any)?.detail ||
          (error.response?.data as any)?.message ||
          error.message ||
          "Failed to lookup Khalti payment";
        return res.status(status).json({
          success: false,
          message,
        });
      }

      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async confirmPayment(req: Request, res: Response) {
    try {
      const user = req.user as { _id: string };
      if (!user?._id) {
        throw new HttpError(401, "Unauthorized");
      }

      const secretKey = (KHALTI_SECRET_KEY || "").trim();
      if (!secretKey) {
        throw new HttpError(500, "Khalti configuration missing");
      }

      const { pidx, purchaseOrderId } = req.body as {
        pidx?: string;
        purchaseOrderId?: string;
      };
      if (!pidx || !purchaseOrderId) {
        throw new HttpError(400, "pidx and purchaseOrderId are required");
      }

      const existingOrder = await OrderModel.findOne({ purchaseOrderId }).lean();
      if (existingOrder) {
        return res.status(200).json({
          success: true,
          message: "Order already confirmed",
          data: existingOrder,
        });
      }

      const { data: lookupData } = await axios.post<{
        status: string;
        total_amount: number;
        transaction_id: string | null;
      }>(
        `${KHALTI_BASE_URL}/epayment/lookup/`,
        { pidx },
        {
          headers: {
            Authorization: `key ${secretKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (lookupData.status !== "Completed") {
        throw new HttpError(
          400,
          `Payment not completed. Status: ${lookupData.status}`
        );
      }

      const pending = await PendingPaymentModel.findOne({
        purchaseOrderId,
        user: user._id,
      });
      if (!pending) {
        throw new HttpError(404, "Pending payment not found or expired");
      }

      const seatsCount = pending.seats.length;
      const earnedPoints = seatsCount * POINTS_PER_SEAT;
      const redeemPoints = pending.loyaltyPointsToRedeem ?? 0;

      const [order] = await Promise.all([
        OrderModel.create({
          user: user._id,
          purchaseOrderId,
          pidx,
          khaltiTransactionId: lookupData.transaction_id || undefined,
          amount: pending.totalPrice,
          seatsCount,
          seats: pending.seats,
          movieTitle: (pending.metadata as any)?.movieTitle,
          movieId: (pending.metadata as any)?.movieId,
          status: "completed",
        }),
        BookingModel.create({
          showtime: pending.showtimeId,
          user: user._id,
          seats: pending.seats,
          totalPrice: pending.totalPrice,
          status: "confirmed",
        }),
        PendingPaymentModel.deleteOne({ _id: pending._id }),
      ]);

      const dbUser = await UserModel.findById(user._id);
      if (dbUser) {
        if (redeemPoints > 0) {
          dbUser.loyaltyPoints = (dbUser.loyaltyPoints ?? 0) - redeemPoints;
          await dbUser.save();
          await LoyaltyTransactionModel.create({
            user: dbUser._id,
            change: -redeemPoints,
            reason: "Redeemed for booking",
            meta: { orderId: order._id },
          });
        }
        if (earnedPoints > 0) {
          dbUser.loyaltyPoints = (dbUser.loyaltyPoints ?? 0) + earnedPoints;
          await dbUser.save();
          await LoyaltyTransactionModel.create({
            user: dbUser._id,
            change: earnedPoints,
            reason: "Points earned from booking",
            meta: { orderId: order._id, amount: pending.totalPrice, seatsCount },
          });
        }
      }

      return res.status(200).json({
        success: true,
        message: "Order confirmed and loyalty points awarded",
        data: order,
      });
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status ?? 500;
        const message =
          (error.response?.data as any)?.detail ||
          (error.response?.data as any)?.message ||
          error.message ||
          "Failed to confirm payment";
        return res.status(status).json({
          success: false,
          message,
        });
      }
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
  async mobileReturnKhaltiPayment(req: Request, res: Response) {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Status - Cineghar</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            background-color: #f7f9fc;
            color: #333;
          }
          .container {
            background: white;
            padding: 2.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.05);
            text-align: center;
            max-width: 90%;
            width: 400px;
          }
          .icon {
            font-size: 64px;
            color: #10b981;
            margin-bottom: 1rem;
          }
          h2 {
            margin-top: 0;
            color: #111827;
            font-size: 1.5rem;
          }
          p {
            color: #4b5563;
            line-height: 1.5;
            margin-bottom: 1.5rem;
          }
          .button {
            display: inline-block;
            padding: 0.75rem 1.5rem;
            background-color: #3b82f6;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            transition: background-color 0.2s;
          }
          .button:hover {
            background-color: #2563eb;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">✓</div>
          <h2>Payment Reached</h2>
          <p>Your payment process via Khalti is completed.</p>
          <p><strong>Please close this browser window and return to the Cineghar app</strong> to confirm your booking and view your tickets.</p>
          <a href="cineghar://" class="button">Return to App</a>
        </div>
      </body>
      </html>
    `;
    return res.send(html);
  }
}

