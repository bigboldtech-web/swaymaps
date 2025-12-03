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
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="mb-4">
          <div className="text-xs uppercase tracking-wide text-slate-500">Decode Map</div>
          <div className="text-xl font-semibold text-slate-900">Sign in</div>
          <p className="text-sm text-slate-600">Demo credentials: alex@demo.com / demo</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wide text-slate-500">Email</label>
            <input
              type="email"
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-slate-500">Password</label>
            <input
              type="password"
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="text-sm text-rose-600">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <div className="mt-4 text-sm text-slate-600">
          No account?{" "}
          <button
            className="font-semibold text-blue-600 hover:underline"
            onClick={() => router.push("/auth/signup")}
          >
            Sign up
          </button>{" "}
          or use the demo credentials above.
        </div>
      </div>
    </div>
  );
}
