import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../../lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const map = await prisma.decodeMap.findUnique({
    where: { id: params.id },
    include: {
      nodes: true,
      edges: true,
      notes: {
        include: {
          comments: {
            orderBy: { createdAt: "asc" },
            include: { author: { select: { id: true, name: true } } },
          },
        },
      },
    },
  });

  if (!map) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Transform to match expected format
  const nodes = map.nodes.map(n => ({
    id: n.id,
    kind: n.kind,
    kindLabel: n.kindLabel,
    title: n.title,
    tags: n.tags,
    color: n.color,
    noteId: n.noteId,
    position: { x: n.posX, y: n.posY },
  }));

  const edges = map.edges.map(e => ({
    id: e.id,
    sourceId: e.sourceNodeId,
    targetId: e.targetNodeId,
    sourceHandle: e.sourceHandle,
    targetHandle: e.targetHandle,
    label: e.label,
    noteId: e.noteId,
  }));

  const notes = map.notes.map(n => ({
    id: n.id,
    title: n.title,
    tags: n.tags,
    content: n.content,
    comments: n.comments.map(c => ({
      id: c.id,
      author: c.author?.name || "Unknown",
      text: c.text,
      createdAt: c.createdAt.toISOString(),
    })),
    createdAt: n.createdAt.toISOString(),
    updatedAt: n.updatedAt.toISOString(),
  }));

  return NextResponse.json({
    updatedAt: map.updatedAt.toISOString(),
    nodes,
    edges,
    notes,
  });
}
