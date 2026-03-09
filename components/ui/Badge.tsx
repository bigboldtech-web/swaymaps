"use client";

import React from "react";

type BadgeVariant = "default" | "sky" | "emerald" | "amber" | "rose" | "indigo" | "violet";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-slate-800/60 text-slate-300 border-slate-700/50",
  sky: "bg-brand-500/10 text-brand-300 border-brand-500/20",
  emerald: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  amber: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  rose: "bg-rose-500/10 text-rose-300 border-rose-500/20",
  indigo: "bg-brand-500/10 text-brand-300 border-brand-500/20",
  violet: "bg-violet-500/10 text-violet-300 border-violet-500/20",
};

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
