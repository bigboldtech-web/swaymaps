import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { prismaMapToDomain } from "../../../../lib/mapTransform";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { logActivity } from "../../../../lib/activityLog";

interface Params {
  params: { id: string };
}

export async function GET(_req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const map = await prisma.decodeMap.findUnique({
      where: { id: params.id },
      include: { workspace: { include: { members: true } } }
    });
    if (!map) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const isMember = map.workspace ? map.workspace.members.some((m) => m.userId === userId) : true;
    if (!isMember) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json(prismaMapToDomain(map));
  } catch (err) {
    console.error("Prisma get map failed, using fallback", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const { name, description, ownerUserId } = body ?? {};
  try {
    const updated = await prisma.decodeMap.update({
      where: { id: params.id },
      data: {
        name,
        description,
        ownerId: ownerUserId ?? null
      }
    });
    return NextResponse.json(prismaMapToDomain(updated));
  } catch (err) {
    console.error("Prisma update map failed, using fallback", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const map = await prisma.decodeMap.findUnique({ where: { id: params.id } });
    if (!map) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const mapName = map.name;
    const wsId = map.workspaceId;

    await prisma.$transaction([
      prisma.mapEdge.deleteMany({ where: { mapId: params.id } }),
      prisma.mapNode.deleteMany({ where: { mapId: params.id } }),
      prisma.note.deleteMany({ where: { mapId: params.id } }),
      prisma.decodeMap.delete({ where: { id: params.id } })
    ]);

    if (wsId) {
      logActivity({
        workspaceId: wsId,
        userId: userId as string,
        action: "map.deleted",
        entityType: "map",
        entityId: params.id,
        metadata: { name: mapName },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Prisma delete map failed, using fallback", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
