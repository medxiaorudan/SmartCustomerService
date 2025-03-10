"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center p-10 bg-white shadow-lg rounded-lg space-y-4">
      <h1 className="text-3xl font-bold">Select Your Role</h1>
      <div className="flex gap-4">
        <Link href="/admin" className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">
          Admin
        </Link>
        <Link href="/user" className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">
          User
        </Link>
      </div>
    </div>
  );
}
