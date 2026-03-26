import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../../lib/prisma";
import { logActivity } from "../../../../../lib/activityLog";

// GET /api/maps/[id]/versions - List versions for a map (Team plan only)
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  const userPlan = (session as any)?.user?.plan ?? "free";
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (userPlan !== "team") return NextResponse.json({ error: "Version history is a Team plan feature", plan: userPlan }, { status: 403 });

  try {
    // If no versions exist yet, auto-create an initial snapshot so Diff Viewer has something to show
    const count = await prisma.mapVersion.count({ where: { mapId: params.id } });
    if (count === 0) {
      const map = await prisma.decodeMap.findUnique({
        where: { id: params.id },
        include: { nodes: true, edges: true, notes: true },
      });
      if (map && (map.nodes.length > 0 || map.edges.length > 0)) {
        const snapshot = JSON.stringify({
          nodes: map.nodes.map((n) => ({
            id: n.id, kind: n.kind, kindLabel: n.kindLabel, title: n.title,
            tags: n.tags, color: n.color, posX: n.posX, posY: n.posY,
            status: n.status ?? null, owner: n.owner ?? null,
          })),
          edges: map.edges.map((e) => ({
            id: e.id, sourceNodeId: e.sourceNodeId, targetNodeId: e.targetNodeId,
            sourceHandle: e.sourceHandle ?? null, targetHandle: e.targetHandle ?? null,
            label: e.label ?? null,
          })),
          notes: map.notes.map((n) => ({
            id: n.id, title: n.title, tags: n.tags, content: n.content,
          })),
        });
        await prisma.mapVersion.create({
          data: { mapId: params.id, version: 1, snapshot, createdBy: userId },
        });
      }
    }

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

// POST /api/maps/[id]/versions - Create a new version (Team plan only)
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  const userPlan = (session as any)?.user?.plan ?? "free";
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (userPlan !== "team") return NextResponse.json({ error: "Version history is a Team plan feature" }, { status: 403 });

  const versionLimit = 50; // Team plan: 50 versions max

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

    // Clean up old versions beyond the plan limit
    const allVersions = await prisma.mapVersion.findMany({
      where: { mapId: params.id },
      orderBy: { version: "desc" },
      select: { id: true },
    });
    if (allVersions.length > versionLimit) {
      const toDelete = allVersions.slice(versionLimit).map((v) => v.id);
      await prisma.mapVersion.deleteMany({ where: { id: { in: toDelete } } });
    }

    return NextResponse.json({ id: version.id, version: version.version });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Failed to create version" }, { status: 500 });
  }
}

// PUT /api/maps/[id]/versions - Restore a map to a specific version (Team plan only)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  const userPlan = (session as any)?.user?.plan ?? "free";
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (userPlan !== "team") return NextResponse.json({ error: "Version history is a Team plan feature" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const { versionId } = body as { versionId?: string };
  if (!versionId) {
    return NextResponse.json({ error: "versionId is required" }, { status: 400 });
  }

  try {
    const version = await prisma.mapVersion.findUnique({ where: { id: versionId } });
    if (!version || version.mapId !== params.id) {
      return NextResponse.json({ error: "Version not found" }, { status: 404 });
    }

    const map = await prisma.decodeMap.findUnique({ where: { id: params.id } });
    if (!map) return NextResponse.json({ error: "Map not found" }, { status: 404 });

    const snapshot = JSON.parse(version.snapshot) as {
      nodes: Array<{ id: string; kind: string; kindLabel: string; title: string; tags: string; color: string; posX: number; posY: number }>;
      edges: Array<{ id: string; sourceNodeId: string; targetNodeId: string; sourceHandle?: string; targetHandle?: string; label?: string }>;
      notes: Array<{ id: string; title: string; tags: string; content: string }>;
    };

    // Use a transaction to atomically replace map contents
    await prisma.$transaction(async (tx) => {
      // Delete existing edges first (they reference nodes)
      await tx.mapEdge.deleteMany({ where: { mapId: params.id } });
      // Delete existing nodes (clear noteId links first)
      await tx.mapNode.deleteMany({ where: { mapId: params.id } });
      // Delete existing notes
      await tx.note.deleteMany({ where: { mapId: params.id } });

      // Recreate notes
      if (snapshot.notes.length > 0) {
        await tx.note.createMany({
          data: snapshot.notes.map((n) => ({
            id: n.id,
            mapId: params.id,
            title: n.title,
            tags: n.tags,
            content: n.content,
          })),
        });
      }

      // Recreate nodes
      if (snapshot.nodes.length > 0) {
        await tx.mapNode.createMany({
          data: snapshot.nodes.map((n) => ({
            id: n.id,
            mapId: params.id,
            kind: n.kind,
            kindLabel: n.kindLabel,
            title: n.title,
            tags: n.tags,
            color: n.color,
            posX: n.posX,
            posY: n.posY,
          })),
        });
      }

      // Recreate edges
      if (snapshot.edges.length > 0) {
        await tx.mapEdge.createMany({
          data: snapshot.edges.map((e) => ({
            id: e.id,
            mapId: params.id,
            sourceNodeId: e.sourceNodeId,
            targetNodeId: e.targetNodeId,
            sourceHandle: e.sourceHandle ?? null,
            targetHandle: e.targetHandle ?? null,
            label: e.label ?? null,
          })),
        });
      }
    });

    // Log the restore
    if (map.workspaceId) {
      await logActivity({
        workspaceId: map.workspaceId,
        userId,
        action: "version.restored",
        entityType: "map",
        entityId: params.id,
        metadata: { restoredVersion: version.version },
      });
    }

    return NextResponse.json({ ok: true, restoredVersion: version.version });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Failed to restore version" }, { status: 500 });
  }
}
