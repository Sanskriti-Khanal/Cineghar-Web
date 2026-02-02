"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-800">
          This is dashboard page
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/user/profile"
            className="px-6 py-3 bg-[#8B0000] text-white rounded-lg hover:bg-[#6B0000]"
          >
            Update Profile
          </Link>
          {user?.role === "admin" && (
            <Link
              href="/admin"
              className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
            >
              Admin Dashboard
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
