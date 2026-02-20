"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { createAdminMovieApi } from "@/lib/api/adminMovies";
import FormInput from "@/app/_components/FormInput";
import Button from "@/app/_components/Button";
import Alert from "@/app/_components/Alert";

const createMovieSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  genre: z.string().optional(),
  duration: z.coerce.number().int().min(1, "Duration must be at least 1 minute"),
  rating: z.coerce.number().min(0).max(10),
  posterUrl: z.string().url().optional().or(z.literal("")),
  releaseDate: z.string().optional(),
});

type CreateMovieFormInputs = z.infer<typeof createMovieSchema>;

export default function AdminCreateMoviePage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateMovieFormInputs>({
    resolver: zodResolver(createMovieSchema),
  });

  const onSubmit = async (data: CreateMovieFormInputs) => {
    setError(null);
    setSuccess(null);
    try {
      const genreArray = data.genre
        ? data.genre.split(",").map((g) => g.trim()).filter(Boolean)
        : [];
      await createAdminMovieApi({
        title: data.title,
        description: data.description,
        genre: genreArray,
        duration: data.duration,
        rating: data.rating,
        posterUrl: data.posterUrl || undefined,
        releaseDate: data.releaseDate || undefined,
      });
      setSuccess("Movie created successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create movie");
    }
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Movie</h1>
        <p className="mt-1 text-sm text-gray-500">
          <Link href="/admin/movies" className="text-[#8B0000] hover:underline">
            Movies
          </Link>
          {" / Create"}
        </p>
      </header>

      <div className="max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {error && (
          <Alert
            variant="error"
            className="mb-4"
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}
        {success && (
          <Alert
            variant="success"
            className="mb-4"
            onClose={() => setSuccess(null)}
          >
            {success}
          </Alert>
        )}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 [&_label]:text-gray-900 [&_input]:text-gray-900 [&_input::placeholder]:text-gray-600 [&_textarea]:text-gray-900"
        >
          <FormInput
            label="Title"
            type="text"
            placeholder="Movie title"
            error={errors.title}
            {...register("title")}
          />
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-900">
              Description
            </label>
            <textarea
              rows={4}
              placeholder="Movie description"
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#8B0000] focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
              {...register("description")}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>
          <FormInput
            label="Genre (comma-separated)"
            type="text"
            placeholder="e.g. Action, Drama, Comedy"
            error={errors.genre}
            {...register("genre")}
          />
          <FormInput
            label="Duration (minutes)"
            type="number"
            placeholder="120"
            error={errors.duration}
            {...register("duration")}
          />
          <FormInput
            label="Rating (0–10)"
            type="number"
            step={0.1}
            placeholder="7.5"
            error={errors.rating}
            {...register("rating")}
          />
          <FormInput
            label="Poster URL (optional)"
            type="url"
            placeholder="https://..."
            error={errors.posterUrl}
            {...register("posterUrl")}
          />
          <FormInput
            label="Release date (optional)"
            type="date"
            error={errors.releaseDate}
            {...register("releaseDate")}
          />
          <div className="flex gap-2 pt-2">
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Create Movie
            </Button>
            <Link
              href="/admin/movies"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
