import { Request, Response } from "express";
import z from "zod";
import { UserModel } from "../../models/user.model";
import { LoyaltyTransactionModel } from "../../models/loyalty-transaction.model";
import { LoyaltyRuleModel } from "../../models/loyalty-rule.model";
import { HttpError } from "../../errors/http-error";

const AdjustPointsDto = z.object({
  userId: z.string(),
  change: z
    .number()
    .int()
    .refine((val) => val !== 0, {
      message: "Change must be non-zero",
    }),
  reason: z.string().min(3),
});

const CreateLoyaltyRuleDto = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  pointsPerCurrencyUnit: z.number().positive(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  isActive: z.boolean().optional(),
});

type CreateLoyaltyRuleDtoType = z.infer<typeof CreateLoyaltyRuleDto>;

export class AdminLoyaltyController {
  async listUsers(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      const [users, total] = await Promise.all([
        UserModel.find({})
          .select("name email loyaltyPoints role createdAt")
          .skip(skip)
          .limit(limit)
          .lean(),
        UserModel.countDocuments(),
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
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async getUserHistory(req: Request, res: Response) {
    try {
      const userId = String(req.params.id);
      const user = await UserModel.findById(userId)
        .select("name email loyaltyPoints")
        .lean();
      if (!user) {
        throw new HttpError(404, "User not found");
      }

      const transactions = await LoyaltyTransactionModel.find({
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
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async adjustPoints(req: Request, res: Response) {
    try {
      const parsed = AdjustPointsDto.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsed.error),
        });
      }

      const { userId, change, reason } = parsed.data;

      const user = await UserModel.findById(userId);
      if (!user) {
        throw new HttpError(404, "User not found");
      }

      const currentPoints = user.loyaltyPoints ?? 0;
      const newBalance = currentPoints + change;
      if (newBalance < 0) {
        throw new HttpError(400, "Insufficient loyalty points for this deduction");
      }

      user.loyaltyPoints = newBalance;
      await user.save();

      const transaction = await LoyaltyTransactionModel.create({
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
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async listRules(_req: Request, res: Response) {
    try {
      const rules = await LoyaltyRuleModel.find().sort({ startDate: -1 }).lean();
      return res.status(200).json({
        success: true,
        data: rules,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async createRule(req: Request, res: Response) {
    try {
      const parsed = CreateLoyaltyRuleDto.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsed.error),
        });
      }
      const data = parsed.data;
      const rule = await LoyaltyRuleModel.create({
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
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async updateRule(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const parsed = CreateLoyaltyRuleDto.partial().safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsed.error),
        });
      }
      const data = parsed.data;
      const update: Record<string, unknown> = { ...data };
      if (data.startDate) update.startDate = new Date(data.startDate);
      if (data.endDate) update.endDate = new Date(data.endDate);
      const rule = await LoyaltyRuleModel.findByIdAndUpdate(id, update, {
        new: true,
      }).lean();
      if (!rule) {
        throw new HttpError(404, "Loyalty rule not found");
      }
      return res.status(200).json({
        success: true,
        message: "Loyalty rule updated",
        data: rule,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async deleteRule(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const deleted = await LoyaltyRuleModel.findByIdAndDelete(id).lean();
      if (!deleted) {
        throw new HttpError(404, "Loyalty rule not found");
      }
      return res.status(200).json({
        success: true,
        message: "Loyalty rule deleted",
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}

