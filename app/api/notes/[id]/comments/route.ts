import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../../lib/prisma";
import { logActivity } from "../../../../../lib/activityLog";
import { notifyWorkspaceMembers } from "../../../../../lib/notify";
import { sendWebhookNotifications } from "../../../../../lib/integrations/webhook";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const comments = await prisma.comment.findMany({
    where: { noteId: params.id },
    orderBy: { createdAt: "asc" },
    include: {
      author: { select: { id: true, name: true, avatarUrl: true } },
    },
  });

  return NextResponse.json(comments);
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { text } = body ?? {};

  if (!text || typeof text !== "string" || !text.trim()) {
    return NextResponse.json({ error: "Text is required" }, { status: 400 });
  }

  // Verify note exists
  const note = await prisma.note.findUnique({ where: { id: params.id } });
  if (!note) return NextResponse.json({ error: "Note not found" }, { status: 404 });

  const comment = await prisma.comment.create({
    data: {
      noteId: params.id,
      authorId: userId,
      text: text.trim(),
    },
    include: {
      author: { select: { id: true, name: true, avatarUrl: true } },
    },
  });

  // Log activity + notify — find workspace via note → map
  const map = await prisma.decodeMap.findUnique({ where: { id: note.mapId } });
  if (map && map.workspaceId) {
    await logActivity({
      workspaceId: map.workspaceId,
      userId,
      action: "comment.added",
      entityType: "note",
      entityId: params.id,
      metadata: { commentId: comment.id },
    });
    const commenterName = comment.author?.name ?? "Someone";
    await notifyWorkspaceMembers(map.workspaceId, userId, {
      type: "comment",
      title: "New Comment",
      body: `${commenterName} commented on "${note.title ?? "a note"}" in "${map.name}".`,
      link: `/app?map=${map.id}`,
    });
    // Also send to Slack/Teams webhooks
    sendWebhookNotifications(map.workspaceId, {
      event: "comment.added",
      mapName: map.name,
      userName: commenterName,
      details: `${commenterName} commented on "${note.title ?? "a note"}"`,
      link: `${process.env.NEXTAUTH_URL ?? ""}/app?map=${map.id}`,
    }).catch(() => {});
  }

  return NextResponse.json(comment);
}
