"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { getAdminUserByIdApi, updateAdminUserApi } from "@/lib/api/admin";
import type { AuthUser } from "@/lib/api/auth";
import FormInput from "@/app/_components/FormInput";
import DateInput from "@/app/_components/DateInput";
import Button from "@/app/_components/Button";
import Toast from "@/app/_components/Toast";

const updateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  dateOfBirth: z.string().optional(),
});

type UpdateUserFormInputs = z.infer<typeof updateUserSchema>;

export default function AdminUserEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; variant: "success" | "error" } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UpdateUserFormInputs>({
    resolver: zodResolver(updateUserSchema),
  });

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getAdminUserByIdApi(id);
        if (res.success && res.data) {
          setUser(res.data);
          // Pre-fill form with user data
          reset({
            name: res.data.name,
            email: res.data.email,
            dateOfBirth: res.data.dateOfBirth || "",
          });
        } else {
          setError(res.message || "Failed to load user");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load user");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      void fetchUser();
    }
  }, [id, reset]);

  const onSubmit = async (data: UpdateUserFormInputs) => {
    setError(null);
    setToast(null);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      if (data.dateOfBirth) {
        formData.append("dateOfBirth", data.dateOfBirth);
      }
      const fileInput = document.getElementById("user-image") as HTMLInputElement;
      if (fileInput?.files?.[0]) {
        formData.append("image", fileInput.files[0]);
      }
      await updateAdminUserApi(id, formData);
      setToast({ message: "User updated successfully!", variant: "success" });
      // Redirect to user detail page after a short delay
      setTimeout(() => {
        router.push(`/admin/users/${id}`);
      }, 1500);
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : "Failed to update user",
        variant: "error",
      });
    }
  };

  if (loading) {
    return (
      <div>
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
          <p className="mt-1 text-sm text-gray-500">
            <Link href="/admin/users" className="text-[#8B0000] hover:underline">
              Users
            </Link>
            {" / "}
            <Link href={`/admin/users/${id}`} className="text-[#8B0000] hover:underline">
              User {id}
            </Link>
            {" / Edit"}
          </p>
        </header>
        <div className="flex items-center justify-center py-24">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#8B0000] border-t-transparent" />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div>
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
          <p className="mt-1 text-sm text-gray-500">
            <Link href="/admin/users" className="text-[#8B0000] hover:underline">
              Users
            </Link>
            {" / "}Error
          </p>
        </header>
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 shadow-sm">
          <p className="text-red-800">{error || "User not found"}</p>
          <Link
            href="/admin/users"
            className="mt-4 inline-block text-[#8B0000] hover:underline"
          >
            ← Back to Users
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onClose={() => setToast(null)}
        />
      )}
      <div>
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
          <p className="mt-1 text-sm text-gray-500">
            <Link href="/admin/users" className="text-[#8B0000] hover:underline">
              Users
            </Link>
            {" / "}
            <Link href={`/admin/users/${id}`} className="text-[#8B0000] hover:underline">
              {user.name}
            </Link>
            {" / Edit"}
          </p>
        </header>

        <div className="max-w-md rounded-xl bg-white p-6 shadow-sm border border-gray-200">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
              {error}
            </div>
          )}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 [&_label]:text-gray-900 [&_input]:text-gray-900 [&_input::placeholder]:text-gray-600"
          >
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
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Profile Image (optional)
              </label>
              <input
                id="user-image"
                type="file"
                accept="image/*"
                className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-[#8B0000] file:text-white hover:file:bg-[#6B0000]"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" variant="primary" isLoading={isSubmitting}>
                Update User
              </Button>
              <Link
                href={`/admin/users/${id}`}
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
