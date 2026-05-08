import type { FolderNode, TreeRow } from "./types";
import type { MapListItem } from "../Sidebar";

/**
 * Build the flat, ordered list of tree rows respecting open/closed state.
 * Folders sort first within each parent, then maps. Both sorted by `position` (or updatedAt fallback).
 */
export function buildVisibleRows(
  folders: FolderNode[],
  maps: MapListItem[],
  expanded: Set<string>,
  searchQuery: string
): TreeRow[] {
  const query = searchQuery.trim().toLowerCase();

  // Index folders by parentId
  const foldersByParent = new Map<string | null, FolderNode[]>();
  for (const f of folders) {
    const arr = foldersByParent.get(f.parentId) ?? [];
    arr.push(f);
    foldersByParent.set(f.parentId, arr);
  }
  for (const arr of foldersByParent.values()) {
    arr.sort((a, b) => (a.position < b.position ? -1 : a.position > b.position ? 1 : 0));
  }

  // Index maps by folderId
  const mapsByFolder = new Map<string | null, MapListItem[]>();
  for (const m of maps) {
    const fid = (m as any).folderId ?? null;
    const arr = mapsByFolder.get(fid) ?? [];
    arr.push(m);
    mapsByFolder.set(fid, arr);
  }
  for (const arr of mapsByFolder.values()) {
    arr.sort((a, b) => {
      const ap = (a as any).position;
      const bp = (b as any).position;
      if (ap && bp) return ap < bp ? -1 : ap > bp ? 1 : 0;
      if (a.updatedAt && b.updatedAt) {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      return 0;
    });
  }

  const rows: TreeRow[] = [];

  // If searching, flatten everything and filter
  if (query) {
    for (const f of folders) {
      if (f.name.toLowerCase().includes(query)) {
        rows.push({
          type: "folder",
          id: f.id,
          parentId: f.parentId,
          name: f.name,
          depth: 0,
          hasChildren: (foldersByParent.get(f.id)?.length ?? 0) + (mapsByFolder.get(f.id)?.length ?? 0) > 0,
          isOpen: false,
        });
      }
    }
    for (const m of maps) {
      if (m.name.toLowerCase().includes(query)) {
        rows.push({
          type: "map",
          id: m.id,
          parentId: (m as any).folderId ?? null,
          name: m.name,
          depth: 0,
          meta: {
            nodeCount: m.nodeCount,
            edgeCount: m.edgeCount,
            updatedAt: m.updatedAt,
            isShared: !!m.publicShareId,
          },
        });
      }
    }
    return rows;
  }

  function walk(parentId: string | null, depth: number) {
    const childFolders = foldersByParent.get(parentId) ?? [];
    for (const f of childFolders) {
      const isOpen = expanded.has(f.id);
      const childCount =
        (foldersByParent.get(f.id)?.length ?? 0) + (mapsByFolder.get(f.id)?.length ?? 0);
      rows.push({
        type: "folder",
        id: f.id,
        parentId: f.parentId,
        name: f.name,
        depth,
        hasChildren: childCount > 0,
        isOpen,
      });
      if (isOpen) walk(f.id, depth + 1);
    }
    const childMaps = mapsByFolder.get(parentId) ?? [];
    for (const m of childMaps) {
      rows.push({
        type: "map",
        id: m.id,
        parentId: (m as any).folderId ?? null,
        name: m.name,
        depth,
        meta: {
          nodeCount: m.nodeCount,
          edgeCount: m.edgeCount,
          updatedAt: m.updatedAt,
          isShared: !!m.publicShareId,
          mapType: (m as any).mapType,
        },
      });
    }
  }

  walk(null, 0);
  return rows;
}

export function timeAgo(dateStr?: string): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  if (days < 30) return `${Math.floor(days / 7)}w`;
  return `${Math.floor(days / 30)}mo`;
}
