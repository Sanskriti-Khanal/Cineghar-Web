"use client";

import { useEffect, useState } from "react";
import {
  getSalesSummaryOverallApi,
  getSalesSummaryByMovieApi,
  getSalesSummaryByDayApi,
  type SalesSummaryOverall,
  type SalesSummaryByMovie,
  type SalesSummaryByDay,
} from "@/lib/api/adminSales";

type GroupBy = "overall" | "movie" | "day";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString();
}

export default function AdminSalesPage() {
  const [groupBy, setGroupBy] = useState<GroupBy>("overall");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [overall, setOverall] = useState<SummaryOverall | null>(null);
  const [byMovie, setByMovie] = useState<SummaryByMovie | null>(null);
  const [byDay, setByDay] = useState<SummaryByDay | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: { from?: string; to?: string } = {};
      if (from) params.from = new Date(from).toISOString();
      if (to) params.to = new Date(to).toISOString();

      if (groupBy === "overall") {
        const res = await getSalesSummaryOverallApi(params);
        setOverall(res.data);
        setByMovie(null);
        setByDay(null);
      } else if (groupBy === "movie") {
        const res = await getSalesSummaryByMovieApi(params);
        setByMovie(res.data);
        setOverall(null);
        setByDay(null);
      } else {
        const res = await getSalesSummaryByDayApi(params);
        setByDay(res.data);
        setOverall(null);
        setByMovie(null);
      }
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupBy]);

  return (
    <div>
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales</h1>
          <p className="mt-1 text-sm text-gray-500">
            View ticket sales and revenue statistics.
          </p>
        </div>
      </header>

      <div className="mb-6 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col">
            <label className="mb-1 text-xs font-medium text-gray-600">
              From date
            </label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#8B0000] focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-xs font-medium text-gray-600">
              To date
            </label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#8B0000] focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-xs font-medium text-gray-600">
              Group by
            </label>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as GroupBy)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#8B0000] focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
            >
              <option value="overall">Overall</option>
              <option value="movie">Movie</option>
              <option value="day">Day</option>
            </select>
          </div>
        </div>
        <button
          type="button"
          onClick={fetchData}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-md bg-[#8B0000] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#a00000] disabled:opacity-60"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {overall && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Total revenue
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              Rs. {overall.totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Tickets sold
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {overall.totalTickets.toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Bookings
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {overall.totalBookings.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {byMovie && (
        <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Movie
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Revenue
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Tickets
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Bookings
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {byMovie.items.map((item) => (
                <tr key={item.movieId}>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                    {item.movieTitle}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-900">
                    Rs. {item.totalRevenue.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-900">
                    {item.totalTickets.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-900">
                    {item.totalBookings.toLocaleString()}
                  </td>
                </tr>
              ))}
              {byMovie.items.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-sm text-gray-500"
                  >
                    No data for the selected range.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {byDay && (
        <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Date
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Revenue
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Tickets
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Bookings
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {byDay.items.map((item) => (
                <tr key={item.date}>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                    {formatDate(item.date)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-900">
                    Rs. {item.totalRevenue.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-900">
                    {item.totalTickets.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-900">
                    {item.totalBookings.toLocaleString()}
                  </td>
                </tr>
              ))}
              {byDay.items.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-sm text-gray-500"
                  >
                    No data for the selected range.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

