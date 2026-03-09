"use client";

import React from "react";

interface SkeletonProps {
  className?: string;
  rows?: number;
}

export function Skeleton({ className = "h-4 w-full" }: { className?: string }) {
  return (
    <div
      className={`rounded-lg bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-[length:200%_100%] animate-shimmer ${className}`}
    />
  );
}

export function SkeletonRows({ rows = 3, className = "" }: SkeletonProps) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className={`h-10 w-full rounded-lg ${i === rows - 1 ? "w-2/3" : ""}`} />
      ))}
    </div>
  );
}
