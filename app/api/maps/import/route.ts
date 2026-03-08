import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

// POST /api/maps/import - Import a map from JSON
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  const userPlan = (session as any)?.user?.plan ?? "free";
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { name, nodes, edges, notes, workspaceId } = body;

    if (!name) {
      return NextResponse.json({ error: "Map name is required" }, { status: 400 });
    }
    if (!Array.isArray(nodes)) {
      return NextResponse.json({ error: "Nodes array is required" }, { status: 400 });
    }

    // Check plan limits
    if (userPlan === "free") {
      const existingMaps = await prisma.decodeMap.count({ where: { ownerId: userId as string } });
      if (existingMaps >= 3) {
        return NextResponse.json({ error: "Free plan limit: 3 maps. Upgrade to Pro for unlimited." }, { status: 403 });
      }
    }

    // Create the map
    const map = await prisma.decodeMap.create({
      data: {
        name: name || "Imported Map",
        description: body.description || "Imported from JSON",
        ownerId: userId as string,
        workspaceId: workspaceId || null,
      },
    });

    // Create nodes with new IDs, maintaining a mapping
    const idMap = new Map<string, string>();

    for (const node of (nodes || [])) {
      const created = await prisma.mapNode.create({
        data: {
          mapId: map.id,
          kind: node.kind || "generic",
          kindLabel: node.kindLabel || node.kind || "Generic",
          title: node.title || "Untitled",
          tags: Array.isArray(node.tags) ? node.tags.join(",") : (node.tags || ""),
          color: node.color || "#6366f1",
          posX: node.position?.x ?? node.posX ?? 100,
          posY: node.position?.y ?? node.posY ?? 100,
        },
      });
      idMap.set(node.id, created.id);
    }

    // Create edges using mapped IDs
    for (const edge of (edges || [])) {
      const sourceId = idMap.get(edge.sourceId) || idMap.get(edge.sourceNodeId);
      const targetId = idMap.get(edge.targetId) || idMap.get(edge.targetNodeId);
      if (!sourceId || !targetId) continue;

      await prisma.mapEdge.create({
        data: {
          mapId: map.id,
          sourceNodeId: sourceId,
          targetNodeId: targetId,
          sourceHandle: edge.sourceHandle || null,
          targetHandle: edge.targetHandle || null,
          label: edge.label || null,
        },
      });
    }

    // Create notes
    for (const note of (notes || [])) {
      await prisma.note.create({
        data: {
          mapId: map.id,
          title: note.title || "",
          tags: Array.isArray(note.tags) ? note.tags.join(",") : (note.tags || ""),
          content: note.content || "",
        },
      });
    }

    return NextResponse.json({ id: map.id, name: map.name });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Import failed" }, { status: 500 });
  }
}
