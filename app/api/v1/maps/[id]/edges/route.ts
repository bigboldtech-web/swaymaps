import { NextResponse } from "next/server";
import { authenticateApiKey } from "../../../../../../lib/apiAuth";
import { prisma } from "../../../../../../lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const auth = await authenticateApiKey(req);
  if (!auth) return NextResponse.json({ error: "Invalid API key" }, { status: 401 });

  const map = await prisma.decodeMap.findFirst({ where: { id: params.id, workspaceId: auth.workspaceId } });
  if (!map) return NextResponse.json({ error: "Map not found" }, { status: 404 });

  const edges = await prisma.mapEdge.findMany({ where: { mapId: params.id } });
  return NextResponse.json({ edges });
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const auth = await authenticateApiKey(req);
  if (!auth) return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
  if (!auth.permissions.includes("write")) return NextResponse.json({ error: "Write permission required" }, { status: 403 });

  const map = await prisma.decodeMap.findFirst({ where: { id: params.id, workspaceId: auth.workspaceId } });
  if (!map) return NextResponse.json({ error: "Map not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const { sourceNodeId, targetNodeId, label } = body ?? {};
  if (!sourceNodeId || !targetNodeId) return NextResponse.json({ error: "sourceNodeId and targetNodeId required" }, { status: 400 });

  const edge = await prisma.mapEdge.create({
    data: { mapId: params.id, sourceNodeId, targetNodeId, label },
  });

  return NextResponse.json(edge, { status: 201 });
}
