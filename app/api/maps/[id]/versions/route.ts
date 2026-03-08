import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../../lib/prisma";

// GET /api/maps/[id]/versions - List versions for a map
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const versions = await prisma.mapVersion.findMany({
      where: { mapId: params.id },
      orderBy: { version: "desc" },
      take: 50,
      select: {
        id: true,
        version: true,
        createdBy: true,
        createdAt: true,
      },
    });
    return NextResponse.json(versions);
  } catch {
    return NextResponse.json([]);
  }
}

// POST /api/maps/[id]/versions - Create a new version (auto-save snapshot)
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  const userPlan = (session as any)?.user?.plan ?? "free";
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Version history is a Team feature
  if (userPlan !== "team") {
    return NextResponse.json({ error: "Version history requires a Team plan" }, { status: 403 });
  }

  try {
    // Get current map state
    const map = await prisma.decodeMap.findUnique({
      where: { id: params.id },
      include: { nodes: true, edges: true, notes: true },
    });
    if (!map) return NextResponse.json({ error: "Map not found" }, { status: 404 });

    // Get latest version number
    const latest = await prisma.mapVersion.findFirst({
      where: { mapId: params.id },
      orderBy: { version: "desc" },
    });
    const nextVersion = (latest?.version ?? 0) + 1;

    // Create snapshot
    const snapshot = JSON.stringify({
      nodes: map.nodes.map((n) => ({
        id: n.id,
        kind: n.kind,
        kindLabel: n.kindLabel,
        title: n.title,
        tags: n.tags,
        color: n.color,
        posX: n.posX,
        posY: n.posY,
      })),
      edges: map.edges.map((e) => ({
        id: e.id,
        sourceNodeId: e.sourceNodeId,
        targetNodeId: e.targetNodeId,
        sourceHandle: e.sourceHandle,
        targetHandle: e.targetHandle,
        label: e.label,
      })),
      notes: map.notes.map((n) => ({
        id: n.id,
        title: n.title,
        tags: n.tags,
        content: n.content,
      })),
    });

    const version = await prisma.mapVersion.create({
      data: {
        mapId: params.id,
        version: nextVersion,
        snapshot,
        createdBy: userId,
      },
    });

    return NextResponse.json({ id: version.id, version: version.version });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Failed to create version" }, { status: 500 });
  }
}
