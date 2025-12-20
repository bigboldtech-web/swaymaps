"use client";

export function LandingFeatures() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {[
        {
          title: "Visual systems",
          body: "Drag-and-drop maps for people, systems, and processes with rich notes and tags.",
          icon: "🗺️"
        },
        {
          title: "Shareable context",
          body: "Invite teammates, pin critical nodes, and focus views without losing structure.",
          icon: "🔗"
        },
        {
          title: "Safer changes",
          body: "Surface dependencies before deploys; capture learnings directly on the map.",
          icon: "🛡️"
        },
        {
          title: "Fast onboarding",
          body: "Give new teammates the lay of the land in minutes, not meetings.",
          icon: "⚡"
        }
      ].map((item) => (
        <div key={item.title} className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 transition hover:border-slate-700 hover:bg-slate-900/60">
          <div className="mb-2 text-2xl">{item.icon}</div>
          <div className="text-sm font-semibold text-slate-100">{item.title}</div>
          <p className="mt-2 text-sm text-slate-300">{item.body}</p>
        </div>
      ))}
    </div>
  );
}
