import { Request, Response } from "express";
import { SnackItemModel } from "../models/snack-item.model";
import { SnackComboModel } from "../models/snack-combo.model";

export class SnackController {
  async listItems(_req: Request, res: Response) {
    try {
      const items = await SnackItemModel.find({ isActive: true })
        .sort({ sortOrder: 1, name: 1 })
        .lean();
      return res.status(200).json({
        success: true,
        data: items,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async listCombos(_req: Request, res: Response) {
    try {
      const combos = await SnackComboModel.find({ isActive: true })
        .sort({ sortOrder: 1, name: 1 })
        .lean();
      return res.status(200).json({
        success: true,
        data: combos,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}

