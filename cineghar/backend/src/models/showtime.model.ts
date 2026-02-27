import mongoose, { Document, Schema } from "mongoose";
import type { IMovie } from "./movie.model";
import type { ICinemaHall } from "./cinema-hall.model";

const showtimeSchema: Schema = new Schema(
  {
    movie: { type: Schema.Types.ObjectId, ref: "Movie", required: true },
    hall: { type: Schema.Types.ObjectId, ref: "CinemaHall", required: true },
    startTime: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export interface IShowtime extends Document {
  _id: mongoose.Types.ObjectId;
  movie: IMovie["_id"];
  hall: ICinemaHall["_id"];
  startTime: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const ShowtimeModel = mongoose.model<IShowtime>(
  "Showtime",
  showtimeSchema
);

