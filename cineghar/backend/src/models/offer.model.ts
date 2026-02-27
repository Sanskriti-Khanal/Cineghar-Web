import mongoose, { Document, Schema } from "mongoose";

type OfferType = "percentage_discount" | "fixed_discount" | "bonus_points";

const offerSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    description: { type: String, required: false },
    type: {
      type: String,
      enum: ["percentage_discount", "fixed_discount", "bonus_points"],
      required: true,
    },
    discountPercent: { type: Number, required: false },
    discountAmount: { type: Number, required: false },
    bonusPoints: { type: Number, required: false },
    minSpend: { type: Number, required: false },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: false },
    isActive: { type: Boolean, default: true },
    maxRedemptions: { type: Number, required: false },
    perUserLimit: { type: Number, required: false },
  },
  { timestamps: true }
);

export interface IOffer extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  code: string;
  description?: string;
  type: OfferType;
  discountPercent?: number;
  discountAmount?: number;
  bonusPoints?: number;
  minSpend?: number;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  maxRedemptions?: number;
  perUserLimit?: number;
  createdAt: Date;
  updatedAt: Date;
}

export const OfferModel = mongoose.model<IOffer>("Offer", offerSchema);

