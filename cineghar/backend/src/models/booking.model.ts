import mongoose, { Document, Schema } from "mongoose";
import type { IShowtime } from "./showtime.model";
import type { IUser } from "./user.model";

const bookingSchema: Schema = new Schema(
  {
    showtime: {
      type: Schema.Types.ObjectId,
      ref: "Showtime",
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    seats: { type: [String], required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
  },
  { timestamps: true }
);

export interface IBooking extends Document {
  _id: mongoose.Types.ObjectId;
  showtime: IShowtime["_id"];
  user: IUser["_id"];
  seats: string[];
  totalPrice: number;
  status: "confirmed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

export const BookingModel = mongoose.model<IBooking>(
  "Booking",
  bookingSchema
);

