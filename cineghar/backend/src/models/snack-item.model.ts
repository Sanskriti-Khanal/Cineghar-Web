import mongoose, { Document, Schema } from "mongoose";

export type SnackCategory = "veg" | "nonveg" | "beverage";

const snackItemSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
    price: { type: Number, required: true },
    category: {
      type: String,
      enum: ["veg", "nonveg", "beverage"],
      required: true,
    },
    imageUrl: { type: String, required: false },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export interface ISnackItem extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  price: number;
  category: SnackCategory;
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export const SnackItemModel = mongoose.model<ISnackItem>(
  "SnackItem",
  snackItemSchema
);

