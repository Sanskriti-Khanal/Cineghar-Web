import mongoose, { Document, Schema } from "mongoose";

const movieSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    genre: { type: [String], default: [] },
    duration: { type: Number, required: true }, // minutes
    rating: { type: Number, required: true, min: 0, max: 10 },
    posterUrl: { type: String, required: false },
    releaseDate: { type: Date, required: false },
  },
  { timestamps: true }
);

export interface IMovie extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  genre: string[];
  duration: number;
  rating: number;
  posterUrl?: string;
  releaseDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const MovieModel = mongoose.model<IMovie>("Movie", movieSchema);
