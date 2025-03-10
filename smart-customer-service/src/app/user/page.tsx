"use client";

import { getCompanies } from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function User() {
  const [companies, setCompanies] = useState<string[]>([]);

  useEffect(() => {
    async function getCompaniesNameList() {
      const comp = await getCompanies();
      setCompanies(comp);
    }

    getCompaniesNameList();
  }, []);



  return (
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
      
      <div>
        <Link
          key={"DeepSeek"}
          href={`/user/DeepSeek`} // Dynamic route: company name as URL parameter
          className="px-6 py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 mt-2"
        >
            No companies information available. Wanna continue?
        </Link>
      </div>

    )}
  </div>
  );
}
