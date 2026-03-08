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
  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div
        className={`w-full max-w-2xl rounded-2xl border p-6 shadow-2xl ${
          isDark ? "border-[#0f172a] bg-[#050b15] text-slate-100" : "border-slate-200 bg-white text-slate-900"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className={`text-xs uppercase tracking-wide ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              {isPaid ? "Manage Subscription" : "Upgrade"}
            </div>
            <div className="text-lg font-semibold">
              {isPaid ? "Your current plan" : "Unlock more maps and features"}
            </div>
            <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              Current plan: <span className="font-semibold capitalize">{currentPlan}</span>
            </p>
          </div>
          <button
            className={`rounded-full border px-3 py-1 text-sm font-semibold transition ${
              isDark
                ? "border-[#0f172a] text-slate-200 hover:bg-slate-800"
                : "border-slate-200 text-slate-700 hover:border-slate-300"
            }`}
            onClick={onClose}
            aria-label="Close upgrade modal"
          >
            ✕
          </button>
        </div>

        {/* Billing interval toggle */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              interval === "month"
                ? isDark ? "bg-sky-500/20 text-sky-300 border border-sky-500/50" : "bg-sky-100 text-sky-700 border border-sky-300"
                : isDark ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-700"
            }`}
            onClick={() => setInterval("month")}
          >
            Monthly
          </button>
          <button
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              interval === "year"
                ? isDark ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50" : "bg-emerald-100 text-emerald-700 border border-emerald-300"
                : isDark ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-700"
            }`}
            onClick={() => setInterval("year")}
          >
            Annual
            <span className={`ml-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${
              isDark ? "bg-emerald-500/30 text-emerald-200" : "bg-emerald-200 text-emerald-800"
            }`}>
              SAVE 35%
            </span>
          </button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {/* Free plan */}
          <div
            className={`rounded-xl border p-4 ${
              isDark ? "border-slate-800 bg-[#0b1422]" : "border-slate-200 bg-slate-50"
            } ${currentPlan === "free" ? "ring-2 ring-sky-500/50" : ""}`}
          >
            <div className={`text-sm font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>Free</div>
            <div className={`mt-1 text-2xl font-bold ${isDark ? "text-slate-100" : "text-slate-900"}`}>$0</div>
            <div className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>forever</div>
            <ul className={`mt-3 space-y-1.5 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              <li>3 maps</li>
              <li>1 workspace</li>
              <li>5 AI brainstorms/mo</li>
              <li>Basic node types</li>
            </ul>
            {currentPlan === "free" && (
              <div className={`mt-4 rounded-lg py-2 text-center text-sm font-semibold ${
                isDark ? "bg-slate-800 text-slate-300" : "bg-slate-200 text-slate-600"
              }`}>
                Current Plan
              </div>
            )}
          </div>

          {/* Pro plan */}
          <button
            className={`rounded-xl border p-4 text-left transition hover:-translate-y-[1px] hover:shadow-lg ${
              isDark
                ? "border-slate-800 bg-[#0b1422] text-slate-100 hover:border-sky-500/50"
                : "border-blue-200 bg-blue-50 text-blue-900 hover:border-blue-400"
            } ${currentPlan === "pro" ? "ring-2 ring-sky-500/50" : ""}`}
            disabled={loading || currentPlan === "pro"}
            onClick={() => handleSelect("pro")}
          >
            <div className={`text-sm font-semibold ${isDark ? "text-sky-300" : "text-blue-900"}`}>Pro</div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className={`text-2xl font-bold ${isDark ? "text-sky-300" : "text-blue-700"}`}>
                ${proPrice}
              </span>
              <span className={`text-sm ${isDark ? "text-slate-400" : "text-blue-500"}`}>/mo</span>
            </div>
            {interval === "year" && (
              <div className={`text-xs ${isDark ? "text-slate-500" : "text-blue-400"}`}>
                billed annually at $228/yr
              </div>
            )}
            <ul className={`mt-3 space-y-1.5 text-sm ${isDark ? "text-slate-200" : "text-blue-900"}`}>
              <li>Unlimited maps</li>
              <li>5 workspaces</li>
              <li>Unlimited AI brainstorm</li>
              <li>All node types</li>
              <li>Export PNG/SVG/PDF</li>
              <li>All templates</li>
              <li>Public sharing</li>
            </ul>
            {currentPlan === "pro" ? (
              <div className={`mt-4 rounded-lg py-2 text-center text-sm font-semibold ${
                isDark ? "bg-sky-500/20 text-sky-300" : "bg-blue-200 text-blue-700"
              }`}>
                Current Plan
              </div>
            ) : (
              <div className="mt-4 rounded-lg bg-gradient-to-r from-sky-500 to-blue-500 py-2 text-center text-sm font-semibold text-white shadow-sm">
                {loading ? "Redirecting..." : "Start 14-Day Free Trial"}
              </div>
            )}
          </button>

          {/* Team plan */}
          <button
            className={`relative rounded-xl border p-4 text-left transition hover:-translate-y-[1px] hover:shadow-lg ${
              isDark
                ? "border-emerald-500/30 bg-[#0b1422] text-slate-100 hover:border-emerald-500/50"
                : "border-emerald-200 bg-emerald-50 text-emerald-900 hover:border-emerald-400"
            } ${currentPlan === "team" ? "ring-2 ring-emerald-500/50" : ""}`}
            disabled={loading || currentPlan === "team"}
            onClick={() => handleSelect("team")}
          >
            <div className={`absolute -top-2.5 right-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
              isDark ? "bg-emerald-500 text-white" : "bg-emerald-500 text-white"
            }`}>
              Most Popular
            </div>
            <div className={`text-sm font-semibold ${isDark ? "text-emerald-300" : "text-emerald-900"}`}>Team</div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className={`text-2xl font-bold ${isDark ? "text-emerald-300" : "text-emerald-700"}`}>
                ${teamPrice}
              </span>
              <span className={`text-sm ${isDark ? "text-slate-400" : "text-emerald-500"}`}>/mo</span>
            </div>
            {interval === "year" && (
              <div className={`text-xs ${isDark ? "text-slate-500" : "text-emerald-400"}`}>
                billed annually at $708/yr
              </div>
            )}
            <ul className={`mt-3 space-y-1.5 text-sm ${isDark ? "text-slate-200" : "text-emerald-900"}`}>
              <li>Everything in Pro</li>
              <li>Unlimited workspaces</li>
              <li>Unlimited team members</li>
              <li>Version history</li>
              <li>Priority support</li>
              <li>API access (coming)</li>
            </ul>
            {currentPlan === "team" ? (
              <div className={`mt-4 rounded-lg py-2 text-center text-sm font-semibold ${
                isDark ? "bg-emerald-500/20 text-emerald-300" : "bg-emerald-200 text-emerald-700"
              }`}>
                Current Plan
              </div>
            ) : (
              <div className="mt-4 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 py-2 text-center text-sm font-semibold text-white shadow-sm">
                {loading ? "Redirecting..." : "Start 14-Day Free Trial"}
              </div>
            )}
          </button>
        </div>

        {isPaid && (
          <div className="mt-4 text-center">
            <button
              className={`text-sm font-semibold underline transition ${
                isDark ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-700"
              }`}
              onClick={handleManageBilling}
              disabled={loading}
            >
              Manage billing, invoices & cancel
            </button>
          </div>
        )}

        {error && <div className="mt-3 text-sm text-rose-400">{error}</div>}

        <p className={`mt-4 text-center text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>
          14-day free trial on all paid plans. Cancel anytime. Prices in USD.
        </p>
      </div>
    </div>
  );
}
