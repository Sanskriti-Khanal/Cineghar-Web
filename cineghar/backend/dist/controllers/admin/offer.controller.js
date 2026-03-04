"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminOfferController = void 0;
const zod_1 = __importDefault(require("zod"));
const offer_model_1 = require("../../models/offer.model");
const http_error_1 = require("../../errors/http-error");
const CreateOfferDto = zod_1.default.object({
    name: zod_1.default.string().min(3),
    code: zod_1.default.string().min(3),
    description: zod_1.default.string().optional(),
    type: zod_1.default.enum(["percentage_discount", "fixed_discount", "bonus_points"]),
    discountPercent: zod_1.default.number().min(0).max(100).optional(),
    discountAmount: zod_1.default.number().min(0).optional(),
    bonusPoints: zod_1.default.number().int().min(0).optional(),
    minSpend: zod_1.default.number().min(0).optional(),
    startDate: zod_1.default.string().datetime(),
    endDate: zod_1.default.string().datetime().optional(),
    isActive: zod_1.default.boolean().optional(),
    maxRedemptions: zod_1.default.number().int().min(1).optional(),
    perUserLimit: zod_1.default.number().int().min(1).optional(),
});
class AdminOfferController {
    async list(req, res) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 20;
            const skip = (page - 1) * limit;
            const [offers, total] = await Promise.all([
                offer_model_1.OfferModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
                offer_model_1.OfferModel.countDocuments(),
            ]);
            const totalPages = Math.ceil(total / limit);
            return res.status(200).json({
                success: true,
                data: offers,
                page,
                limit,
                totalPages,
                totalOffers: total,
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
            const offer = await offer_model_1.OfferModel.findById(id).lean();
            if (!offer) {
                throw new http_error_1.HttpError(404, "Offer not found");
            }
            return res.status(200).json({
                success: true,
                data: offer,
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
            const parsed = CreateOfferDto.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    success: false,
                    message: zod_1.default.prettifyError(parsed.error),
                });
            }
            const data = parsed.data;
            const doc = {
                ...data,
                startDate: new Date(data.startDate),
                endDate: data.endDate ? new Date(data.endDate) : undefined,
            };
            const offer = await offer_model_1.OfferModel.create(doc);
            return res.status(201).json({
                success: true,
                message: "Offer created",
                data: offer,
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
            const parsed = CreateOfferDto.partial().safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    success: false,
                    message: zod_1.default.prettifyError(parsed.error),
                });
            }
            const data = parsed.data;
            const update = {
                ...data,
            };
            if (data.startDate)
                update.startDate = new Date(data.startDate);
            if (data.endDate)
                update.endDate = new Date(data.endDate);
            const offer = await offer_model_1.OfferModel.findByIdAndUpdate(id, update, {
                new: true,
            }).lean();
            if (!offer) {
                throw new http_error_1.HttpError(404, "Offer not found");
            }
            return res.status(200).json({
                success: true,
                message: "Offer updated",
                data: offer,
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
            const deleted = await offer_model_1.OfferModel.findByIdAndDelete(id).lean();
            if (!deleted) {
                throw new http_error_1.HttpError(404, "Offer not found");
            }
            return res.status(200).json({
                success: true,
                message: "Offer deleted",
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
exports.AdminOfferController = AdminOfferController;
