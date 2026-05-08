"use client";

import * as React from "react";
import {
  PanelLeftClose,
  Plus,
  Search,
  Settings,
  LogOut,
  Users,
  Shield,
  Sparkles,
  ChevronsUpDown,
  Check,
  FolderPlus,
  Download,
  Upload,
  HelpCircle,
} from "lucide-react";
import { SwayMapsIcon } from "./SwayMapsLogo";
import { Workspace } from "../types/map";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/Separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/DropdownMenu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { cn } from "@/lib/cn";
import { SidebarTree } from "./sidebar/SidebarTree";
import type { FolderNode } from "./sidebar/types";
import { FolderPermissionsDialog } from "./folders/FolderPermissionsDialog";

export interface MapListItem {
  id: string;
  name: string;
  nodeCount: number;
  edgeCount?: number;
  ownerName?: string;
  ownerUserId?: string;
  publicShareId?: string | null;
  workspaceId?: string;
  folderId?: string | null;
  position?: string | null;
  mapType?: string;
  updatedAt?: string;
  description?: string;
}

interface SidebarProps {
  maps: MapListItem[];
  activeMapId: string | null;
  onSelectMap: (id: string) => void;
  onCreateMap: () => void;
  onDeleteMap: (id: string) => void;
  onClose: () => void;
  createDisabled?: boolean;
  planLabel?: string;
  onInvite?: () => void;
  onSettings?: () => void;
  authLabel?: string;
  onAuthClick?: () => void;
  onEmbedMap?: (id: string) => void;
  onBoardInvite?: (id: string) => void;
  onUpgrade?: () => void;
  onRename?: (id: string) => void;
  onMembers?: () => void;
  onTraining?: () => void;
  onAdmin?: () => void;
  onGlobalSearch?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  search?: string;
  onSearchChange?: (val: string) => void;
  theme?: "light" | "dark";
  disabledMapIds?: string[];
  workspaces?: Workspace[];
  currentWorkspaceId?: string | null;
  onSelectWorkspace?: (id: string) => void;
  userName?: string;
  userEmail?: string;
}

function planVariant(plan: string): "indigo" | "emerald" | "default" {
  if (plan === "team") return "emerald";
  if (plan === "pro") return "indigo";
  return "default";
}

