"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import {
  createAdminShowtimeApi,
  getAdminHallsApi,
  type AdminCinemaHall,
} from "@/lib/api/adminBooking";
import { getMoviesApi, type CinegharMovie } from "@/lib/api/publicMovies";
import FormInput from "@/app/_components/FormInput";
import Button from "@/app/_components/Button";
import Alert from "@/app/_components/Alert";

const showtimeSchema = z.object({
  movieId: z.string().min(1, "Movie is required"),
  hallId: z.string().min(1, "Hall is required"),
  startTime: z.string().min(1, "Start time is required"),
});

type ShowtimeFormInputs = z.infer<typeof showtimeSchema>;

export default function AdminCreateShowtimePage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [movies, setMovies] = useState<CinegharMovie[]>([]);
  const [halls, setHalls] = useState<AdminCinemaHall[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ShowtimeFormInputs>({
    resolver: zodResolver(showtimeSchema),
  });

  useEffect(() => {
    const loadOptions = async () => {
      setLoadingOptions(true);
      setError(null);
      try {
        const [moviesRes, hallsRes] = await Promise.all([
          getMoviesApi({ page: 1, limit: 100 }),
          getAdminHallsApi({ page: 1, limit: 100 }),
        ]);
        setMovies(moviesRes.data ?? []);
        setHalls(hallsRes.data ?? []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load movies or halls"
        );
      } finally {
        setLoadingOptions(false);
      }
    };
    void loadOptions();
  }, []);

  const onSubmit = async (data: ShowtimeFormInputs) => {
    setError(null);
    setSuccess(null);
    try {
      await createAdminShowtimeApi({
        movieId: data.movieId,
        hallId: data.hallId,
        startTime: data.startTime,
      });
      setSuccess("Showtime created successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create showtime"
      );
    }
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Showtime</h1>
        <p className="mt-1 text-sm text-gray-500">
          <Link
            href="/admin/showtimes"
            className="text-[#8B0000] hover:underline"
          >
            Showtimes
          </Link>
          {" / Create"}
        </p>
      </header>

      <div className="max-w-md rounded-xl bg-white p-6 shadow-sm border border-gray-200">
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

        {loadingOptions ? (
          <div className="flex items-center justify-center py-10 text-sm text-gray-500">
            Loading movies and halls...
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 [&_label]:text-gray-900 [&_input]:text-gray-900 [&_input::placeholder]:text-gray-600"
          >
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Movie
              </label>
              <select
                className={`block w-full rounded-lg border px-3 py-2 text-sm text-gray-900 focus:border-[#8B0000] focus:outline-none focus:ring-1 focus:ring-[#8B0000] ${
                  errors.movieId ? "border-red-500" : "border-gray-300"
                }`}
                {...register("movieId")}
              >
                <option value="">Select movie</option>
                {movies.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.title}
                  </option>
                ))}
              </select>
              {errors.movieId && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.movieId.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Hall
              </label>
              <select
                className={`block w-full rounded-lg border px-3 py-2 text-sm text-gray-900 focus:border-[#8B0000] focus:outline-none focus:ring-1 focus:ring-[#8B0000] ${
                  errors.hallId ? "border-red-500" : "border-gray-300"
                }`}
                {...register("hallId")}
              >
                <option value="">Select hall</option>
                {halls.map((h) => (
                  <option key={h._id} value={h._id}>
                    {h.name} – {h.city}
                  </option>
                ))}
              </select>
              {errors.hallId && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.hallId.message}
                </p>
              )}
            </div>

            <FormInput
              label="Start time"
              type="datetime-local"
              error={errors.startTime}
              {...register("startTime")}
            />

            <div className="flex gap-2 pt-2">
              <Button type="submit" variant="primary" isLoading={isSubmitting}>
                Create Showtime
              </Button>
              <Link
                href="/admin/showtimes"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

