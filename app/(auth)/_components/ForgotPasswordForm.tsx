"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { forgotPasswordSchema, ForgotPasswordFormInputs } from "../schema";
import { forgotPasswordApi } from "@/lib/api/auth";
import FormInput from "@/app/_components/FormInput";
import Button from "@/app/_components/Button";
import Alert from "@/app/_components/Alert";

const ForgotPasswordForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordFormInputs>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormInputs) => {
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);
    try {
      const response = await forgotPasswordApi(data.email);
      if (response.success) {
        setSuccess(response.message || "Password reset instructions have been sent to your email.");
        reset();
      } else {
        setError(response.message || "Failed to send reset instructions. Please try again.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reset instructions. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-white mb-2">
          Forgot Password?
        </h1>
        <p className="text-sm text-white/90">
          Enter your email address and we'll send you instructions to reset your password.
        </p>
      </div>

      <div className="rounded-xl bg-white p-8 shadow-lg">
        {error && (
          <Alert variant="error" className="mb-4" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="success" className="mb-4" onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            label="Email"
            type="email"
            placeholder="Enter your email"
            error={errors.email}
            {...register("email")}
          />

          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            className="w-full"
          >
            Send Reset Instructions
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

export default ForgotPasswordForm;
