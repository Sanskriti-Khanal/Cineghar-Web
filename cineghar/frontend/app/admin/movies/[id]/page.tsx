"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getAdminMovieByIdApi } from "@/lib/api/adminMovies";
import { getPosterUrl } from "@/lib/api/publicMovies";
import type { Movie } from "@/lib/api/adminMovies";

export default function AdminMovieDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getAdminMovieByIdApi(id);
        if (res.success && res.data) {
          setMovie(res.data);
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
  }, [id]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div>
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Movie Detail</h1>
          <p className="mt-1 text-sm text-gray-500">
            <Link href="/admin/movies" className="text-[#8B0000] hover:underline">
              Movies
            </Link>
            {" / Loading..."}
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
          <h1 className="text-2xl font-bold text-gray-900">Movie Detail</h1>
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
    <div>
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Movie Detail</h1>
          <p className="mt-1 text-sm text-gray-500">
            <Link href="/admin/movies" className="text-[#8B0000] hover:underline">
              Movies
            </Link>
            {" / "}
            {movie.title}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/admin/movies/${id}/edit`}
            className="inline-flex items-center justify-center rounded-lg bg-[#8B0000] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#6B0000]"
          >
            Edit Movie
          </Link>
          <Link
            href="/admin/movies"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Back to Movies
          </Link>
        </div>
      </header>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="p-8">
          <div className="flex flex-col gap-6 sm:flex-row">
            <div className="flex-shrink-0">
              <div className="h-64 w-44 overflow-hidden rounded-lg bg-gray-200">
                {getPosterUrl(movie.posterUrl) ? (
                  <img
                    src={getPosterUrl(movie.posterUrl)!}
                    alt={movie.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-500">
                    No poster
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Title
                </label>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {movie.title}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Description
                </label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                  {movie.description}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Genre
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {movie.genre?.length ? movie.genre.join(", ") : "—"}
                </p>
              </div>
              <div className="flex gap-6 flex-wrap">
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Duration
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {movie.duration} min
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Rating
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {movie.rating}/10
                  </p>
                </div>
                {movie.language && (
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                      Language
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {movie.language}
                    </p>
                  </div>
                )}
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Release date
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(movie.releaseDate)}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Movie ID
                </label>
                <p className="mt-1 font-mono text-sm text-gray-600">
                  {movie._id}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
