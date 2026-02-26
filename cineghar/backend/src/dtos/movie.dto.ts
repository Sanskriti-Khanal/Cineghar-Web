import z from "zod";

export const CreateMovieDto = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  genre: z.array(z.string()).default([]),
  duration: z.coerce.number().int().min(1, "Duration must be at least 1 minute"),
  rating: z.coerce.number().min(0).max(10),
  posterUrl: z.union([z.string().url(), z.string().startsWith("/")]).optional().or(z.literal("")),
  releaseDate: z.string().optional(),
});

export type CreateMovieDto = z.infer<typeof CreateMovieDto>;

export const UpdateMovieDto = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  genre: z.array(z.string()).optional(),
  duration: z.coerce.number().int().min(1).optional(),
  rating: z.coerce.number().min(0).max(10).optional(),
  posterUrl: z.union([z.string().url(), z.string().startsWith("/")]).optional().or(z.literal("")),
  releaseDate: z.string().optional(),
});

export type UpdateMovieDto = z.infer<typeof UpdateMovieDto>;
