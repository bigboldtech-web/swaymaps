import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { prisma } from "../../../lib/prisma";

// GET /api/search?q=keyword&type=all|maps|nodes|tags
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const query = url.searchParams.get("q")?.trim();
  const type = url.searchParams.get("type") ?? "all";

  if (!query || query.length < 2) {
    return NextResponse.json({ error: "Query must be at least 2 characters" }, { status: 400 });
  }

  const searchTerm = `%${query}%`;

  try {
    const results: {
      maps: any[];
      nodes: any[];
    } = { maps: [], nodes: [] };

    if (type === "all" || type === "maps") {
      // Search maps by name and description
      const maps = await prisma.decodeMap.findMany({
        where: {
          ownerId: userId as string,
          OR: [
            { name: { contains: query } },
            { description: { contains: query } },
          ],
        },
        select: {
          id: true,
          name: true,
          description: true,
          updatedAt: true,
          _count: { select: { nodes: true } },
        },
        take: 20,
        orderBy: { updatedAt: "desc" },
      });

      results.maps = maps.map((m) => ({
        id: m.id,
        name: m.name,
        description: m.description,
        nodeCount: m._count.nodes,
        updatedAt: m.updatedAt,
        type: "map",
      }));
    }

    if (type === "all" || type === "nodes" || type === "tags") {
      // Search nodes by title, kind, and tags
      const nodeWhere: any = {
        map: { ownerId: userId as string },
      };

      if (type === "tags") {
        nodeWhere.tags = { contains: query };
      } else {
        nodeWhere.OR = [
          { title: { contains: query } },
          { kind: { contains: query } },
          { kindLabel: { contains: query } },
          { tags: { contains: query } },
        ];
      }

      const nodes = await prisma.mapNode.findMany({
        where: nodeWhere,
        select: {
          id: true,
          title: true,
          kind: true,
          kindLabel: true,
          tags: true,
          color: true,
          mapId: true,
          map: { select: { name: true } },
        },
        take: 30,
      });

      results.nodes = nodes.map((n) => ({
        id: n.id,
        title: n.title,
        kind: n.kind,
        kindLabel: n.kindLabel,
        tags: n.tags,
        color: n.color,
        mapId: n.mapId,
        mapName: n.map.name,
        type: "node",
      }));
    }

    return NextResponse.json(results);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Search failed" }, { status: 500 });
  }
}
