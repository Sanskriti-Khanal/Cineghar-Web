import type { Request, Response } from "express";
import axios from "axios";
import {
  FRONTEND_URL,
  KHALTI_BASE_URL,
  KHALTI_SECRET_KEY,
  KHALTI_WEBSITE_URL,
} from "../configs";
import { HttpError } from "../errors/http-error";

interface InitiateKhaltiRequestBody {
  amount?: number; // in NPR (rupees)
  purchaseOrderId?: string;
  purchaseOrderName?: string;
  metadata?: Record<string, unknown>;
}

export class PaymentController {
  async initiateKhaltiEpayment(req: Request, res: Response) {
    try {
      if (!KHALTI_SECRET_KEY) {
        throw new HttpError(
          500,
          "Khalti configuration missing. Please set KHALTI_SECRET_KEY."
        );
      }

      const body = req.body as InitiateKhaltiRequestBody;
      const amountRupees = body.amount;
      const purchaseOrderId = body.purchaseOrderId;
      const purchaseOrderName = body.purchaseOrderName;

      if (
        !amountRupees ||
        Number.isNaN(amountRupees) ||
        amountRupees <= 0
      ) {
        throw new HttpError(400, "Valid amount (in NPR) is required");
      }
      if (!purchaseOrderId || !purchaseOrderName) {
        throw new HttpError(
          400,
          "purchaseOrderId and purchaseOrderName are required"
        );
      }

      const amountPaisa = Math.round(amountRupees * 100);

      const returnUrl = `${FRONTEND_URL}/auth/payment/khalti/return`;

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
            Authorization: `Key ${KHALTI_SECRET_KEY}`,
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
          "Failed to initiate Khalti payment";
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
      if (!KHALTI_SECRET_KEY) {
        throw new HttpError(
          500,
          "Khalti configuration missing. Please set KHALTI_SECRET_KEY."
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
            Authorization: `Key ${KHALTI_SECRET_KEY}`,
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
}

