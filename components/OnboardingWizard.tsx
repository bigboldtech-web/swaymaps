"use client";

import React, { useState, useCallback } from "react";

interface OnboardingWizardProps {
  userName: string;
  onComplete: (data: { role: string; templateCategory: string }) => void;
}

const ROLES = [
  "Engineering Manager",
  "Platform Engineer",
  "CTO/VP Engineering",
  "DevOps/SRE",
  "Compliance/Security",
  "Product Manager",
  "Other",
] as const;

const TEMPLATES = [
  {
    title: "Microservice Architecture",
    category: "architecture",
    description: "Map your services, databases, and APIs",
    gradient: "from-sky-500 to-cyan-400",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
        <rect x="2" y="2" width="6" height="6" rx="1" />
        <rect x="16" y="2" width="6" height="6" rx="1" />
        <rect x="9" y="16" width="6" height="6" rx="1" />
        <path d="M5 8v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8" />
        <path d="M12 13v3" />
      </svg>
    ),
  },
  {
    title: "Team Org Chart",
    category: "org",
    description: "Map team ownership and responsibilities",
    gradient: "from-violet-500 to-purple-400",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
        <circle cx="12" cy="4" r="2" />
        <circle cx="6" cy="12" r="2" />
        <circle cx="18" cy="12" r="2" />
        <circle cx="6" cy="20" r="2" />
        <circle cx="18" cy="20" r="2" />
        <path d="M12 6v2a2 2 0 0 1-2 2H8m8-4v2a2 2 0 0 0 2 2h-2" />
        <path d="M6 14v4m12-4v4" />
      </svg>
    ),
  },
  {
    title: "Data Flow Diagram",
    category: "compliance",
    description: "Track where data flows through your systems",
    gradient: "from-emerald-500 to-teal-400",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
        <path d="M4 6h16" />
        <path d="M4 12h16" />
        <path d="M4 18h16" />
        <polyline points="10 3 13 6 10 9" />
        <polyline points="14 15 11 18 14 21" />
      </svg>
    ),
  },
  {
    title: "CI/CD Pipeline",
    category: "devops",
    description: "Map your build and deploy pipeline",
    gradient: "from-amber-500 to-orange-400",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
        <path d="M12 2v4m0 12v4" />
        <circle cx="12" cy="12" r="4" />
        <path d="M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83" />
        <path d="M19.07 4.93l-2.83 2.83m-8.48 8.48l-2.83 2.83" />
      </svg>
    ),
  },
  {
    title: "Start from Scratch",
    category: "custom",
    description: "Build your own map from a blank canvas",
    gradient: "from-slate-400 to-slate-500",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M12 8v8m-4-4h8" />
      </svg>
    ),
  },
] as const;

export function OnboardingWizard({ userName, onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleComplete = useCallback(() => {
    if (selectedTemplate) {
      onComplete({ role, templateCategory: selectedTemplate });
    }
  }, [role, selectedTemplate, onComplete]);

  const selectedTemplateData = TEMPLATES.find((t) => t.category === selectedTemplate);
  const firstName = userName.split(" ")[0] || userName;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 animate-fade-in">
      <div className="w-full max-w-xl max-sm:max-w-full rounded-2xl glass-panel-solid p-5 sm:p-8 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Step 1: Welcome */}
        {step === 0 && (
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 text-white shadow-lg shadow-sky-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-100">
              Welcome to SwayMaps{firstName ? `, ${firstName}` : ""}
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Map every dependency. Ship safer changes.
            </p>

            <div className="mt-8 w-full max-w-xs text-left">
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
                Your role
              </label>
              <select
                className="w-full rounded-lg border border-slate-700/50 bg-slate-800/30 px-3 py-2.5 text-sm font-medium text-slate-100 outline-none transition focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="" disabled>
                  Select your role...
                </option>
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="mt-8 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 px-8 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:shadow-sky-500/40 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!role}
              onClick={() => setStep(1)}
            >
              Next
            </button>
          </div>
        )}

        {/* Step 2: Template Selection */}
        {step === 1 && (
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">
              What will you map first?
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Pick a template to get started, or begin from scratch.
            </p>

            <div className="mt-6 grid w-full grid-cols-2 gap-3">
              {TEMPLATES.map((template) => {
                const isSelected = selectedTemplate === template.category;
                return (
                  <button
                    key={template.category}
                    type="button"
                    className={`group relative flex flex-col items-start rounded-xl border p-4 text-left transition-all duration-200 ${
                      isSelected
                        ? "border-sky-500/50 bg-sky-500/10 ring-1 ring-sky-500/30"
                        : "border-slate-700/40 bg-slate-800/30 hover:border-slate-600"
                    } ${template.category === "custom" ? "col-span-2" : ""}`}
                    onClick={() => setSelectedTemplate(template.category)}
                  >
                    <div
                      className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${template.gradient} text-white shadow-sm transition-transform duration-200 group-hover:scale-110`}
                    >
                      {template.icon}
                    </div>
                    <div className="text-sm font-semibold text-slate-200">{template.title}</div>
                    <div className="mt-0.5 text-xs leading-relaxed text-slate-500">
                      {template.description}
                    </div>
                    {isSelected && (
                      <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                className="rounded-lg border border-slate-700/50 px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800/60"
                onClick={() => setStep(0)}
              >
                Back
              </button>
              <button
                className="rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 px-8 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:shadow-sky-500/40 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!selectedTemplate}
                onClick={() => setStep(2)}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 2 && (
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 text-white shadow-lg shadow-emerald-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-100">
              You&apos;re all set!
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Your workspace is ready. Start mapping your dependencies.
            </p>

            <div className="mt-6 w-full max-w-xs rounded-xl border border-slate-700/40 bg-slate-800/30 p-4 text-left">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Your selections
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Role</span>
                  <span className="text-sm font-medium text-slate-200">{role}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Template</span>
                  <span className="text-sm font-medium text-slate-200">
                    {selectedTemplateData?.title}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <button
                className="rounded-lg border border-slate-700/50 px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800/60"
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button
                className="rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 px-8 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:shadow-sky-500/40"
                onClick={handleComplete}
              >
                Start Mapping
              </button>
            </div>
          </div>
        )}

        {/* Progress dots */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step
                  ? "w-6 bg-gradient-to-r from-sky-500 to-indigo-500"
                  : i < step
                  ? "w-2 bg-sky-500/40"
                  : "w-2 bg-slate-700"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
