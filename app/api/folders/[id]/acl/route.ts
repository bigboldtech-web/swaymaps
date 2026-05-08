import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/lib/prisma";
import { requirePerm, PermissionDeniedError } from "@/lib/rbac";
import { logActivity } from "@/lib/activityLog";
import type { FolderPermission } from "@prisma/client";

const VALID_PERMS: FolderPermission[] = ["VIEW", "EDIT", "ADMIN"];

async function getFolderForAdmin(folderId: string, userId: string) {
  const folder = await prisma.folder.findUnique({
    where: { id: folderId },
    select: { id: true, workspaceId: true, name: true },
  });
  if (!folder) return { error: NextResponse.json({ error: "Not found" }, { status: 404 }) };
  try {
    await requirePerm(userId, folder.workspaceId, "folder.acl.manage");
  } catch (e) {
    if (e instanceof PermissionDeniedError)
      return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
    throw e;
  }
  return { folder };
}

/**
 * GET /api/folders/[id]/acl
 * Returns the explicit ACL list for the folder, plus all workspace members
 * (so the dialog can show "Add member" candidates).
 */
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await getFolderForAdmin(params.id, userId);
  if ("error" in result) return result.error;

  const [acls, members, groups] = await Promise.all([
    prisma.folderACL.findMany({
      where: { folderId: params.id },
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true } },
        group: { select: { id: true, name: true } },
      },
    }),
    prisma.workspaceMember.findMany({
      where: { workspaceId: result.folder.workspaceId },
      include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } },
    }),
    prisma.group.findMany({
      where: { workspaceId: result.folder.workspaceId },
      select: { id: true, name: true },
    }),
  ]);

  return NextResponse.json({ acls, members, groups });
}

/**
 * POST /api/folders/[id]/acl
 * Body: { userId?: string, groupId?: string, permission: 'VIEW' | 'EDIT' | 'ADMIN' }
 * Upserts the ACL row for the given subject.
 */
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await getFolderForAdmin(params.id, userId);
  if ("error" in result) return result.error;

  const body = await req.json().catch(() => ({}));
  const subjectUserId: string | null = body.userId ?? null;
  const subjectGroupId: string | null = body.groupId ?? null;
  const permission: FolderPermission = body.permission;

  if (!permission || !VALID_PERMS.includes(permission)) {
    return NextResponse.json({ error: "Invalid permission" }, { status: 400 });
  }
  if (!subjectUserId && !subjectGroupId) {
    return NextResponse.json({ error: "userId or groupId required" }, { status: 400 });
  }
  if (subjectUserId && subjectGroupId) {
    return NextResponse.json({ error: "Provide either userId or groupId, not both" }, { status: 400 });
  }

  // Validate subject is in this workspace
  if (subjectUserId) {
    const isMember = await prisma.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId: subjectUserId, workspaceId: result.folder.workspaceId } },
    });
    if (!isMember) return NextResponse.json({ error: "User is not a workspace member" }, { status: 400 });
  } else if (subjectGroupId) {
    const isGroup = await prisma.group.findFirst({
      where: { id: subjectGroupId, workspaceId: result.folder.workspaceId },
      select: { id: true },
    });
    if (!isGroup) return NextResponse.json({ error: "Group not found" }, { status: 400 });
  }

  const acl = subjectUserId
    ? await prisma.folderACL.upsert({
        where: { folderId_userId: { folderId: params.id, userId: subjectUserId } },
        create: { folderId: params.id, userId: subjectUserId, permission },
        update: { permission },
      })
    : await prisma.folderACL.upsert({
        where: { folderId_groupId: { folderId: params.id, groupId: subjectGroupId! } },
        create: { folderId: params.id, groupId: subjectGroupId!, permission },
        update: { permission },
      });

  await logActivity({
    workspaceId: result.folder.workspaceId,
    userId,
    action: "folder.updated",
    entityType: "folder_acl",
    entityId: acl.id,
    metadata: { folderId: params.id, subjectUserId, subjectGroupId, permission },
  }).catch(() => {});

  return NextResponse.json({ acl });
}

/**
 * DELETE /api/folders/[id]/acl?aclId=...
 * Removes a single ACL entry.
 */
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await getFolderForAdmin(params.id, userId);
  if ("error" in result) return result.error;

  const url = new URL(req.url);
  const aclId = url.searchParams.get("aclId");
  if (!aclId) return NextResponse.json({ error: "aclId required" }, { status: 400 });

  const acl = await prisma.folderACL.findFirst({ where: { id: aclId, folderId: params.id } });
  if (!acl) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.folderACL.delete({ where: { id: aclId } });

  await logActivity({
    workspaceId: result.folder.workspaceId,
    userId,
    action: "folder.updated",
    entityType: "folder_acl",
    entityId: aclId,
    metadata: { removed: true, folderId: params.id },
  }).catch(() => {});

  return NextResponse.json({ ok: true });
}
