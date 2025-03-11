"use client";

import { getCompanies } from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function User() {
  const [companies, setCompanies] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getCompaniesNameList() {
      try {
        const comp = await getCompanies();
        setCompanies(comp);
      } finally {
        setLoading(false);
      }
    }

    getCompaniesNameList();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto animate-fade-in">
        <h2 className="text-3xl font-bold text-slate-800 mb-8 transition-opacity duration-300">
          Select Company
        </h2>

        {loading ? (
          <div className="flex flex-col gap-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-14 bg-slate-200 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {companies.length > 0 ? (
              companies.map((company, index) => (
                <div
                  key={company}
                  className="animate-card-enter opacity-0"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Link
                    href={`/user/${company}`}
                    className="block w-full px-6 py-4 bg-white text-slate-800 rounded-xl shadow-md hover:shadow-lg
                             transition-all duration-200 text-lg font-medium border border-slate-200
                             hover:border-slate-300 hover:scale-[1.02] active:scale-95"
                  >
                    {company}
                  </Link>
                </div>
              ))
            ) : (
              <div className="animate-fade-in">
                <Link
                  href="/user/DeepSeek"
                  className="block w-full px-6 py-4 bg-emerald-500 text-white rounded-xl shadow-md hover:shadow-lg
                           transition-all duration-200 text-lg font-medium text-center
                           hover:scale-[1.02] active:scale-95"
                >
                  No companies available. Continue to DeepSeek →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes card-enter {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }

        .animate-card-enter {
          animation: card-enter 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}