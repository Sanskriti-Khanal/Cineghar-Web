"use client";

import ProtectedRoute from "@/app/_components/ProtectedRoute";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
