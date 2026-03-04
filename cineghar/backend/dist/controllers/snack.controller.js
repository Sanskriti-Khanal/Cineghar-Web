"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnackController = void 0;
const snack_item_model_1 = require("../models/snack-item.model");
const snack_combo_model_1 = require("../models/snack-combo.model");
class SnackController {
    async listItems(_req, res) {
        try {
            const items = await snack_item_model_1.SnackItemModel.find({ isActive: true })
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
    async listCombos(_req, res) {
        try {
            const combos = await snack_combo_model_1.SnackComboModel.find({ isActive: true })
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
}
exports.SnackController = SnackController;
