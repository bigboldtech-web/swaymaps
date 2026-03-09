import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { prismaMapToDomain, prismaUserToDomain } from "../../../lib/mapTransform";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { logActivity } from "../../../lib/activityLog";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const maps = await prisma.decodeMap.findMany({
      where: {
        OR: [
          { ownerId: userId as string },
          { workspace: { members: { some: { userId: userId as string } } } }
        ]
      },
      include: {
        _count: {
          select: { nodes: true, edges: true }
        },
        owner: true,
        workspace: {
          include: {
            members: true
          }
        }
      },
      orderBy: { updatedAt: "desc" }
    });

    const response = maps.map((map) => ({
      id: map.id,
      name: map.name,
      description: map.description ?? "",
      publicShareId: (map as any).publicShareId ?? null,
      ownerUserId: map.ownerId ?? undefined,
      ownerName: map.owner?.name ?? "Unknown",
      workspaceId: map.workspaceId ?? undefined,
      nodeCount: map._count.nodes,
      edgeCount: map._count.edges,
      createdAt: map.createdAt,
      updatedAt: map.updatedAt
    }));

    return NextResponse.json({
      maps: response,
      users: (await prisma.user.findMany()).map(prismaUserToDomain),
      workspaces: await prisma.workspace.findMany({
        where: { members: { some: { userId: userId as string } } },
        include: { members: true }
      })
    });
  } catch (err) {
    console.error("Prisma fetch failed", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { name, description = "", workspaceId } = body ?? {};
  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  try {
    const creatorId = userId as string;
    const owner = await prisma.user.findUnique({ where: { id: creatorId } });

    // Free plan: max 3 maps
    if (owner?.plan === "free") {
      const count = await prisma.decodeMap.count({
        where: { ownerId: creatorId }
      });
      if (count >= 3) {
        return NextResponse.json({ error: "Free plan allows 3 maps. Upgrade to add more." }, { status: 403 });
      }
    }

    // If workspaceId provided, verify membership
    let targetWorkspaceId = workspaceId ?? null;
    if (targetWorkspaceId) {
      const membership = await prisma.workspaceMember.findFirst({
        where: { workspaceId: targetWorkspaceId, userId: creatorId }
      });
      if (!membership) {
        return NextResponse.json({ error: "You are not a member of this workspace." }, { status: 403 });
      }
    } else {
      // Find the user's first workspace
      const membership = await prisma.workspaceMember.findFirst({
        where: { userId: creatorId },
        include: { workspace: true }
      });
      targetWorkspaceId = membership?.workspaceId ?? null;
    }

    const created = await prisma.decodeMap.create({
      data: {
        name,
        description,
        ownerId: creatorId,
        workspaceId: targetWorkspaceId
      }
    });

    if (targetWorkspaceId) {
      logActivity({
        workspaceId: targetWorkspaceId,
        userId: creatorId,
        action: "map.created",
        entityType: "map",
        entityId: created.id,
        metadata: { name },
      });
    }

    return NextResponse.json({
      ...prismaMapToDomain(created),
      workspaceId: targetWorkspaceId
    });
  } catch (err) {
    console.error("Create map failed", err);
    return NextResponse.json({ error: "Failed to create map" }, { status: 500 });
  }
}
