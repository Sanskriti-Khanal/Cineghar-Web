import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import { LoyaltyTransactionModel } from "../models/loyalty-transaction.model";
import { HttpError } from "../errors/http-error";

export class LoyaltyController {
  async getMyPoints(req: Request, res: Response) {
    try {
      const userId = req.user?._id;
      if (!userId) {
        throw new HttpError(401, "Unauthorized");
      }

      const user = await UserModel.findById(userId).select("loyaltyPoints").lean();
      if (!user) {
        throw new HttpError(404, "User not found");
      }

      const transactions = await LoyaltyTransactionModel.find({
        user: userId,
      })
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();

      return res.status(200).json({
        success: true,
        data: {
          loyaltyPoints: user.loyaltyPoints ?? 0,
          recentTransactions: transactions,
        },
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}

