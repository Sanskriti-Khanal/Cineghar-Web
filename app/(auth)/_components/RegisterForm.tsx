"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { registerSchema, RegisterFormInputs } from "../schema";
import { useAuth } from "@/contexts/AuthContext";
import FormInput from "@/app/_components/FormInput";
import DateInput from "@/app/_components/DateInput";
import PasswordInput from "@/app/_components/PasswordInput";
import Button from "@/app/_components/Button";
import Separator from "@/app/_components/Separator";
import GoogleButton from "@/app/_components/GoogleButton";
import Alert from "@/app/_components/Alert";

const RegisterForm = () => {
  const [error, setError] = useState<string | null>(null);
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    setError(null);
    try {
      await registerUser(
        data.name,
        data.email,
        data.password,
        data.dateOfBirth
      );
      // Redirect is handled by AuthContext
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    }
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
        {error && (
          <Alert variant="error" className="mb-4" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
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

          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
          >
            Sign up
          </Button>
        </form>

        <Separator />

        <GoogleButton onClick={handleGoogleSignIn} />

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
