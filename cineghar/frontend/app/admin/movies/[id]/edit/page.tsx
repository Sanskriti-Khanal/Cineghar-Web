"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import {
  getAdminMovieByIdApi,
  updateAdminMovieApi,
} from "@/lib/api/adminMovies";
import type { Movie } from "@/lib/api/adminMovies";
import FormInput from "@/app/_components/FormInput";
import Button from "@/app/_components/Button";
import Toast from "@/app/_components/Toast";

const updateMovieSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  genre: z.string().optional(),
  duration: z.coerce.number().int().min(1, "Duration must be at least 1 minute"),
  rating: z.coerce.number().min(0).max(10),
  posterUrl: z.union([z.string().url(), z.literal("")]).optional(),
  releaseDate: z.string().optional(),
});

type UpdateMovieFormInputs = z.infer<typeof updateMovieSchema>;

export default function AdminMovieEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    variant: "success" | "error";
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UpdateMovieFormInputs>({
    resolver: zodResolver(updateMovieSchema),
  });

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getAdminMovieByIdApi(id);
        if (res.success && res.data) {
          setMovie(res.data);
          const m = res.data;
          const releaseDateStr = m.releaseDate
            ? new Date(m.releaseDate).toISOString().slice(0, 10)
            : "";
          reset({
            title: m.title,
            description: m.description,
            genre: m.genre?.join(", ") ?? "",
            duration: m.duration,
            rating: m.rating,
            posterUrl: m.posterUrl ?? "",
            releaseDate: releaseDateStr,
          });
        } else {
          setError(res.message || "Failed to load movie");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load movie");
      } finally {
        setLoading(false);
      }
    };

    if (id) void fetchMovie();
  }, [id, reset]);

  const onSubmit = async (data: UpdateMovieFormInputs) => {
    setError(null);
    setToast(null);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      if (data.genre) formData.append("genre", data.genre);
      formData.append("duration", String(data.duration));
      formData.append("rating", String(data.rating));
      if (data.releaseDate) formData.append("releaseDate", data.releaseDate);
      if (data.posterUrl) formData.append("posterUrl", data.posterUrl);
      const fileInput = document.getElementById("movie-poster-edit") as HTMLInputElement;
      if (fileInput?.files?.[0]) formData.append("poster", fileInput.files[0]);
      await updateAdminMovieApi(id, formData);
      setToast({ message: "Movie updated successfully!", variant: "success" });
      setTimeout(() => {
        router.push(`/admin/movies/${id}`);
      }, 1500);
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : "Failed to update movie",
        variant: "error",
      });
    }
  };

  if (loading) {
    return (
      <div>
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Movie</h1>
          <p className="mt-1 text-sm text-gray-500">
            <Link href="/admin/movies" className="text-[#8B0000] hover:underline">
              Movies
            </Link>
            {" / Edit"}
          </p>
        </header>
        <div className="flex items-center justify-center py-24">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#8B0000] border-t-transparent" />
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div>
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Movie</h1>
          <p className="mt-1 text-sm text-gray-500">
            <Link href="/admin/movies" className="text-[#8B0000] hover:underline">
              Movies
            </Link>
            {" / Error"}
          </p>
        </header>
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 shadow-sm">
          <p className="text-red-800">{error || "Movie not found"}</p>
          <Link
            href="/admin/movies"
            className="mt-4 inline-block text-[#8B0000] hover:underline"
          >
            ← Back to Movies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onClose={() => setToast(null)}
        />
      )}
      <div>
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Movie</h1>
          <p className="mt-1 text-sm text-gray-500">
            <Link href="/admin/movies" className="text-[#8B0000] hover:underline">
              Movies
            </Link>
            {" / "}
            <Link href={`/admin/movies/${id}`} className="text-[#8B0000] hover:underline">
              {movie.title}
            </Link>
            {" / Edit"}
          </p>
        </header>

        <div className="max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
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
              placeholder="e.g. Action, Drama"
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
                id="movie-poster-edit"
                type="file"
                accept="image/*"
                className="block w-full text-sm text-gray-900 file:mr-4 file:rounded file:border-0 file:bg-[#8B0000] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-[#6B0000]"
              />
              <p className="mt-1 text-xs text-gray-500">
                Upload a new image to replace current poster, or use URL below.
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
                Update Movie
              </Button>
              <Link
                href={`/admin/movies/${id}`}
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
