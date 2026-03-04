"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listActiveRewards = listActiveRewards;
const reward_model_1 = require("../models/reward.model");
/** GET /api/rewards – list active rewards (for Rewards & Benefits dropdown). */
async function listActiveRewards(req, res) {
    try {
        const rewards = await reward_model_1.RewardModel.find({ isActive: true })
            .sort({ sortOrder: 1, createdAt: 1 })
            .select("title subtitle description pointsRequired isPopular sortOrder")
            .lean();
        return res.status(200).json({
            success: true,
            data: rewards,
        });
    }
    catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
}
