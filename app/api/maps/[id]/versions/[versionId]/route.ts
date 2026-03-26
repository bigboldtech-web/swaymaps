import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";
import { prisma } from "../../../../../../lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string; versionId: string } }
) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const version = await prisma.mapVersion.findUnique({
      where: { id: params.versionId },
    });

    if (!version || version.mapId !== params.id) {
      return NextResponse.json({ error: "Version not found" }, { status: 404 });
    }

    const snapshot = JSON.parse(version.snapshot);

    // Normalize snapshot to match the format DiffViewer expects
    const nodes = (snapshot.nodes || []).map((n: any) => ({
      id: n.id,
      kind: n.kind,
      kindLabel: n.kindLabel,
      title: n.title,
      tags: typeof n.tags === "string" ? n.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : n.tags || [],
      color: n.color,
      position: { x: n.posX ?? n.position?.x ?? 0, y: n.posY ?? n.position?.y ?? 0 },
      status: n.status ?? undefined,
      owner: n.owner ?? undefined,
      noteId: n.noteId ?? "",
    }));

    const edges = (snapshot.edges || []).map((e: any) => ({
      id: e.id,
      sourceId: e.sourceNodeId ?? e.sourceId,
      targetId: e.targetNodeId ?? e.targetId,
      sourceHandle: e.sourceHandle ?? null,
      targetHandle: e.targetHandle ?? null,
      label: e.label ?? undefined,
    }));

    return NextResponse.json({
      id: version.id,
      version: version.version,
      createdAt: version.createdAt,
      nodes,
      edges,
    });
  } catch {
    return NextResponse.json({ error: "Failed to load version" }, { status: 500 });
  }
}
