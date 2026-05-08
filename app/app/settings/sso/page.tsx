"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { Plus, Trash2, ExternalLink, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Label } from "@/components/ui/Input";
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

interface Connection {
  id: string;
  type: "saml" | "oidc";
  name: string;
  enforced: boolean;
  domains: string[];
  defaultRole: string;
  createdAt: string;
}

export default function SSOSettingsPage() {
  const { data: session } = useSession();
  const [workspaceId, setWorkspaceId] = React.useState<string | null>(null);
  const [workspaces, setWorkspaces] = React.useState<{ id: string; name: string }[]>([]);
  const [connections, setConnections] = React.useState<Connection[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);

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
      const res = await fetch(`/api/sso/connections?workspaceId=${workspaceId}`);
      if (!res.ok) {
        setConnections([]);
        return;
      }
      const data = await res.json();
      setConnections(data.connections ?? []);
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  React.useEffect(() => {
    load();
  }, [load]);

  const remove = async (id: string) => {
    if (!confirm("Remove this SSO connection? Users will fall back to password login.")) return;
    const res = await fetch(`/api/sso/connections/${id}`, { method: "DELETE" });
    if (res.ok) {
      setConnections((prev) => prev.filter((c) => c.id !== id));
      toast.success("Connection removed");
    } else {
      toast.error("Failed to remove");
    }
  };

  const toggleEnforced = async (conn: Connection) => {
    const res = await fetch(`/api/sso/connections/${conn.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enforced: !conn.enforced }),
    });
    if (res.ok) {
      const data = await res.json();
      setConnections((prev) => prev.map((c) => (c.id === conn.id ? data.connection : c)));
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-fg-muted text-sm">Sign in to manage SSO.</p>
      </div>
    );
  }

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="min-h-screen bg-bg-subtle">
      <div className="mx-auto max-w-[1100px] px-6 py-8">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-fg">Single Sign-On (SSO)</h1>
            <p className="mt-1 text-sm text-fg-muted">
              Connect your identity provider via SAML 2.0 or OIDC. Standard
              metadata-based setup, JIT provisioning included.
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
              Add connection
            </Button>
          </div>
        </div>

        <Separator className="my-6" />

        {/* SP metadata */}
        <div className="rounded-md border border-border bg-panel p-5 mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-fg-muted">
            Service Provider details
          </p>
          <p className="mt-1 text-sm text-fg-muted">
            Configure these in your IdP when creating the SwayMaps SAML application.
          </p>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
            <div>
              <dt className="text-xs text-fg-subtle">SP Entity ID</dt>
              <dd className="mt-0.5 font-mono text-xs text-fg break-all">
                {process.env.NEXT_PUBLIC_SAML_AUDIENCE ?? "https://saml.swaymaps.com"}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-fg-subtle">ACS / Reply URL</dt>
              <dd className="mt-0.5 font-mono text-xs text-fg break-all">{baseUrl}/api/sso/acs</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs text-fg-subtle">SP metadata (XML)</dt>
              <dd className="mt-0.5">
                <a
                  href="/api/sso/metadata"
                  className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover"
                >
                  Download metadata.xml
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </dd>
            </div>
          </dl>
        </div>

        {/* Connection list */}
        {loading ? (
          <div className="py-12 text-center text-sm text-fg-muted">Loading…</div>
        ) : connections.length === 0 ? (
          <div className="rounded-md border border-dashed border-border bg-panel p-12 text-center">
            <Lock className="h-6 w-6 text-fg-subtle mx-auto" />
            <h2 className="mt-3 text-md font-semibold text-fg">No SSO connections yet</h2>
            <p className="mt-1 text-sm text-fg-muted max-w-sm mx-auto">
              Add a SAML 2.0 or OIDC connection to let your team sign in via your
              identity provider.
            </p>
            <Button
              variant="primary"
              size="md"
              icon={<Plus />}
              className="mt-5"
              onClick={() => setShowNew(true)}
              disabled={!workspaceId}
            >
              Add connection
            </Button>
          </div>
        ) : (
          <ul className="space-y-2">
            {connections.map((c) => (
              <li
                key={c.id}
                className="flex items-center gap-3 rounded-md border border-border bg-panel p-4"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-bg-muted">
                  <Lock className="h-4 w-4 text-fg-muted" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-fg truncate">{c.name}</span>
                    <Badge variant="default" size="sm">
                      {c.type.toUpperCase()}
                    </Badge>
                    {c.enforced && (
                      <Badge variant="emerald" size="sm">
                        Enforced
                      </Badge>
                    )}
                  </div>
                  <div className="mt-0.5 text-xs text-fg-subtle">
                    {c.domains.length > 0
                      ? `Domains: ${c.domains.join(", ")}`
                      : "No domain restrictions"}{" "}
                    · Default role: {c.defaultRole}
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => toggleEnforced(c)}>
                  {c.enforced ? "Unenforce" : "Enforce"}
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Remove"
                  onClick={() => remove(c.id)}
                >
                  <Trash2 className="h-3.5 w-3.5 text-fg-subtle" />
                </Button>
              </li>
            ))}
          </ul>
        )}

        <NewConnectionDialog
          open={showNew}
          onClose={() => setShowNew(false)}
          workspaceId={workspaceId}
          onCreated={() => {
            setShowNew(false);
            load();
          }}
        />
      </div>
    </div>
  );
}

function NewConnectionDialog({
  open,
  onClose,
  workspaceId,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  workspaceId: string | null;
  onCreated: () => void;
}) {
  const [type, setType] = React.useState<"saml" | "oidc">("saml");
  const [name, setName] = React.useState("");
  const [metadata, setMetadata] = React.useState("");
  const [metadataUrl, setMetadataUrl] = React.useState("");
  const [oidcDiscoveryUrl, setOidcDiscoveryUrl] = React.useState("");
  const [oidcClientId, setOidcClientId] = React.useState("");
  const [oidcClientSecret, setOidcClientSecret] = React.useState("");
  const [domains, setDomains] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const reset = () => {
    setType("saml");
    setName("");
    setMetadata("");
    setMetadataUrl("");
    setOidcDiscoveryUrl("");
    setOidcClientId("");
    setOidcClientSecret("");
    setDomains("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceId) return;
    setSubmitting(true);
    try {
      const body: any = {
        workspaceId,
        type,
        name,
        domains: domains.split(",").map((d) => d.trim()).filter(Boolean),
      };
      if (type === "saml") {
        if (metadata) body.metadata = metadata;
        if (metadataUrl) body.metadataUrl = metadataUrl;
      } else {
        body.oidcDiscoveryUrl = oidcDiscoveryUrl;
        body.oidcClientId = oidcClientId;
        body.oidcClientSecret = oidcClientSecret;
      }
      const res = await fetch("/api/sso/connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error ?? "Failed to create connection");
        return;
      }
      toast.success("SSO connection created");
      reset();
      onCreated();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add SSO connection</DialogTitle>
          <DialogDescription>
            SAML 2.0 or OIDC. Bring metadata from your IdP and we&apos;ll wire the rest.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-2 grid-cols-2">
            <button
              type="button"
              className={`rounded-sm border px-3 py-2.5 text-left transition-colors ${
                type === "saml"
                  ? "border-accent bg-accent-subtle"
                  : "border-border bg-panel hover:bg-bg-muted"
              }`}
              onClick={() => setType("saml")}
            >
              <div className="text-sm font-medium text-fg">SAML 2.0</div>
              <div className="text-xs text-fg-muted">Okta, Azure AD, OneLogin, JumpCloud…</div>
            </button>
            <button
              type="button"
              className={`rounded-sm border px-3 py-2.5 text-left transition-colors ${
                type === "oidc"
                  ? "border-accent bg-accent-subtle"
                  : "border-border bg-panel hover:bg-bg-muted"
              }`}
              onClick={() => setType("oidc")}
            >
              <div className="text-sm font-medium text-fg">OIDC</div>
              <div className="text-xs text-fg-muted">Auth0, Keycloak, generic OIDC IdPs.</div>
            </button>
          </div>

          <div>
            <Label htmlFor="sso-name">Connection name</Label>
            <Input
              id="sso-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Okta Production"
              required
              className="mt-1.5"
            />
          </div>

          {type === "saml" ? (
            <>
              <div>
                <Label htmlFor="md-url">Metadata URL (recommended)</Label>
                <Input
                  id="md-url"
                  value={metadataUrl}
                  onChange={(e) => setMetadataUrl(e.target.value)}
                  placeholder="https://your-idp.example/metadata.xml"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="md-xml">…or paste metadata XML</Label>
                <Textarea
                  id="md-xml"
                  value={metadata}
                  onChange={(e) => setMetadata(e.target.value)}
                  rows={6}
                  className="mt-1.5 font-mono text-xs"
                  placeholder="<EntityDescriptor …>"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <Label htmlFor="oidc-disc">Discovery URL</Label>
                <Input
                  id="oidc-disc"
                  value={oidcDiscoveryUrl}
                  onChange={(e) => setOidcDiscoveryUrl(e.target.value)}
                  placeholder="https://your-idp/.well-known/openid-configuration"
                  required
                  className="mt-1.5"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="oidc-id">Client ID</Label>
                  <Input
                    id="oidc-id"
                    value={oidcClientId}
                    onChange={(e) => setOidcClientId(e.target.value)}
                    required
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="oidc-secret">Client Secret</Label>
                  <Input
                    id="oidc-secret"
                    value={oidcClientSecret}
                    onChange={(e) => setOidcClientSecret(e.target.value)}
                    type="password"
                    required
                    className="mt-1.5"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <Label htmlFor="sso-domains">Email domains (optional, comma-separated)</Label>
            <Input
              id="sso-domains"
              value={domains}
              onChange={(e) => setDomains(e.target.value)}
              placeholder="acme.com, acme.co.uk"
              className="mt-1.5"
            />
            <p className="mt-1 text-xs text-fg-subtle">
              Users with these email domains are auto-routed to this connection.
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              Create connection
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
