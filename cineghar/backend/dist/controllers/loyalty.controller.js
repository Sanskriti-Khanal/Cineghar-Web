"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoyaltyController = void 0;
const user_model_1 = require("../models/user.model");
const loyalty_transaction_model_1 = require("../models/loyalty-transaction.model");
const http_error_1 = require("../errors/http-error");
class LoyaltyController {
    async getMyPoints(req, res) {
        try {
            const userId = req.user?._id;
            if (!userId) {
                throw new http_error_1.HttpError(401, "Unauthorized");
            }
            const user = await user_model_1.UserModel.findById(userId).select("loyaltyPoints").lean();
            if (!user) {
                throw new http_error_1.HttpError(404, "User not found");
            }
            const transactions = await loyalty_transaction_model_1.LoyaltyTransactionModel.find({
                user: userId,
            })
                .sort({ createdAt: -1 })
                .limit(20)
                .lean();
            return res.status(200).json({
                success: true,
                data: {
                    loyaltyPoints: user.loyaltyPoints ?? 0,
                    recentTransactions: transactions,
                },
            });
        }
        catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
}
exports.LoyaltyController = LoyaltyController;
