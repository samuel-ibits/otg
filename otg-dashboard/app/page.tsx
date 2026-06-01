"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/app/lib/services/authService";
import { APIError } from "@/app/lib/api";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await authService.login({ email, password });

      if (response.success || response.data?.token || response.token) {
        // Login successful, redirect to dashboard
        router.push("/dashboard");
      } else {
        setError(response.message || "Login failed. Please try again.");
      }
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.message || "Invalid email or password");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* Left Side - Blue Background */}
      <div className="hidden w-1/2 bg-[#0066FF] p-12 lg:flex flex-col justify-between relative overflow-hidden">
        <div className="z-10">
          <div className="flex items-center gap-2 text-white font-bold text-base mb-16">
            {/* Logo */}
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="14" stroke="white" strokeWidth="2" />
              <path d="M16 8L12 12L16 16L20 12L16 8Z" fill="white" />
              <path d="M12 16L8 20L12 24L16 20L12 16Z" fill="white" />
              <path d="M20 16L16 20L20 24L24 20L20 16Z" fill="white" />
            </svg>
            <span className="tracking-wide">ONTHEGO<br />AFRICA</span>
          </div>
          <h1 className="text-white text-5xl font-bold leading-tight max-w-md">
            Manage your business on OTG the easy way
          </h1>
        </div>

        {/* Chart Visual */}
        <div className="relative z-10 mt-12 max-w-lg">
          <div className="bg-white rounded-2xl p-6 shadow-2xl">
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 text-sm">Revenue growth</h3>
            </div>
            {/* Chart Lines */}
            <div className="h-40 w-full relative mb-2">
              <svg viewBox="0 0 400 120" className="w-full h-full" preserveAspectRatio="none">
                {/* Grid lines */}
                <line x1="0" y1="30" x2="400" y2="30" stroke="#E5E7EB" strokeWidth="1" />
                <line x1="0" y1="60" x2="400" y2="60" stroke="#E5E7EB" strokeWidth="1" />
                <line x1="0" y1="90" x2="400" y2="90" stroke="#E5E7EB" strokeWidth="1" />

                {/* Chart lines */}
                <path d="M0 90 Q100 70, 200 60 T400 40" fill="none" stroke="#3B82F6" strokeWidth="2.5" />
                <path d="M0 100 Q100 85, 200 75 T400 60" fill="none" stroke="#93C5FD" strokeWidth="2.5" />
                <path d="M0 105 Q100 95, 200 88 T400 75" fill="none" stroke="#DBEAFE" strokeWidth="2.5" />
              </svg>
            </div>
            <div className="flex justify-between text-xs text-gray-500 px-2">
              <span>Jan</span>
              <span>Mar</span>
              <span>May</span>
              <span>Jul</span>
              <span>Sep</span>
            </div>
          </div>

          {/* Floating Active Users Card */}
          <div className="absolute -right-8 -bottom-6 bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
            <div className="flex flex-col items-center justify-center relative">
              {/* Circular progress */}
              <svg viewBox="0 0 120 120" className="w-32 h-32 transform -rotate-90">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#E5E7EB" strokeWidth="8" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="#0066FF" strokeWidth="8"
                  strokeDasharray="314" strokeDashoffset="78" strokeLinecap="round" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="#60A5FA" strokeWidth="8"
                  strokeDasharray="314" strokeDashoffset="157" strokeLinecap="round" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="#93C5FD" strokeWidth="8"
                  strokeDasharray="314" strokeDashoffset="235" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xs text-gray-500 mb-1">Active users</span>
                <span className="text-2xl font-bold text-gray-900">1,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-sm text-gray-500">
              Please enter your details.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={loading}
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot password
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 rounded-lg bg-[#0066FF] px-4 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-[#0052CC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed transition-all"
            >
              {loading && (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
