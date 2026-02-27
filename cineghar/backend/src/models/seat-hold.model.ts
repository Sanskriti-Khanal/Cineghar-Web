import mongoose, { Document, Schema } from "mongoose";
import type { IShowtime } from "./showtime.model";
import type { IUser } from "./user.model";

const seatHoldSchema: Schema = new Schema(
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
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index, documents are removed automatically after expiresAt
    },
  },
  { timestamps: true }
);

export interface ISeatHold extends Document {
  _id: mongoose.Types.ObjectId;
  showtime: IShowtime["_id"];
  user: IUser["_id"];
  seats: string[];
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const SeatHoldModel = mongoose.model<ISeatHold>(
  "SeatHold",
  seatHoldSchema
);

