import mongoose, { Document, Schema } from "mongoose";
import { UserType } from "../types/user.type";

const userMongoSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dateOfBirth: { type: String, required: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    imageUrl: { type: String, required: false },
    resetPasswordToken: { type: String, required: false },
    resetPasswordExpires: { type: Date, required: false },
  },
  {
    timestamps: true,
  }
);

export interface IUser extends UserType, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

export const UserModel = mongoose.model<IUser>("User", userMongoSchema);

