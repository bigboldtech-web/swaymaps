"use client";

import React, { useState, useEffect } from "react";

interface TrainingModalProps {
  open: boolean;
  onClose: () => void;
}

const trainingSteps = [
  {
    title: "Welcome to SwayMaps",
    icon: <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a6 6 0 0012 0v-1.5m0-4V14m0-2.5v-6a1.5 1.5 0 013 0m-3 6a1.5 1.5 0 003 0" /></svg>,
    body: "SwayMaps helps you visualize systems, processes, and dependencies. This quick guide will show you the key features.",
    tips: [
      "Click anywhere on the canvas to close this menu",
      "Use the Training button anytime to review",
      "All changes auto-save to your workspace"
    ]
  },
  {
    title: "Add & move nodes",
    icon: <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><circle cx="12" cy="12" r="10" /><path d="M12 8v8m-4-4h8" /></svg>,
    body: "Nodes are the building blocks of your map. Each node can represent a system, person, process, or anything else.",
    tips: [
      "Click 'Add Node (N)' or press N key",
      "Drag nodes to reposition them",
      "Use grab cursor to pan the canvas",
      "Zoom with mouse wheel or pinch"
    ]
  },
  {
    title: "Connect & organize",
    icon: <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>,
    body: "Create relationships between nodes by connecting them with edges. Drag from a node's connection point to another node.",
    tips: [
      "Hover over a node to see connection points",
      "Drag from any connection point to create an edge",
      "Click edges to add labels and notes",
      "Drag edge midpoint to create new connected nodes"
    ]
  },
  {
    title: "Select & inspect",
    icon: <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
    body: "Click any node to open the inspector panel and view or edit its details, notes, tags, and comments.",
    tips: [
      "Click a node to select it",
      "Add tags for filtering and organization",
      "Write detailed notes with markdown support",
      "Add comments for team collaboration"
    ]
  },
  {
    title: "Pin & focus",
    icon: <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>,
    body: "Pin critical nodes to quickly focus on important parts of your map during incidents or presentations.",
    tips: [
      "Toggle Pin in the inspector panel",
      "Give pins custom labels",
      "Use Focus dropdown to jump to pinned nodes",
      "Share focused views with teammates"
    ]
  },
  {
    title: "Customize & style",
    icon: <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>,
    body: "Personalize your map with colors, node types, and visual styles to match your workflow.",
    tips: [
      "Choose from 11 color options per node",
      "Set node types: System, Person, Process, Generic",
      "Toggle gradient edges in Settings",
      "Switch between light and dark themes"
    ]
  },
  {
    title: "Share & collaborate",
    icon: <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
    body: "Work with your team in real-time. Share maps, invite members, and keep everyone aligned.",
    tips: [
      "Click Share to copy link to share your map",
      "Invite teammates from the sidebar",
      "Set roles: Owner, Admin, Editor, Viewer",
      "All changes sync in real-time"
    ]
  },
  {
    title: "You're all set!",
    icon: <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    body: "You now know the essentials of SwayMaps. Start mapping your systems, processes, and ideas!",
    tips: [
      "Press N to quickly add nodes",
      "Check Settings for advanced options",
      "Visit the landing page for more examples",
      "Reach out if you need help!"
    ]
  }
];

export function TrainingModal({ open, onClose }: TrainingModalProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (open) setStep(0);
  }, [open]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("sway-training-dismissed", open ? "false" : "true");
  }, [open]);

  if (!open) return null;

  const current = trainingSteps[step];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-lg max-sm:max-w-full rounded-2xl glass-panel-solid shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700/30 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 text-white">
              {current.icon}
            </div>
            <div>
              <div className="text-lg font-bold text-slate-100">
                {current.title}
              </div>
              <div className="text-xs text-slate-500">
                Step {step + 1} of {trainingSteps.length}
              </div>
            </div>
          </div>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700/50 text-slate-400 transition hover:bg-slate-800/60 hover:text-slate-200"
            onClick={onClose}
            aria-label="Close training"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm leading-relaxed text-slate-300">
            {current.body}
          </p>

          {current.tips && (
            <div className="mt-4 rounded-xl border border-slate-700/40 bg-slate-800/30 p-4">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-sky-400">
                Quick Tips
              </div>
              <ul className="space-y-2">
                {current.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="mt-0.5 text-sky-400">&#8226;</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-700/30 p-5">
          <div className="mb-4 flex justify-center gap-1.5">
            {trainingSteps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setStep(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === step
                    ? "w-8 bg-gradient-to-r from-sky-500 to-indigo-500"
                    : idx < step
                    ? "w-2 bg-sky-500/40"
                    : "w-2 bg-slate-700 hover:bg-slate-600"
                }`}
                aria-label={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              className="flex items-center gap-2 rounded-lg border border-slate-700/50 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800/60 disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={() => setStep((prev) => Math.max(0, prev - 1))}
              disabled={step === 0}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            {step < trainingSteps.length - 1 ? (
              <button
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:shadow-sky-500/40"
                onClick={() => setStep((prev) => prev + 1)}
              >
                Next
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:shadow-emerald-500/40"
                onClick={onClose}
              >
                Get Started
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" d="M5 13l4 4L19 7" />
                </svg>
              </button>
            )}
          </div>

          <button
            className="mt-3 w-full text-center text-xs text-slate-600 hover:text-slate-400 transition"
            onClick={onClose}
          >
            Skip tutorial
          </button>
        </div>
      </div>
    </div>
  );
}
