import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireMapPerm, FolderPermissionDeniedError } from "@/lib/folderPermissions";

/**
 * GET  /api/maps/[id]/canvas — fetch the JSON canvas state (whiteboard, kanban, etc.)
 * PUT  /api/maps/[id]/canvas — replace the JSON canvas state.
 *
 * The graph-based map types (DEPENDENCY, MINDMAP, FLOWCHART, ORGCHART, PRODUCTFLOW)
 * still use MapNode + MapEdge tables for their primary data. This endpoint serves
 * the JSON-blob types (WHITEBOARD, KANBAN) and any auxiliary canvas state.
 */
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const map = await prisma.decodeMap.findUnique({
    where: { id: params.id },
    select: { id: true, mapType: true, canvasState: true, name: true, ownerId: true, workspaceId: true },
  });
  if (!map) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    await requireMapPerm(userId, map.id, "VIEW");
  } catch (e) {
    if (e instanceof FolderPermissionDeniedError)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    throw e;
  }

  let state: unknown = null;
  if (map.canvasState) {
    try {
      state = JSON.parse(map.canvasState);
    } catch {
      state = null;
    }
  }

  return NextResponse.json({
    id: map.id,
    mapType: map.mapType,
    name: map.name,
    state,
  });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const map = await prisma.decodeMap.findUnique({
    where: { id: params.id },
    select: { id: true, mapType: true, ownerId: true, workspaceId: true },
  });
  if (!map) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    await requireMapPerm(userId, map.id, "EDIT");
  } catch (e) {
    if (e instanceof FolderPermissionDeniedError)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    throw e;
  }

  const body = await req.json().catch(() => null);
  if (!body || body.state === undefined) {
    return NextResponse.json({ error: "state required" }, { status: 400 });
  }

  // Cap payload size to prevent abuse — 4 MB is generous for SVG whiteboard JSON.
  const serialized = JSON.stringify(body.state);
  if (serialized.length > 4 * 1024 * 1024) {
    return NextResponse.json({ error: "Canvas state too large" }, { status: 413 });
  }

  await prisma.decodeMap.update({
    where: { id: map.id },
    data: { canvasState: serialized },
  });

  return NextResponse.json({ ok: true });
}
