import { NextResponse } from "next/server";
import { authenticateApiKey } from "../../../../../lib/apiAuth";
import { prisma } from "../../../../../lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const auth = await authenticateApiKey(req);
  if (!auth) return NextResponse.json({ error: "Invalid API key" }, { status: 401 });

  const map = await prisma.decodeMap.findFirst({
    where: { id: params.id, workspaceId: auth.workspaceId },
    include: { nodes: true, edges: true, notes: true },
  });

  if (!map) return NextResponse.json({ error: "Map not found" }, { status: 404 });
  return NextResponse.json(map);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const auth = await authenticateApiKey(req);
  if (!auth) return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
  if (!auth.permissions.includes("write")) return NextResponse.json({ error: "Write permission required" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const { name, description } = body ?? {};

  const map = await prisma.decodeMap.updateMany({
    where: { id: params.id, workspaceId: auth.workspaceId },
    data: { ...(name && { name }), ...(description !== undefined && { description }) },
  });

  if (map.count === 0) return NextResponse.json({ error: "Map not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const auth = await authenticateApiKey(req);
  if (!auth) return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
  if (!auth.permissions.includes("write")) return NextResponse.json({ error: "Write permission required" }, { status: 403 });

  // Delete nodes and edges first (cascade), then map
  const map = await prisma.decodeMap.findFirst({ where: { id: params.id, workspaceId: auth.workspaceId } });
  if (!map) return NextResponse.json({ error: "Map not found" }, { status: 404 });

  await prisma.mapEdge.deleteMany({ where: { mapId: params.id } });
  await prisma.mapNode.deleteMany({ where: { mapId: params.id } });
  await prisma.decodeMap.delete({ where: { id: params.id } });

  return NextResponse.json({ ok: true });
}
