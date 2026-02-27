import mongoose, { Document, Schema } from "mongoose";

const snackComboSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    itemsPreview: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: false },
    discountLabel: { type: String, required: false },
    imageUrl: { type: String, required: false },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export interface ISnackCombo extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  itemsPreview: string;
  price: number;
  originalPrice?: number;
  discountLabel?: string;
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export const SnackComboModel = mongoose.model<ISnackCombo>(
  "SnackCombo",
  snackComboSchema
);

