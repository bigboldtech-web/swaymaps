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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500">Upgrade</div>
            <div className="text-lg font-semibold text-slate-900">
              Unlock more maps and features
            </div>
            <p className="text-sm text-slate-600">
              Current plan: {currentUser?.plan ?? "free"}
            </p>
          </div>
          <button
            className="rounded-full border border-slate-200 px-3 py-1 text-sm font-semibold text-slate-700 hover:border-slate-300"
            onClick={onClose}
            aria-label="Close upgrade modal"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <button
            className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-left shadow-sm transition hover:-translate-y-[1px] hover:shadow"
            disabled={loading}
            onClick={() => handleSelect("pro")}
          >
            <div className="text-sm font-semibold text-blue-900">Pro</div>
            <div className="text-lg font-bold text-blue-700 mt-1">$9/mo</div>
            <ul className="mt-2 space-y-1 text-sm text-blue-900">
              <li>• Unlimited maps</li>
              <li>• Export & sharing</li>
              <li>• Priority support</li>
            </ul>
          </button>

          <button
            className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-left shadow-sm transition hover:-translate-y-[1px] hover:shadow"
            disabled={loading}
            onClick={() => handleSelect("team")}
          >
            <div className="text-sm font-semibold text-emerald-900">Team</div>
            <div className="text-lg font-bold text-emerald-700 mt-1">$19/mo</div>
            <ul className="mt-2 space-y-1 text-sm text-emerald-900">
              <li>• Unlimited maps & seats</li>
              <li>• Collaboration & audit</li>
              <li>• SSO-ready</li>
            </ul>
          </button>
        </div>

        {error && <div className="mt-3 text-sm text-rose-600">{error}</div>}
        <p className="mt-4 text-xs text-slate-500">
          (Demo upgrade: updates plan on your account. Hook Stripe for production.)
        </p>
      </div>
    </div>
  );
}
