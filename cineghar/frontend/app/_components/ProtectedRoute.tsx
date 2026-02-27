"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/utils/constants";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    // If not logged in, send to login
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN);
      return;
    }
    // If admin is trying to access user /auth area, send to admin dashboard
    if (user?.role === "admin") {
      router.replace(ROUTES.ADMIN_DASHBOARD);
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B0000] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // While redirecting admins or unauthenticated users, render nothing
  if (!isAuthenticated || user?.role === "admin") {
    return null;
  }

  return <>{children}</>;
}
