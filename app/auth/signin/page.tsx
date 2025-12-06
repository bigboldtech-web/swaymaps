"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("alex@demo.com");
  const [password, setPassword] = useState("demo");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid credentials");
      return;
    }
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
        {/* Left: simple hero */}
        <div className="flex flex-col justify-center bg-gradient-to-br from-sky-100 via-white to-indigo-50 px-10 py-12">
          <div className="max-w-lg space-y-3">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">SwayMaps</div>
            <h1 className="text-4xl font-semibold text-slate-900">
              Map your teams, systems, and processes in one living canvas.
            </h1>
            <p className="text-sm text-slate-600">
              Drag, connect, and annotate instantly. Attach notes to nodes and edges, invite teammates, and autosave everything.
            </p>
          </div>
        </div>

        {/* Right: auth form */}
        <div className="flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
            <div className="mb-4 flex items-center gap-2">
              <svg viewBox="0 0 48 48" className="h-8 w-8">
                <circle cx="36" cy="8" r="4" fill="#ef4444" stroke="#0ea5e9" strokeWidth="3" />
                <circle cx="12" cy="40" r="4" fill="#ef4444" stroke="#0ea5e9" strokeWidth="3" />
                <path
                  d="M36 8 L22 18 L30 28 L12 40"
                  fill="none"
                  stroke="#0ea5e9"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="text-lg font-semibold text-[#0ea5e9]">SwayMaps</div>
            </div>
            <div className="mb-6">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Sign in</div>
              <div className="text-2xl font-semibold text-slate-900">Welcome back</div>
              <p className="text-sm text-slate-600">Demo: alex@demo.com / demo</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wide text-slate-600">Email</label>
                <input
                  type="email"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-slate-600">Password</label>
                <input
                  type="password"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <div className="text-sm text-rose-600">{error}</div>}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="mt-4 text-sm text-slate-600">
              No account?{" "}
              <button
                className="font-semibold text-sky-600 hover:underline"
                onClick={() => router.push("/auth/signup")}
              >
                Sign up
              </button>{" "}
              or use the demo credentials above.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
