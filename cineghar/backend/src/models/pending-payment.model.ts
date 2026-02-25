import mongoose, { Document, Schema } from "mongoose";
import type { IUser } from "./user.model";

const pendingPaymentSchema: Schema = new Schema(
  {
    purchaseOrderId: { type: String, required: true, unique: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    seats: { type: [String], required: true },
    totalPrice: { type: Number, required: true },
    showtimeId: { type: String, required: true },
    showtime: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
    discountApplied: { type: Number, default: 0 },
    offerCode: { type: String },
    loyaltyPointsToRedeem: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export interface IPendingPayment extends Document {
  _id: mongoose.Types.ObjectId;
  purchaseOrderId: string;
  user: IUser["_id"];
  seats: string[];
  totalPrice: number;
  showtimeId: string;
  showtime: string;
  metadata?: Record<string, unknown>;
  discountApplied?: number;
  offerCode?: string;
  loyaltyPointsToRedeem?: number;
  createdAt: Date;
  updatedAt: Date;
}

export const PendingPaymentModel = mongoose.model<IPendingPayment>(
  "PendingPayment",
  pendingPaymentSchema
);
