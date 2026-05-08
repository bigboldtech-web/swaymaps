"use client";

import * as React from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  pointerWithin,
} from "@dnd-kit/core";
import {
  ChevronRight,
  Folder as FolderIcon,
  FolderOpen,
  FileText,
  MoreHorizontal,
  Share2,
} from "lucide-react";
import { MAP_TYPE_BY_ID, type MapTypeId } from "@/lib/mapTypes";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  ContextMenuShortcut,
} from "@/components/ui/ContextMenu";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { buildVisibleRows, timeAgo } from "./buildTree";
import type { FolderNode, TreeRow } from "./types";
import type { MapListItem } from "../Sidebar";

interface SidebarTreeProps {
  folders: FolderNode[];
  maps: MapListItem[];
  activeMapId: string | null;
  searchQuery: string;
  onSelectMap: (id: string) => void;
  onRenameMap?: (id: string) => void;
  onDeleteMap?: (id: string) => void;
  onShareMap?: (id: string) => void;
  onEmbedMap?: (id: string) => void;
  onCreateMapInFolder?: (folderId: string | null) => void;
  onCreateFolder?: (parentId: string | null) => void;
  onRenameFolder?: (id: string, currentName: string) => void;
  onDeleteFolder?: (id: string) => void;
  onManageFolderPerms?: (id: string, name: string) => void;
  onMoveItem?: (
    type: "folder" | "map",
    id: string,
    newParentId: string | null,
    beforeId: string | null,
    afterId: string | null
  ) => void;
  disabledMapIds?: string[];
}

