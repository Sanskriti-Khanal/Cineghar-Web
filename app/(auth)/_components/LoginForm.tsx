"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginSchema, LoginFormInputs } from "../schema";
import FormInput from "@/app/_components/FormInput";
import PasswordInput from "@/app/_components/PasswordInput";
import Checkbox from "@/app/_components/Checkbox";
import Button from "@/app/_components/Button";
import Separator from "@/app/_components/Separator";
import GoogleButton from "@/app/_components/GoogleButton";

const LoginForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setIsSubmitting(true);
    // TODO: Implement login logic
    console.log("Login data:", data);
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
          Welcome Back!
        </h1>
        <p className="text-sm text-white/90">
          Signin to continue your movie journey
        </p>
      </div>

      <div className="rounded-xl bg-white p-8 shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          <Checkbox
            label="Keep me logged in"
            name="rememberMe"
            {...register("rememberMe")}
          />

          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
          >
            Sign in
          </Button>
        </form>

        <Separator />

        <GoogleButton onClick={handleGoogleSignIn} text="Sign in with Google" />

        <div className="mt-6 text-center text-sm text-gray-600">
          Need an account?{" "}
          <Link href="/register" className="text-[#8B0000] hover:text-[#6B0000] font-medium no-underline">
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
