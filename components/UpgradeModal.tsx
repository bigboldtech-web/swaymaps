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
  const [coupon, setCoupon] = React.useState("");
  const [couponMessage, setCouponMessage] = React.useState("");
  const discount =
    coupon.trim().toUpperCase() === "DECODE20" ? 0.2 : 0;
  const couponStatus = (() => {
    if (!coupon.trim()) return "";
    return discount > 0 ? "Coupon applied" : "Invalid coupon";
  })();
  const formatPrice = (base: number) => {
    if (discount <= 0) return `$${base}/mo`;
    const discounted = (base * (1 - discount)).toFixed(2);
    return (
      <div className="flex items-baseline gap-2">
        <span className="text-sm line-through opacity-70">${base}/mo</span>
        <span>${discounted}/mo</span>
      </div>
    );
  };
  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");

  const handleSelect = async (plan: "pro" | "team") => {
    setError("");
    setCouponMessage("");
    if (coupon.trim() && discount <= 0) {
      setError("Invalid coupon");
      return;
    }
    setLoading(true);
    try {
      await onSelectPlan(plan, coupon.trim() || undefined);
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
            <div className={`mt-1 text-lg font-bold ${isDark ? "text-sky-300" : "text-blue-700"}`}>
              {formatPrice(4)}
            </div>
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
            <div className={`mt-1 text-lg font-bold ${isDark ? "text-emerald-300" : "text-emerald-700"}`}>
              {formatPrice(19)}
            </div>
            <ul className={`mt-2 space-y-1 text-sm ${isDark ? "text-slate-200" : "text-emerald-900"}`}>
              <li>• Unlimited maps & seats</li>
              <li>• Collaboration & audit</li>
              <li>• SSO-ready</li>
            </ul>
          </button>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <label className="text-sm font-semibold">Coupon code</label>
            <div className="flex items-center gap-2 text-xs">
              <button
                className={`rounded-full px-2 py-1 font-semibold ${
                  isDark ? "bg-slate-800 text-slate-100" : "bg-slate-100 text-slate-700"
                }`}
                onClick={() => setCoupon("DECODE20")}
                type="button"
              >
                Use DECODE20
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              className={`w-full rounded-md border px-3 py-2 text-sm outline-none ${
                isDark
                  ? "border-slate-800 bg-[#0b0f19] text-slate-100 focus:border-sky-400"
                  : "border-slate-200 bg-white text-slate-900 focus:border-sky-400"
              }`}
              placeholder="Enter coupon (e.g., DECODE20)"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />
            <button
              className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold ${
                isDark ? "bg-slate-800 text-slate-100 hover:bg-slate-700" : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
              type="button"
              onClick={() => {
                if (!coupon.trim()) {
                  setError("Enter a coupon to apply");
                  setCouponMessage("");
                  return;
                }
                if (discount <= 0) {
                  setError("Invalid coupon");
                  setCouponMessage("");
                  return;
                }
                setError("");
                setCouponMessage(`Coupon "${coupon.trim()}" will be applied at checkout.`);
              }}
            >
              Apply
            </button>
          </div>
          <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Apply DECODE20 for either Pro or Team to get your discount.
          </p>
          {couponMessage && (
            <p className={`text-xs font-semibold ${isDark ? "text-emerald-300" : "text-emerald-700"}`}>
              {couponMessage}
            </p>
          )}
          {couponStatus && (
            <p
              className={`text-xs font-semibold ${
                discount > 0 ? (isDark ? "text-emerald-300" : "text-emerald-700") : "text-rose-400"
              }`}
            >
              {discount > 0 ? `Savings applied: ${Math.round(discount * 100)}% off` : "Invalid coupon"}
            </p>
          )}
        </div>

        {error && <div className="mt-3 text-sm text-rose-400">{error}</div>}
        <p className={`mt-4 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          (Demo upgrade: updates plan on your account. Hook Stripe for production.)
        </p>
      </div>
    </div>
  );
}
