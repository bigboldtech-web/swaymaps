import React from "react";
import { User } from "../types/map";

interface UpgradeModalProps {
  currentUser: User | undefined;
  onSelectPlan: (plan: "pro" | "team") => Promise<void>;
  onClose: () => void;
}

export function UpgradeModal({ currentUser, onSelectPlan, onClose }: UpgradeModalProps) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");

  const handleSelect = async (plan: "pro" | "team") => {
    setError("");
    setLoading(true);
    try {
      await onSelectPlan(plan);
      onClose();
    } catch (err: any) {
      setError(err?.message ?? "Upgrade failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div
        className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl ${
          isDark ? "border-[#0f172a] bg-[#050b15] text-slate-100" : "border-slate-200 bg-white text-slate-900"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className={`text-xs uppercase tracking-wide ${isDark ? "text-slate-400" : "text-slate-500"}`}>Upgrade</div>
            <div className="text-lg font-semibold">
              Unlock more maps and features
            </div>
            <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              Current plan: {currentUser?.plan ?? "free"}
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

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <button
            className={`rounded-xl border p-4 text-left shadow-sm transition hover:-translate-y-[1px] hover:shadow ${
              isDark
                ? "border-slate-800 bg-[#0b1422] text-slate-100"
                : "border-blue-200 bg-blue-50 text-blue-900"
            }`}
            disabled={loading}
            onClick={() => handleSelect("pro")}
          >
            <div className={`text-sm font-semibold ${isDark ? "text-slate-100" : "text-blue-900"}`}>Pro</div>
            <div className={`mt-1 text-lg font-bold ${isDark ? "text-sky-300" : "text-blue-700"}`}>$9/mo</div>
            <ul className={`mt-2 space-y-1 text-sm ${isDark ? "text-slate-200" : "text-blue-900"}`}>
              <li>• Unlimited maps</li>
              <li>• Export & sharing</li>
              <li>• Priority support</li>
            </ul>
          </button>

          <button
            className={`rounded-xl border p-4 text-left shadow-sm transition hover:-translate-y-[1px] hover:shadow ${
              isDark
                ? "border-slate-800 bg-[#0b1422] text-slate-100"
                : "border-emerald-200 bg-emerald-50 text-emerald-900"
            }`}
            disabled={loading}
            onClick={() => handleSelect("team")}
          >
            <div className={`text-sm font-semibold ${isDark ? "text-slate-100" : "text-emerald-900"}`}>Team</div>
            <div className={`mt-1 text-lg font-bold ${isDark ? "text-emerald-300" : "text-emerald-700"}`}>$19/mo</div>
            <ul className={`mt-2 space-y-1 text-sm ${isDark ? "text-slate-200" : "text-emerald-900"}`}>
              <li>• Unlimited maps & seats</li>
              <li>• Collaboration & audit</li>
              <li>• SSO-ready</li>
            </ul>
          </button>
        </div>

        {error && <div className="mt-3 text-sm text-rose-400">{error}</div>}
        <p className={`mt-4 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          (Demo upgrade: updates plan on your account. Hook Stripe for production.)
        </p>
      </div>
    </div>
  );
}
