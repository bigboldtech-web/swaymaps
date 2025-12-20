"use client";

export function LandingDemo() {
  return (
    <section className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/30 p-6 shadow-xl shadow-slate-900/50">
      <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
        <div className="text-sm font-semibold text-slate-200">Live canvas</div>
        <p className="mt-2 text-sm text-slate-400">
          Pan, zoom, and focus pinned nodes without losing the bigger picture.
        </p>
        <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900 p-3">
          <div className="flex flex-col gap-3 text-xs text-slate-200">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-sky-400" />
              <div>Incident map</div>
              <div className="rounded-full bg-sky-500/20 px-2 py-0.5 text-[10px] uppercase text-sky-200">Pinned</div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              {["Auth Service", "DB Cluster", "Billing", "On-call", "Runbook", "Postmortem"].map((item) => (
                <div key={item} className="rounded-lg border border-slate-800 bg-slate-950/70 px-2 py-3 text-center text-slate-100">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300">
        Map incidents, ownership, and change history in one place. Export summaries, share links, and keep everyone aligned.
      </div>
    </section>
  );
}
