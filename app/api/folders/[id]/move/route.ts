import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/lib/prisma";
import { userInWorkspace, isMoveSafe, computeFolderPosition } from "@/lib/folderHelpers";
import { logActivity } from "@/lib/activityLog";
import { requireFolderPerm, FolderPermissionDeniedError } from "@/lib/folderPermissions";
import { requirePerm, PermissionDeniedError } from "@/lib/rbac";

/**
 * POST /api/folders/[id]/move
 * Body: { newParentId: string | null, beforeId?: string | null, afterId?: string | null }
 */
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const folder = await prisma.folder.findUnique({
    where: { id: params.id },
    select: { id: true, workspaceId: true, parentId: true, name: true },
  });
  if (!folder) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Need workspace-level permission AND folder-level EDIT on the moving folder
  try {
    await requirePerm(userId, folder.workspaceId, "folder.move");
    await requireFolderPerm(userId, folder.id, "EDIT");
  } catch (e) {
    if (e instanceof PermissionDeniedError || e instanceof FolderPermissionDeniedError)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    throw e;
  }

  const body = await req.json().catch(() => ({}));
  const newParentId: string | null = body.newParentId ?? null;
  const beforeId: string | null = body.beforeId ?? null;
  const afterId: string | null = body.afterId ?? null;

  if (newParentId) {
    const dest = await prisma.folder.findFirst({
      where: { id: newParentId, workspaceId: folder.workspaceId },
      select: { id: true },
    });
    if (!dest) return NextResponse.json({ error: "Destination folder not found" }, { status: 404 });
    // Need EDIT on the destination too
    try {
      await requireFolderPerm(userId, newParentId, "EDIT");
    } catch (e) {
      if (e instanceof FolderPermissionDeniedError)
        return NextResponse.json({ error: "Forbidden on destination" }, { status: 403 });
      throw e;
    }
  }

  if (!(await isMoveSafe(folder.id, newParentId))) {
    return NextResponse.json({ error: "Cannot move folder into its own descendant" }, { status: 400 });
  }

  const position = await computeFolderPosition(folder.workspaceId, newParentId, beforeId, afterId);

  const updated = await prisma.folder.update({
    where: { id: folder.id },
    data: { parentId: newParentId, position },
  });

  await logActivity({
    workspaceId: folder.workspaceId,
    userId,
    action: "folder.moved",
    entityType: "folder",
    entityId: folder.id,
    metadata: { from: folder.parentId, to: newParentId },
  }).catch(() => {});

  return NextResponse.json({ folder: updated });
}
