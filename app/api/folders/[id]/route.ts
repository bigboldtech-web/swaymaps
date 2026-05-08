import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/lib/prisma";
import { userInWorkspace } from "@/lib/folderHelpers";
import { logActivity } from "@/lib/activityLog";
import { requireFolderPerm, FolderPermissionDeniedError } from "@/lib/folderPermissions";

async function getFolderForUser(id: string, userId: string) {
  const folder = await prisma.folder.findUnique({
    where: { id },
    select: { id: true, workspaceId: true, name: true, parentId: true },
  });
  if (!folder) return null;
  if (!(await userInWorkspace(userId, folder.workspaceId))) return "forbidden";
  return folder;
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await getFolderForUser(params.id, userId);
  if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (result === "forbidden") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    await requireFolderPerm(userId, params.id, "VIEW");
  } catch (e) {
    if (e instanceof FolderPermissionDeniedError)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    throw e;
  }

  const folder = await prisma.folder.findUnique({
    where: { id: params.id },
    include: {
      children: { orderBy: { position: "asc" } },
      maps: {
        orderBy: { position: "asc" },
        select: { id: true, name: true, updatedAt: true, _count: { select: { nodes: true, edges: true } } },
      },
    },
  });

  return NextResponse.json({ folder });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await getFolderForUser(params.id, userId);
  if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (result === "forbidden") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    await requireFolderPerm(userId, params.id, "EDIT");
  } catch (e) {
    if (e instanceof FolderPermissionDeniedError)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    throw e;
  }

  const body = await req.json().catch(() => ({}));
  const data: any = {};
  if (typeof body.name === "string" && body.name.trim()) data.name = body.name.trim().slice(0, 120);
  if (typeof body.icon === "string" || body.icon === null) data.icon = body.icon;
  if (typeof body.color === "string" || body.color === null) data.color = body.color;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const updated = await prisma.folder.update({
    where: { id: params.id },
    data,
  });

  await logActivity({
    workspaceId: result.workspaceId,
    userId,
    action: "folder.updated",
    entityType: "folder",
    entityId: updated.id,
    metadata: data,
  }).catch(() => {});

  return NextResponse.json({ folder: updated });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await getFolderForUser(params.id, userId);
  if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (result === "forbidden") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    await requireFolderPerm(userId, params.id, "ADMIN");
  } catch (e) {
    if (e instanceof FolderPermissionDeniedError)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    throw e;
  }

  // Move contained maps to parent folder (don't cascade-delete maps)
  await prisma.decodeMap.updateMany({
    where: { folderId: params.id },
    data: { folderId: result.parentId },
  });

  // Cascade-delete child folders (Prisma cascades via onDelete: Cascade in schema)
  await prisma.folder.delete({ where: { id: params.id } });

  await logActivity({
    workspaceId: result.workspaceId,
    userId,
    action: "folder.deleted",
    entityType: "folder",
    entityId: params.id,
    metadata: { name: result.name },
  }).catch(() => {});

  return NextResponse.json({ ok: true });
}
