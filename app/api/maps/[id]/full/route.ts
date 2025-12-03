import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { prismaMapToDomain, prismaUserToDomain } from "../../../../../lib/mapTransform";
import { initialMaps, initialUsers, initialWorkspaces } from "../../../../../data/initialData";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";

const memoryMaps = initialMaps.map((m) => JSON.parse(JSON.stringify(m)));
const memoryUsers = [...initialUsers];

interface Params {
  params: { id: string };
}

export async function GET(_req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const map = await prisma.decodeMap.findUnique({
      where: { id: params.id },
      include: {
        nodes: true,
        edges: true,
        notes: true,
        owner: true,
        workspace: { include: { members: true } }
      }
    });

    if (!map) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const isMember = map.workspace
      ? map.workspace.members.some((m) => m.userId === session.user.id)
      : true;
    if (!isMember) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      map: prismaMapToDomain(map),
      owner: map.owner ? prismaUserToDomain(map.owner) : null
    });
  } catch (err) {
    console.error("Prisma full map failed, using fallback", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
