import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireMapPerm, FolderPermissionDeniedError } from "@/lib/folderPermissions";
import { userInWorkspace } from "@/lib/folderHelpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/ai/sidekick/conversations
 *
 * Query options (one required):
 *   - ?mapId=...                 → conversations scoped to a specific map
 *   - ?mapId=...&nodeId=...      → conversations focused on a specific node within a map
 *   - ?workspaceId=...           → workspace-level conversations
 */
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const mapId = url.searchParams.get("mapId");
  const nodeId = url.searchParams.get("nodeId");
  const workspaceId = url.searchParams.get("workspaceId");

  if (mapId) {
    try {
      await requireMapPerm(userId, mapId, "VIEW");
    } catch (e) {
      if (e instanceof FolderPermissionDeniedError)
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      throw e;
    }
    const where: any = { mapId, userId };
    if (nodeId) {
      where.scopeKind = "NODE";
      where.focusNodeId = nodeId;
    } else {
      where.scopeKind = "MAP";
    }
    const conversations = await prisma.sidekickConversation.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        scopeKind: true,
        focusNodeId: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { messages: true } },
      },
      take: 50,
    });
    return NextResponse.json({ conversations });
  }

  if (workspaceId) {
    if (!(await userInWorkspace(userId, workspaceId))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const conversations = await prisma.sidekickConversation.findMany({
      where: { workspaceId, userId, scopeKind: "WORKSPACE" },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        scopeKind: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { messages: true } },
      },
      take: 50,
    });
    return NextResponse.json({ conversations });
  }

  return NextResponse.json({ error: "mapId or workspaceId required" }, { status: 400 });
}

/**
 * DELETE /api/ai/sidekick/conversations?id=...
 */
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const conv = await prisma.sidekickConversation.findUnique({ where: { id } });
  if (!conv || conv.userId !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.sidekickConversation.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
