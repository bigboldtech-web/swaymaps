"use client";

import Link from "next/link";

export function LandingHero() {
  return (
    <section className="space-y-8">
      <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-200">
        Systems thinking, simplified
      </div>
      <h1 className="text-4xl font-bold leading-tight text-slate-50 sm:text-5xl lg:text-6xl">
        Map every dependency. Share context fast. Ship safer changes.
      </h1>
      <p className="max-w-2xl text-lg text-slate-300 lg:text-xl">
        SwayMaps turns complex systems, teams, and processes into living maps you can navigate, comment on, and keep in sync. Perfect for incident prep, onboarding, and change reviews.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/"
          className="rounded-xl bg-sky-500 px-6 py-3 text-base font-semibold text-slate-950 shadow-lg shadow-sky-500/30 transition hover:-translate-y-[1px] hover:bg-sky-400"
        >
          Start mapping now
        </Link>
        <Link
          href="/auth/signup"
          className="rounded-xl border border-slate-800 px-6 py-3 text-base font-semibold text-slate-100 hover:border-slate-700 hover:bg-slate-900"
        >
          Create a workspace
        </Link>
        <div className="rounded-full border border-slate-800 px-4 py-2 text-xs font-semibold text-slate-300">
          Use coupon <span className="text-sky-300">DECODE20</span> on Pro or Team
        </div>
      </div>
    </section>
  );
}
