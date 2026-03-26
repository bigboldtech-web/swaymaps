import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { MapEdgeMeta, MapNodeMeta, Note } from "../../../../../types/map";
import { initialMaps, initialWorkspaces } from "../../../../../data/initialData";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { sendWebhookNotifications } from "../../../../../lib/integrations/webhook";

const memoryMaps = initialMaps.map((m) => JSON.parse(JSON.stringify(m)));

interface Params {
  params: { id: string };
}

type IncomingNode = {
  id: string;
  position: { x: number; y: number };
  data: { meta: MapNodeMeta };
};

export async function PUT(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { nodes = [], edges = [], notes = [] } = body as {
    nodes: IncomingNode[];
    edges: MapEdgeMeta[];
    notes: Note[];
  };

  try {
    const map = await prisma.decodeMap.findUnique({
      where: { id: params.id },
      include: {
        workspace: { include: { members: true } }
      }
    });
    if (!map) {
      return NextResponse.json({ error: "Map not found" }, { status: 404 });
    }

    const role = map.workspace?.members.find((m) => m.userId === userId)?.role ?? "viewer";
    if (role === "viewer") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.$transaction([
      prisma.mapEdge.deleteMany({ where: { mapId: params.id } }),
      prisma.mapNode.deleteMany({ where: { mapId: params.id } }),
      prisma.note.deleteMany({ where: { mapId: params.id } })
    ]);

    if (notes.length) {
      await prisma.note.createMany({
        data: notes.map((note) => ({
          id: note.id,
          mapId: params.id,
          title: note.title,
          tags: note.tags.join(", "),
          content: note.content,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt)
        }))
      });
    }

    if (nodes.length) {
      await prisma.mapNode.createMany({
        data: nodes.map((node) => ({
          id: node.id,
          mapId: params.id,
          kind: node.data.meta.kind,
          kindLabel: node.data.meta.kindLabel,
          title: node.data.meta.title,
          tags: node.data.meta.tags.join(", "),
          color: node.data.meta.color ?? "",
          noteId: node.data.meta.noteId || null,
          posX: node.position?.x ?? 0,
          posY: node.position?.y ?? 0,
          status: node.data.meta.status ?? null,
          priority: node.data.meta.priority ?? null,
          owner: node.data.meta.owner ?? null,
          url: node.data.meta.url ?? null,
          description: node.data.meta.description ?? null,
          version: node.data.meta.version ?? null,
          sla: node.data.meta.sla ?? null,
          customFields: node.data.meta.customFields ? JSON.stringify(node.data.meta.customFields) : null,
        }))
      });
    }

    if (edges.length) {
      await prisma.mapEdge.createMany({
        data: edges.map((edge) => ({
          id: edge.id,
          mapId: params.id,
          sourceNodeId: edge.sourceId,
          targetNodeId: edge.targetId,
          sourceHandle: edge.sourceHandle ?? null,
          targetHandle: edge.targetHandle ?? null,
          label: edge.label ?? null,
          noteId: edge.noteId ?? null,
          edgeType: edge.edgeType ?? null,
          lineStyle: edge.lineStyle ?? null,
          color: edge.color ?? null,
          animated: edge.animated ?? null,
          relationType: edge.relationType ?? null,
          direction: edge.direction ?? null,
          weight: edge.weight ?? null,
          protocol: edge.protocol ?? null,
          latency: edge.latency ?? null,
          dataFlow: edge.dataFlow ?? null,
        }))
      });
    }

    await prisma.decodeMap.update({
      where: { id: params.id },
      data: { updatedAt: new Date() }
    });

    // Auto-create version snapshot (Team plan only, throttled: only if last version is > 5 min old)
    const savingUserPlan = (session as any)?.user?.plan ?? "free";
    if (savingUserPlan === "team") try {
      const lastVersion = await prisma.mapVersion.findFirst({
        where: { mapId: params.id },
        orderBy: { createdAt: "desc" },
      });
      const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
      if (!lastVersion || lastVersion.createdAt < fiveMinAgo) {
        const nextVer = (lastVersion?.version ?? 0) + 1;
        const snapshot = JSON.stringify({
          nodes: nodes.map((n: IncomingNode) => ({
            id: n.id, kind: n.data.meta.kind, kindLabel: n.data.meta.kindLabel,
            title: n.data.meta.title, tags: n.data.meta.tags?.join(", ") ?? "",
            color: n.data.meta.color ?? "", posX: n.position?.x ?? 0, posY: n.position?.y ?? 0,
            status: n.data.meta.status ?? null, owner: n.data.meta.owner ?? null,
          })),
          edges: edges.map((e: MapEdgeMeta) => ({
            id: e.id, sourceNodeId: e.sourceId, targetNodeId: e.targetId,
            sourceHandle: e.sourceHandle ?? null, targetHandle: e.targetHandle ?? null,
            label: e.label ?? null,
          })),
        });
        await prisma.mapVersion.create({
          data: { mapId: params.id, version: nextVer, snapshot, createdBy: userId },
        });
        // Keep max 50 versions (Team plan)
        const allVers = await prisma.mapVersion.findMany({
          where: { mapId: params.id }, orderBy: { version: "desc" }, select: { id: true },
        });
        if (allVers.length > 50) {
          const toDelete = allVers.slice(50).map((v) => v.id);
          await prisma.mapVersion.deleteMany({ where: { id: { in: toDelete } } });
        }
      }
    } catch (vErr) {
      // Version creation is non-critical, don't fail the save
      console.error("Auto-version creation failed:", vErr);
    }

    // Fire webhook notifications asynchronously (don't block the response)
    if (map.workspaceId) {
      const userName = session?.user?.name ?? "Unknown";
      sendWebhookNotifications(map.workspaceId, {
        event: "map.updated",
        mapName: map.name,
        userName,
        details: `Map "${map.name}" updated (${nodes.length} nodes, ${edges.length} edges)`,
        link: `${process.env.NEXTAUTH_URL ?? ""}/app?map=${params.id}`,
      }).catch(() => {}); // fire-and-forget
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Prisma state update failed, using fallback", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST alias for sendBeacon (used on page unload to flush pending saves)
export async function POST(req: Request, ctx: Params) {
  return PUT(req, ctx);
}
