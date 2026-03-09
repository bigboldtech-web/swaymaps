"use client";

import React from "react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center animate-fade-in">
      {icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/40 border border-slate-700/30 text-slate-500">
          {icon}
        </div>
      )}
      <div className="text-lg font-semibold text-slate-300">{title}</div>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>
      )}
      {action && (
        <button
          className="mt-4 rounded-lg bg-gradient-to-r from-brand-600 to-brand-400 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 transition hover:shadow-brand-500/40"
          onClick={action.onClick}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
