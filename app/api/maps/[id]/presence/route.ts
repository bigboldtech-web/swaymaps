import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";

interface Params {
  params: { id: string };
}

// Clean up stale presences older than 60 seconds
async function cleanupStale(mapId: string) {
  const cutoff = new Date(Date.now() - 60_000);
  await prisma.mapPresence.deleteMany({
    where: { mapId, lastSeen: { lt: cutoff } },
  });
}

// Return users with lastSeen within 30 seconds
async function getActiveUsers(mapId: string) {
  const cutoff = new Date(Date.now() - 30_000);
  const presences = await prisma.mapPresence.findMany({
    where: { mapId, lastSeen: { gte: cutoff } },
    include: { user: { select: { id: true, name: true, avatarUrl: true, color: true } } },
  });
  return presences.map((p) => ({
    id: p.user.id,
    name: p.user.name,
    avatarUrl: p.user.avatarUrl,
    color: p.user.color,
    cursorX: p.cursorX,
    cursorY: p.cursorY,
  }));
}

export async function GET(_req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id as string | undefined;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const mapId = params.id;
  await cleanupStale(mapId);
  const users = await getActiveUsers(mapId);

  return NextResponse.json({ users });
}

export async function POST(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id as string | undefined;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const mapId = params.id;
  const body = await req.json().catch(() => ({}));
  const cursorX = typeof body.cursorX === "number" ? body.cursorX : null;
  const cursorY = typeof body.cursorY === "number" ? body.cursorY : null;

  await cleanupStale(mapId);

  // Upsert presence record
  await prisma.mapPresence.upsert({
    where: { mapId_userId: { mapId, userId } },
    update: { cursorX, cursorY, lastSeen: new Date() },
    create: { mapId, userId, cursorX, cursorY, lastSeen: new Date() },
  });

  const users = await getActiveUsers(mapId);
  return NextResponse.json({ users });
}