export function Sidebar({
  maps,
  activeMapId,
  onSelectMap,
  onCreateMap,
  onDeleteMap,
  onClose,
  planLabel,
  onInvite,
  onSettings,
  authLabel,
  onAuthClick,
  onEmbedMap,
  onBoardInvite,
  onUpgrade,
  onRename,
  onMembers,
  onTraining,
  onAdmin,
  onGlobalSearch,
  onExport,
  onImport,
  search,
  onSearchChange,
  createDisabled = false,
  disabledMapIds = [],
  workspaces = [],
  currentWorkspaceId,
  onSelectWorkspace,
  userName,
  userEmail,
}: SidebarProps) {
  const [folders, setFolders] = React.useState<FolderNode[]>([]);
  const [foldersLoaded, setFoldersLoaded] = React.useState(false);
  const [permsTarget, setPermsTarget] = React.useState<{ id: string; name: string } | null>(null);

  const currentWs = workspaces.find((w) => w.id === currentWorkspaceId);
  const plan = planLabel ?? "free";
  const initials = (userName ?? authLabel ?? "U")
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // Load folders for current workspace
  React.useEffect(() => {
    if (!currentWorkspaceId) {
      setFolders([]);
      setFoldersLoaded(true);
      return;
    }
    let cancelled = false;
    setFoldersLoaded(false);
    fetch(`/api/folders?workspaceId=${encodeURIComponent(currentWorkspaceId)}`)
      .then((r) => (r.ok ? r.json() : { folders: [] }))
      .then((data) => {
        if (!cancelled) {
          setFolders(data.folders ?? []);
          setFoldersLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled) setFoldersLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [currentWorkspaceId]);

  const handleCreateFolder = React.useCallback(
    async (parentId: string | null) => {
      if (!currentWorkspaceId) return;
      const name = window.prompt("Folder name", "New folder")?.trim();
      if (!name) return;
      const res = await fetch("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId: currentWorkspaceId, name, parentId }),
      });
      if (res.ok) {
        const data = await res.json();
        setFolders((prev) => [...prev, data.folder]);
      }
    },
    [currentWorkspaceId]
  );

  const handleRenameFolder = React.useCallback(
    async (id: string, currentName: string) => {
      const name = window.prompt("Rename folder", currentName)?.trim();
      if (!name || name === currentName) return;
      const res = await fetch(`/api/folders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        const data = await res.json();
        setFolders((prev) => prev.map((f) => (f.id === id ? data.folder : f)));
      }
    },
    []
  );

  const handleDeleteFolder = React.useCallback(
    async (id: string) => {
      const folder = folders.find((f) => f.id === id);
      if (!folder) return;
      if (!window.confirm(`Delete folder "${folder.name}"? Maps inside will move to the parent folder.`)) return;
      const res = await fetch(`/api/folders/${id}`, { method: "DELETE" });
      if (res.ok) {
        setFolders((prev) => prev.filter((f) => f.id !== id));
      }
    },
    [folders]
  );

  const handleMoveItem = React.useCallback(
    async (
      type: "folder" | "map",
      id: string,
      newParentId: string | null,
      beforeId: string | null,
      afterId: string | null
    ) => {
      if (type === "folder") {
        const res = await fetch(`/api/folders/${id}/move`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newParentId, beforeId, afterId }),
        });
        if (res.ok) {
          const data = await res.json();
          setFolders((prev) => prev.map((f) => (f.id === id ? { ...f, ...data.folder } : f)));
        }
      } else {
        // Map move — optimistically update via fetch; the parent owns map state
        await fetch(`/api/maps/${id}/move`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ folderId: newParentId, beforeId, afterId }),
        });
        // Trigger a soft refresh: consumer will re-fetch maps on next render cycle if needed.
        // For Phase 1 we rely on the consumer to re-fetch when activeMapId changes;
        // moves still take effect on next workspace switch / reload. Phase 2 will surface a maps-refresh callback.
      }
    },
    []
  );

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className="fixed inset-0 z-30 bg-[var(--color-overlay)] md:hidden animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className="fixed inset-y-0 left-0 z-40 flex h-screen w-[260px] flex-col border-r border-border bg-bg-subtle text-fg select-none md:relative">

        {/* ───── Brand row ───── */}
        <div className="flex h-12 items-center justify-between px-3 border-b border-border">
          <div className="flex items-center gap-2 min-w-0">
            <SwayMapsIcon size={20} />
            <span className="text-sm font-semibold tracking-tight truncate">SwayMaps</span>
          </div>
          <div className="flex items-center gap-0.5">
            {onGlobalSearch && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={onGlobalSearch}
                    aria-label="Search"
                  >
                    <Search className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Search · ⌘K</TooltipContent>
              </Tooltip>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={onClose}
                  aria-label="Collapse sidebar"
                >
                  <PanelLeftClose className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Collapse</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* ───── Workspace switcher ───── */}
        {workspaces.length > 0 && (
          <div className="px-2 pt-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-sm border border-border bg-panel px-2 py-1.5 text-left hover:bg-panel-hover transition-colors"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-xs bg-bg-muted text-[10px] font-semibold text-fg">
                    {(currentWs?.name ?? "W").charAt(0).toUpperCase()}
                  </span>
                  <span className="flex-1 min-w-0 text-sm font-medium text-fg truncate">
                    {currentWs?.name ?? "Workspace"}
                  </span>
                  <ChevronsUpDown className="h-3 w-3 text-fg-subtle shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[244px]">
                <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
                {workspaces.map((ws) => (
                  <DropdownMenuItem
                    key={ws.id}
                    onClick={() => onSelectWorkspace?.(ws.id)}
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-xs bg-bg-muted text-[10px] font-semibold">
                      {ws.name.charAt(0).toUpperCase()}
                    </span>
                    <span className="flex-1 truncate">{ws.name}</span>
                    {ws.id === currentWorkspaceId && (
                      <Check className="h-3.5 w-3.5 text-accent" />
                    )}
                  </DropdownMenuItem>
                ))}
                {onSettings && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onSettings}>
                      <Settings className="h-3.5 w-3.5" />
                      Workspace settings
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* ───── Quick actions ───── */}
        <div className="flex items-center gap-1 px-2 pt-2">
          <Button
            variant="primary"
            size="sm"
            disabled={createDisabled}
            onClick={onCreateMap}
            icon={<Plus />}
            className="flex-1"
          >
            New map
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => handleCreateFolder(null)}
                disabled={!currentWorkspaceId}
                aria-label="New folder"
              >
                <FolderPlus className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>New folder</TooltipContent>
          </Tooltip>
          {onImport && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={onImport}
                  aria-label="Import"
                >
                  <Upload className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Import</TooltipContent>
            </Tooltip>
          )}
          {onExport && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={onExport}
                  aria-label="Export"
                >
                  <Download className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export</TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* ───── Search ───── */}
        <div className="px-2 pt-2 pb-1">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-fg-subtle pointer-events-none" />
            <Input
              className="pl-7 h-7 text-xs"
              placeholder="Filter…"
              value={search ?? ""}
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
          </div>
        </div>

        {/* ───── Tree ───── */}
        <ScrollArea className="flex-1 min-h-0">
          {!foldersLoaded ? (
            <div className="px-3 py-4 text-xs text-fg-subtle">Loading…</div>
          ) : (
            <SidebarTree
              folders={folders}
              maps={maps}
              activeMapId={activeMapId}
              searchQuery={search ?? ""}
              onSelectMap={onSelectMap}
              onRenameMap={onRename}
              onDeleteMap={onDeleteMap}
              onShareMap={onBoardInvite}
              onEmbedMap={onEmbedMap}
              onCreateMapInFolder={() => onCreateMap()}
              onCreateFolder={handleCreateFolder}
              onRenameFolder={handleRenameFolder}
              onDeleteFolder={handleDeleteFolder}
              onManageFolderPerms={(id, name) => setPermsTarget({ id, name })}
              onMoveItem={handleMoveItem}
              disabledMapIds={disabledMapIds}
            />
          )}
        </ScrollArea>

        {/* ───── Bottom nav ───── */}
        <div className="border-t border-border px-1.5 py-1">
          {onMembers && (
            <NavItem icon={<Users className="h-3.5 w-3.5" />} label="Members" onClick={onMembers} />
          )}
          {onTraining && (
            <NavItem icon={<HelpCircle className="h-3.5 w-3.5" />} label="Getting started" onClick={onTraining} />
          )}
          {onSettings && (
            <NavItem icon={<Settings className="h-3.5 w-3.5" />} label="Settings" onClick={onSettings} />
          )}
          {onAdmin && (
            <NavItem icon={<Shield className="h-3.5 w-3.5" />} label="Admin" onClick={onAdmin} />
          )}
        </div>

        {/* ───── User profile footer ───── */}
        <div className="border-t border-border px-2 py-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-sm px-1.5 py-1 hover:bg-bg-muted transition-colors"
              >
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-fg truncate">
                      {userName ?? "User"}
                    </span>
                    {planLabel && (
                      <Badge variant={planVariant(plan)} size="sm">
                        {plan.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                  {userEmail && (
                    <div className="text-[11px] text-fg-subtle truncate">{userEmail}</div>
                  )}
                </div>
                <ChevronsUpDown className="h-3 w-3 text-fg-subtle shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[244px]">
              {onUpgrade && plan === "free" && (
                <>
                  <DropdownMenuItem onClick={onUpgrade}>
                    <Sparkles className="h-3.5 w-3.5 text-accent" />
                    Upgrade plan
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              {onSettings && (
                <DropdownMenuItem onClick={onSettings}>
                  <Settings className="h-3.5 w-3.5" />
                  Settings
                </DropdownMenuItem>
              )}
              {onAuthClick && (
                <DropdownMenuItem onClick={onAuthClick}>
                  <LogOut className="h-3.5 w-3.5" />
                  {authLabel ?? "Sign out"}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
      <FolderPermissionsDialog
        folderId={permsTarget?.id ?? null}
        folderName={permsTarget?.name ?? ""}
        open={!!permsTarget}
        onClose={() => setPermsTarget(null)}
      />
    </>
  );
}

function NavItem({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-7 w-full items-center gap-2 rounded-xs px-1.5 text-sm text-fg-muted hover:bg-bg-muted hover:text-fg transition-colors"
    >
      <span className="text-fg-subtle">{icon}</span>
      {label}
    </button>
  );
}
