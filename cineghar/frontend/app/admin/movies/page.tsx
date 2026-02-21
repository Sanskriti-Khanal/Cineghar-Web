"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  getAdminMoviesApi,
  deleteAdminMovieApi,
} from "@/lib/api/adminMovies";
import { getPosterUrl } from "@/lib/api/publicMovies";
import type { Movie } from "@/lib/api/adminMovies";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export default function AdminMoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [limit] = useState(DEFAULT_LIMIT);
  const [totalPages, setTotalPages] = useState(0);
  const [totalMovies, setTotalMovies] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchMovies = useCallback(async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminMoviesApi({ page: p, limit });
      setMovies(res.data ?? []);
      setTotalPages(res.totalPages ?? 0);
      setTotalMovies(res.totalMovies ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load movies");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    void fetchMovies(page);
  }, [page, fetchMovies]);

  const handleDelete = async (movieId: string, title: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    setDeletingId(movieId);
    setError(null);
    try {
      await deleteAdminMovieApi(movieId);
      const res = await getAdminMoviesApi({ page, limit });
      const newMovies = res.data ?? [];
      const newTotalPages = res.totalPages ?? 0;
      if (newMovies.length === 0 && page > 1 && newTotalPages > 0) {
        setPage(page - 1);
      } else {
        setMovies(newMovies);
        setTotalPages(newTotalPages);
        setTotalMovies(res.totalMovies ?? 0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete movie");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#8B0000] border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Movies</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage all movies
            {totalMovies > 0 && ` (${totalMovies} total)`}
          </p>
        </div>
        <Link
          href="/admin/movies/create"
          className="inline-flex items-center justify-center rounded-lg bg-[#8B0000] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#6B0000]"
        >
          Create Movie
        </Link>
      </header>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Poster
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Genre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Language
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {movies.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  No movies found.
                </td>
              </tr>
            ) : (
              movies.map((movie) => (
                <tr key={movie._id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-gray-200">
                      {getPosterUrl(movie.posterUrl) ? (
                        <img
                          src={getPosterUrl(movie.posterUrl)!}
                          alt={movie.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">
                          No image
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {movie.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {movie.genre?.length
                      ? movie.genre.join(", ")
                      : "—"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {movie.duration} min
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {movie.rating}/10
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {movie.language || "—"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                    <Link
                      href={`/admin/movies/${movie._id}`}
                      className="font-semibold text-gray-900 hover:underline"
                    >
                      View
                    </Link>
                    <span className="mx-2 text-gray-300">|</span>
                    <Link
                      href={`/admin/movies/${movie._id}/edit`}
                      className="font-semibold text-gray-900 hover:underline"
                    >
                      Edit
                    </Link>
                    <span className="mx-2 text-gray-300">|</span>
                    <button
                      type="button"
                      onClick={() => handleDelete(movie._id, movie.title)}
                      disabled={deletingId === movie._id}
                      className="font-semibold text-red-600 hover:underline hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === movie._id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {(totalPages > 0 || totalMovies > 0) && (
        <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-sm text-gray-600">
            <p>
              Showing page {page} of {totalPages || 1}
              {totalMovies > 0 && (
                <span className="ml-1">
                  ({totalMovies} {totalMovies === 1 ? "movie" : "movies"} total)
                </span>
              )}
            </p>
          </div>
          {totalPages > 1 && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || loading}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || loading}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
