"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listActiveOffers = listActiveOffers;
const offer_model_1 = require("../models/offer.model");
/** GET /api/offers – list active offers (for booking discount). */
async function listActiveOffers(req, res) {
    try {
        const now = new Date();
        const offers = await offer_model_1.OfferModel.find({
            isActive: true,
            startDate: { $lte: now },
            $or: [{ endDate: { $exists: false } }, { endDate: null }, { endDate: { $gte: now } }],
            type: { $in: ["percentage_discount", "fixed_discount"] },
        })
            .select("name code description type discountPercent discountAmount minSpend")
            .sort({ createdAt: -1 })
            .lean();
        return res.status(200).json({
            success: true,
            data: offers,
        });
    }
    catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
}
