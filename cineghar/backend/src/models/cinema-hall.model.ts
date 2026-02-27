import mongoose, { Document, Schema } from "mongoose";

export type City = "Kathmandu" | "Pokhara" | "Chitwan";

const cinemaHallSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    city: {
      type: String,
      enum: ["Kathmandu", "Pokhara", "Chitwan"],
      required: true,
    },
    location: { type: String, required: true },
    rating: { type: Number, default: 0 },
    facilities: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export interface ICinemaHall extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  city: City;
  location: string;
  rating: number;
  facilities: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const CinemaHallModel = mongoose.model<ICinemaHall>(
  "CinemaHall",
  cinemaHallSchema
);

