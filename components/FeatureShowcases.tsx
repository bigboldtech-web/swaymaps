"use client";

import { Tag } from "./Tag";
import { useState } from "react";

export function FeatureShowcases() {
  const [selectedFeature, setSelectedFeature] = useState(0);

  const showcases = [
    {
      title: "Smart Tagging System",
      description: "Organize nodes with custom tags for easy filtering and categorization",
      component: (
        <div className="space-y-3">
          <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
            <div className="mb-2 text-sm font-semibold text-slate-200">Node: Auth Service</div>
            <div className="flex flex-wrap gap-2">
              <Tag label="production" tone="green" />
              <Tag label="critical" tone="red" />
              <Tag label="backend" tone="blue" />
              <Tag label="verified" tone="blue" />
            </div>
          </div>
          <div className="text-xs text-slate-400">
            ✨ Click tags to filter, add custom tags to any node
          </div>
        </div>
      )
    },
    {
      title: "Node Type Indicators",
      description: "Different node types for systems, people, processes, and more",
      component: (
        <div className="grid grid-cols-2 gap-3">
          {[
            { type: "System", color: "#22c55e", icon: "🖥️" },
            { type: "Person", color: "#38bdf8", icon: "👤" },
            { type: "Process", color: "#fbbf24", icon: "⚙️" },
            { type: "Generic", color: "#29a5e5", icon: "📦" }
          ].map((item) => (
            <div
              key={item.type}
              className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-center"
            >
              <div className="mb-2 text-2xl">{item.icon}</div>
              <div className="text-sm font-semibold text-slate-200">{item.type}</div>
              <div
                className="mx-auto mt-2 h-2 w-16 rounded-full"
                style={{ backgroundColor: item.color }}
              />
            </div>
          ))}
        </div>
      )
    },
    {
      title: "Inspector Panel",
      description: "Rich notes and metadata for every node and connection",
      component: (
        <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-bold text-slate-100">Node Inspector</div>
            <div className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-300">
              Active
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-400">Title</label>
              <div className="mt-1 rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">
                Auth Service
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400">Notes</label>
              <div className="mt-1 rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-400">
                Handles user authentication...
              </div>
            </div>
            <div className="flex gap-2">
              <Tag label="production" tone="green" />
              <Tag label="critical" tone="red" />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Workspace Management",
      description: "Collaborate with teams using role-based access control",
      component: (
        <div className="space-y-3">
          <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
            <div className="mb-3 text-sm font-semibold text-slate-200">Team Members</div>
            {[
              { name: "Sarah Chen", role: "Owner", avatar: "🧑‍💻" },
              { name: "Marcus Rodriguez", role: "Admin", avatar: "👨‍💼" },
              { name: "Emily Watson", role: "Editor", avatar: "👩‍🔧" }
            ].map((member, idx) => (
              <div
                key={idx}
                className="mb-2 flex items-center justify-between rounded border border-slate-800 bg-slate-900 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{member.avatar}</span>
                  <span className="text-sm text-slate-200">{member.name}</span>
                </div>
                <span className="rounded bg-brand-500/20 px-2 py-0.5 text-xs text-brand-300">
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-slate-50 sm:text-4xl">
          Real components from SwayMaps
        </h2>
        <p className="mt-2 text-slate-300">Explore the actual UI elements you'll use every day</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Feature Tabs */}
        <div className="space-y-4">
          {showcases.map((showcase, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedFeature(idx)}
              className={`w-full rounded-xl border p-4 text-left transition ${
                selectedFeature === idx
                  ? "border-brand-500 bg-sky-950/30 shadow-lg shadow-brand-500/10"
                  : "border-slate-800 bg-slate-900/40 hover:border-slate-700"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-100">{showcase.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{showcase.description}</p>
                </div>
                <div
                  className={`h-3 w-3 rounded-full ${
                    selectedFeature === idx ? "bg-brand-400" : "bg-slate-700"
                  }`}
                />
              </div>
            </button>
          ))}
        </div>

        {/* Preview Area */}
        <div className="relative">
          <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-brand-500/20 to-blue-500/20 blur-xl" />
          <div className="relative rounded-xl border border-brand-500/30 bg-slate-950 p-6">
            <div className="mb-4">
              <div className="text-sm font-semibold text-brand-300">Live Preview</div>
              <div className="text-xs text-slate-400">This is the actual component</div>
            </div>
            <div className="min-h-[300px]">{showcases[selectedFeature].component}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
