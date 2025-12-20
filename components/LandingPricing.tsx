"use client";

import Link from "next/link";

export function LandingPricing() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-6 transition hover:border-sky-600 hover:shadow-lg hover:shadow-sky-500/10">
        <div className="text-xs uppercase tracking-wide text-slate-400">Pro</div>
        <div className="mt-1 text-3xl font-bold text-sky-300">$4/mo</div>
        <p className="mt-2 text-sm text-slate-300">Solo builders who need unlimited maps.</p>
        <ul className="mt-4 space-y-2 text-sm text-slate-400">
          <li className="flex items-center gap-2">
            <span className="text-sky-400">✓</span> Unlimited maps
          </li>
          <li className="flex items-center gap-2">
            <span className="text-sky-400">✓</span> Unlimited nodes
          </li>
          <li className="flex items-center gap-2">
            <span className="text-sky-400">✓</span> Export & embed
          </li>
          <li className="flex items-center gap-2">
            <span className="text-sky-400">✓</span> Priority support
          </li>
        </ul>
        <div className="mt-4 text-xs text-slate-400">Use coupon DECODE20 at checkout.</div>
        <Link
          href="/"
          className="mt-4 block w-full rounded-lg bg-sky-500 px-4 py-2.5 text-center text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
        >
          Start Pro Plan
        </Link>
      </div>
      <div className="rounded-xl border-2 border-emerald-600/50 bg-slate-950/70 p-6 transition hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10">
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-wide text-slate-400">Team</div>
          <div className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-300">Popular</div>
        </div>
        <div className="mt-1 text-3xl font-bold text-emerald-300">$19/mo</div>
        <p className="mt-2 text-sm text-slate-300">Collaborative teams with seats and audit.</p>
        <ul className="mt-4 space-y-2 text-sm text-slate-400">
          <li className="flex items-center gap-2">
            <span className="text-emerald-400">✓</span> Everything in Pro
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-400">✓</span> Team workspaces
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-400">✓</span> Role-based access
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-400">✓</span> Audit logs
          </li>
        </ul>
        <div className="mt-4 text-xs text-slate-400">Use coupon DECODE20 at checkout.</div>
        <Link
          href="/"
          className="mt-4 block w-full rounded-lg bg-emerald-500 px-4 py-2.5 text-center text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
        >
          Start Team Plan
        </Link>
      </div>
    </div>
  );
}
