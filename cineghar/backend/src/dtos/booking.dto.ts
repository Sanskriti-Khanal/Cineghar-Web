import z from "zod";
import type { City } from "../models/cinema-hall.model";

export const CreateCinemaHallDto = z.object({
  name: z.string().min(1, "Name is required"),
  city: z.custom<City>().refine((val): val is City =>
    ["Kathmandu", "Pokhara", "Chitwan"].includes(String(val))
  , { message: "Invalid city" }),
  location: z.string().min(1, "Location is required"),
  rating: z.coerce.number().min(0).max(5).optional(),
  facilities: z.array(z.string()).optional().default([]),
  isActive: z.boolean().optional().default(true),
});

export type CreateCinemaHallDto = z.infer<typeof CreateCinemaHallDto>;

export const UpdateCinemaHallDto = CreateCinemaHallDto.partial();

export type UpdateCinemaHallDto = z.infer<typeof UpdateCinemaHallDto>;

export const CreateShowtimeDto = z.object({
  movieId: z.string().min(1, "movieId is required"),
  hallId: z.string().min(1, "hallId is required"),
  startTime: z.string().min(1, "startTime is required"),
  isActive: z.boolean().optional().default(true),
});

export type CreateShowtimeDto = z.infer<typeof CreateShowtimeDto>;

export const UpdateShowtimeDto = CreateShowtimeDto.partial();

export type UpdateShowtimeDto = z.infer<typeof UpdateShowtimeDto>;

