"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8 animate-fade-in">
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome to AI Smart Customer Services
          </h1>
          <p className="text-xl text-gray-600">
            Select your role to continue
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/admin"
            className="group relative flex flex-col items-center p-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />
            <div className="relative z-10 text-center space-y-4">
              <div className="inline-block p-4 bg-blue-100 rounded-2xl group-hover:bg-blue-200 transition-colors duration-300">
                <svg
                  className="w-12 h-12 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 7l6 3m-6-3l-6 3m6-3v10m-6 0l6 3m6-3l6 3m-6-3v10m0-13l6 3m-6-3l-6 3"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Admin</h2>
              <p className="text-gray-600">
                Manage company information and configurations
              </p>
            </div>
          </Link>

          <Link
            href="/user"
            className="group relative flex flex-col items-center p-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-purple-100 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />
            <div className="relative z-10 text-center space-y-4">
              <div className="inline-block p-4 bg-indigo-100 rounded-2xl group-hover:bg-indigo-200 transition-colors duration-300">
                <svg
                  className="w-12 h-12 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">User</h2>
              <p className="text-gray-600">
                Ask for company-specific questions
              </p>
            </div>
          </Link>
        </div>

        <style jsx global>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .animate-fade-in {
            animation: fade-in 0.6s ease-out forwards;
          }
        `}</style>
      </div>
    </div>
  );
}