"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import {
  getAdminShowtimeByIdApi,
  updateAdminShowtimeApi,
  getAdminHallsApi,
  type AdminCinemaHall,
} from "@/lib/api/adminBooking";
import { getMoviesApi, type CinegharMovie } from "@/lib/api/publicMovies";
import FormInput from "@/app/_components/FormInput";
import Button from "@/app/_components/Button";
import Toast from "@/app/_components/Toast";

const showtimeSchema = z.object({
  movieId: z.string().min(1, "Movie is required"),
  hallId: z.string().min(1, "Hall is required"),
  startTime: z.string().min(1, "Start time is required"),
});

type ShowtimeFormInputs = z.infer<typeof showtimeSchema>;

export default function AdminEditShowtimePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    variant: "success" | "error";
  } | null>(null);
  const [movies, setMovies] = useState<CinegharMovie[]>([]);
  const [halls, setHalls] = useState<AdminCinemaHall[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ShowtimeFormInputs>({
    resolver: zodResolver(showtimeSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [stRes, moviesRes, hallsRes] = await Promise.all([
          getAdminShowtimeByIdApi(id),
          getMoviesApi({ page: 1, limit: 100 }),
          getAdminHallsApi({ page: 1, limit: 100 }),
        ]);
        if (!stRes.success || !stRes.data) {
          throw new Error(stRes.message || "Failed to load showtime");
        }
        setMovies(moviesRes.data ?? []);
        setHalls(hallsRes.data ?? []);

        const st = stRes.data;
        const movieId =
          typeof st.movie === "string"
            ? st.movie
            : (st.movie as any)._id ?? "";
        const hallId =
          typeof st.hall === "string"
            ? st.hall
            : (st.hall as any)._id ?? "";
        const startIso = new Date(st.startTime)
          .toISOString()
          .slice(0, 16); // yyyy-MM-ddTHH:mm

        reset({
          movieId,
          hallId,
          startTime: startIso,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load showtime"
        );
      } finally {
        setLoading(false);
      }
    };
    if (id) void fetchData();
  }, [id, reset]);

  const onSubmit = async (data: ShowtimeFormInputs) => {
    setError(null);
    setToast(null);
    try {
      await updateAdminShowtimeApi(id, {
        movieId: data.movieId,
        hallId: data.hallId,
        startTime: data.startTime,
      });
      setToast({
        message: "Showtime updated successfully!",
        variant: "success",
      });
      setTimeout(() => {
        router.push("/admin/showtimes");
      }, 1500);
    } catch (err) {
      setToast({
        message:
          err instanceof Error ? err.message : "Failed to update showtime",
        variant: "error",
      });
    }
  };

  if (loading) {
    return (
      <div>
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Showtime</h1>
        </header>
        <div className="flex items-center justify-center py-24">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#8B0000] border-t-transparent" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Showtime</h1>
        </header>
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 shadow-sm">
          <p className="text-red-800">{error}</p>
          <Link
            href="/admin/showtimes"
            className="mt-4 inline-block text-[#8B0000] hover:underline"
          >
            ← Back to Showtimes
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
          <h1 className="text-2xl font-bold text-gray-900">Edit Showtime</h1>
          <p className="mt-1 text-sm text-gray-500">
            <Link
              href="/admin/showtimes"
              className="text-[#8B0000] hover:underline"
            >
              Showtimes
            </Link>
            {" / Edit"}
          </p>
        </header>

        <div className="max-w-md rounded-xl bg-white p-6 shadow-sm border border-gray-200">
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
                Update Showtime
              </Button>
              <Link
                href="/admin/showtimes"
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

