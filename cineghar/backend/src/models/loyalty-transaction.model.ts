import mongoose, { Document, Schema } from "mongoose";
import type { IUser } from "./user.model";

const loyaltyTransactionSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    change: { type: Number, required: true },
    reason: { type: String, required: true },
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: false,
    },
    meta: {
      type: Schema.Types.Mixed,
      required: false,
    },
  },
  { timestamps: true }
);

export interface ILoyaltyTransaction extends Document {
  _id: mongoose.Types.ObjectId;
  user: IUser["_id"];
  change: number;
  reason: string;
  booking?: mongoose.Types.ObjectId;
  meta?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export const LoyaltyTransactionModel = mongoose.model<ILoyaltyTransaction>(
  "LoyaltyTransaction",
  loyaltyTransactionSchema
);

