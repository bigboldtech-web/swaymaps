import { NextResponse } from "next/server";
import { authenticateApiKey } from "../../../../../../lib/apiAuth";
import { prisma } from "../../../../../../lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const auth = await authenticateApiKey(req);
  if (!auth) return NextResponse.json({ error: "Invalid API key" }, { status: 401 });

  const map = await prisma.decodeMap.findFirst({ where: { id: params.id, workspaceId: auth.workspaceId } });
  if (!map) return NextResponse.json({ error: "Map not found" }, { status: 404 });

  const nodes = await prisma.mapNode.findMany({ where: { mapId: params.id } });
  return NextResponse.json({ nodes });
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const auth = await authenticateApiKey(req);
  if (!auth) return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
  if (!auth.permissions.includes("write")) return NextResponse.json({ error: "Write permission required" }, { status: 403 });

  const map = await prisma.decodeMap.findFirst({ where: { id: params.id, workspaceId: auth.workspaceId } });
  if (!map) return NextResponse.json({ error: "Map not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const { title, kind = "generic", kindLabel, tags = "", color = "#6366f1", posX = 0, posY = 0 } = body ?? {};
  if (!title) return NextResponse.json({ error: "title required" }, { status: 400 });

  // Create note for the node
  const note = await prisma.note.create({
    data: { mapId: params.id, title, tags: typeof tags === "string" ? tags : (tags || []).join(","), content: "" },
  });

  const node = await prisma.mapNode.create({
    data: { mapId: params.id, kind, kindLabel: kindLabel || kind, title, tags: typeof tags === "string" ? tags : (tags || []).join(","), color, posX, posY, noteId: note.id },
  });

  return NextResponse.json(node, { status: 201 });
}
