"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { createAdminHallApi } from "@/lib/api/adminBooking";
import FormInput from "@/app/_components/FormInput";
import Button from "@/app/_components/Button";
import Alert from "@/app/_components/Alert";

const hallSchema = z.object({
  name: z.string().min(1, "Name is required"),
  city: z.enum(["Kathmandu", "Pokhara", "Chitwan"]),
  location: z.string().min(1, "Location is required"),
  rating: z.coerce.number().min(0).max(5).optional(),
  facilities: z.string().optional(),
});

type HallFormInputs = z.infer<typeof hallSchema>;

export default function AdminCreateHallPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<HallFormInputs>({
    resolver: zodResolver(hallSchema),
    defaultValues: {
      city: "Kathmandu",
    },
  });

  const onSubmit = async (data: HallFormInputs) => {
    setError(null);
    setSuccess(null);
    try {
      const facilities = data.facilities
        ? data.facilities
            .split(",")
            .map((f) => f.trim())
            .filter(Boolean)
        : [];
      await createAdminHallApi({
        name: data.name,
        city: data.city,
        location: data.location,
        rating: data.rating,
        facilities,
      });
      setSuccess("Cinema hall created successfully.");
      reset({ name: "", city: data.city, location: "", rating: undefined, facilities: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create hall");
    }
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Hall</h1>
        <p className="mt-1 text-sm text-gray-500">
          <Link href="/admin/halls" className="text-[#8B0000] hover:underline">
            Halls
          </Link>
          {" / Create"}
        </p>
      </header>

      <div className="max-w-md rounded-xl bg-white p-6 shadow-sm border border-gray-200">
        {error && (
          <Alert
            variant="error"
            className="mb-4"
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}
        {success && (
          <Alert
            variant="success"
            className="mb-4"
            onClose={() => setSuccess(null)}
          >
            {success}
          </Alert>
        )}

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
              <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
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
              Create Hall
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
  );
}

