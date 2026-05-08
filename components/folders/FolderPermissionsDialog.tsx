"use client";

import * as React from "react";
import { Trash2, Users, User as UserIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Separator } from "@/components/ui/Separator";
import { cn } from "@/lib/cn";
import { toast } from "@/components/ui/Toast";

type Permission = "VIEW" | "EDIT" | "ADMIN";

interface ACLEntry {
  id: string;
  permission: Permission;
  user?: { id: string; name: string; email: string; avatarUrl?: string | null } | null;
  group?: { id: string; name: string } | null;
}

interface MemberOption {
  user: { id: string; name: string; email: string; avatarUrl?: string | null };
}

interface GroupOption {
  id: string;
  name: string;
}

interface FolderPermissionsDialogProps {
  folderId: string | null;
  folderName: string;
  open: boolean;
  onClose: () => void;
}

export function FolderPermissionsDialog({
  folderId,
  folderName,
  open,
  onClose,
}: FolderPermissionsDialogProps) {
  const [acls, setAcls] = React.useState<ACLEntry[]>([]);
  const [members, setMembers] = React.useState<MemberOption[]>([]);
  const [groups, setGroups] = React.useState<GroupOption[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    if (!open || !folderId) return;
    let cancelled = false;
    setLoading(true);
    fetch(`/api/folders/${folderId}/acl`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data) => {
        if (cancelled) return;
        setAcls(data.acls ?? []);
        setMembers(data.members ?? []);
        setGroups(data.groups ?? []);
      })
      .catch(() => {
        if (!cancelled) toast.error("Failed to load permissions");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, folderId]);

  const aclByUserId = React.useMemo(() => {
    const m = new Map<string, ACLEntry>();
    for (const a of acls) if (a.user?.id) m.set(a.user.id, a);
    return m;
  }, [acls]);

  const aclByGroupId = React.useMemo(() => {
    const m = new Map<string, ACLEntry>();
    for (const a of acls) if (a.group?.id) m.set(a.group.id, a);
    return m;
  }, [acls]);

  const candidates = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    const userOpts = members
      .filter((m) => !aclByUserId.has(m.user.id))
      .filter(
        (m) =>
          !q ||
          m.user.name.toLowerCase().includes(q) ||
          m.user.email.toLowerCase().includes(q)
      );
    const groupOpts = groups
      .filter((g) => !aclByGroupId.has(g.id))
      .filter((g) => !q || g.name.toLowerCase().includes(q));
    return { userOpts, groupOpts };
  }, [search, members, groups, aclByUserId, aclByGroupId]);

  const upsert = async (subject: { userId?: string; groupId?: string }, permission: Permission) => {
    if (!folderId) return;
    const res = await fetch(`/api/folders/${folderId}/acl`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...subject, permission }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "Failed to update permission");
      return;
    }
    const data = await res.json();
    // Replace by acl id, or add
    setAcls((prev) => {
      const idx = prev.findIndex((a) => a.id === data.acl.id);
      const merged: ACLEntry = {
        id: data.acl.id,
        permission: data.acl.permission,
        user: subject.userId ? members.find((m) => m.user.id === subject.userId)?.user ?? null : null,
        group: subject.groupId ? groups.find((g) => g.id === subject.groupId) ?? null : null,
      };
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = merged;
        return next;
      }
      return [...prev, merged];
    });
  };

  const remove = async (aclId: string) => {
    if (!folderId) return;
    const res = await fetch(`/api/folders/${folderId}/acl?aclId=${aclId}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Failed to remove");
      return;
    }
    setAcls((prev) => prev.filter((a) => a.id !== aclId));
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Permissions for {folderName}</DialogTitle>
          <DialogDescription>
            Override workspace-level access for this folder. Changes inherit to all
            subfolders and maps inside.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center text-sm text-fg-muted">Loading…</div>
        ) : (
          <>
            <div>
              <Input
                placeholder="Search to add a member or group…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (candidates.userOpts.length + candidates.groupOpts.length) > 0 && (
                <div className="mt-2 max-h-44 overflow-y-auto rounded-sm border border-border bg-panel divide-y divide-border">
                  {candidates.groupOpts.map((g) => (
                    <button
                      key={`g:${g.id}`}
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-bg-muted"
                      onClick={() => {
                        upsert({ groupId: g.id }, "VIEW");
                        setSearch("");
                      }}
                    >
                      <Users className="h-3.5 w-3.5 text-fg-muted" />
                      <span className="flex-1 truncate text-fg">{g.name}</span>
                      <Badge variant="default" size="sm">Group</Badge>
                    </button>
                  ))}
                  {candidates.userOpts.map((m) => (
                    <button
                      key={`u:${m.user.id}`}
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-bg-muted"
                      onClick={() => {
                        upsert({ userId: m.user.id }, "VIEW");
                        setSearch("");
                      }}
                    >
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-[9px]">
                          {m.user.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="flex-1 truncate text-fg">{m.user.name}</span>
                      <span className="text-xs text-fg-subtle truncate">{m.user.email}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-fg-subtle mb-2">
                Explicit access ({acls.length})
              </p>
              {acls.length === 0 ? (
                <p className="text-sm text-fg-muted py-4 text-center">
                  No explicit overrides. Access inherits from workspace role and parent folders.
                </p>
              ) : (
                <ul className="space-y-1">
                  {acls.map((acl) => (
                    <li
                      key={acl.id}
                      className="flex items-center gap-2 rounded-sm border border-border bg-panel px-3 py-2"
                    >
                      {acl.group ? (
                        <Users className="h-4 w-4 text-fg-muted shrink-0" />
                      ) : (
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-[10px]">
                            {(acl.user?.name ?? "?").slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-fg truncate">
                          {acl.group?.name ?? acl.user?.name ?? "Unknown"}
                        </div>
                        {acl.user?.email && (
                          <div className="text-xs text-fg-subtle truncate">{acl.user.email}</div>
                        )}
                        {acl.group && (
                          <div className="text-xs text-fg-subtle">Group</div>
                        )}
                      </div>
                      <PermissionPicker
                        value={acl.permission}
                        onChange={(p) =>
                          upsert(
                            acl.user?.id
                              ? { userId: acl.user.id }
                              : { groupId: acl.group!.id },
                            p
                          )
                        }
                      />
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Remove"
                        onClick={() => remove(acl.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-fg-subtle" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PermissionPicker({
  value,
  onChange,
}: {
  value: Permission;
  onChange: (p: Permission) => void;
}) {
  const labels: Record<Permission, string> = {
    VIEW: "Can view",
    EDIT: "Can edit",
    ADMIN: "Full access",
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={cn("min-w-[100px] justify-between")}>
          {labels[value]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(["VIEW", "EDIT", "ADMIN"] as Permission[]).map((p) => (
          <DropdownMenuItem key={p} onClick={() => onChange(p)}>
            {labels[p]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
