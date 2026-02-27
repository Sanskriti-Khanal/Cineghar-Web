import { Request, Response } from "express";
import z from "zod";
import {
  SnackItemModel,
  type SnackCategory,
} from "../../models/snack-item.model";
import { SnackComboModel } from "../../models/snack-combo.model";
import { HttpError } from "../../errors/http-error";

const CreateSnackItemDto = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.coerce.number().min(0),
  category: z.enum(["veg", "nonveg", "beverage"]) as z.ZodType<SnackCategory>,
  imageUrl: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

const CreateSnackComboDto = z.object({
  name: z.string().min(2),
  itemsPreview: z.string().min(3),
  price: z.coerce.number().min(0),
  originalPrice: z.coerce.number().min(0).optional(),
  discountLabel: z.string().optional(),
  imageUrl: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

export class AdminSnackController {
  // Snack items
  async listItems(_req: Request, res: Response) {
    try {
      const items = await SnackItemModel.find()
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

  async getItem(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const item = await SnackItemModel.findById(id).lean();
      if (!item) {
        throw new HttpError(404, "Snack item not found");
      }
      return res.status(200).json({
        success: true,
        data: item,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async createItem(req: Request, res: Response) {
    try {
      const parsed = CreateSnackItemDto.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsed.error),
        });
      }
      const data = parsed.data;
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : data.imageUrl;
      const item = await SnackItemModel.create({
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
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async updateItem(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const parsed = CreateSnackItemDto.partial().safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsed.error),
        });
      }
      const data = parsed.data;
      const update: Record<string, unknown> = { ...data };
      if (req.file) {
        update.imageUrl = `/uploads/${req.file.filename}`;
      }
      const item = await SnackItemModel.findByIdAndUpdate(
        id,
        { $set: update },
        { new: true }
      ).lean();
      if (!item) {
        throw new HttpError(404, "Snack item not found");
      }
      return res.status(200).json({
        success: true,
        message: "Snack item updated",
        data: item,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async deleteItem(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const deleted = await SnackItemModel.findByIdAndDelete(id).lean();
      if (!deleted) {
        throw new HttpError(404, "Snack item not found");
      }
      return res.status(200).json({
        success: true,
        message: "Snack item deleted",
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  // Snack combos
  async listCombos(_req: Request, res: Response) {
    try {
      const combos = await SnackComboModel.find()
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

  async getCombo(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const combo = await SnackComboModel.findById(id).lean();
      if (!combo) {
        throw new HttpError(404, "Snack combo not found");
      }
      return res.status(200).json({
        success: true,
        data: combo,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async createCombo(req: Request, res: Response) {
    try {
      const parsed = CreateSnackComboDto.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsed.error),
        });
      }
      const data = parsed.data;
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : data.imageUrl;
      const combo = await SnackComboModel.create({
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
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async updateCombo(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const parsed = CreateSnackComboDto.partial().safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsed.error),
        });
      }
      const data = parsed.data;
      const update: Record<string, unknown> = { ...data };
      if (req.file) {
        update.imageUrl = `/uploads/${req.file.filename}`;
      }
      const combo = await SnackComboModel.findByIdAndUpdate(
        id,
        { $set: update },
        { new: true }
      ).lean();
      if (!combo) {
        throw new HttpError(404, "Snack combo not found");
      }
      return res.status(200).json({
        success: true,
        message: "Snack combo updated",
        data: combo,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async deleteCombo(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const deleted = await SnackComboModel.findByIdAndDelete(id).lean();
      if (!deleted) {
        throw new HttpError(404, "Snack combo not found");
      }
      return res.status(200).json({
        success: true,
        message: "Snack combo deleted",
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}

