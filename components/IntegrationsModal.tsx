"use client";

import React, { useState, useEffect, useCallback } from "react";

interface Integration {
  id: string;
  type: string;
  name: string;
  webhookUrl: string;
  events: string;
  enabled: boolean;
  createdAt: string;
}

interface IntegrationsModalProps {
  open: boolean;
  onClose: () => void;
  workspaceId: string | null;
}

const EVENT_OPTIONS = [
  { value: "all", label: "All events" },
  { value: "map.created", label: "Map created" },
  { value: "map.updated", label: "Map updated" },
  { value: "node.added", label: "Node added" },
  { value: "comment.added", label: "Comment added" },
];

export function IntegrationsModal({ open, onClose, workspaceId }: IntegrationsModalProps) {
  const [tab, setTab] = useState<"slack" | "teams">("slack");
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>(["all"]);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchIntegrations = useCallback(async () => {
    if (!workspaceId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/integrations?workspaceId=${workspaceId}`);
      if (res.ok) {
        const data = await res.json();
        setIntegrations(data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    if (open && workspaceId) fetchIntegrations();
  }, [open, workspaceId, fetchIntegrations]);

  if (!open) return null;

  const filteredIntegrations = integrations.filter((i) => i.type === tab);

  const eventsValue = selectedEvents.includes("all")
    ? "all"
    : selectedEvents.join(",");

  const handleToggleEvent = (value: string) => {
    if (value === "all") {
      setSelectedEvents(["all"]);
      return;
    }
    let next = selectedEvents.filter((e) => e !== "all");
    if (next.includes(value)) {
      next = next.filter((e) => e !== value);
    } else {
      next.push(value);
    }
    if (next.length === 0) next = ["all"];
    setSelectedEvents(next);
  };

  const handleAdd = async () => {
    if (!workspaceId || !name.trim() || !webhookUrl.trim()) {
      setError("Name and webhook URL are required.");
      return;
    }
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          type: tab,
          name: name.trim(),
          webhookUrl: webhookUrl.trim(),
          events: eventsValue,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to add integration.");
        return;
      }
      setName("");
      setWebhookUrl("");
      setSelectedEvents(["all"]);
      setSuccess("Integration added successfully.");
      fetchIntegrations();
    } catch {
      setError("Failed to add integration.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!workspaceId) return;
    if (!confirm("Remove this integration?")) return;
    try {
      await fetch(`/api/integrations?id=${id}&workspaceId=${workspaceId}`, { method: "DELETE" });
      fetchIntegrations();
    } catch {
      // ignore
    }
  };

  const handleTest = async (integration: Integration) => {
    setTesting(integration.id);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/integrations/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: integration.type, webhookUrl: integration.webhookUrl }),
      });
      if (res.ok) {
        setSuccess(`Test message sent to "${integration.name}".`);
      } else {
        setError("Test failed. Check the webhook URL.");
      }
    } catch {
      setError("Test failed.");
    } finally {
      setTesting(null);
    }
  };

  const handleTestNew = async () => {
    if (!webhookUrl.trim()) {
      setError("Enter a webhook URL first.");
      return;
    }
    setTesting("new");
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/integrations/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: tab, webhookUrl: webhookUrl.trim() }),
      });
      if (res.ok) {
        setSuccess("Test message sent successfully.");
      } else {
        setError("Test failed. Check the webhook URL.");
      }
    } catch {
      setError("Test failed.");
    } finally {
      setTesting(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-fade-in">
      <div className="w-full max-w-2xl max-sm:max-w-full rounded-2xl glass-panel-solid p-4 sm:p-6 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-400">Integrations</div>
            <div className="text-xl font-semibold text-slate-100">Slack & Microsoft Teams</div>
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

        {/* Tabs */}
        <div className="flex gap-1 mb-5 rounded-lg border border-slate-700/40 bg-slate-800/30 p-1">
          <button
            className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold transition ${
              tab === "slack"
                ? "bg-slate-700/60 text-slate-100"
                : "text-slate-400 hover:text-slate-200"
            }`}
            onClick={() => { setTab("slack"); setError(""); setSuccess(""); }}
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zm10.124 2.521a2.528 2.528 0 0 1 2.52-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.52V8.834zm-1.271 0a2.528 2.528 0 0 1-2.521 2.521 2.528 2.528 0 0 1-2.521-2.521V2.522A2.528 2.528 0 0 1 15.166 0a2.528 2.528 0 0 1 2.521 2.522v6.312zm-2.521 10.124a2.528 2.528 0 0 1 2.521 2.52A2.528 2.528 0 0 1 15.166 24a2.528 2.528 0 0 1-2.521-2.522v-2.52h2.521zm0-1.271a2.528 2.528 0 0 1-2.521-2.521 2.528 2.528 0 0 1 2.521-2.521h6.312A2.528 2.528 0 0 1 24 15.166a2.528 2.528 0 0 1-2.522 2.521h-6.312z"/></svg>
              Slack
            </span>
          </button>
          <button
            className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold transition ${
              tab === "teams"
                ? "bg-slate-700/60 text-slate-100"
                : "text-slate-400 hover:text-slate-200"
            }`}
            onClick={() => { setTab("teams"); setError(""); setSuccess(""); }}
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.625 6.547h-2.344V4.734a1.64 1.64 0 0 0-1.64-1.64h-5.157a1.64 1.64 0 0 0-1.64 1.64v4.688H6.656A1.64 1.64 0 0 0 5.016 11.06v5.157a1.64 1.64 0 0 0 1.64 1.64h3.188v2.344a1.64 1.64 0 0 0 1.64 1.64h5.157a1.64 1.64 0 0 0 1.64-1.64v-4.688h3.188a1.172 1.172 0 0 0 1.172-1.172V7.72a1.172 1.172 0 0 0-1.172-1.172zM9.844 16.216H7.031a.469.469 0 0 1-.469-.469V11.06a.469.469 0 0 1 .469-.469h2.813v5.625zm6.562 3.985a.469.469 0 0 1-.469.469h-5.156a.469.469 0 0 1-.469-.469v-5.157-.469-4.688-.469-4.688a.469.469 0 0 1 .469-.469h5.156a.469.469 0 0 1 .469.469v4.688.469 4.688.469 5.157zm3.985-5.86h-2.813V7.72h2.813v6.622z"/></svg>
              Microsoft Teams
            </span>
          </button>
        </div>

        {/* Instructions */}
        <div className="mb-5 rounded-xl border border-slate-700/40 bg-slate-800/30 p-4">
          <div className="text-sm font-semibold text-slate-200 mb-2">Setup Instructions</div>
          {tab === "slack" ? (
            <ol className="text-xs text-slate-400 space-y-1 list-decimal list-inside">
              <li>Go to your Slack workspace settings and open <span className="text-slate-300">Incoming Webhooks</span>.</li>
              <li>Click <span className="text-slate-300">Add New Webhook to Workspace</span> and select a channel.</li>
              <li>Copy the webhook URL (starts with <code className="text-brand-400">https://hooks.slack.com/</code>).</li>
              <li>Paste it below and give the integration a name.</li>
            </ol>
          ) : (
            <ol className="text-xs text-slate-400 space-y-1 list-decimal list-inside">
              <li>In Microsoft Teams, go to your channel and click <span className="text-slate-300">Connectors</span> (or <span className="text-slate-300">Workflows</span>).</li>
              <li>Add an <span className="text-slate-300">Incoming Webhook</span> connector and name it.</li>
              <li>Copy the webhook URL (contains <code className="text-brand-400">webhook.office.com</code>).</li>
              <li>Paste it below and give the integration a name.</li>
            </ol>
          )}
        </div>

        {/* Feedback */}
        {error && (
          <div className="mb-4 rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-sm text-rose-400">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">
            {success}
          </div>
        )}

        {/* Add new integration */}
        <div className="mb-5 rounded-xl border border-slate-700/40 bg-slate-800/30 p-4 space-y-3">
          <div className="text-sm font-semibold text-slate-200">Add {tab === "slack" ? "Slack" : "Teams"} Integration</div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-wide text-slate-500 mb-1 block">Name</label>
              <input
                type="text"
                className="w-full rounded-lg border border-slate-700/50 bg-slate-800/30 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50"
                placeholder={tab === "slack" ? "e.g. #dev-notifications" : "e.g. Dev Channel"}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-slate-500 mb-1 block">Webhook URL</label>
              <input
                type="url"
                className="w-full rounded-lg border border-slate-700/50 bg-slate-800/30 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50"
                placeholder={tab === "slack" ? "https://hooks.slack.com/services/..." : "https://...webhook.office.com/..."}
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
            </div>
          </div>

          {/* Event filters */}
          <div>
            <label className="text-xs uppercase tracking-wide text-slate-500 mb-2 block">Events</label>
            <div className="flex flex-wrap gap-2">
              {EVENT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    selectedEvents.includes(opt.value)
                      ? "border-brand-500/50 bg-brand-500/20 text-brand-300"
                      : "border-slate-700/50 text-slate-400 hover:text-slate-200 hover:border-slate-600"
                  }`}
                  onClick={() => handleToggleEvent(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              className="rounded-lg bg-gradient-to-r from-brand-600 to-brand-400 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 transition hover:shadow-brand-500/40 disabled:opacity-50"
              onClick={handleAdd}
              disabled={saving}
            >
              {saving ? "Adding..." : "Add Integration"}
            </button>
            <button
              className="rounded-lg border border-slate-700/50 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800/60 disabled:opacity-50"
              onClick={handleTestNew}
              disabled={testing === "new" || !webhookUrl.trim()}
            >
              {testing === "new" ? "Sending..." : "Test Webhook"}
            </button>
          </div>
        </div>

        {/* Existing integrations */}
        <div className="rounded-xl border border-slate-700/40 bg-slate-800/30 p-4">
          <div className="text-sm font-semibold text-slate-200 mb-3">
            Active {tab === "slack" ? "Slack" : "Teams"} Integrations
          </div>
          {loading ? (
            <div className="text-sm text-slate-400">Loading...</div>
          ) : filteredIntegrations.length === 0 ? (
            <div className="text-sm text-slate-500">
              No {tab === "slack" ? "Slack" : "Teams"} integrations configured yet.
            </div>
          ) : (
            <div className="space-y-2">
              {filteredIntegrations.map((integration) => (
                <div
                  key={integration.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-slate-700/30 bg-slate-800/20 px-3 py-2"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-slate-200 truncate">{integration.name}</div>
                    <div className="text-xs text-slate-500 truncate">{integration.webhookUrl}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Events: {integration.events === "all" ? "All" : integration.events}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${
                        integration.enabled ? "bg-emerald-400" : "bg-slate-600"
                      }`}
                      title={integration.enabled ? "Enabled" : "Disabled"}
                    />
                    <button
                      className="rounded-md border border-slate-700/50 px-2 py-1 text-xs font-semibold text-slate-300 transition hover:bg-slate-700/40 disabled:opacity-50"
                      onClick={() => handleTest(integration)}
                      disabled={testing === integration.id}
                    >
                      {testing === integration.id ? "..." : "Test"}
                    </button>
                    <button
                      className="rounded-md border border-rose-500/40 px-2 py-1 text-xs font-semibold text-rose-400 transition hover:bg-rose-500/10"
                      onClick={() => handleDelete(integration.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
