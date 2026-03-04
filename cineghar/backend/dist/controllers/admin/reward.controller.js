"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRewardController = void 0;
const zod_1 = __importDefault(require("zod"));
const reward_model_1 = require("../../models/reward.model");
const http_error_1 = require("../../errors/http-error");
const CreateRewardDto = zod_1.default.object({
    title: zod_1.default.string().min(3),
    subtitle: zod_1.default.string().optional(),
    description: zod_1.default.string().optional(),
    pointsRequired: zod_1.default.number().int().min(0),
    isPopular: zod_1.default.boolean().optional(),
    isActive: zod_1.default.boolean().optional(),
    sortOrder: zod_1.default.number().int().optional(),
});
class AdminRewardController {
    async list(_req, res) {
        try {
            const rewards = await reward_model_1.RewardModel.find()
                .sort({ sortOrder: 1, createdAt: 1 })
                .lean();
            return res.status(200).json({
                success: true,
                data: rewards,
            });
        }
        catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
    async getOne(req, res) {
        try {
            const id = String(req.params.id);
            const reward = await reward_model_1.RewardModel.findById(id).lean();
            if (!reward) {
                throw new http_error_1.HttpError(404, "Reward not found");
            }
            return res.status(200).json({
                success: true,
                data: reward,
            });
        }
        catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
    async create(req, res) {
        try {
            const parsed = CreateRewardDto.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    success: false,
                    message: zod_1.default.prettifyError(parsed.error),
                });
            }
            const data = parsed.data;
            const reward = await reward_model_1.RewardModel.create({
                title: data.title,
                subtitle: data.subtitle,
                description: data.description,
                pointsRequired: data.pointsRequired,
                isPopular: data.isPopular ?? false,
                isActive: data.isActive ?? true,
                sortOrder: data.sortOrder ?? 0,
            });
            return res.status(201).json({
                success: true,
                message: "Reward created",
                data: reward,
            });
        }
        catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
    async update(req, res) {
        try {
            const id = String(req.params.id);
            const parsed = CreateRewardDto.partial().safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    success: false,
                    message: zod_1.default.prettifyError(parsed.error),
                });
            }
            const data = parsed.data;
            const reward = await reward_model_1.RewardModel.findByIdAndUpdate(id, {
                $set: data,
            }, { new: true }).lean();
            if (!reward) {
                throw new http_error_1.HttpError(404, "Reward not found");
            }
            return res.status(200).json({
                success: true,
                message: "Reward updated",
                data: reward,
            });
        }
        catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
    async remove(req, res) {
        try {
            const id = String(req.params.id);
            const deleted = await reward_model_1.RewardModel.findByIdAndDelete(id).lean();
            if (!deleted) {
                throw new http_error_1.HttpError(404, "Reward not found");
            }
            return res.status(200).json({
                success: true,
                message: "Reward deleted",
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
exports.AdminRewardController = AdminRewardController;
