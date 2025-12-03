import React from "react";

type Tone = "slate" | "blue" | "green" | "yellow" | "red" | "purple";

const toneStyles: Record<Tone, string> = {
  slate: "bg-slate-100 text-slate-800",
  blue: "bg-blue-100 text-blue-800",
  green: "bg-emerald-100 text-emerald-800",
  yellow: "bg-amber-100 text-amber-800",
  red: "bg-rose-100 text-rose-800",
  purple: "bg-purple-100 text-purple-800"
};

interface TagProps {
  label: string;
  tone?: Tone;
}

export function Tag({ label, tone = "slate" }: TagProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${toneStyles[tone]}`}
    >
      {label}
    </span>
  );
}
