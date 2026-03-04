"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const order_model_1 = require("../models/order.model");
const http_error_1 = require("../errors/http-error");
class OrderController {
    /** GET /api/orders – list orders for the authenticated user */
    async getMyOrders(req, res) {
        const userId = req.user?._id;
        if (!userId) {
            throw new http_error_1.HttpError(401, "Unauthorized");
        }
        const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
        const orders = await order_model_1.OrderModel.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();
        return res.status(200).json({
            success: true,
            data: orders,
        });
    }
}
exports.OrderController = OrderController;
