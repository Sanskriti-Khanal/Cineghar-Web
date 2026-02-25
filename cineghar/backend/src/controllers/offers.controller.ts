import { Request, Response } from "express";
import { OfferModel } from "../models/offer.model";
import { HttpError } from "../errors/http-error";

/** GET /api/offers – list active offers (for booking discount). */
export async function listActiveOffers(req: Request, res: Response) {
  try {
    const now = new Date();
    const offers = await OfferModel.find({
      isActive: true,
      startDate: { $lte: now },
      $or: [{ endDate: { $exists: false } }, { endDate: null }, { endDate: { $gte: now } }],
    })
      .select("name code description type discountPercent discountAmount minSpend")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: offers,
    });
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
}
