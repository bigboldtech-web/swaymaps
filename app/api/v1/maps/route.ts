import { NextResponse } from "next/server";
import { authenticateApiKey } from "../../../../lib/apiAuth";
import { prisma } from "../../../../lib/prisma";

export async function GET(req: Request) {
  const auth = await authenticateApiKey(req);
  if (!auth) return NextResponse.json({ error: "Invalid API key" }, { status: 401 });

  const maps = await prisma.decodeMap.findMany({
    where: { workspaceId: auth.workspaceId },
    select: { id: true, name: true, description: true, createdAt: true, updatedAt: true, _count: { select: { nodes: true, edges: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ maps });
}

export async function POST(req: Request) {
  const auth = await authenticateApiKey(req);
  if (!auth) return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
  if (!auth.permissions.includes("write")) return NextResponse.json({ error: "Write permission required" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const { name, description } = body ?? {};
  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });

  const map = await prisma.decodeMap.create({
    data: { name, description, ownerId: auth.userId, workspaceId: auth.workspaceId },
  });

  return NextResponse.json(map, { status: 201 });
}
