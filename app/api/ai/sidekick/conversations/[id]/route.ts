import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/ai/sidekick/conversations/[id]
 * Returns the full message history for a conversation.
 */
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const conv = await prisma.sidekickConversation.findUnique({
    where: { id: params.id },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });
  if (!conv || conv.userId !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const messages = conv.messages.map((m) => {
    let content: unknown = [];
    try {
      content = JSON.parse(m.content);
    } catch {
      // Fall back to raw text on parse failure
      content = [{ type: "text", text: m.content }];
    }
    return {
      id: m.id,
      role: m.role,
      content,
      createdAt: m.createdAt,
    };
  });

  return NextResponse.json({
    id: conv.id,
    mapId: conv.mapId,
    title: conv.title,
    messages,
  });
}
