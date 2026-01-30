"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

export default function AdminUserEditPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link
            href={`/admin/users/${id}`}
            className="text-sm text-[#8B0000] hover:underline"
          >
            ← Back to User
          </Link>
        </div>
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Edit User (dummy page)
          </h1>
          <p className="text-gray-600">User ID: <strong>{id}</strong></p>
        </div>
      </div>
    </div>
  );
}
