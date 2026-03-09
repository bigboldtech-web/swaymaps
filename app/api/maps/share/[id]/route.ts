import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

interface Params {
  params: { id: string };
}

export async function GET(_req: Request, { params }: Params) {
  try {
    const map = await prisma.decodeMap.findFirst({
      where: { publicShareId: params.id },
      include: {
        nodes: true,
        edges: true,
        notes: true,
      },
    });

    if (!map) {
      return NextResponse.json({ error: "Map not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: map.id,
      name: map.name,
      description: map.description,
      nodes: map.nodes,
      edges: map.edges,
    });
  } catch (err) {
    console.error("Share map fetch failed", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
