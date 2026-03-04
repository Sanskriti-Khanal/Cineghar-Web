"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSnackController = void 0;
const zod_1 = __importDefault(require("zod"));
const snack_item_model_1 = require("../../models/snack-item.model");
const snack_combo_model_1 = require("../../models/snack-combo.model");
const http_error_1 = require("../../errors/http-error");
const CreateSnackItemDto = zod_1.default.object({
    name: zod_1.default.string().min(2),
    description: zod_1.default.string().optional(),
    price: zod_1.default.coerce.number().min(0),
    category: zod_1.default.enum(["veg", "nonveg", "beverage"]),
    imageUrl: zod_1.default.string().optional(),
    isActive: zod_1.default.coerce.boolean().optional(),
    sortOrder: zod_1.default.coerce.number().int().optional(),
});
const CreateSnackComboDto = zod_1.default.object({
    name: zod_1.default.string().min(2),
    itemsPreview: zod_1.default.string().min(3),
    price: zod_1.default.coerce.number().min(0),
    originalPrice: zod_1.default.coerce.number().min(0).optional(),
    discountLabel: zod_1.default.string().optional(),
    imageUrl: zod_1.default.string().optional(),
    isActive: zod_1.default.coerce.boolean().optional(),
    sortOrder: zod_1.default.coerce.number().int().optional(),
});
class AdminSnackController {
    // Snack items
    async listItems(_req, res) {
        try {
            const items = await snack_item_model_1.SnackItemModel.find()
                .sort({ sortOrder: 1, name: 1 })
                .lean();
            return res.status(200).json({
                success: true,
                data: items,
            });
        }
        catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
    async getItem(req, res) {
        try {
            const id = String(req.params.id);
            const item = await snack_item_model_1.SnackItemModel.findById(id).lean();
            if (!item) {
                throw new http_error_1.HttpError(404, "Snack item not found");
            }
            return res.status(200).json({
                success: true,
                data: item,
            });
        }
        catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
    async createItem(req, res) {
        try {
            const parsed = CreateSnackItemDto.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    success: false,
                    message: zod_1.default.prettifyError(parsed.error),
                });
            }
            const data = parsed.data;
            const imageUrl = req.file ? `/uploads/${req.file.filename}` : data.imageUrl;
            const item = await snack_item_model_1.SnackItemModel.create({
                ...data,
                imageUrl,
                isActive: data.isActive ?? true,
                sortOrder: data.sortOrder ?? 0,
            });
            return res.status(201).json({
                success: true,
                message: "Snack item created",
                data: item,
            });
        }
        catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
    async updateItem(req, res) {
        try {
            const id = String(req.params.id);
            const parsed = CreateSnackItemDto.partial().safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    success: false,
                    message: zod_1.default.prettifyError(parsed.error),
                });
            }
            const data = parsed.data;
            const update = { ...data };
            if (req.file) {
                update.imageUrl = `/uploads/${req.file.filename}`;
            }
            const item = await snack_item_model_1.SnackItemModel.findByIdAndUpdate(id, { $set: update }, { new: true }).lean();
            if (!item) {
                throw new http_error_1.HttpError(404, "Snack item not found");
            }
            return res.status(200).json({
                success: true,
                message: "Snack item updated",
                data: item,
            });
        }
        catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
    async deleteItem(req, res) {
        try {
            const id = String(req.params.id);
            const deleted = await snack_item_model_1.SnackItemModel.findByIdAndDelete(id).lean();
            if (!deleted) {
                throw new http_error_1.HttpError(404, "Snack item not found");
            }
            return res.status(200).json({
                success: true,
                message: "Snack item deleted",
            });
        }
        catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
    // Snack combos
    async listCombos(_req, res) {
        try {
            const combos = await snack_combo_model_1.SnackComboModel.find()
                .sort({ sortOrder: 1, name: 1 })
                .lean();
            return res.status(200).json({
                success: true,
                data: combos,
            });
        }
        catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
    async getCombo(req, res) {
        try {
            const id = String(req.params.id);
            const combo = await snack_combo_model_1.SnackComboModel.findById(id).lean();
            if (!combo) {
                throw new http_error_1.HttpError(404, "Snack combo not found");
            }
            return res.status(200).json({
                success: true,
                data: combo,
            });
        }
        catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
    async createCombo(req, res) {
        try {
            const parsed = CreateSnackComboDto.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    success: false,
                    message: zod_1.default.prettifyError(parsed.error),
                });
            }
            const data = parsed.data;
            const imageUrl = req.file ? `/uploads/${req.file.filename}` : data.imageUrl;
            const combo = await snack_combo_model_1.SnackComboModel.create({
                ...data,
                imageUrl,
                isActive: data.isActive ?? true,
                sortOrder: data.sortOrder ?? 0,
            });
            return res.status(201).json({
                success: true,
                message: "Snack combo created",
                data: combo,
            });
        }
        catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
    async updateCombo(req, res) {
        try {
            const id = String(req.params.id);
            const parsed = CreateSnackComboDto.partial().safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    success: false,
                    message: zod_1.default.prettifyError(parsed.error),
                });
            }
            const data = parsed.data;
            const update = { ...data };
            if (req.file) {
                update.imageUrl = `/uploads/${req.file.filename}`;
            }
            const combo = await snack_combo_model_1.SnackComboModel.findByIdAndUpdate(id, { $set: update }, { new: true }).lean();
            if (!combo) {
                throw new http_error_1.HttpError(404, "Snack combo not found");
            }
            return res.status(200).json({
                success: true,
                message: "Snack combo updated",
                data: combo,
            });
        }
        catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
    async deleteCombo(req, res) {
        try {
            const id = String(req.params.id);
            const deleted = await snack_combo_model_1.SnackComboModel.findByIdAndDelete(id).lean();
            if (!deleted) {
                throw new http_error_1.HttpError(404, "Snack combo not found");
            }
            return res.status(200).json({
                success: true,
                message: "Snack combo deleted",
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
exports.AdminSnackController = AdminSnackController;
