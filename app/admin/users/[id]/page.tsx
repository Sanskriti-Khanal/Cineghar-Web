"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

export default function AdminUserDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Detail</h1>
        <p className="mt-1 text-sm text-gray-500">
          <Link href="/admin/users" className="text-[#8B0000] hover:underline">Users</Link>
          {" / "}User {id}
        </p>
      </header>
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm text-center">
        <p className="text-gray-600">User ID: <strong>{id}</strong></p>
      </div>
    </div>
  );
}
