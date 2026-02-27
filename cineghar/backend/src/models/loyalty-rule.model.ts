import mongoose, { Document, Schema } from "mongoose";

const loyaltyRuleSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
    pointsPerCurrencyUnit: { type: Number, required: true }, // e.g. 0.01 => 1 point per 100
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export interface ILoyaltyRule extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  pointsPerCurrencyUnit: number;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const LoyaltyRuleModel = mongoose.model<ILoyaltyRule>(
  "LoyaltyRule",
  loyaltyRuleSchema
);

