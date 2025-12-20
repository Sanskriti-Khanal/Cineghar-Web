"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerSchema, RegisterFormInputs } from "../schema";
import FormInput from "@/app/_components/FormInput";
import DateInput from "@/app/_components/DateInput";
import PasswordInput from "@/app/_components/PasswordInput";

const RegisterForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    setIsSubmitting(true);
    // TODO: Implement registration logic
    console.log("Registration data:", data);
    setTimeout(() => {
      setIsSubmitting(false);
      // router.push("/dashboard");
    }, 1000);
  };

  const handleGoogleSignIn = () => {
    // TODO: Implement Google sign-in
    console.log("Google sign-in clicked");
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-white mb-2">
          Join the Move Journey !
        </h1>
        <p className="text-sm text-white/90">
          Create your account and explore endless movies
        </p>
      </div>

      <div className="rounded-xl bg-white p-8 shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            label="Your Name"
            type="text"
            placeholder="Enter your name"
            error={errors.name}
            {...register("name")}
          />
          
          <DateInput
            label="Date of Birth"
            placeholder="Select your date of birth"
            error={errors.dateOfBirth}
            {...register("dateOfBirth")}
          />

          <FormInput
            label="Email"
            type="email"
            placeholder="Enter your email"
            error={errors.email}
            {...register("email")}
          />

          <PasswordInput
            label="Password"
            placeholder="Password"
            error={errors.password}
            {...register("password")}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#8B0000] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#6B0000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Signing up..." : "Sign up"}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full bg-white border border-gray-300 text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
        >
          Continue with Google
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        </button>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account??{" "}
          <Link href="/login" className="text-[#8B0000] hover:text-[#6B0000] font-medium no-underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
