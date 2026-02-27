"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  getAdminShowtimesApi,
  deleteAdminShowtimeApi,
  type AdminShowtime,
} from "@/lib/api/adminBooking";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export default function AdminShowtimesPage() {
  const [showtimes, setShowtimes] = useState<AdminShowtime[]>([]);
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [limit] = useState(DEFAULT_LIMIT);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchShowtimes = useCallback(
    async (p: number) => {
      setLoading(true);
      setError(null);
      try {
        const res = await getAdminShowtimesApi({ page: p, limit });
        setShowtimes(res.data ?? []);
        setTotalPages(res.totalPages ?? 0);
        setTotal(res.total ?? 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load showtimes");
        setShowtimes([]);
      } finally {
        setLoading(false);
      }
    },
    [limit]
  );

  useEffect(() => {
    void fetchShowtimes(page);
  }, [page, fetchShowtimes]);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this showtime? This action cannot be undone."
    );
    if (!confirmed) return;

    setDeletingId(id);
    setError(null);
    try {
      await deleteAdminShowtimeApi(id);
      const res = await getAdminShowtimesApi({ page, limit });
      const newItems = res.data ?? [];
      const newTotalPages = res.totalPages ?? 0;
      if (newItems.length === 0 && page > 1 && newTotalPages > 0) {
        setPage(page - 1);
      } else {
        setShowtimes(newItems);
        setTotalPages(newTotalPages);
        setTotal(res.total ?? 0);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete showtime"
      );
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
          <h1 className="text-2xl font-bold text-gray-900">Showtimes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage showtimes for all movies and halls{" "}
            {total > 0 && `(${total} total)`}
          </p>
        </div>
        <Link
          href="/admin/showtimes/create"
          className="inline-flex items-center justify-center rounded-lg bg-[#8B0000] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#6B0000]"
        >
          Create Showtime
        </Link>
      </header>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Movie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hall
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                City
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start Time
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {showtimes.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  No showtimes found.
                </td>
              </tr>
            ) : (
              showtimes.map((st) => {
                const movieTitle =
                  typeof st.movie === "string"
                    ? st.movie
                    : st.movie?.title ?? "Unknown movie";
                const hallName =
                  typeof st.hall === "string"
                    ? st.hall
                    : st.hall?.name ?? "Unknown hall";
                const hallCity =
                  typeof st.hall === "string"
                    ? ""
                    : (st.hall as any)?.city ?? "";
                const start = new Date(st.startTime);
                return (
                  <tr key={st._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {movieTitle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {hallName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {hallCity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {start.toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Link
                        href={`/admin/showtimes/${st._id}/edit`}
                        className="text-gray-900 font-semibold hover:underline"
                      >
                        Edit
                      </Link>
                      <span className="mx-2 text-gray-300">|</span>
                      <button
                        type="button"
                        onClick={() => handleDelete(st._id)}
                        disabled={deletingId === st._id}
                        className="text-red-600 font-semibold hover:text-red-800 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId === st._id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-sm text-gray-600">
            <p>
              Showing page {page} of {totalPages || 1}
              {total > 0 && (
                <span className="ml-1">
                  ({total} {total === 1 ? "showtime" : "showtimes"} total)
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

