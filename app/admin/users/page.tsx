"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getAdminUsersApi } from "@/lib/api/admin";
import type { AuthUser } from "@/lib/api/auth";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5050";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [limit] = useState(DEFAULT_LIMIT);
  const [totalPages, setTotalPages] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminUsersApi({ page: p, limit });
      setUsers(res.data ?? []);
      setTotalPages(res.totalPages ?? 0);
      setTotalUsers(res.totalUsers ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    void fetchUsers(page);
  }, [page, fetchUsers]);

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
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage all users {totalUsers > 0 && `(${totalUsers} total)`}
          </p>
        </div>
        <Link
          href="/admin/users/create"
          className="inline-flex items-center justify-center rounded-lg bg-[#8B0000] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#6B0000]"
        >
          Create User
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
                Photo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const initial =
                  user.name?.charAt(0).toUpperCase() ||
                  user.email?.charAt(0).toUpperCase() ||
                  "U";

                return (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden text-xs font-semibold text-gray-700">
                        {user.imageUrl ? (
                          <img
                            src={`${API_BASE}${user.imageUrl}`}
                            alt={user.name || user.email}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          initial
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Link
                        href={`/admin/users/${user._id}`}
                        className="text-gray-900 font-semibold hover:underline"
                      >
                        View
                      </Link>
                      <span className="mx-2 text-gray-300">|</span>
                      <Link
                        href={`/admin/users/${user._id}/edit`}
                        className="text-gray-900 font-semibold hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {(totalPages > 0 || totalUsers > 0) && (
        <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
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
          )}
        </div>
      )}
    </div>
  );
}
