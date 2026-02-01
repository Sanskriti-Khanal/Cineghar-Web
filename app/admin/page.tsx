"use client";

import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage users and content from here.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        <Link
          href="/admin/users"
          className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-[#8B0000] hover:shadow-md"
        >
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-[#8B0000]/10 text-[#8B0000] transition-colors group-hover:bg-[#8B0000]/20">
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Users</h2>
            <p className="text-sm text-gray-500">View and manage all users</p>
          </div>
          <svg className="ml-auto h-5 w-5 text-gray-400 group-hover:text-[#8B0000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>

        <Link
          href="/admin/users/create"
          className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-[#8B0000] hover:shadow-md"
        >
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-[#8B0000]/10 text-[#8B0000] transition-colors group-hover:bg-[#8B0000]/20">
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Create User</h2>
            <p className="text-sm text-gray-500">Add a new user</p>
          </div>
          <svg className="ml-auto h-5 w-5 text-gray-400 group-hover:text-[#8B0000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
