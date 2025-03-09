"use client";

import { getCompanies } from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [companies, setCompanies] = useState<string[]>([]);

  useEffect(() => {
    async function getCompaniesNameList() {
      const comp = await getCompanies();
      setCompanies(comp);
    }

    getCompaniesNameList();
  }, []);

  return (
    <div className="flex flex-col items-center p-10 bg-white shadow-lg rounded-lg space-y-4">
      <h1 className="text-3xl font-bold">Select Your Role</h1>
      <div className="flex gap-4">
        <Link href="/admin" className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">
          Admin
        </Link>
        <div>
          <h2 className="text-xl font-semibold">Select a company for User Role:</h2>
          {companies.length > 0 ? (
            companies.map((company) => (
              <Link
                key={company}
                href={`/user/${company}`} // Dynamic route: company name as URL parameter
                className="px-6 py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 mt-2"
              >
                {company}
              </Link>
            ))
          ) : (
            <p>No companies available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
