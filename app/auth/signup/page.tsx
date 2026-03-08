"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Sign up failed. Please try again.");
      setLoading(false);
      return;
    }

    // Auto sign-in after successful signup
    const signInRes = await signIn("credentials", {
      redirect: false,
      email,
      password
    });
    setLoading(false);

    if (signInRes?.error) {
      // Account created but auto-signin failed, redirect to signin
      router.push("/auth/signin");
      return;
    }

    router.push("/app");
  };

  const handleGoogleSignUp = () => {
    signIn("google", { callbackUrl: "/app" });
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
        {/* Left: hero */}
        <div className="hidden flex-col justify-center bg-gradient-to-br from-sky-950 via-[#030712] to-indigo-950 px-12 py-12 md:flex">
          <div className="max-w-lg space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <svg viewBox="0 0 48 48" className="h-8 w-8">
                <circle cx="36" cy="8" r="4" fill="#ef4444" stroke="#0ea5e9" strokeWidth="3" />
                <circle cx="12" cy="40" r="4" fill="#ef4444" stroke="#0ea5e9" strokeWidth="3" />
                <path d="M36 8 L22 18 L30 28 L12 40" fill="none" stroke="#0ea5e9" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-xl font-bold text-white">SwayMaps</span>
            </Link>
            <h1 className="mt-6 bg-gradient-to-r from-white via-sky-200 to-indigo-200 bg-clip-text text-4xl font-extrabold text-transparent">
              Start mapping your dependencies in minutes.
            </h1>
            <p className="text-sm leading-relaxed text-slate-400">
              Free to start. No credit card required. Create up to 3 maps on the free plan. Upgrade anytime for unlimited maps and team features.
            </p>
            <div className="mt-6 space-y-3 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-sky-400">&#10003;</span> Free plan with 3 maps
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sky-400">&#10003;</span> 14-day free trial on Pro & Team
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sky-400">&#10003;</span> Cancel anytime
              </div>
            </div>
          </div>
        </div>

        {/* Right: form */}
        <div className="flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            <div className="mb-6 flex items-center gap-2 md:hidden">
              <Link href="/" className="flex items-center gap-2">
                <svg viewBox="0 0 48 48" className="h-8 w-8">
                  <circle cx="36" cy="8" r="4" fill="#ef4444" stroke="#0ea5e9" strokeWidth="3" />
                  <circle cx="12" cy="40" r="4" fill="#ef4444" stroke="#0ea5e9" strokeWidth="3" />
                  <path d="M36 8 L22 18 L30 28 L12 40" fill="none" stroke="#0ea5e9" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-lg font-bold text-white">SwayMaps</span>
              </Link>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">Create your account</h2>
                <p className="mt-1 text-sm text-slate-400">Start mapping for free in under a minute</p>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignUp}
                className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Sign up with Google
              </button>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-800" />
                <span className="text-xs text-slate-500">or sign up with email</span>
                <div className="h-px flex-1 bg-slate-800" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-medium uppercase tracking-wide text-slate-400">Full Name</label>
                  <input
                    required
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wide text-slate-400">Work Email</label>
                  <input
                    type="email"
                    required
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wide text-slate-400">Password</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && (
                  <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-400">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:shadow-sky-500/40 disabled:opacity-60"
                >
                  {loading ? "Creating account..." : "Create Free Account"}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-slate-400">
                Already have an account?{" "}
                <Link href="/auth/signin" className="font-semibold text-sky-400 transition hover:text-sky-300">
                  Sign in
                </Link>
              </div>
            </div>

            <div className="mt-6 text-center text-xs text-slate-600">
              By creating an account, you agree to our{" "}
              <Link href="/legal/terms" className="text-slate-500 hover:text-slate-400">Terms</Link>
              {" "}and{" "}
              <Link href="/legal/privacy" className="text-slate-500 hover:text-slate-400">Privacy Policy</Link>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
