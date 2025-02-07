"use client";

import { Suspense } from "react";
import ResetPasswordForm from "../_components/ResetPasswordForm";

function ResetPasswordContent() {
  return <ResetPasswordForm />;
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-md">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">Reset Password</h1>
        </div>
        <div className="rounded-xl bg-white p-8 shadow-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B0000] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
