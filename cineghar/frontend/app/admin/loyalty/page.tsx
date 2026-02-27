"use client";

import { useEffect, useState } from "react";
import {
  getLoyaltyUsersApi,
  getLoyaltyUserHistoryApi,
  adjustLoyaltyPointsApi,
  type LoyaltyUserSummary,
  type LoyaltyUserHistory,
} from "@/lib/api/adminLoyalty";

export default function AdminLoyaltyPage() {
  const [users, setUsers] = useState<LoyaltyUserSummary[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [history, setHistory] = useState<LoyaltyUserHistory | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [adjustChange, setAdjustChange] = useState<string>("");
  const [adjustReason, setAdjustReason] = useState<string>("");
  const [adjustLoading, setAdjustLoading] = useState(false);
  const [adjustError, setAdjustError] = useState<string | null>(null);

  const fetchUsers = async (p: number) => {
    try {
      setLoading(true);
      setError(null);
      const res = await getLoyaltyUsersApi({ page: p, limit: 10 });
      setUsers(res.data ?? []);
      setTotalPages(res.totalPages ?? 0);
      setTotalUsers(res.totalUsers ?? 0);
    } catch (e: any) {
      setError(e.message || "Failed to load loyalty users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async (userId: string) => {
    try {
      setHistoryLoading(true);
      setAdjustError(null);
      const res = await getLoyaltyUserHistoryApi(userId);
      setHistory(res.data);
      setSelectedUserId(userId);
      setAdjustChange("");
      setAdjustReason("");
    } catch (e: any) {
      setAdjustError(e.message || "Failed to load user history");
      setHistory(null);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;
    const change = Number(adjustChange);
    if (!Number.isFinite(change) || change === 0) {
      setAdjustError("Change must be a non-zero number");
      return;
    }
    if (!adjustReason || adjustReason.trim().length < 3) {
      setAdjustError("Reason must be at least 3 characters");
      return;
    }

    try {
      setAdjustLoading(true);
      setAdjustError(null);
      await adjustLoyaltyPointsApi({
        userId: selectedUserId,
        change,
        reason: adjustReason.trim(),
      });
      await fetchUsers(page);
      await fetchHistory(selectedUserId);
    } catch (e: any) {
      setAdjustError(e.message || "Failed to adjust points");
    } finally {
      setAdjustLoading(false);
    }
  };

  useEffect(() => {
    void fetchUsers(page);
  }, [page]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#8B0000] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1.5fr]">
      <div>
        <header className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Loyalty Points</h1>
            <p className="mt-1 text-sm text-gray-500">
              View users and manage their loyalty balances.
            </p>
          </div>
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Points
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-sm text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {u.name || "Unnamed"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {u.email}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-900">
                      {u.loyaltyPoints ?? 0}
                    </td>
                    <td className="px-4 py-3 text-right text-sm">
                      <button
                        type="button"
                        onClick={() => void fetchHistory(u._id)}
                        className="text-[#8B0000] font-semibold hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {(totalPages > 1 || totalUsers > 0) && (
          <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
            <div className="text-sm text-gray-600">
              <p>
                Showing page {page} of {totalPages || 1}
                {totalUsers > 0 && (
                  <span className="ml-1">
                    ({totalUsers} {totalUsers === 1 ? "user" : "users"} total)
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
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages || loading}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            User details & history
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Select a user on the left to view their balance and transactions.
          </p>

          {historyLoading && (
            <div className="mt-6 flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#8B0000] border-t-transparent" />
            </div>
          )}

          {!historyLoading && history && (
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {history.user.name || "Unnamed"}
                  </p>
                  <p className="text-xs text-gray-500">{history.user.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Points balance
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {history.user.loyaltyPoints ?? 0}
                  </p>
                </div>
              </div>

              <form onSubmit={handleAdjust} className="space-y-3 rounded-lg bg-gray-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Adjust balance
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    type="number"
                    value={adjustChange}
                    onChange={(e) => setAdjustChange(e.target.value)}
                    placeholder="Change (+/-)"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#8B0000] focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
                  />
                  <input
                    type="text"
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                    placeholder="Reason"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#8B0000] focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
                  />
                  <button
                    type="submit"
                    disabled={adjustLoading}
                    className="whitespace-nowrap rounded-md bg-[#8B0000] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#a00000] disabled:opacity-60"
                  >
                    {adjustLoading ? "Saving..." : "Update"}
                  </button>
                </div>
                {adjustError && (
                  <p className="text-xs text-red-600">{adjustError}</p>
                )}
              </form>

              <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Change
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reason
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {history.transactions.length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-3 py-4 text-center text-xs text-gray-500"
                        >
                          No transactions yet.
                        </td>
                      </tr>
                    ) : (
                      history.transactions.map((t) => {
                        const date = new Date(t.createdAt);
                        const formatted = date.toLocaleString();
                        return (
                          <tr key={t._id}>
                            <td className="px-3 py-2 text-xs text-gray-500">
                              {formatted}
                            </td>
                            <td
                              className={`px-3 py-2 text-right text-xs font-semibold ${
                                t.change >= 0 ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {t.change > 0 ? `+${t.change}` : t.change}
                            </td>
                            <td className="px-3 py-2 text-xs text-gray-700">
                              {t.reason}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

