"use client";

import { useState } from "react";
import { uploadUrls, getToken } from "@/lib/api";

export default function Admin() {
  const [urls, setUrls] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleLogin() {
    try {
      setLoading(true);
      setError("");
      await getToken(password);
      setLoggedIn(true);
      setSuccess("Login successful!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      setError("Invalid password. Please try again.");
      console.error('Login failed:', e);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload() {
    try {
      setLoading(true);
      setError("");
      await uploadUrls(companyName, urls.split("\n"));
      setSuccess("Data uploaded successfully!");
      setTimeout(() => setSuccess(""), 5000);
      // Reset form
      setUrls("");
      setCompanyName("");
    } catch (e) {
      setError("Upload failed. Please check your inputs.");
      console.error('Upload error:', e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 transition-all duration-300">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin</h1>
          <p className="text-gray-600">Manage your company data sources</p>
        </div>

        {!loggedIn ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">Secure Login</h2>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  placeholder="Enter your admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>
              <button 
                onClick={handleLogin}
                disabled={!password || loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </div>
                ) : "Login"}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">Data Source Configuration</h2>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                <input
                  type="text"
                  placeholder="Enter company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  URLs (one per line)
                  <span className="text-gray-500 ml-2">- Include http:// or https://</span>
                </label>
                <textarea
                  placeholder="Example:
https://company.com/about
https://company.com/contact"
                  value={urls}
                  onChange={(e) => setUrls(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-48 resize-none transition-all"
                />
              </div>

              <button 
                onClick={handleUpload}
                disabled={!companyName || !urls || loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Uploading...</span>
                  </div>
                ) : "Upload Data Sources"}
              </button>
            </div>
          </div>
        )}

        {(error || success) && (
          <div className={`mt-6 p-4 rounded-lg ${error ? 'bg-red-50' : 'bg-green-50'} transition-all`}>
            <p className={`text-sm ${error ? 'text-red-800' : 'text-green-800'}`}>
              {error || success}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}