"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import AdminProtectedRoute from "@/app/_components/AdminProtectedRoute";

const adminNavItems: { href: string; label: string; exact: boolean; icon: React.ReactNode }[] = [
  {
    href: "/admin",
    label: "Dashboard",
    exact: true,
    icon: (
      <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    href: "/admin/users",
    label: "Users",
    exact: false,
    icon: (
      <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    href: "/admin/users/create",
    label: "Create User",
    exact: true,
    icon: (
      <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ),
  },
  {
    href: "/admin/movies",
    label: "Movies",
    exact: false,
    icon: (
      <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1z" />
      </svg>
    ),
  },
  {
    href: "/admin/movies/create",
    label: "Create Movie",
    exact: true,
    icon: (
      <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    href: "/admin/halls",
    label: "Halls",
    exact: false,
    icon: (
      <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18M5 7V5a2 2 0 012-2h10a2 2 0 012 2v2" />
      </svg>
    ),
  },
  {
    href: "/admin/showtimes",
    label: "Showtimes",
    exact: false,
    icon: (
      <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m4-7a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    href: "/admin/sales",
    label: "Sales",
    exact: false,
    icon: (
      <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3v18h18M7 14l4-4 3 3 5-5"
        />
      </svg>
    ),
  },
  {
    href: "/admin/loyalty",
    label: "Loyalty",
    exact: false,
    icon: (
      <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 1.343-3 3 0 2.25 3 5 3 5s3-2.75 3-5c0-1.657-1.343-3-3-3z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5.5 20h13a1.5 1.5 0 001.355-2.06L13.88 4.5a1.5 1.5 0 00-2.76 0L4.145 17.94A1.5 1.5 0 005.5 20z"
        />
      </svg>
    ),
  },
  {
    href: "/admin/rewards",
    label: "Rewards",
    exact: false,
    icon: (
      <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 8l2 12h10l2-12M9 8V6a3 3 0 116 0v2"
        />
      </svg>
    ),
  },
  {
    href: "/admin/offers",
    label: "Offers",
    exact: false,
    icon: (
      <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 5h18M5 9h14l-1 10H6L5 9zm4-4h6l1 4H8l1-4z"
        />
      </svg>
    ),
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen flex bg-gray-100">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 flex flex-col bg-[#1a1a1a] text-white shadow-xl">
          {/* Logo + Brand */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#8B0000]">
              <Image
                src="/images/logo.png"
                alt="CineGhar"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-semibold text-white">CineGhar</span>
              <span className="ml-1.5 block text-xs text-gray-400">Admin</span>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <ul className="space-y-1">
              {adminNavItems.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-[#8B0000] text-white"
                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User + Logout */}
          <div className="border-t border-white/10 px-4 py-4">
            <div className="mb-3 flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#8B0000] text-sm font-medium text-white">
                {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{user?.name || "Admin"}</p>
                <p className="truncate text-xs text-gray-400">{user?.email}</p>
              </div>
            </div>
            <Link
              href="/"
              className="mb-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to site
            </Link>
            <button
              onClick={logout}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-red-500/10 hover:text-red-400"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 pl-64 min-h-screen">
          <div className="py-8 px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </AdminProtectedRoute>
  );
}
