"use client";

import { useState } from "react";
import { uploadUrls, uploadFile } from "@/lib/api";

export default function Admin() {
  const [urls, setUrls] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");

  return (
    <div className="flex flex-col items-center p-10 bg-white shadow-lg rounded-lg w-full max-w-lg">
      <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>

      <h2 className="text-3xl font-bold mb-4">Password</h2>

      <input
        type="text"
        placeholder="Type your password..."
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-3 w-full rounded-lg"
      />
      <h2 className="text-3xl font-bold mb-4">Company Name</h2>

      <input
        type="text"
        placeholder="Type the Company Name..."
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        className="border p-3 w-full rounded-lg"
      />

      <textarea
        placeholder="Enter URLs (one per line)"
        value={urls}
        onChange={(e) => setUrls(e.target.value)}
        className="border p-3 w-full h-32 rounded-lg"
      />
      <button onClick={() => uploadUrls(password, companyName, urls.split("\n"))} className="mt-2">Upload URLs</button>

      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="mt-4 w-full" />
      <button onClick={() => file && uploadFile(file)} className="mt-2 bg-green-500 hover:bg-green-600">
        Upload File
      </button>

      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
}
