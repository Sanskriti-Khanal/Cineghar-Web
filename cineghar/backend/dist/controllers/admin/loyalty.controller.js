"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminLoyaltyController = void 0;
const zod_1 = __importDefault(require("zod"));
const user_model_1 = require("../../models/user.model");
const loyalty_transaction_model_1 = require("../../models/loyalty-transaction.model");
const loyalty_rule_model_1 = require("../../models/loyalty-rule.model");
const http_error_1 = require("../../errors/http-error");
const AdjustPointsDto = zod_1.default.object({
    userId: zod_1.default.string(),
    change: zod_1.default
        .number()
        .int()
        .refine((val) => val !== 0, {
        message: "Change must be non-zero",
    }),
    reason: zod_1.default.string().min(3),
});
const CreateLoyaltyRuleDto = zod_1.default.object({
    name: zod_1.default.string().min(3),
    description: zod_1.default.string().optional(),
    pointsPerCurrencyUnit: zod_1.default.number().positive(),
    startDate: zod_1.default.string().datetime(),
    endDate: zod_1.default.string().datetime().optional(),
    isActive: zod_1.default.boolean().optional(),
});
class AdminLoyaltyController {
    async listUsers(req, res) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 20;
            const skip = (page - 1) * limit;
            const [users, total] = await Promise.all([
                user_model_1.UserModel.find({})
                    .select("name email loyaltyPoints role createdAt")
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                user_model_1.UserModel.countDocuments(),
            ]);
            const totalPages = Math.ceil(total / limit);
            return res.status(200).json({
                success: true,
                data: users,
                page,
                limit,
                totalPages,
                totalUsers: total,
            });
        }
        catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
    async getUserHistory(req, res) {
        try {
            const userId = String(req.params.id);
            const user = await user_model_1.UserModel.findById(userId)
                .select("name email loyaltyPoints")
                .lean();
            if (!user) {
                throw new http_error_1.HttpError(404, "User not found");
            }
            const transactions = await loyalty_transaction_model_1.LoyaltyTransactionModel.find({
                user: userId,
            })
                .sort({ createdAt: -1 })
                .lean();
            return res.status(200).json({
                success: true,
                data: {
                    user,
                    transactions,
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
    async adjustPoints(req, res) {
        try {
            const parsed = AdjustPointsDto.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    success: false,
                    message: zod_1.default.prettifyError(parsed.error),
                });
            }
            const { userId, change, reason } = parsed.data;
            const user = await user_model_1.UserModel.findById(userId);
            if (!user) {
                throw new http_error_1.HttpError(404, "User not found");
            }
            const currentPoints = user.loyaltyPoints ?? 0;
            const newBalance = currentPoints + change;
            if (newBalance < 0) {
                throw new http_error_1.HttpError(400, "Insufficient loyalty points for this deduction");
            }
            user.loyaltyPoints = newBalance;
            await user.save();
            const transaction = await loyalty_transaction_model_1.LoyaltyTransactionModel.create({
                user: user._id,
                change,
                reason,
                meta: { adjustedByAdminId: req.user?._id },
            });
            return res.status(200).json({
                success: true,
                message: "Loyalty points updated",
                data: {
                    loyaltyPoints: newBalance,
                    transaction,
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
    async listRules(_req, res) {
        try {
            const rules = await loyalty_rule_model_1.LoyaltyRuleModel.find().sort({ startDate: -1 }).lean();
            return res.status(200).json({
                success: true,
                data: rules,
            });
        }
        catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
    async createRule(req, res) {
        try {
            const parsed = CreateLoyaltyRuleDto.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    success: false,
                    message: zod_1.default.prettifyError(parsed.error),
                });
            }
            const data = parsed.data;
            const rule = await loyalty_rule_model_1.LoyaltyRuleModel.create({
                name: data.name,
                description: data.description,
                pointsPerCurrencyUnit: data.pointsPerCurrencyUnit,
                startDate: new Date(data.startDate),
                endDate: data.endDate ? new Date(data.endDate) : undefined,
                isActive: data.isActive ?? true,
            });
            return res.status(201).json({
                success: true,
                message: "Loyalty rule created",
                data: rule,
            });
        }
        catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
    async updateRule(req, res) {
        try {
            const id = String(req.params.id);
            const parsed = CreateLoyaltyRuleDto.partial().safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    success: false,
                    message: zod_1.default.prettifyError(parsed.error),
                });
            }
            const data = parsed.data;
            const update = { ...data };
            if (data.startDate)
                update.startDate = new Date(data.startDate);
            if (data.endDate)
                update.endDate = new Date(data.endDate);
            const rule = await loyalty_rule_model_1.LoyaltyRuleModel.findByIdAndUpdate(id, update, {
                new: true,
            }).lean();
            if (!rule) {
                throw new http_error_1.HttpError(404, "Loyalty rule not found");
            }
            return res.status(200).json({
                success: true,
                message: "Loyalty rule updated",
                data: rule,
            });
        }
        catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
    async deleteRule(req, res) {
        try {
            const id = String(req.params.id);
            const deleted = await loyalty_rule_model_1.LoyaltyRuleModel.findByIdAndDelete(id).lean();
            if (!deleted) {
                throw new http_error_1.HttpError(404, "Loyalty rule not found");
            }
            return res.status(200).json({
                success: true,
                message: "Loyalty rule deleted",
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
exports.AdminLoyaltyController = AdminLoyaltyController;
