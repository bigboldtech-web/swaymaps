/**
 * Folder permission resolution.
 *
 * Algorithm (per call, per user):
 *   1. Resolve workspace role. OWNER/ADMIN bypass folder ACL → ADMIN on every folder.
 *   2. Walk folder → root collecting explicit ACLs that match the user
 *      directly OR via group membership.
 *   3. Closest explicit ACL wins. If none, fall back to workspace role mapped to
 *      a folder-level baseline.
 *
 * The walk uses a single recursive CTE-style query for the chain of folder ids,
 * then one batched `findMany` for ACLs. This keeps the cost flat per request.
 */

import { FolderPermission, WorkspaceRole } from "@prisma/client";
import { prisma } from "./prisma";
import { getWorkspaceRole, FOLDER_PERM_RANK, meetsFolderPerm } from "./rbac";

export const ROLE_BASELINE: Record<WorkspaceRole, FolderPermission | null> = {
  OWNER: "ADMIN",
  ADMIN: "ADMIN",
  EDITOR: "EDIT",
  VIEWER: "VIEW",
  GUEST: null, // No baseline; explicit ACL only.
};

/**
 * Returns the chain of folder ids from `folderId` up to root (inclusive of folderId).
 * Index 0 is the leaf, last index is the topmost ancestor.
 */
async function walkFolderChain(folderId: string): Promise<string[]> {
  const chain: string[] = [];
  let current: string | null = folderId;
  const visited = new Set<string>();
  while (current && !visited.has(current)) {
    visited.add(current);
    chain.push(current);
    const f: { parentId: string | null } | null = await prisma.folder.findUnique({
      where: { id: current },
      select: { parentId: true },
    });
    current = f?.parentId ?? null;
  }
  return chain;
}

/**
 * Resolves a user's permission on a folder.
 * Returns null if no access.
 */
export async function resolveFolderPermission(
  userId: string,
  folderId: string
): Promise<FolderPermission | null> {
  const folder = await prisma.folder.findUnique({
    where: { id: folderId },
    select: { workspaceId: true },
  });
  if (!folder) return null;

  const role = await getWorkspaceRole(userId, folder.workspaceId);
  if (!role) return null;

  // OWNER/ADMIN always have full folder admin
  if (role === "OWNER" || role === "ADMIN") return "ADMIN";

  // Walk ancestor chain, collect ACLs matching user or their groups
  const chain = await walkFolderChain(folderId);
  if (chain.length === 0) return ROLE_BASELINE[role];

  // Fetch all ACLs for the chain in one query
  const acls = await prisma.folderACL.findMany({
    where: {
      folderId: { in: chain },
      OR: [
        { userId },
        { group: { members: { some: { id: userId } } } },
      ],
    },
    select: { folderId: true, userId: true, groupId: true, permission: true },
  });

  if (acls.length === 0) return ROLE_BASELINE[role];

  // Closest ancestor wins. Within one folder, take the strongest (user > group is also ok;
  // we just take the strongest of any matching ACL at that level).
  for (const fid of chain) {
    const here = acls.filter((a) => a.folderId === fid);
    if (here.length === 0) continue;
    const strongest = here.reduce<FolderPermission>(
      (best, a) =>
        FOLDER_PERM_RANK[a.permission] > FOLDER_PERM_RANK[best] ? a.permission : best,
      "VIEW"
    );
    return strongest;
  }

  return ROLE_BASELINE[role];
}

/**
 * Map-level check. Resolves via the map's containing folder; root maps fall
 * back to the workspace baseline.
 */
export async function resolveMapPermission(
  userId: string,
  mapId: string
): Promise<FolderPermission | null> {
  const map = await prisma.decodeMap.findUnique({
    where: { id: mapId },
    select: { ownerId: true, workspaceId: true, folderId: true },
  });
  if (!map) return null;

  // Personal maps (no workspace): only the owner has access (ADMIN).
  if (!map.workspaceId) {
    return map.ownerId === userId ? "ADMIN" : null;
  }

  if (map.folderId) return resolveFolderPermission(userId, map.folderId);

  // Root map: use workspace role baseline
  const role = await getWorkspaceRole(userId, map.workspaceId);
  if (!role) return null;
  if (role === "OWNER" || role === "ADMIN") return "ADMIN";
  return ROLE_BASELINE[role];
}

export class FolderPermissionDeniedError extends Error {
  status = 403;
  constructor(public needed: FolderPermission) {
    super(`Missing folder permission: ${needed}`);
  }
}

export async function requireFolderPerm(
  userId: string,
  folderId: string,
  needed: FolderPermission
): Promise<FolderPermission> {
  const have = await resolveFolderPermission(userId, folderId);
  if (!meetsFolderPerm(have, needed)) {
    throw new FolderPermissionDeniedError(needed);
  }
  return have!;
}

export async function requireMapPerm(
  userId: string,
  mapId: string,
  needed: FolderPermission
): Promise<FolderPermission> {
  const have = await resolveMapPermission(userId, mapId);
  if (!meetsFolderPerm(have, needed)) {
    throw new FolderPermissionDeniedError(needed);
  }
  return have!;
}
