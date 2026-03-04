import { Request, Response } from "express";
import { RewardModel } from "../models/reward.model";
import { HttpError } from "../errors/http-error";

/** GET /api/rewards – list active rewards (for Rewards & Benefits dropdown). */
export async function listActiveRewards(req: Request, res: Response) {
  try {
    const rewards = await RewardModel.find({ isActive: true })
      .sort({ sortOrder: 1, createdAt: 1 })
      .select("title subtitle description pointsRequired isPopular sortOrder")
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
