import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";

interface Params {
  params: { id: string };
}

async function authorize(mapId: string, userId: string | undefined) {
  if (!userId) return false;
  const map = await prisma.decodeMap.findUnique({
    where: { id: mapId },
    include: {
      workspace: { include: { members: true } }
    }
  });
  if (!map) return false;
  if (map.ownerId === userId) return true;
  const role = map.workspace?.members.find((m) => m.userId === userId)?.role;
  return role === "owner" || role === "admin";
}

export async function POST(_req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id as string | undefined;
  const allowed = await authorize(params.id, userId);
  if (!allowed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const token = crypto.randomUUID();
  const updated = await prisma.decodeMap.update({
    where: { id: params.id },
    data: { publicShareId: token },
    select: { publicShareId: true }
  });

  return NextResponse.json({ shareId: updated.publicShareId });
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id as string | undefined;
  const allowed = await authorize(params.id, userId);
  if (!allowed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  await prisma.decodeMap.update({
    where: { id: params.id },
    data: { publicShareId: null }
  });

  return NextResponse.json({ ok: true });
}
