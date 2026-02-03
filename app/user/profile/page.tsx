"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getProfileApi, updateProfileApi } from "@/lib/api/auth";
import type { AuthUser } from "@/lib/api/auth";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/utils/constants";
import FormInput from "@/app/_components/FormInput";
import DateInput from "@/app/_components/DateInput";
import Button from "@/app/_components/Button";
import Alert from "@/app/_components/Alert";
import Link from "next/link";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  dateOfBirth: z.string().optional(),
});

type ProfileFormInputs = z.infer<typeof profileSchema>;

export default function UserProfilePage() {
  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { updateUser } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormInputs>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfileApi();
        if (res.data) {
          setProfile(res.data);
          reset({
            name: res.data.name,
            email: res.data.email,
            dateOfBirth: res.data.dateOfBirth ?? "",
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    void fetchProfile();
  }, [reset]);

  const onSubmit = async (data: ProfileFormInputs) => {
    setError(null);
    setSuccess(null);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      if (data.dateOfBirth) formData.append("dateOfBirth", data.dateOfBirth);
      const fileInput = document.getElementById("profile-image") as HTMLInputElement;
      if (fileInput?.files?.[0]) {
        formData.append("image", fileInput.files[0]);
      }
      const res = await updateProfileApi(formData);
      if (res.data) {
        setProfile(res.data);
        // Keep global auth state in sync so navbar and other places
        // immediately reflect the updated profile picture and details.
        updateUser({
          email: res.data.email,
          name: res.data.name,
          role: res.data.role,
          dateOfBirth: res.data.dateOfBirth,
          imageUrl: res.data.imageUrl,
        });
        setSuccess("Profile updated successfully.");
        // Redirect user back to dashboard after successful update
        router.push(ROUTES.DASHBOARD);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B0000]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Update Profile</h1>
          <Link
            href="/auth/dashboard"
            className="text-sm text-[#8B0000] hover:underline"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-lg">
          {profile?.imageUrl && (
            <div className="mb-4 flex justify-center">
              <img
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5050"}${profile.imageUrl}`}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            </div>
          )}
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
              placeholder="Your name"
              error={errors.name}
              {...register("name")}
            />
            <FormInput
              label="Email"
              type="email"
              placeholder="Your email"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Image (optional)
              </label>
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-[#8B0000] file:text-white hover:file:bg-[#6B0000]"
              />
            </div>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Save Profile
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
