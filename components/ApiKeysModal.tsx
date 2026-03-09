"use client";

import React, { useState, useEffect, useCallback } from "react";

interface ApiKeyEntry {
  id: string;
  name: string;
  keyPrefix: string;
  permissions: string;
  lastUsedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  workspaceId: string;
}

interface ApiKeysModalProps {
  open: boolean;
  onClose: () => void;
  workspaceId: string | null;
}

export function ApiKeysModal({ open, onClose, workspaceId }: ApiKeysModalProps) {
  const [keys, setKeys] = useState<ApiKeyEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyPermission, setNewKeyPermission] = useState("read");
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDocs, setShowDocs] = useState(false);

  const fetchKeys = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/keys");
      if (res.ok) {
        const data = await res.json();
        setKeys(data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchKeys();
      setCreatedKey(null);
      setCopied(false);
      setError(null);
    }
  }, [open, fetchKeys]);

  const handleCreate = async () => {
    if (!newKeyName.trim() || !workspaceId) return;
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName.trim(), workspaceId, permissions: newKeyPermission }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create key");
        return;
      }
      const data = await res.json();
      setCreatedKey(data.key);
      setNewKeyName("");
      setNewKeyPermission("read");
      fetchKeys();
    } catch {
      setError("Failed to create key");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this API key? Any integrations using it will stop working.")) return;
    try {
      await fetch(`/api/keys?id=${id}`, { method: "DELETE" });
      fetchKeys();
    } catch {
      // ignore
    }
  };

  const handleCopy = () => {
    if (createdKey) {
      navigator.clipboard.writeText(createdKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!open) return null;

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://app.swaymaps.com";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-fade-in">
      <div className="w-full max-w-2xl max-sm:max-w-full max-h-[90vh] overflow-y-auto rounded-2xl glass-panel-solid p-4 sm:p-6 shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-400">Developer</div>
            <div className="text-xl font-semibold text-slate-100">API Keys</div>
          </div>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700/50 text-slate-400 transition hover:bg-slate-800/60 hover:text-slate-200"
            onClick={onClose}
            aria-label="Close"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Created key banner */}
        {createdKey && (
          <div className="mb-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 space-y-2">
            <div className="text-sm font-semibold text-emerald-400">API key created successfully</div>
            <p className="text-xs text-emerald-300/80">
              Copy this key now. You will not be able to see it again.
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded-lg bg-slate-900/60 px-3 py-2 text-xs font-mono text-slate-200 break-all select-all">
                {createdKey}
              </code>
              <button
                onClick={handleCopy}
                className="shrink-0 rounded-lg border border-emerald-500/40 px-3 py-2 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-500/20"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        )}

        {/* Create key form */}
        <div className="mb-4 rounded-xl border border-slate-700/40 bg-slate-800/30 p-4 space-y-3">
          <div className="text-sm font-semibold text-slate-200">Create new key</div>
          {error && <div className="text-xs text-rose-400">{error}</div>}
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Key name (e.g. CI/CD Pipeline)"
              className="flex-1 rounded-lg border border-slate-700/50 bg-slate-800/30 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
            <select
              className="rounded-lg border border-slate-700/50 bg-slate-800/30 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50"
              value={newKeyPermission}
              onChange={(e) => setNewKeyPermission(e.target.value)}
            >
              <option value="read">Read only</option>
              <option value="read,write">Read & Write</option>
            </select>
            <button
              onClick={handleCreate}
              disabled={creating || !newKeyName.trim() || !workspaceId}
              className="shrink-0 rounded-lg bg-gradient-to-r from-brand-600 to-brand-400 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 transition hover:shadow-brand-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating ? "Creating..." : "Create key"}
            </button>
          </div>
        </div>

        {/* Keys list */}
        <div className="mb-4 rounded-xl border border-slate-700/40 bg-slate-800/30 p-4 space-y-3">
          <div className="text-sm font-semibold text-slate-200">Your API keys</div>
          {loading ? (
            <div className="text-sm text-slate-400">Loading...</div>
          ) : keys.length === 0 ? (
            <div className="text-sm text-slate-500">No API keys yet. Create one above to get started.</div>
          ) : (
            <div className="space-y-2">
              {keys.map((k) => (
                <div
                  key={k.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border border-slate-700/30 bg-slate-900/30 px-3 py-2"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-200 truncate">{k.name}</span>
                      <span className="shrink-0 rounded-full bg-slate-700/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        {k.permissions}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-3 text-xs text-slate-500">
                      <span className="font-mono">{k.keyPrefix}...</span>
                      <span>Created {new Date(k.createdAt).toLocaleDateString()}</span>
                      {k.lastUsedAt && <span>Last used {new Date(k.lastUsedAt).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(k.id)}
                    className="shrink-0 rounded-md border border-rose-500/40 px-2 py-1 text-xs font-semibold text-rose-400 transition hover:bg-rose-500/10"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* API docs */}
        <div className="rounded-xl border border-slate-700/40 bg-slate-800/30 p-4 space-y-3">
          <button
            className="flex w-full items-center justify-between text-sm font-semibold text-slate-200"
            onClick={() => setShowDocs(!showDocs)}
          >
            <span>API Documentation</span>
            <svg
              className={`h-4 w-4 text-slate-400 transition-transform ${showDocs ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path strokeLinecap="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showDocs && (
            <div className="space-y-4 text-xs text-slate-400">
              <p>
                Use your API key as a Bearer token in the <code className="rounded bg-slate-700/60 px-1 py-0.5 text-slate-300">Authorization</code> header.
              </p>

              <div className="space-y-1">
                <div className="font-semibold text-slate-300">List maps</div>
                <pre className="overflow-x-auto rounded-lg bg-slate-900/60 p-3 text-[11px] font-mono text-slate-300">
{`curl ${baseUrl}/api/v1/maps \\
  -H "Authorization: Bearer sm_your_key_here"`}
                </pre>
              </div>

              <div className="space-y-1">
                <div className="font-semibold text-slate-300">Create a map</div>
                <pre className="overflow-x-auto rounded-lg bg-slate-900/60 p-3 text-[11px] font-mono text-slate-300">
{`curl -X POST ${baseUrl}/api/v1/maps \\
  -H "Authorization: Bearer sm_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "My Map", "description": "Created via API"}'`}
                </pre>
              </div>

              <div className="space-y-1">
                <div className="font-semibold text-slate-300">Get a map with nodes & edges</div>
                <pre className="overflow-x-auto rounded-lg bg-slate-900/60 p-3 text-[11px] font-mono text-slate-300">
{`curl ${baseUrl}/api/v1/maps/{mapId} \\
  -H "Authorization: Bearer sm_your_key_here"`}
                </pre>
              </div>

              <div className="space-y-1">
                <div className="font-semibold text-slate-300">Add a node</div>
                <pre className="overflow-x-auto rounded-lg bg-slate-900/60 p-3 text-[11px] font-mono text-slate-300">
{`curl -X POST ${baseUrl}/api/v1/maps/{mapId}/nodes \\
  -H "Authorization: Bearer sm_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"title": "Auth Service", "kind": "system", "color": "#29a5e5"}'`}
                </pre>
              </div>

              <div className="space-y-1">
                <div className="font-semibold text-slate-300">Add an edge</div>
                <pre className="overflow-x-auto rounded-lg bg-slate-900/60 p-3 text-[11px] font-mono text-slate-300">
{`curl -X POST ${baseUrl}/api/v1/maps/{mapId}/edges \\
  -H "Authorization: Bearer sm_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"sourceNodeId": "...", "targetNodeId": "...", "label": "depends on"}'`}
                </pre>
              </div>

              <div className="space-y-1">
                <div className="font-semibold text-slate-300">Endpoints</div>
                <div className="overflow-x-auto rounded-lg bg-slate-900/60 p-3 font-mono text-[11px] text-slate-300 space-y-1">
                  <div><span className="text-emerald-400">GET</span>    /api/v1/maps</div>
                  <div><span className="text-brand-400">POST</span>   /api/v1/maps</div>
                  <div><span className="text-emerald-400">GET</span>    /api/v1/maps/:id</div>
                  <div><span className="text-amber-400">PATCH</span>  /api/v1/maps/:id</div>
                  <div><span className="text-rose-400">DELETE</span> /api/v1/maps/:id</div>
                  <div><span className="text-emerald-400">GET</span>    /api/v1/maps/:id/nodes</div>
                  <div><span className="text-brand-400">POST</span>   /api/v1/maps/:id/nodes</div>
                  <div><span className="text-emerald-400">GET</span>    /api/v1/maps/:id/edges</div>
                  <div><span className="text-brand-400">POST</span>   /api/v1/maps/:id/edges</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
