"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const axios_1 = __importDefault(require("axios"));
const configs_1 = require("../configs");
const http_error_1 = require("../errors/http-error");
const pending_payment_model_1 = require("../models/pending-payment.model");
const order_model_1 = require("../models/order.model");
const user_model_1 = require("../models/user.model");
const loyalty_transaction_model_1 = require("../models/loyalty-transaction.model");
const offer_model_1 = require("../models/offer.model");
const POINTS_PER_SEAT = 5;
/** 1 loyalty point = 1 NPR discount when redeeming */
const LOYALTY_POINTS_PER_NPR = 1;
class PaymentController {
    async initiateKhaltiEpayment(req, res) {
        try {
            const secretKey = (configs_1.KHALTI_SECRET_KEY || "").trim();
            if (!secretKey) {
                throw new http_error_1.HttpError(500, "Khalti configuration missing. Set KHALTI_SECRET_KEY in backend .env (get it from test-admin.khalti.com for sandbox).");
            }
            const body = req.body;
            const subtotal = body.amount;
            const purchaseOrderId = body.purchaseOrderId;
            const purchaseOrderName = body.purchaseOrderName;
            const offerCode = typeof body.offerCode === "string" ? body.offerCode.trim() || undefined : undefined;
            const loyaltyPointsToRedeem = typeof body.loyaltyPointsToRedeem === "number" && body.loyaltyPointsToRedeem > 0 ? body.loyaltyPointsToRedeem : undefined;
            if (!subtotal || Number.isNaN(subtotal) || subtotal <= 0) {
                throw new http_error_1.HttpError(400, "Valid amount (in NPR) is required");
            }
            if (!purchaseOrderId || !purchaseOrderName) {
                throw new http_error_1.HttpError(400, "purchaseOrderId and purchaseOrderName are required");
            }
            const user = req.user;
            if (!user?._id) {
                throw new http_error_1.HttpError(401, "Unauthorized");
            }
            const metadata = body.metadata || {};
            const seats = Array.isArray(metadata.seats) ? metadata.seats : [];
            const subtotalFromMeta = Number(metadata.total) ?? Number(metadata.ticketSubtotal) ?? subtotal;
            let totalPrice = subtotalFromMeta;
            let discountApplied = 0;
            let appliedOfferCode;
            let appliedLoyaltyPoints = 0;
            if (offerCode && loyaltyPointsToRedeem) {
                throw new http_error_1.HttpError(400, "Use either an offer code or loyalty points, not both");
            }
            if (offerCode) {
                const now = new Date();
                const offer = await offer_model_1.OfferModel.findOne({
                    code: offerCode,
                    isActive: true,
                    type: { $in: ["percentage_discount", "fixed_discount"] },
                    startDate: { $lte: now },
                    $or: [{ endDate: { $exists: false } }, { endDate: null }, { endDate: { $gte: now } }],
                }).lean();
                if (!offer) {
                    throw new http_error_1.HttpError(400, "Invalid or expired offer code");
                }
                const minSpend = offer.minSpend ?? 0;
                if (subtotalFromMeta < minSpend) {
                    throw new http_error_1.HttpError(400, `Minimum spend for this offer is NPR ${minSpend}`);
                }
                if (offer.type === "percentage_discount" && offer.discountPercent != null) {
                    discountApplied = Math.min((subtotalFromMeta * offer.discountPercent) / 100, subtotalFromMeta);
                }
                else if (offer.type === "fixed_discount" && offer.discountAmount != null) {
                    discountApplied = Math.min(offer.discountAmount, subtotalFromMeta);
                }
                totalPrice = Math.max(0, subtotalFromMeta - discountApplied);
                appliedOfferCode = offer.code;
            }
            else if (loyaltyPointsToRedeem) {
                const dbUser = await user_model_1.UserModel.findById(user._id).select("loyaltyPoints").lean();
                const userPoints = dbUser?.loyaltyPoints ?? 0;
                if (loyaltyPointsToRedeem > userPoints) {
                    throw new http_error_1.HttpError(400, "Insufficient loyalty points");
                }
                const maxDiscountFromPoints = loyaltyPointsToRedeem * LOYALTY_POINTS_PER_NPR;
                discountApplied = Math.min(maxDiscountFromPoints, subtotalFromMeta);
                appliedLoyaltyPoints = Math.min(loyaltyPointsToRedeem, Math.floor(discountApplied / LOYALTY_POINTS_PER_NPR));
                totalPrice = Math.max(0, subtotalFromMeta - discountApplied);
            }
            if (totalPrice <= 0) {
                throw new http_error_1.HttpError(400, "Amount after discount must be greater than zero");
            }
            const amountPaisa = Math.round(totalPrice * 100);
            await pending_payment_model_1.PendingPaymentModel.findOneAndUpdate({ purchaseOrderId }, {
                purchaseOrderId,
                user: user._id,
                seats,
                totalPrice,
                metadata: body.metadata,
                discountApplied,
                offerCode: appliedOfferCode,
                loyaltyPointsToRedeem: appliedLoyaltyPoints,
            }, { upsert: true, new: true });
            const returnUrl = `${configs_1.FRONTEND_URL}/auth/payment/khalti/return?po=${encodeURIComponent(purchaseOrderId)}`;
            const payload = {
                return_url: returnUrl,
                website_url: configs_1.KHALTI_WEBSITE_URL,
                amount: amountPaisa,
                purchase_order_id: purchaseOrderId,
                purchase_order_name: purchaseOrderName,
            };
            if (body.metadata) {
                payload.merchant_extra = JSON.stringify(body.metadata);
            }
            const { data } = await axios_1.default.post(`${configs_1.KHALTI_BASE_URL}/epayment/initiate/`, payload, {
                headers: {
                    Authorization: `key ${secretKey}`,
                    "Content-Type": "application/json",
                },
            });
            return res.status(200).json({
                success: true,
                data,
            });
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                const status = error.response?.status ?? 500;
                let message = error.response?.data?.detail ||
                    error.response?.data?.message ||
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
    async lookupKhaltiPayment(req, res) {
        try {
            const secretKey = (configs_1.KHALTI_SECRET_KEY || "").trim();
            if (!secretKey) {
                throw new http_error_1.HttpError(500, "Khalti configuration missing. Set KHALTI_SECRET_KEY in backend .env");
            }
            const pidx = req.body?.pidx ||
                req.query?.pidx;
            if (!pidx) {
                throw new http_error_1.HttpError(400, "pidx is required");
            }
            const { data } = await axios_1.default.post(`${configs_1.KHALTI_BASE_URL}/epayment/lookup/`, { pidx }, {
                headers: {
                    Authorization: `key ${secretKey}`,
                    "Content-Type": "application/json",
                },
            });
            return res.status(200).json({
                success: true,
                data,
            });
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                const status = error.response?.status ?? 500;
                const message = error.response?.data?.detail ||
                    error.response?.data?.message ||
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
    async confirmPayment(req, res) {
        try {
            const user = req.user;
            if (!user?._id) {
                throw new http_error_1.HttpError(401, "Unauthorized");
            }
            const secretKey = (configs_1.KHALTI_SECRET_KEY || "").trim();
            if (!secretKey) {
                throw new http_error_1.HttpError(500, "Khalti configuration missing");
            }
            const { pidx, purchaseOrderId } = req.body;
            if (!pidx || !purchaseOrderId) {
                throw new http_error_1.HttpError(400, "pidx and purchaseOrderId are required");
            }
            const existingOrder = await order_model_1.OrderModel.findOne({ purchaseOrderId }).lean();
            if (existingOrder) {
                return res.status(200).json({
                    success: true,
                    message: "Order already confirmed",
                    data: existingOrder,
                });
            }
            const { data: lookupData } = await axios_1.default.post(`${configs_1.KHALTI_BASE_URL}/epayment/lookup/`, { pidx }, {
                headers: {
                    Authorization: `key ${secretKey}`,
                    "Content-Type": "application/json",
                },
            });
            if (lookupData.status !== "Completed") {
                throw new http_error_1.HttpError(400, `Payment not completed. Status: ${lookupData.status}`);
            }
            const pending = await pending_payment_model_1.PendingPaymentModel.findOne({
                purchaseOrderId,
                user: user._id,
            });
            if (!pending) {
                throw new http_error_1.HttpError(404, "Pending payment not found or expired");
            }
            const seatsCount = pending.seats.length;
            const earnedPoints = seatsCount * POINTS_PER_SEAT;
            const redeemPoints = pending.loyaltyPointsToRedeem ?? 0;
            const [order] = await Promise.all([
                order_model_1.OrderModel.create({
                    user: user._id,
                    purchaseOrderId,
                    pidx,
                    khaltiTransactionId: lookupData.transaction_id || undefined,
                    amount: pending.totalPrice,
                    seatsCount,
                    seats: pending.seats,
                    movieTitle: pending.metadata?.movieTitle,
                    movieId: pending.metadata?.movieId,
                    status: "completed",
                }),
                pending_payment_model_1.PendingPaymentModel.deleteOne({ _id: pending._id }),
            ]);
            const dbUser = await user_model_1.UserModel.findById(user._id);
            if (dbUser) {
                if (redeemPoints > 0) {
                    dbUser.loyaltyPoints = (dbUser.loyaltyPoints ?? 0) - redeemPoints;
                    await dbUser.save();
                    await loyalty_transaction_model_1.LoyaltyTransactionModel.create({
                        user: dbUser._id,
                        change: -redeemPoints,
                        reason: "Redeemed for booking",
                        meta: { orderId: order._id },
                    });
                }
                if (earnedPoints > 0) {
                    dbUser.loyaltyPoints = (dbUser.loyaltyPoints ?? 0) + earnedPoints;
                    await dbUser.save();
                    await loyalty_transaction_model_1.LoyaltyTransactionModel.create({
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
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                const status = error.response?.status ?? 500;
                const message = error.response?.data?.detail ||
                    error.response?.data?.message ||
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
}
exports.PaymentController = PaymentController;
