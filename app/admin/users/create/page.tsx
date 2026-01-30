"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { createAdminUserApi } from "@/lib/api/admin";
import FormInput from "@/app/_components/FormInput";
import DateInput from "@/app/_components/DateInput";
import PasswordInput from "@/app/_components/PasswordInput";
import Button from "@/app/_components/Button";
import Alert from "@/app/_components/Alert";

const createUserSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password"),
    dateOfBirth: z.string().optional(),
    role: z.enum(["user", "admin"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type CreateUserFormInputs = z.infer<typeof createUserSchema>;

export default function AdminCreateUserPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormInputs>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { role: "user" },
  });

  const onSubmit = async (data: CreateUserFormInputs) => {
    setError(null);
    setSuccess(null);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("confirmPassword", data.confirmPassword);
      if (data.dateOfBirth) formData.append("dateOfBirth", data.dateOfBirth);
      formData.append("role", data.role);
      const fileInput = document.getElementById("user-image") as HTMLInputElement;
      if (fileInput?.files?.[0]) {
        formData.append("image", fileInput.files[0]);
      }
      await createAdminUserApi(formData);
      setSuccess("User created successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <Link
            href="/admin/users"
            className="text-sm text-[#8B0000] hover:underline"
          >
            ← Back to Users
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Create User
        </h1>

        <div className="rounded-xl bg-white p-6 shadow-lg">
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
              label="Name"
              type="text"
              placeholder="Enter name"
              error={errors.name}
              {...register("name")}
            />
            <FormInput
              label="Email"
              type="email"
              placeholder="Enter email"
              error={errors.email}
              {...register("email")}
            />
            <DateInput
              label="Date of Birth"
              placeholder="Select date of birth"
              error={errors.dateOfBirth}
              {...register("dateOfBirth")}
            />
            <PasswordInput
              label="Password"
              placeholder="Password"
              error={errors.password}
              {...register("password")}
            />
            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm password"
              error={errors.confirmPassword}
              {...register("confirmPassword")}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                {...register("role")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-[#8B0000]"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Image (optional)
              </label>
              <input
                id="user-image"
                type="file"
                accept="image/*"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-[#8B0000] file:text-white hover:file:bg-[#6B0000]"
              />
            </div>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Create User
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
