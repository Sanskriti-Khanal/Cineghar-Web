import mongoose, { Document, Schema } from "mongoose";

const rewardSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: false },
    description: { type: String, required: false },
    pointsRequired: { type: Number, required: true },
    isPopular: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export interface IReward extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  subtitle?: string;
  description?: string;
  pointsRequired: number;
  isPopular: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export const RewardModel = mongoose.model<IReward>("Reward", rewardSchema);

