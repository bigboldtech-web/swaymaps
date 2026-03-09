"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-medium uppercase tracking-wider text-slate-400">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`rounded-lg border border-slate-700/50 bg-slate-800/30 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all duration-150 focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 backdrop-blur-sm ${
            error ? "border-rose-500/50 focus:border-rose-500/50 focus:ring-rose-500/50" : ""
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-rose-400">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";
