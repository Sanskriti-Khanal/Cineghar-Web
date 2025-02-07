"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getAdminUserByIdApi } from "@/lib/api/admin";
import type { AuthUser } from "@/lib/api/auth";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5050";

export default function AdminUserDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getAdminUserByIdApi(id);
        if (res.success && res.data) {
          setUser(res.data);
        } else {
          setError(res.message || "Failed to load user");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load user");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      void fetchUser();
    }
  }, [id]);

  if (loading) {
    return (
      <div>
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">User Detail</h1>
          <p className="mt-1 text-sm text-gray-500">
            <Link href="/admin/users" className="text-[#8B0000] hover:underline">
              Users
            </Link>
            {" / "}Loading...
          </p>
        </header>
        <div className="flex items-center justify-center py-24">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#8B0000] border-t-transparent" />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div>
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">User Detail</h1>
          <p className="mt-1 text-sm text-gray-500">
            <Link href="/admin/users" className="text-[#8B0000] hover:underline">
              Users
            </Link>
            {" / "}Error
          </p>
        </header>
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 shadow-sm">
          <p className="text-red-800">{error || "User not found"}</p>
          <Link
            href="/admin/users"
            className="mt-4 inline-block text-[#8B0000] hover:underline"
          >
            ← Back to Users
          </Link>
        </div>
      </div>
    );
  }

  const initial =
    user.name?.charAt(0).toUpperCase() ||
    user.email?.charAt(0).toUpperCase() ||
    "U";

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not provided";
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

  return (
    <div>
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Detail</h1>
          <p className="mt-1 text-sm text-gray-500">
            <Link href="/admin/users" className="text-[#8B0000] hover:underline">
              Users
            </Link>
            {" / "}
            {user.name}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/admin/users/${id}/edit`}
            className="inline-flex items-center justify-center rounded-lg bg-[#8B0000] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#6B0000]"
          >
            Edit User
          </Link>
          <Link
            href="/admin/users"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Back to Users
          </Link>
        </div>
      </header>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* User Avatar */}
            <div className="flex-shrink-0">
              <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden text-4xl font-semibold text-gray-700">
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
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </label>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {user.name}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </label>
                  <p className="mt-1">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </p>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date of Birth
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatDate(user.dateOfBirth)}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User ID
                  </label>
                  <p className="mt-1 text-sm font-mono text-gray-600">{user._id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
