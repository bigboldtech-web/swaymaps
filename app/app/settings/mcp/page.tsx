"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { Plus, Trash2, Plug, KeyRound, Power, PowerOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/Separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/Dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { toast } from "@/components/ui/Toast";

interface McpServer {
  id: string;
  name: string;
  label: string;
  url: string;
  enabled: boolean;
  hasAuthToken: boolean;
  createdAt: string;
}

const PRESETS: Array<{ name: string; label: string; url: string; hint: string }> = [
  {
    name: "linear",
    label: "Linear",
    url: "https://mcp.linear.app/mcp",
    hint: "Issues, projects, cycles. Auth via OAuth bearer token.",
  },
  {
    name: "github",
    label: "GitHub",
    url: "https://api.githubcopilot.com/mcp/",
    hint: "Repos, PRs, issues, actions. Auth via GitHub PAT or OAuth.",
  },
  {
    name: "notion",
    label: "Notion",
    url: "https://mcp.notion.com/mcp",
    hint: "Databases, pages. Auth via OAuth bearer token.",
  },
];

export default function McpSettingsPage() {
  const { data: session } = useSession();
  const [workspaces, setWorkspaces] = React.useState<{ id: string; name: string }[]>([]);
  const [workspaceId, setWorkspaceId] = React.useState<string | null>(null);
  const [servers, setServers] = React.useState<McpServer[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [presetSeed, setPresetSeed] = React.useState<typeof PRESETS[number] | null>(null);

  React.useEffect(() => {
    fetch("/api/workspaces")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.workspaces ?? [];
        setWorkspaces(list.map((w: any) => ({ id: w.id, name: w.name })));
        if (list.length > 0) setWorkspaceId(list[0].id);
      });
  }, []);

  const load = React.useCallback(async () => {
    if (!workspaceId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/mcp-servers?workspaceId=${workspaceId}`);
      if (!res.ok) {
        setServers([]);
        return;
      }
      const data = await res.json();
      setServers(data.servers ?? []);
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  React.useEffect(() => {
    load();
  }, [load]);

  const remove = async (id: string) => {
    if (!confirm("Remove this MCP server? Sidekick will stop using its tools immediately.")) return;
    const res = await fetch(`/api/mcp-servers/${id}`, { method: "DELETE" });
    if (res.ok) {
      setServers((p) => p.filter((s) => s.id !== id));
      toast.success("Removed");
    }
  };

  const toggle = async (server: McpServer) => {
    const res = await fetch(`/api/mcp-servers/${server.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: !server.enabled }),
    });
    if (res.ok) {
      const data = await res.json();
      setServers((p) => p.map((s) => (s.id === server.id ? data.server : s)));
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-fg-muted text-sm">Sign in to manage MCP servers.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-subtle">
      <div className="mx-auto max-w-[1100px] px-6 py-8">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-fg">MCP servers</h1>
            <p className="mt-1 text-sm text-fg-muted">
              Connect external systems (Linear, GitHub, Notion, anything that speaks MCP) to give
              Sidekick live context. Sidekick gets new tools automatically when servers are enabled.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="md">
                  {workspaces.find((w) => w.id === workspaceId)?.name ?? "Select workspace"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {workspaces.map((w) => (
                  <DropdownMenuItem key={w.id} onClick={() => setWorkspaceId(w.id)}>
                    {w.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="primary" size="md" icon={<Plus />} disabled={!workspaceId}>
                  Add server
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {PRESETS.map((preset) => (
                  <DropdownMenuItem
                    key={preset.name}
                    onClick={() => {
                      setPresetSeed(preset);
                      setShowNew(true);
                    }}
                  >
                    <Plug className="h-3.5 w-3.5" />
                    {preset.label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem
                  onClick={() => {
                    setPresetSeed(null);
                    setShowNew(true);
                  }}
                >
                  Custom URL…
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Separator className="my-6" />

        {loading ? (
          <div className="py-12 text-center text-sm text-fg-muted">Loading…</div>
        ) : servers.length === 0 ? (
          <div className="rounded-md border border-dashed border-border bg-panel p-12 text-center">
            <Plug className="h-6 w-6 text-fg-subtle mx-auto" />
            <h2 className="mt-3 text-md font-semibold text-fg">No MCP servers connected</h2>
            <p className="mt-1 text-sm text-fg-muted max-w-sm mx-auto">
              Add a server (Linear, GitHub, Notion, etc.) to give the Sidekick live tools that
              read and act on your other systems.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {servers.map((s) => (
              <li
                key={s.id}
                className="flex items-center gap-3 rounded-md border border-border bg-panel p-4"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-bg-muted">
                  <Plug className="h-4 w-4 text-fg-muted" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-fg truncate">{s.label}</span>
                    <Badge variant="default" size="sm">{s.name}</Badge>
                    {s.enabled ? (
                      <Badge variant="emerald" size="sm">Enabled</Badge>
                    ) : (
                      <Badge variant="default" size="sm">Disabled</Badge>
                    )}
                    {s.hasAuthToken && (
                      <span
                        className="inline-flex items-center gap-1 text-xs text-fg-subtle"
                        title="Auth token configured"
                      >
                        <KeyRound className="h-3 w-3" />
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 text-xs text-fg-subtle font-mono truncate">{s.url}</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  icon={s.enabled ? <PowerOff /> : <Power />}
                  onClick={() => toggle(s)}
                >
                  {s.enabled ? "Disable" : "Enable"}
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Remove"
                  onClick={() => remove(s.id)}
                >
                  <Trash2 className="h-3.5 w-3.5 text-fg-subtle" />
                </Button>
              </li>
            ))}
          </ul>
        )}

        <NewServerDialog
          open={showNew}
          preset={presetSeed}
          onClose={() => {
            setShowNew(false);
            setPresetSeed(null);
          }}
          workspaceId={workspaceId}
          onCreated={() => {
            setShowNew(false);
            setPresetSeed(null);
            load();
          }}
        />
      </div>
    </div>
  );
}

function NewServerDialog({
  open,
  preset,
  onClose,
  workspaceId,
  onCreated,
}: {
  open: boolean;
  preset: typeof PRESETS[number] | null;
  onClose: () => void;
  workspaceId: string | null;
  onCreated: () => void;
}) {
  const [name, setName] = React.useState("");
  const [label, setLabel] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [authToken, setAuthToken] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    setName(preset?.name ?? "");
    setLabel(preset?.label ?? "");
    setUrl(preset?.url ?? "");
    setAuthToken("");
  }, [open, preset]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceId) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/mcp-servers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          name,
          label,
          url,
          authToken: authToken.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error ?? "Failed to add server");
        return;
      }
      toast.success("MCP server added");
      onCreated();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{preset ? `Add ${preset.label}` : "Add MCP server"}</DialogTitle>
          <DialogDescription>
            {preset?.hint ??
              "Connect a Model Context Protocol server. Sidekick will load its tools on the next chat."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <Label htmlFor="mcp-label">Display label</Label>
            <Input
              id="mcp-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
              className="mt-1.5"
              placeholder="e.g. Linear (Production)"
            />
          </div>
          <div>
            <Label htmlFor="mcp-name">Short name</Label>
            <Input
              id="mcp-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1.5 font-mono"
              placeholder="e.g. linear"
            />
            <p className="mt-1 text-xs text-fg-subtle">
              Lowercase identifier shown to Claude. Letters, digits, underscores only.
            </p>
          </div>
          <div>
            <Label htmlFor="mcp-url">MCP server URL</Label>
            <Input
              id="mcp-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="mt-1.5 font-mono text-xs"
              placeholder="https://mcp.example.com/mcp"
            />
          </div>
          <div>
            <Label htmlFor="mcp-token">Auth token (optional)</Label>
            <Input
              id="mcp-token"
              type="password"
              value={authToken}
              onChange={(e) => setAuthToken(e.target.value)}
              className="mt-1.5"
              placeholder="Bearer token, OAuth access token, or PAT"
            />
            <p className="mt-1 text-xs text-fg-subtle">
              Stored on the server, never returned to the client. Leave blank if the server is public.
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              Add server
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
