import mongoose, { Document, Schema } from "mongoose";
import type { IUser } from "./user.model";

const orderSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    purchaseOrderId: { type: String, required: true, unique: true, index: true },
    pidx: { type: String, required: true },
    khaltiTransactionId: { type: String },
    amount: { type: Number, required: true }, // total in NPR
    seatsCount: { type: Number, required: true },
    seats: { type: [String], default: [] },
    movieTitle: { type: String },
    movieId: { type: String },
    status: { type: String, enum: ["completed"], default: "completed" },
  },
  { timestamps: true }
);

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  user: IUser["_id"];
  purchaseOrderId: string;
  pidx: string;
  khaltiTransactionId?: string;
  amount: number;
  seatsCount: number;
  seats: string[];
  movieTitle?: string;
  movieId?: string;
  status: "completed";
  createdAt: Date;
  updatedAt: Date;
}

export const OrderModel = mongoose.model<IOrder>("Order", orderSchema);
