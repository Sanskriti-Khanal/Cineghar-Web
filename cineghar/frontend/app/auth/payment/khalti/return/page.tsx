"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProtectedRoute from "@/app/_components/ProtectedRoute";
import Navbar from "@/app/_components/Navbar";
import { lookupKhaltiPaymentApi } from "@/lib/api/payment";

type ViewState =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "error"; message: string }
  | {
      type: "result";
      status: string;
      amount: number;
      transactionId: string | null;
    };

export default function KhaltiReturnPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [state, setState] = useState<ViewState>({ type: "idle" });

  useEffect(() => {
    const pidx = searchParams.get("pidx");
    if (!pidx) {
      setState({
        type: "error",
        message: "Missing payment reference (pidx).",
      });
      return;
    }

    const run = async () => {
      try {
        setState({ type: "loading" });
        const res = await lookupKhaltiPaymentApi(pidx);
        if (!res.success || !res.data) {
          throw new Error(res.message || "Failed to verify payment.");
        }
        setState({
          type: "result",
          status: res.data.status,
          amount: res.data.total_amount,
          transactionId: res.data.transaction_id,
        });
      } catch (error: any) {
        setState({
          type: "error",
          message:
            error?.message || "Something went wrong while verifying your payment.",
        });
      }
    };

    void run();
  }, [searchParams]);

  const renderContent = () => {
    if (state.type === "loading" || state.type === "idle") {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-sm text-gray-300">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#8B0000] border-t-transparent mb-3" />
          <p>Verifying your payment with Khalti…</p>
        </div>
      );
    }

    if (state.type === "error") {
      return (
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-5 text-sm text-red-100">
          <p className="font-semibold mb-1">Payment verification failed</p>
          <p className="text-xs text-red-200 mb-3">{state.message}</p>
          <p className="text-[11px] text-red-200/80">
            If money has been deducted, please contact support with your Khalti
            transaction details.
          </p>
        </div>
      );
    }

    if (state.type === "result") {
      const isSuccess = state.status === "Completed";
      return (
        <div className="rounded-2xl border border-white/10 bg-black/40 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-[0.25em] text-gray-400 mb-1">
              Khalti Payment
            </p>
            <h1 className="text-xl font-semibold text-white">
              {isSuccess ? "Payment successful" : "Payment status"}
            </h1>
            <p className="mt-1 text-xs text-gray-400">
              Status from Khalti:{" "}
              <span className="font-semibold text-gray-100">{state.status}</span>
            </p>
          </div>

          <div className="space-y-2 text-xs text-gray-200">
            <div className="flex items-center justify-between">
              <span>Amount</span>
              <span>NPR {(state.amount / 100).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Transaction ID</span>
              <span className="truncate max-w-[220px] text-[11px] text-gray-300">
                {state.transactionId || "Not available"}
              </span>
            </div>
          </div>

          <p className="mt-4 text-[11px] text-gray-400">
            This page currently confirms payment with Khalti only. Linking this to
            actual seat bookings can be done next by connecting the booking API.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => router.push("/auth/movies")}
              className="rounded-full bg-gradient-to-r from-[#8B0000] to-[#A00000] px-4 py-2 text-xs font-semibold text-white shadow-[0_14px_40px_rgba(0,0,0,0.9)] hover:shadow-[0_18px_50px_rgba(0,0,0,1)]"
            >
              Back to movies
            </button>
            <button
              type="button"
              onClick={() => router.push("/auth/dashboard")}
              className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-gray-200 hover:bg-white/10"
            >
              Go to dashboard
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#050509] text-white">
        <Navbar />
        <main className="pt-16 pb-10">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

