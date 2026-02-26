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
  posterUrl: z.union([z.string().url(), z.literal("")]).optional(),
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
    resolver: zodResolver(createMovieSchema) as import("react-hook-form").Resolver<CreateMovieFormInputs>,
  });

  const onSubmit = async (data: CreateMovieFormInputs) => {
    setError(null);
    setSuccess(null);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      if (data.genre) formData.append("genre", data.genre);
      formData.append("duration", String(data.duration));
      formData.append("rating", String(data.rating));
      if (data.releaseDate) formData.append("releaseDate", data.releaseDate);
      if (data.posterUrl) formData.append("posterUrl", data.posterUrl);
      const fileInput = document.getElementById("movie-poster") as HTMLInputElement;
      if (fileInput?.files?.[0]) formData.append("poster", fileInput.files[0]);
      await createAdminMovieApi(formData);
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
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-900">
              Rating (0–10)
            </label>
            <input
              type="number"
              step={0.1}
              placeholder="7.5"
              className={`block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#8B0000] focus:outline-none focus:ring-1 focus:ring-[#8B0000] ${
                errors.rating ? "border-red-500" : ""
              }`}
              {...register("rating")}
            />
            {errors.rating && (
              <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-900">
              Poster image (optional)
            </label>
            <input
              id="movie-poster"
              type="file"
              accept="image/*"
              className="block w-full text-sm text-gray-900 file:mr-4 file:rounded file:border-0 file:bg-[#8B0000] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-[#6B0000]"
            />
            <p className="mt-1 text-xs text-gray-500">
              Upload an image or use a URL below.
            </p>
          </div>
          <FormInput
            label="Poster URL (optional, if not uploading)"
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
