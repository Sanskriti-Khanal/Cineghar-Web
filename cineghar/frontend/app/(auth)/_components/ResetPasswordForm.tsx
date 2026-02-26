"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { resetPasswordSchema, ResetPasswordFormInputs } from "../schema";
import { resetPasswordApi } from "@/lib/api/auth";
import PasswordInput from "@/app/_components/PasswordInput";
import Button from "@/app/_components/Button";
import Alert from "@/app/_components/Alert";

const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormInputs>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    if (!token) {
      setTokenError("Reset token is missing. Please use the link from your email.");
    }
  }, [token]);

  const onSubmit = async (data: ResetPasswordFormInputs) => {
    if (!token) {
      setError("Reset token is missing. Please use the link from your email.");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      const response = await resetPasswordApi({
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      if (response.success) {
        // Redirect to login after successful reset
        router.push("/login?reset=success");
      } else {
        setError(response.message || "Failed to reset password. Please try again.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (tokenError) {
    return (
      <div className="w-full max-w-md">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">
            Reset Password
          </h1>
        </div>
        <div className="rounded-xl bg-white p-8 shadow-lg">
          <Alert variant="error" className="mb-4">
            {tokenError}
          </Alert>
          <div className="text-center">
            <Link href="/forgot-password" className="text-[#8B0000] hover:text-[#6B0000] font-medium no-underline">
              Request a new reset link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-white mb-2">
          Reset Password
        </h1>
        <p className="text-sm text-white/90">
          Enter your new password below
        </p>
      </div>

      <div className="rounded-xl bg-white p-8 shadow-lg">
        {error && (
          <Alert variant="error" className="mb-4" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <PasswordInput
            label="New Password"
            placeholder="Enter new password"
            error={errors.password}
            {...register("password")}
          />

          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm new password"
            error={errors.confirmPassword}
            {...register("confirmPassword")}
          />

          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            className="w-full"
          >
            Reset Password
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Remember your password?{" "}
          <Link href="/login" className="text-[#8B0000] hover:text-[#6B0000] font-medium no-underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
