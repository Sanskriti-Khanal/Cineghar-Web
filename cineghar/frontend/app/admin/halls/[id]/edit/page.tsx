"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import {
  getAdminHallByIdApi,
  updateAdminHallApi,
  type AdminCinemaHall,
} from "@/lib/api/adminBooking";
import FormInput from "@/app/_components/FormInput";
import Button from "@/app/_components/Button";
import Toast from "@/app/_components/Toast";

const hallSchema = z.object({
  name: z.string().min(1, "Name is required"),
  city: z.enum(["Kathmandu", "Pokhara", "Chitwan"]),
  location: z.string().min(1, "Location is required"),
  rating: z.coerce.number().min(0).max(5).optional(),
  facilities: z.string().optional(),
});

type HallFormInputs = z.infer<typeof hallSchema>;

export default function AdminEditHallPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [hall, setHall] = useState<AdminCinemaHall | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    variant: "success" | "error";
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<HallFormInputs>({
    resolver: zodResolver(hallSchema) as import("react-hook-form").Resolver<HallFormInputs>,
  });

  useEffect(() => {
    const fetchHall = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getAdminHallByIdApi(id);
        if (res.success && res.data) {
          setHall(res.data);
          reset({
            name: res.data.name,
            city: res.data.city,
            location: res.data.location,
            rating: res.data.rating,
            facilities: res.data.facilities?.join(", ") ?? "",
          });
        } else {
          setError(res.message || "Failed to load hall");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load hall");
      } finally {
        setLoading(false);
      }
    };

    if (id) void fetchHall();
  }, [id, reset]);

  const onSubmit = async (data: HallFormInputs) => {
    setError(null);
    setToast(null);
    try {
      const facilities = data.facilities
        ? data.facilities
            .split(",")
            .map((f) => f.trim())
            .filter(Boolean)
        : [];
      await updateAdminHallApi(id, {
        name: data.name,
        city: data.city,
        location: data.location,
        rating: data.rating,
        facilities,
      });
      setToast({ message: "Hall updated successfully!", variant: "success" });
      setTimeout(() => {
        router.push("/admin/halls");
      }, 1500);
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : "Failed to update hall",
        variant: "error",
      });
    }
  };

  if (loading) {
    return (
      <div>
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Hall</h1>
        </header>
        <div className="flex items-center justify-center py-24">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#8B0000] border-t-transparent" />
        </div>
      </div>
    );
  }

  if (error || !hall) {
    return (
      <div>
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Hall</h1>
        </header>
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 shadow-sm">
          <p className="text-red-800">{error || "Hall not found"}</p>
          <Link
            href="/admin/halls"
            className="mt-4 inline-block text-[#8B0000] hover:underline"
          >
            ← Back to Halls
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
          <h1 className="text-2xl font-bold text-gray-900">Edit Hall</h1>
          <p className="mt-1 text-sm text-gray-500">
            <Link href="/admin/halls" className="text-[#8B0000] hover:underline">
              Halls
            </Link>
            {" / "}
            {hall.name}
          </p>
        </header>

        <div className="max-w-md rounded-xl bg-white p-6 shadow-sm border border-gray-200">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 [&_label]:text-gray-900 [&_input]:text-gray-900 [&_input::placeholder]:text-gray-600"
          >
            <FormInput
              label="Name"
              type="text"
              placeholder="Hall name"
              error={errors.name}
              {...register("name")}
            />
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                City
              </label>
              <select
                className={`block w-full rounded-lg border px-3 py-2 text-sm text-gray-900 focus:border-[#8B0000] focus:outline-none focus:ring-1 focus:ring-[#8B0000] ${
                  errors.city ? "border-red-500" : "border-gray-300"
                }`}
                {...register("city")}
              >
                <option value="Kathmandu">Kathmandu</option>
                <option value="Pokhara">Pokhara</option>
                <option value="Chitwan">Chitwan</option>
              </select>
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.city.message}
                </p>
              )}
            </div>
            <FormInput
              label="Location"
              type="text"
              placeholder="e.g. Durbar Marg, Lakeside"
              error={errors.location}
              {...register("location")}
            />
            <FormInput
              label="Rating (0–5, optional)"
              type="number"
              placeholder="4.5"
              error={errors.rating}
              {...register("rating")}
            />
            <FormInput
              label="Facilities (comma-separated, optional)"
              type="text"
              placeholder="Dolby Atmos, Recliners, Snacks Bar"
              error={errors.facilities}
              {...register("facilities")}
            />

            <div className="flex gap-2 pt-2">
              <Button type="submit" variant="primary" isLoading={isSubmitting}>
                Update Hall
              </Button>
              <Link
                href="/admin/halls"
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

