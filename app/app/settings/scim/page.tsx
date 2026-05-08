"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { Plus, Trash2, Copy, KeyRound } from "lucide-react";
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

interface Token {
  id: string;
  name: string;
  tokenPrefix: string;
  defaultRole: string;
  lastUsedAt?: string | null;
  createdAt: string;
}

export default function SCIMSettingsPage() {
  const { data: session } = useSession();
  const [workspaces, setWorkspaces] = React.useState<{ id: string; name: string }[]>([]);
  const [workspaceId, setWorkspaceId] = React.useState<string | null>(null);
  const [tokens, setTokens] = React.useState<Token[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [revealed, setRevealed] = React.useState<{ token: string; name: string } | null>(null);

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
      const res = await fetch(`/api/scim/tokens?workspaceId=${workspaceId}`);
      if (!res.ok) {
        setTokens([]);
        return;
      }
      const data = await res.json();
      setTokens(data.tokens ?? []);
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  React.useEffect(() => {
    load();
  }, [load]);

  const remove = async (id: string) => {
    if (!confirm("Revoke this SCIM token? Provisioning will stop until a new token is issued.")) return;
    const res = await fetch(`/api/scim/tokens/${id}`, { method: "DELETE" });
    if (res.ok) {
      setTokens((p) => p.filter((t) => t.id !== id));
      toast.success("Token revoked");
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-fg-muted text-sm">Sign in to manage SCIM tokens.</p>
      </div>
    );
  }

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="min-h-screen bg-bg-subtle">
      <div className="mx-auto max-w-[1100px] px-6 py-8">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-fg">SCIM Provisioning</h1>
            <p className="mt-1 text-sm text-fg-muted">
              Auto-provision and de-provision users and groups from your identity
              provider via SCIM 2.0.
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
            <Button
              variant="primary"
              size="md"
              icon={<Plus />}
              onClick={() => setShowNew(true)}
              disabled={!workspaceId}
            >
              Generate token
            </Button>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="rounded-md border border-border bg-panel p-5 mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-fg-muted">
            SCIM endpoint
          </p>
          <p className="mt-1 text-sm text-fg-muted">
            Configure these in your IdP&apos;s SCIM application setup.
          </p>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
            <div>
              <dt className="text-xs text-fg-subtle">Base URL</dt>
              <dd className="mt-0.5 font-mono text-xs text-fg break-all">
                {baseUrl}/api/scim/v2
              </dd>
            </div>
            <div>
              <dt className="text-xs text-fg-subtle">Auth</dt>
              <dd className="mt-0.5 font-mono text-xs text-fg">Bearer Token</dd>
            </div>
          </dl>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-fg-muted">Loading…</div>
        ) : tokens.length === 0 ? (
          <div className="rounded-md border border-dashed border-border bg-panel p-12 text-center">
            <KeyRound className="h-6 w-6 text-fg-subtle mx-auto" />
            <h2 className="mt-3 text-md font-semibold text-fg">No SCIM tokens</h2>
            <p className="mt-1 text-sm text-fg-muted max-w-sm mx-auto">
              Generate a token to let your IdP synchronize users and groups.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {tokens.map((t) => (
              <li
                key={t.id}
                className="flex items-center gap-3 rounded-md border border-border bg-panel p-4"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-bg-muted">
                  <KeyRound className="h-4 w-4 text-fg-muted" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-fg truncate">{t.name}</span>
                    <Badge variant="default" size="sm">
                      Default role: {t.defaultRole}
                    </Badge>
                  </div>
                  <div className="mt-0.5 text-xs text-fg-subtle">
                    <span className="font-mono">{t.tokenPrefix}…</span> · Created{" "}
                    {new Date(t.createdAt).toLocaleDateString()}
                    {t.lastUsedAt && ` · Last used ${new Date(t.lastUsedAt).toLocaleString()}`}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Revoke"
                  onClick={() => remove(t.id)}
                >
                  <Trash2 className="h-3.5 w-3.5 text-fg-subtle" />
                </Button>
              </li>
            ))}
          </ul>
        )}

        <NewTokenDialog
          open={showNew}
          onClose={() => setShowNew(false)}
          workspaceId={workspaceId}
          onCreated={(token, name) => {
            setShowNew(false);
            setRevealed({ token, name });
            load();
          }}
        />

        <Dialog open={!!revealed} onOpenChange={(o) => { if (!o) setRevealed(null); }}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Token created — copy it now</DialogTitle>
              <DialogDescription>
                This is the only time we will show the full token. Store it in your
                IdP&apos;s SCIM configuration immediately.
              </DialogDescription>
            </DialogHeader>
            {revealed && (
              <div className="space-y-3">
                <div className="rounded-sm border border-border bg-bg-subtle px-3 py-2.5 font-mono text-xs text-fg break-all">
                  {revealed.token}
                </div>
                <Button
                  variant="outline"
                  size="md"
                  icon={<Copy />}
                  onClick={() => {
                    navigator.clipboard.writeText(revealed.token);
                    toast.success("Copied");
                  }}
                >
                  Copy to clipboard
                </Button>
              </div>
            )}
            <DialogFooter>
              <Button variant="primary" onClick={() => setRevealed(null)}>
                I have saved it
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function NewTokenDialog({
  open,
  onClose,
  workspaceId,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  workspaceId: string | null;
  onCreated: (token: string, name: string) => void;
}) {
  const [name, setName] = React.useState("");
  const [defaultRole, setDefaultRole] = React.useState<"EDITOR" | "VIEWER">("EDITOR");
  const [submitting, setSubmitting] = React.useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceId) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/scim/tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId, name, defaultRole }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error ?? "Failed to create token");
        return;
      }
      const data = await res.json();
      setName("");
      onCreated(data.token, data.name);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Generate SCIM token</DialogTitle>
          <DialogDescription>
            Use a descriptive name so you can revoke individual integrations later.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="tok-name">Token name</Label>
            <Input
              id="tok-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Okta Production"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="tok-role">Default role for provisioned users</Label>
            <select
              id="tok-role"
              className="mt-1.5 flex h-8 w-full rounded-sm border border-border bg-panel px-2 text-sm text-fg focus:outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus"
              value={defaultRole}
              onChange={(e) => setDefaultRole(e.target.value as any)}
            >
              <option value="EDITOR">Editor</option>
              <option value="VIEWER">Viewer</option>
            </select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              Generate
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
