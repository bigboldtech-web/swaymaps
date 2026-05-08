import { prisma } from "./prisma";
import { generateKeyBetween } from "fractional-indexing";

/**
 * Verify the user is a member of the given workspace.
 */
export async function userInWorkspace(userId: string, workspaceId: string): Promise<boolean> {
  const member = await prisma.workspaceMember.findUnique({
    where: { userId_workspaceId: { userId, workspaceId } },
    select: { id: true },
  });
  if (member) return true;
  // Owner check
  const ws = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: { ownerId: true },
  });
  return ws?.ownerId === userId;
}

/**
 * Walk up a folder's parent chain to ensure no cycle would be created
 * by setting `folderId.parentId = candidateParentId`.
 * Returns true if safe (no cycle).
 */
export async function isMoveSafe(
  folderId: string,
  candidateParentId: string | null
): Promise<boolean> {
  if (!candidateParentId) return true;
  if (candidateParentId === folderId) return false;
  let current: string | null = candidateParentId;
  const seen = new Set<string>();
  while (current) {
    if (current === folderId) return false;
    if (seen.has(current)) return false; // existing cycle (shouldn't happen)
    seen.add(current);
    const f: { parentId: string | null } | null = await prisma.folder.findUnique({
      where: { id: current },
      select: { parentId: true },
    });
    if (!f) return true;
    current = f.parentId;
  }
  return true;
}

/**
 * Compute a fractional position between two siblings.
 * `before` and `after` are the current positions of neighbors (or null for ends).
 */
export function positionBetween(before: string | null, after: string | null): string {
  return generateKeyBetween(before, after);
}

/**
 * Find the position string for a target slot in a folder, given optional
 * `beforeId` and `afterId` siblings. Loads the relevant rows and returns
 * a fresh fractional key.
 *
 * scope: { workspaceId, parentId } for folders, or { workspaceId, folderId } for maps
 */
export async function computeFolderPosition(
  workspaceId: string,
  parentId: string | null,
  beforeId: string | null,
  afterId: string | null
): Promise<string> {
  let beforePos: string | null = null;
  let afterPos: string | null = null;
  if (beforeId) {
    const b = await prisma.folder.findFirst({
      where: { id: beforeId, workspaceId, parentId },
      select: { position: true },
    });
    beforePos = b?.position ?? null;
  }
  if (afterId) {
    const a = await prisma.folder.findFirst({
      where: { id: afterId, workspaceId, parentId },
      select: { position: true },
    });
    afterPos = a?.position ?? null;
  }
  if (!beforeId && !afterId) {
    // Append to end
    const last = await prisma.folder.findFirst({
      where: { workspaceId, parentId },
      orderBy: { position: "desc" },
      select: { position: true },
    });
    beforePos = last?.position ?? null;
  }
  return positionBetween(beforePos, afterPos);
}

export async function computeMapPosition(
  workspaceId: string,
  folderId: string | null,
  beforeId: string | null,
  afterId: string | null
): Promise<string> {
  let beforePos: string | null = null;
  let afterPos: string | null = null;
  if (beforeId) {
    const b = await prisma.decodeMap.findFirst({
      where: { id: beforeId, workspaceId, folderId },
      select: { position: true },
    });
    beforePos = b?.position ?? null;
  }
  if (afterId) {
    const a = await prisma.decodeMap.findFirst({
      where: { id: afterId, workspaceId, folderId },
      select: { position: true },
    });
    afterPos = a?.position ?? null;
  }
  if (!beforeId && !afterId) {
    const last = await prisma.decodeMap.findFirst({
      where: { workspaceId, folderId },
      orderBy: { position: "desc" },
      select: { position: true },
    });
    beforePos = last?.position ?? null;
  }
  return positionBetween(beforePos, afterPos);
}
