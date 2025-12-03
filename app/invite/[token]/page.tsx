"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type InviteDetails = {
  email: string;
  workspaceName: string;
  role: string;
  isExpired: boolean;
  acceptedAt?: string;
};

export default function InviteAcceptPage({ params }: { params: { token: string } }) {
  const router = useRouter();
  const [details, setDetails] = useState<InviteDetails | null>(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/invites/${params.token}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Invite not found");
      } else {
        setDetails(data);
      }
    };
    load();
  }, [params.token]);

  const handleAccept = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch(`/api/invites/${params.token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password })
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Could not accept invite");
      return;
    }
    router.push("/auth/signin");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="mb-4">
          <div className="text-xs uppercase tracking-wide text-slate-500">Decode Map</div>
          <div className="text-xl font-semibold text-slate-900">Accept invite</div>
        </div>
        {!details && !error && <div className="text-sm text-slate-600">Loading...</div>}
        {error && <div className="text-sm text-rose-600 mb-3">{error}</div>}
        {details && (
          <>
            <div className="mb-3 text-sm text-slate-700">
              You’re invited to <strong>{details.workspaceName}</strong> as <strong>{details.role}</strong>{" "}
              with email <strong>{details.email}</strong>.
            </div>
            {details.isExpired && (
              <div className="text-sm text-amber-700">This invite has expired.</div>
            )}
            {details.acceptedAt && (
              <div className="text-sm text-emerald-700">Invite already accepted.</div>
            )}
            {!details.isExpired && !details.acceptedAt && (
              <form onSubmit={handleAccept} className="space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-wide text-slate-500">Name</label>
                  <input
                    className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-300"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wide text-slate-500">Password</label>
                  <input
                    type="password"
                    className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-300"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
                >
                  {loading ? "Accepting..." : "Accept invite"}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
