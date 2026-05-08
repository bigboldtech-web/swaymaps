import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/lib/prisma";
import { userInWorkspace, computeMapPosition } from "@/lib/folderHelpers";
import { logActivity } from "@/lib/activityLog";
import { requireMapPerm, requireFolderPerm, FolderPermissionDeniedError } from "@/lib/folderPermissions";

/**
 * POST /api/maps/[id]/move
 * Body: { folderId: string | null, beforeId?: string | null, afterId?: string | null }
 */
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const map = await prisma.decodeMap.findUnique({
    where: { id: params.id },
    select: { id: true, workspaceId: true, folderId: true, ownerId: true, name: true },
  });
  if (!map) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Permission: EDIT on the source map
  try {
    await requireMapPerm(userId, map.id, "EDIT");
  } catch (e) {
    if (e instanceof FolderPermissionDeniedError)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    throw e;
  }

  const body = await req.json().catch(() => ({}));
  const folderId: string | null = body.folderId ?? null;
  const beforeId: string | null = body.beforeId ?? null;
  const afterId: string | null = body.afterId ?? null;

  if (folderId && map.workspaceId) {
    const dest = await prisma.folder.findFirst({
      where: { id: folderId, workspaceId: map.workspaceId },
      select: { id: true },
    });
    if (!dest) return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    try {
      await requireFolderPerm(userId, folderId, "EDIT");
    } catch (e) {
      if (e instanceof FolderPermissionDeniedError)
        return NextResponse.json({ error: "Forbidden on destination" }, { status: 403 });
      throw e;
    }
  } else if (folderId && !map.workspaceId) {
    return NextResponse.json({ error: "Map has no workspace" }, { status: 400 });
  }

  const position = map.workspaceId
    ? await computeMapPosition(map.workspaceId, folderId, beforeId, afterId)
    : null;

  const updated = await prisma.decodeMap.update({
    where: { id: map.id },
    data: { folderId, position: position ?? undefined },
  });

  if (map.workspaceId) {
    await logActivity({
      workspaceId: map.workspaceId,
      userId,
      action: "map.moved",
      entityType: "map",
      entityId: map.id,
      metadata: { from: map.folderId, to: folderId, name: map.name },
    }).catch(() => {});
  }

  return NextResponse.json({ map: { id: updated.id, folderId: updated.folderId, position: updated.position } });
}