export function SidebarTree({
  folders,
  maps,
  activeMapId,
  searchQuery,
  onSelectMap,
  onRenameMap,
  onDeleteMap,
  onShareMap,
  onEmbedMap,
  onCreateMapInFolder,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
  onManageFolderPerms,
  onMoveItem,
  disabledMapIds = [],
}: SidebarTreeProps) {
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set());
  const [dragId, setDragId] = React.useState<string | null>(null);
  const [dragOverInfo, setDragOverInfo] = React.useState<{
    targetId: string;
    targetType: "folder" | "map";
    placement: "before" | "after" | "inside";
  } | null>(null);

  const rows = React.useMemo(
    () => buildVisibleRows(folders, maps, expanded, searchQuery),
    [folders, maps, expanded, searchQuery]
  );

  const toggleFolder = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  const handleDragStart = (e: DragStartEvent) => {
    setDragId(String(e.active.id));
  };

  const handleDragOver = (e: DragOverEvent) => {
    const overId = e.over?.id ? String(e.over.id) : null;
    if (!overId) {
      setDragOverInfo(null);
      return;
    }
    const overRow = rows.find((r) => `${r.type}:${r.id}` === overId);
    if (!overRow) {
      setDragOverInfo(null);
      return;
    }
    // Determine placement based on pointer Y vs over rect
    const pointerY = (e.activatorEvent as PointerEvent)?.clientY ?? 0;
    const overRect = (e.over?.rect as any);
    if (!overRect) {
      setDragOverInfo({ targetId: overRow.id, targetType: overRow.type, placement: "after" });
      return;
    }
    const top = overRect.top;
    const height = overRect.height;
    const offsetWithin = (e.delta?.y ?? 0) + pointerY - top;
    const ratio = offsetWithin / height;

    let placement: "before" | "after" | "inside";
    if (overRow.type === "folder") {
      if (ratio < 0.25) placement = "before";
      else if (ratio > 0.75) placement = "after";
      else placement = "inside";
    } else {
      placement = ratio < 0.5 ? "before" : "after";
    }
    setDragOverInfo({ targetId: overRow.id, targetType: overRow.type, placement });
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const activeId = String(e.active.id);
    const info = dragOverInfo;
    setDragId(null);
    setDragOverInfo(null);
    if (!info || !onMoveItem) return;

    const [activeType, ...activeIdParts] = activeId.split(":");
    const aId = activeIdParts.join(":");
    if (!aId || aId === info.targetId) return;

    const targetRow = rows.find((r) => r.id === info.targetId && r.type === info.targetType);
    if (!targetRow) return;

    let newParentId: string | null;
    let beforeId: string | null = null;
    let afterId: string | null = null;

    if (info.placement === "inside" && info.targetType === "folder") {
      newParentId = info.targetId;
      // Append to end (no before/after)
    } else {
      newParentId = targetRow.parentId;
      const idx = rows.findIndex((r) => r.id === info.targetId && r.type === info.targetType);
      if (info.placement === "before") {
        afterId = info.targetId;
        // Find prev sibling at same depth
        for (let i = idx - 1; i >= 0; i--) {
          if (rows[i].parentId === newParentId && rows[i].type === info.targetType) {
            beforeId = rows[i].id;
            break;
          }
        }
      } else {
        beforeId = info.targetId;
        for (let i = idx + 1; i < rows.length; i++) {
          if (rows[i].parentId === newParentId && rows[i].type === info.targetType) {
            afterId = rows[i].id;
            break;
          }
        }
      }
    }

    onMoveItem(activeType as "folder" | "map", aId, newParentId, beforeId, afterId);
  };

  if (rows.length === 0) {
    return (
      <div className="px-3 py-12 text-center">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-bg-muted">
          <FolderIcon className="h-5 w-5 text-fg-subtle" />
        </div>
        <p className="text-sm font-medium text-fg">
          {searchQuery ? "No results" : "No maps yet"}
        </p>
        <p className="mt-0.5 text-xs text-fg-subtle">
          {searchQuery ? "Try a different search" : "Create your first map or folder"}
        </p>
        {!searchQuery && (
          <div className="mt-3 flex flex-col gap-1.5">
            <Button variant="outline" size="sm" onClick={() => onCreateMapInFolder?.(null)}>
              New map
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onCreateFolder?.(null)}>
              New folder
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="px-1.5 py-1">
        {rows.map((row, idx) => (
          <TreeRowItem
            key={`${row.type}:${row.id}`}
            row={row}
            isActive={row.type === "map" && row.id === activeMapId}
            isDisabled={row.type === "map" && disabledMapIds.includes(row.id)}
            isDragging={dragId === `${row.type}:${row.id}`}
            dragOverInfo={
              dragOverInfo &&
              dragOverInfo.targetId === row.id &&
              dragOverInfo.targetType === row.type
                ? dragOverInfo.placement
                : null
            }
            onToggle={() => toggleFolder(row.id)}
            onSelect={() => row.type === "map" && onSelectMap(row.id)}
            onRenameMap={onRenameMap}
            onDeleteMap={onDeleteMap}
            onShareMap={onShareMap}
            onEmbedMap={onEmbedMap}
            onCreateMapInFolder={onCreateMapInFolder}
            onCreateFolder={onCreateFolder}
            onRenameFolder={onRenameFolder}
            onDeleteFolder={onDeleteFolder}
            onManageFolderPerms={onManageFolderPerms}
          />
        ))}
      </div>
      <DragOverlay dropAnimation={null}>
        {dragId ? (
          <div className="flex items-center gap-2 rounded-sm border border-border bg-panel px-2 py-1.5 shadow-overlay text-sm text-fg max-w-[240px]">
            {dragId.startsWith("folder:") ? (
              <FolderIcon className="h-3.5 w-3.5 text-fg-muted shrink-0" />
            ) : (
              <FileText className="h-3.5 w-3.5 text-fg-muted shrink-0" />
            )}
            <span className="truncate">
              {rows.find((r) => `${r.type}:${r.id}` === dragId)?.name ?? ""}
            </span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

interface TreeRowItemProps {
  row: TreeRow;
  isActive: boolean;
  isDisabled: boolean;
  isDragging: boolean;
  dragOverInfo: "before" | "after" | "inside" | null;
  onToggle: () => void;
  onSelect: () => void;
  onRenameMap?: (id: string) => void;
  onDeleteMap?: (id: string) => void;
  onShareMap?: (id: string) => void;
  onEmbedMap?: (id: string) => void;
  onCreateMapInFolder?: (folderId: string | null) => void;
  onCreateFolder?: (parentId: string | null) => void;
  onRenameFolder?: (id: string, currentName: string) => void;
  onDeleteFolder?: (id: string) => void;
  onManageFolderPerms?: (id: string, name: string) => void;
}

function TreeRowItem({
  row,
  isActive,
  isDisabled,
  isDragging,
  dragOverInfo,
  onToggle,
  onSelect,
  onRenameMap,
  onDeleteMap,
  onShareMap,
  onEmbedMap,
  onCreateMapInFolder,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
  onManageFolderPerms,
}: TreeRowItemProps) {
  const isFolder = row.type === "folder";
  const dragKey = `${row.type}:${row.id}`;

  const { setNodeRef: setDragRef, attributes, listeners } = useDraggable(dragKey);
  const { setNodeRef: setDropRef } = useDroppable(dragKey);

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          ref={(el) => {
            setDragRef(el);
            setDropRef(el);
          }}
          {...attributes}
          {...listeners}
          className={cn(
            "group relative flex h-7 items-center gap-1 rounded-xs px-1.5 cursor-default select-none",
            isActive ? "bg-accent-subtle" : "hover:bg-bg-muted",
            isDragging && "opacity-40",
            isDisabled && "opacity-40 cursor-not-allowed"
          )}
          style={{ paddingLeft: `${6 + row.depth * 14}px` }}
          onClick={() => {
            if (isDisabled) return;
            if (isFolder) onToggle();
            else onSelect();
          }}
          onDoubleClick={() => {
            if (isFolder && onRenameFolder) onRenameFolder(row.id, row.name);
            else if (!isFolder && onRenameMap) onRenameMap(row.id);
          }}
        >
          {dragOverInfo === "before" && (
            <span className="absolute left-2 right-2 -top-px h-[2px] bg-accent rounded-full pointer-events-none" />
          )}
          {dragOverInfo === "after" && (
            <span className="absolute left-2 right-2 -bottom-px h-[2px] bg-accent rounded-full pointer-events-none" />
          )}
          {dragOverInfo === "inside" && (
            <span className="absolute inset-0 rounded-xs ring-1 ring-accent bg-accent-subtle pointer-events-none" />
          )}

          {isFolder ? (
            <button
              type="button"
              className="flex h-4 w-4 items-center justify-center text-fg-subtle hover:text-fg shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
            >
              <ChevronRight
                className={cn(
                  "h-3 w-3 transition-transform",
                  row.isOpen && "rotate-90"
                )}
              />
            </button>
          ) : (
            <span className="w-4 shrink-0" />
          )}

          {isFolder ? (
            row.isOpen ? (
              <FolderOpen className="h-3.5 w-3.5 shrink-0 text-fg-muted" />
            ) : (
              <FolderIcon className="h-3.5 w-3.5 shrink-0 text-fg-muted" />
            )
          ) : (
            (() => {
              const typeId = (row.meta?.mapType as MapTypeId | undefined) ?? "DEPENDENCY";
              const TypeIcon = MAP_TYPE_BY_ID[typeId]?.icon ?? FileText;
              return (
                <TypeIcon
                  className={cn(
                    "h-3.5 w-3.5 shrink-0",
                    isActive ? "text-accent" : "text-fg-subtle"
                  )}
                />
              );
            })()
          )}

          <span
            className={cn(
              "flex-1 truncate text-sm",
              isActive ? "text-accent font-medium" : "text-fg"
            )}
          >
            {row.name}
          </span>

          {row.meta?.isShared && (
            <Share2 className="h-3 w-3 shrink-0 text-fg-subtle opacity-60" />
          )}

          {row.meta?.updatedAt && !isFolder && (
            <span className="text-[10px] text-fg-subtle shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              {timeAgo(row.meta.updatedAt)}
            </span>
          )}

          <RowMenu
            row={row}
            onRenameMap={onRenameMap}
            onDeleteMap={onDeleteMap}
            onShareMap={onShareMap}
            onEmbedMap={onEmbedMap}
            onCreateMapInFolder={onCreateMapInFolder}
            onCreateFolder={onCreateFolder}
            onRenameFolder={onRenameFolder}
            onDeleteFolder={onDeleteFolder}
          />
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        {isFolder ? (
          <>
            <ContextMenuItem onClick={() => onCreateMapInFolder?.(row.id)}>
              New map here
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onCreateFolder?.(row.id)}>
              New subfolder
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={() => onRenameFolder?.(row.id, row.name)}>
              Rename
              <ContextMenuShortcut>F2</ContextMenuShortcut>
            </ContextMenuItem>
            {onManageFolderPerms && (
              <ContextMenuItem onClick={() => onManageFolderPerms(row.id, row.name)}>
                Permissions…
              </ContextMenuItem>
            )}
            <ContextMenuSeparator />
            <ContextMenuItem destructive onClick={() => onDeleteFolder?.(row.id)}>
              Delete folder
            </ContextMenuItem>
          </>
        ) : (
          <>
            <ContextMenuItem onClick={onSelect}>Open</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={() => onRenameMap?.(row.id)}>
              Rename
              <ContextMenuShortcut>F2</ContextMenuShortcut>
            </ContextMenuItem>
            {onShareMap && (
              <ContextMenuItem onClick={() => onShareMap(row.id)}>Share…</ContextMenuItem>
            )}
            {onEmbedMap && (
              <ContextMenuItem onClick={() => onEmbedMap(row.id)}>
                Copy embed code
              </ContextMenuItem>
            )}
            <ContextMenuSeparator />
            <ContextMenuItem destructive onClick={() => onDeleteMap?.(row.id)}>
              Delete
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}

function RowMenu(props: {
  row: TreeRow;
  onRenameMap?: (id: string) => void;
  onDeleteMap?: (id: string) => void;
  onShareMap?: (id: string) => void;
  onEmbedMap?: (id: string) => void;
  onCreateMapInFolder?: (folderId: string | null) => void;
  onCreateFolder?: (parentId: string | null) => void;
  onRenameFolder?: (id: string, currentName: string) => void;
  onDeleteFolder?: (id: string) => void;
}) {
  // Trigger the same context menu via an explicit kebab button
  return (
    <span className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
      <button
        type="button"
        aria-label="More"
        onClick={(e) => {
          e.stopPropagation();
          // Synthesize a contextmenu event on the parent
          const target = e.currentTarget.closest("[data-state]") || e.currentTarget.parentElement;
          if (target) {
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            const ev = new MouseEvent("contextmenu", {
              bubbles: true,
              cancelable: true,
              clientX: rect.right,
              clientY: rect.bottom,
            });
            target.dispatchEvent(ev);
          }
        }}
        className="rounded-xs p-0.5 text-fg-subtle hover:text-fg hover:bg-border"
      >
        <MoreHorizontal className="h-3.5 w-3.5" />
      </button>
    </span>
  );
}

/* ──────────────────────────────────────────────────────────
   dnd-kit hooks
   ────────────────────────────────────────────────────────── */

function useDraggable(id: string) {
  const { attributes, listeners, setNodeRef } = useDraggableImpl({ id });
  return { attributes, listeners, setNodeRef };
}

function useDroppable(id: string) {
  const { setNodeRef } = useDroppableImpl({ id });
  return { setNodeRef };
}

// Re-export to allow tree-shaking of the hook
import { useDraggable as useDraggableImpl, useDroppable as useDroppableImpl } from "@dnd-kit/core";
