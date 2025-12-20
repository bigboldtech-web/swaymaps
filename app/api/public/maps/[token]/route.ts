import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { prismaMapToDomain } from "../../../../../lib/mapTransform";

interface Params {
  params: { token: string };
}

export async function GET(_req: Request, { params }: Params) {
  try {
    const map = await prisma.decodeMap.findFirst({
      where: { publicShareId: params.token },
      include: { nodes: true, edges: true, notes: true, owner: true }
    });
    if (!map) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      map: prismaMapToDomain(map),
      ownerName: map.owner?.name ?? "Shared board"
    });
  } catch (err) {
    console.error("Public map fetch failed", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
