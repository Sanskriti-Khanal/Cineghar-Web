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
import Button from "@/app/_components/Button";
import Separator from "@/app/_components/Separator";
import GoogleButton from "@/app/_components/GoogleButton";

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
