import { Request, Response } from "express";
import z from "zod";
import { RewardModel } from "../../models/reward.model";
import { HttpError } from "../../errors/http-error";

const CreateRewardDto = z.object({
  title: z.string().min(3),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  pointsRequired: z.number().int().min(0),
  isPopular: z.boolean().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export class AdminRewardController {
  async list(_req: Request, res: Response) {
    try {
      const rewards = await RewardModel.find()
        .sort({ sortOrder: 1, createdAt: 1 })
        .lean();
      return res.status(200).json({
        success: true,
        data: rewards,
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
      const reward = await RewardModel.findById(id).lean();
      if (!reward) {
        throw new HttpError(404, "Reward not found");
      }
      return res.status(200).json({
        success: true,
        data: reward,
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
      const parsed = CreateRewardDto.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsed.error),
        });
      }
      const data = parsed.data;
      const reward = await RewardModel.create({
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
      const parsed = CreateRewardDto.partial().safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsed.error),
        });
      }
      const data = parsed.data;
      const reward = await RewardModel.findByIdAndUpdate(
        id,
        {
          $set: data,
        },
        { new: true }
      ).lean();
      if (!reward) {
        throw new HttpError(404, "Reward not found");
      }
      return res.status(200).json({
        success: true,
        message: "Reward updated",
        data: reward,
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
      const deleted = await RewardModel.findByIdAndDelete(id).lean();
      if (!deleted) {
        throw new HttpError(404, "Reward not found");
      }
      return res.status(200).json({
        success: true,
        message: "Reward deleted",
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}

