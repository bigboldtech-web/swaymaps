import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/lib/prisma";
import { userInWorkspace, computeFolderPosition } from "@/lib/folderHelpers";
import { logActivity } from "@/lib/activityLog";
import { requirePerm, PermissionDeniedError } from "@/lib/rbac";
import { requireFolderPerm, FolderPermissionDeniedError } from "@/lib/folderPermissions";

/**
 * GET /api/folders?workspaceId=...
 * Returns flat list of folders for the workspace; client builds the tree.
 */
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const workspaceId = url.searchParams.get("workspaceId");
  if (!workspaceId) return NextResponse.json({ error: "workspaceId required" }, { status: 400 });

  if (!(await userInWorkspace(userId, workspaceId))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const folders = await prisma.folder.findMany({
    where: { workspaceId },
    orderBy: [{ parentId: "asc" }, { position: "asc" }],
    select: {
      id: true,
      name: true,
      parentId: true,
      position: true,
      icon: true,
      color: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ folders });
}

/**
 * POST /api/folders
 * Body: { workspaceId, name, parentId?, beforeId?, afterId? }
 */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { workspaceId, name, parentId = null, beforeId = null, afterId = null, icon, color } = body || {};

  if (!workspaceId || !name?.trim()) {
    return NextResponse.json({ error: "workspaceId and name required" }, { status: 400 });
  }

  try {
    await requirePerm(userId, workspaceId, "folder.create");
  } catch (e) {
    if (e instanceof PermissionDeniedError) {
      return NextResponse.json({ error: "Forbidden", permission: e.permission }, { status: 403 });
    }
    throw e;
  }

  if (parentId) {
    const parent = await prisma.folder.findFirst({
      where: { id: parentId, workspaceId },
      select: { id: true },
    });
    if (!parent) return NextResponse.json({ error: "Parent folder not found" }, { status: 404 });
    // Need EDIT on the parent to add children
    try {
      await requireFolderPerm(userId, parentId, "EDIT");
    } catch (e) {
      if (e instanceof FolderPermissionDeniedError) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      throw e;
    }
  }

  const position = await computeFolderPosition(workspaceId, parentId, beforeId, afterId);

  const folder = await prisma.folder.create({
    data: {
      name: name.trim().slice(0, 120),
      workspaceId,
      parentId,
      position,
      icon: icon ?? null,
      color: color ?? null,
      createdById: userId,
    },
  });

  await logActivity({
    workspaceId,
    userId,
    action: "folder.created",
    entityType: "folder",
    entityId: folder.id,
    metadata: { name: folder.name, parentId: folder.parentId },
  }).catch(() => {});

  return NextResponse.json({ folder }, { status: 201 });
}
