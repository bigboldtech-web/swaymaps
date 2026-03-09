import React from "react";
import { User } from "../types/map";

interface UpgradeModalProps {
  currentUser: User | undefined;
  onSelectPlan: (plan: "pro" | "team", couponCode?: string) => Promise<void>;
  onClose: () => void;
}

export function UpgradeModal({ currentUser, onSelectPlan, onClose }: UpgradeModalProps) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [interval, setInterval] = React.useState<"month" | "year">("year");

  const handleSelect = async (plan: "pro" | "team") => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, interval }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create checkout");
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError(err?.message ?? "Upgrade failed");
      setLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to open billing");
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError(err?.message ?? "Failed to open billing portal");
      setLoading(false);
    }
  };

  const proPrice = interval === "year" ? 19 : 29;
  const teamPrice = interval === "year" ? 59 : 79;
  const currentPlan = currentUser?.plan ?? "free";
  const isPaid = currentPlan === "pro" || currentPlan === "team";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-fade-in">
      <div className="w-full max-w-2xl max-sm:max-w-full rounded-2xl glass-panel-solid p-4 sm:p-6 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-400">
              {isPaid ? "Manage Subscription" : "Upgrade"}
            </div>
            <div className="text-lg font-semibold text-slate-100">
              {isPaid ? "Your current plan" : "Unlock more maps and features"}
            </div>
            <p className="text-sm text-slate-400">
              Current plan: <span className="font-semibold capitalize text-slate-200">{currentPlan}</span>
            </p>
          </div>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700/50 text-slate-400 transition hover:bg-slate-800/60 hover:text-slate-200"
            onClick={onClose}
            aria-label="Close upgrade modal"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Billing interval toggle */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              interval === "month"
                ? "bg-sky-500/20 text-sky-300 border border-sky-500/40"
                : "text-slate-500 hover:text-slate-300"
            }`}
            onClick={() => setInterval("month")}
          >
            Monthly
          </button>
          <button
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              interval === "year"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "text-slate-500 hover:text-slate-300"
            }`}
            onClick={() => setInterval("year")}
          >
            Annual
            <span className="ml-1.5 rounded-full bg-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-200">
              SAVE 35%
            </span>
          </button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {/* Free plan */}
          <div className={`rounded-xl border border-slate-700/40 bg-slate-800/30 p-4 ${currentPlan === "free" ? "ring-2 ring-sky-500/40" : ""}`}>
            <div className="text-sm font-semibold text-slate-400">Free</div>
            <div className="mt-1 text-2xl font-bold text-slate-100">$0</div>
            <div className="text-xs text-slate-600">forever</div>
            <ul className="mt-3 space-y-1.5 text-sm text-slate-400">
              <li>3 maps</li>
              <li>1 workspace</li>
              <li>5 AI brainstorms/mo</li>
              <li>Basic node types</li>
            </ul>
            {currentPlan === "free" && (
              <div className="mt-4 rounded-lg bg-slate-700/40 py-2 text-center text-sm font-semibold text-slate-300">
                Current Plan
              </div>
            )}
          </div>

          {/* Pro plan */}
          <button
            className={`rounded-xl border border-slate-700/40 bg-slate-800/30 p-4 text-left transition hover:-translate-y-[1px] hover:border-sky-500/40 hover:shadow-lg hover:shadow-sky-500/10 ${
              currentPlan === "pro" ? "ring-2 ring-sky-500/40" : ""
            }`}
            disabled={loading || currentPlan === "pro"}
            onClick={() => handleSelect("pro")}
          >
            <div className="text-sm font-semibold text-sky-400">Pro</div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-sky-300">${proPrice}</span>
              <span className="text-sm text-slate-500">/mo</span>
            </div>
            {interval === "year" && (
              <div className="text-xs text-slate-600">billed annually at $228/yr</div>
            )}
            <ul className="mt-3 space-y-1.5 text-sm text-slate-300">
              <li>Unlimited maps</li>
              <li>5 workspaces</li>
              <li>Unlimited AI brainstorm</li>
              <li>All node types</li>
              <li>Export PNG/SVG/PDF</li>
              <li>All templates</li>
              <li>Public sharing</li>
            </ul>
            {currentPlan === "pro" ? (
              <div className="mt-4 rounded-lg bg-sky-500/20 py-2 text-center text-sm font-semibold text-sky-300">
                Current Plan
              </div>
            ) : (
              <div className="mt-4 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 py-2 text-center text-sm font-semibold text-white shadow-lg shadow-sky-500/20">
                {loading ? "Redirecting..." : "Start 14-Day Free Trial"}
              </div>
            )}
          </button>

          {/* Team plan */}
          <button
            className={`relative rounded-xl border border-emerald-500/30 bg-slate-800/30 p-4 text-left transition hover:-translate-y-[1px] hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 ${
              currentPlan === "team" ? "ring-2 ring-emerald-500/40" : ""
            }`}
            disabled={loading || currentPlan === "team"}
            onClick={() => handleSelect("team")}
          >
            <div className="absolute -top-2.5 right-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-2.5 py-0.5 text-[10px] font-bold uppercase text-white shadow-sm">
              Most Popular
            </div>
            <div className="text-sm font-semibold text-emerald-400">Team</div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-emerald-300">${teamPrice}</span>
              <span className="text-sm text-slate-500">/mo</span>
            </div>
            {interval === "year" && (
              <div className="text-xs text-slate-600">billed annually at $708/yr</div>
            )}
            <ul className="mt-3 space-y-1.5 text-sm text-slate-300">
              <li>Everything in Pro</li>
              <li>Unlimited workspaces</li>
              <li>Unlimited team members</li>
              <li>Version history</li>
              <li>Priority support</li>
              <li>API access (coming)</li>
            </ul>
            {currentPlan === "team" ? (
              <div className="mt-4 rounded-lg bg-emerald-500/20 py-2 text-center text-sm font-semibold text-emerald-300">
                Current Plan
              </div>
            ) : (
              <div className="mt-4 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 py-2 text-center text-sm font-semibold text-white shadow-lg shadow-emerald-500/20">
                {loading ? "Redirecting..." : "Start 14-Day Free Trial"}
              </div>
            )}
          </button>
        </div>

        {isPaid && (
          <div className="mt-4 text-center">
            <button
              className="text-sm font-semibold text-slate-500 underline transition hover:text-slate-300"
              onClick={handleManageBilling}
              disabled={loading}
            >
              Manage billing, invoices & cancel
            </button>
          </div>
        )}

        {error && <div className="mt-3 text-sm text-rose-400">{error}</div>}

        <p className="mt-4 text-center text-xs text-slate-600">
          14-day free trial on all paid plans. Cancel anytime. Prices in USD.
        </p>
      </div>
    </div>
  );
}
