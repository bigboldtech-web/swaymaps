"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { Download, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/Separator";
import { ScrollArea } from "@/components/ui/ScrollArea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

interface AuditItem {
  id: string;
  createdAt: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata: any;
  user: { id: string; name: string; email: string; avatarUrl?: string | null };
}

const ACTIONS = [
  "all",
  "map.created", "map.updated", "map.deleted", "map.moved", "map.shared", "map.unshared",
  "folder.created", "folder.updated", "folder.moved", "folder.deleted",
  "member.joined", "member.removed", "member.role_changed",
  "invite.sent", "invite.accepted",
];

const RANGES: { label: string; days: number | null }[] = [
  { label: "Last 24 hours", days: 1 },
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
  { label: "All time", days: null },
];

export default function AuditPage() {
  const { data: session } = useSession();
  const [workspaceId, setWorkspaceId] = React.useState<string | null>(null);
  const [workspaces, setWorkspaces] = React.useState<{ id: string; name: string }[]>([]);

  const [actionFilter, setActionFilter] = React.useState<string>("all");
  const [range, setRange] = React.useState<{ label: string; days: number | null }>(RANGES[2]);
  const [q, setQ] = React.useState("");
  const [items, setItems] = React.useState<AuditItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [nextCursor, setNextCursor] = React.useState<string | null>(null);

  // Load workspaces
  React.useEffect(() => {
    fetch("/api/workspaces")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.workspaces ?? [];
        setWorkspaces(list.map((w: any) => ({ id: w.id, name: w.name })));
        if (list.length > 0) setWorkspaceId(list[0].id);
      })
      .catch(() => {});
  }, []);

  const fromDate = React.useMemo(() => {
    if (range.days === null) return null;
    const d = new Date();
    d.setDate(d.getDate() - range.days);
    return d.toISOString();
  }, [range]);

  const buildParams = React.useCallback(
    (cursor?: string | null) => {
      const p = new URLSearchParams();
      if (workspaceId) p.set("workspaceId", workspaceId);
      if (actionFilter !== "all") p.set("action", actionFilter);
      if (fromDate) p.set("from", fromDate);
      if (q.trim()) p.set("q", q.trim());
      if (cursor) p.set("cursor", cursor);
      return p.toString();
    },
    [workspaceId, actionFilter, fromDate, q]
  );

  const load = React.useCallback(
    async (reset: boolean) => {
      if (!workspaceId) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/audit?${buildParams(reset ? null : nextCursor)}`);
        if (!res.ok) {
          if (res.status === 403) {
            setItems([]);
            setNextCursor(null);
          }
          return;
        }
        const data = await res.json();
        setItems((prev) => (reset ? data.items : [...prev, ...data.items]));
        setNextCursor(data.nextCursor ?? null);
      } finally {
        setLoading(false);
      }
    },
    [workspaceId, buildParams, nextCursor]
  );

  React.useEffect(() => {
    if (workspaceId) load(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId, actionFilter, fromDate, q]);

  const downloadCsv = () => {
    if (!workspaceId) return;
    const url = `/api/audit/export-v2?${buildParams()}&format=csv`;
    window.location.href = url;
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-fg-muted text-sm">Sign in to view audit logs.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-subtle">
      <div className="mx-auto max-w-[1100px] px-6 py-8">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-fg">Audit log</h1>
            <p className="mt-1 text-sm text-fg-muted">
              Every meaningful change in this workspace. Filter, search, and export
              for SIEM ingestion.
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
            <Button variant="outline" size="md" icon={<RefreshCw />} onClick={() => load(true)}>
              Refresh
            </Button>
            <Button variant="primary" size="md" icon={<Download />} onClick={downloadCsv}>
              Export CSV
            </Button>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-fg-subtle pointer-events-none" />
            <Input
              className="pl-7"
              placeholder="Search action, entity, metadata…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="md">
                Action: {actionFilter === "all" ? "All" : actionFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="max-h-72 overflow-y-auto">
              {ACTIONS.map((a) => (
                <DropdownMenuItem key={a} onClick={() => setActionFilter(a)}>
                  {a === "all" ? "All actions" : a}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="md">
                {range.label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {RANGES.map((r) => (
                <DropdownMenuItem key={r.label} onClick={() => setRange(r)}>
                  {r.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Table */}
        <div className="mt-6 rounded-md border border-border bg-panel overflow-hidden">
          <div className="grid grid-cols-[180px,1fr,160px,1fr] gap-2 px-4 py-2.5 bg-bg-subtle border-b border-border text-xs font-semibold uppercase tracking-wide text-fg-muted">
            <div>When</div>
            <div>Actor</div>
            <div>Action</div>
            <div>Target</div>
          </div>
          <ScrollArea className="max-h-[60vh]">
            {items.length === 0 && !loading ? (
              <div className="py-16 text-center text-sm text-fg-muted">
                No events match the current filters.
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="grid grid-cols-[180px,1fr,160px,1fr] gap-2 px-4 py-2.5 items-center text-sm"
                  >
                    <div className="text-fg-muted text-xs font-mono">
                      {new Date(item.createdAt).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-[9px]">
                          {(item.user?.name ?? "?").slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="text-fg truncate">{item.user?.name ?? "—"}</div>
                        <div className="text-xs text-fg-subtle truncate">
                          {item.user?.email}
                        </div>
                      </div>
                    </div>
                    <div>
                      <Badge variant={badgeForAction(item.action)} size="md">
                        {item.action}
                      </Badge>
                    </div>
                    <div className="min-w-0">
                      <div className="text-fg-muted text-xs">{item.entityType}</div>
                      <div className="text-xs text-fg-subtle font-mono truncate">
                        {summary(item.metadata) ?? item.entityId}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {nextCursor && (
              <div className="p-3 text-center">
                <Button variant="outline" size="sm" disabled={loading} onClick={() => load(false)}>
                  {loading ? "Loading…" : "Load more"}
                </Button>
              </div>
            )}
          </ScrollArea>
        </div>

        <p className="mt-4 text-xs text-fg-subtle">
          Retention: 90 days on Pro · 1 year on Team · 7 years on Enterprise.
        </p>
      </div>
    </div>
  );
}

function badgeForAction(action: string): "default" | "rose" | "amber" | "emerald" | "indigo" {
  if (action.endsWith(".deleted") || action.endsWith(".removed")) return "rose";
  if (action.endsWith(".created") || action.endsWith(".joined") || action.endsWith(".accepted")) return "emerald";
  if (action.endsWith(".updated") || action.endsWith(".moved") || action.endsWith(".role_changed")) return "amber";
  return "indigo";
}

function summary(metadata: any): string | null {
  if (!metadata) return null;
  if (typeof metadata === "string") return metadata;
  if (typeof metadata === "object") {
    if (metadata.name) return String(metadata.name);
    if (metadata.email) return String(metadata.email);
    if (metadata.action) return String(metadata.action);
  }
  return null;
}
