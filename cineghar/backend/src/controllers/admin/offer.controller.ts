import { Request, Response } from "express";
import z from "zod";
import { OfferModel } from "../../models/offer.model";
import { HttpError } from "../../errors/http-error";

const CreateOfferDto = z.object({
  name: z.string().min(3),
  code: z.string().min(3),
  description: z.string().optional(),
  type: z.enum(["percentage_discount", "fixed_discount", "bonus_points"]),
  discountPercent: z.number().min(0).max(100).optional(),
  discountAmount: z.number().min(0).optional(),
  bonusPoints: z.number().int().min(0).optional(),
  minSpend: z.number().min(0).optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  isActive: z.boolean().optional(),
  maxRedemptions: z.number().int().min(1).optional(),
  perUserLimit: z.number().int().min(1).optional(),
});

export class AdminOfferController {
  async list(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      const [offers, total] = await Promise.all([
        OfferModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        OfferModel.countDocuments(),
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
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const offer = await OfferModel.findById(id).lean();
      if (!offer) {
        throw new HttpError(404, "Offer not found");
      }
      return res.status(200).json({
        success: true,
        data: offer,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const parsed = CreateOfferDto.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsed.error),
        });
      }
      const data = parsed.data;
      const doc = {
        ...data,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      };
      const offer = await OfferModel.create(doc);
      return res.status(201).json({
        success: true,
        message: "Offer created",
        data: offer,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const parsed = CreateOfferDto.partial().safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsed.error),
        });
      }
      const data = parsed.data;
      const update: Record<string, unknown> = {
        ...data,
      };
      if (data.startDate) update.startDate = new Date(data.startDate);
      if (data.endDate) update.endDate = new Date(data.endDate);
      const offer = await OfferModel.findByIdAndUpdate(id, update, {
        new: true,
      }).lean();
      if (!offer) {
        throw new HttpError(404, "Offer not found");
      }
      return res.status(200).json({
        success: true,
        message: "Offer updated",
        data: offer,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const deleted = await OfferModel.findByIdAndDelete(id).lean();
      if (!deleted) {
        throw new HttpError(404, "Offer not found");
      }
      return res.status(200).json({
        success: true,
        message: "Offer deleted",
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}

