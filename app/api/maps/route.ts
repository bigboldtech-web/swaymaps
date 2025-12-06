import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { initialMaps, initialUsers, initialWorkspaces } from "../../../data/initialData";
import { prismaMapToDomain, prismaUserToDomain } from "../../../lib/mapTransform";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import bcrypt from "bcryptjs";

async function ensureSeed() {
  try {
    const mapCount = await prisma.decodeMap.count();
    if (mapCount === 0) {
      // Seed users with password "demo"
      const existingUsers = await prisma.user.count();
      if (existingUsers === 0 && initialUsers.length) {
        for (const u of initialUsers) {
          await prisma.user.create({
            data: {
              id: u.id,
              name: u.name,
              email: (u.email ?? `${u.id}@demo.com`).toLowerCase(),
              passwordHash: await bcrypt.hash("demo", 10),
              color: u.color ?? null,
              plan: u.plan ?? "free"
            }
          });
        }
      }

      // Seed workspaces and memberships
      for (const ws of initialWorkspaces) {
        await prisma.workspace.create({
          data: {
            id: ws.id,
            name: ws.name,
            ownerId: ws.ownerUserId,
            members: {
              create: ws.members.map((m) => ({
                userId: m.userId,
                role: m.role
              }))
            }
          }
        });
      }

      for (const map of initialMaps) {
        const createdMap = await prisma.decodeMap.create({
          data: {
            id: map.id,
            name: map.name,
            description: map.description ?? "",
            ownerId: map.ownerUserId ?? null,
            workspaceId: map.workspaceId ?? null
          }
        });

        await prisma.note.createMany({
          data: map.notes.map((note) => ({
            id: note.id,
            mapId: createdMap.id,
            title: note.title,
            tags: note.tags.join(", "),
            content: note.content
          }))
        });

        await prisma.mapNode.createMany({
          data: map.nodes.map((node) => ({
            id: node.id,
            mapId: createdMap.id,
            kind: node.kind,
            kindLabel: node.kindLabel,
            title: node.title,
            tags: node.tags.join(", "),
            color: node.color ?? "",
            posX: node.position?.x ?? 0,
            posY: node.position?.y ?? 0,
            noteId: node.noteId
          }))
        });

        await prisma.mapEdge.createMany({
          data: map.edges.map((edge) => ({
            id: edge.id,
            mapId: createdMap.id,
            sourceNodeId: edge.sourceId,
            targetNodeId: edge.targetId,
            sourceHandle: edge.sourceHandle ?? null,
            targetHandle: edge.targetHandle ?? null,
            label: edge.label ?? null,
            noteId: edge.noteId ?? null
          }))
        });
      }
    }
    return true;
  } catch (err) {
    console.error("Prisma seed failed, using in-memory fallback", err);
    return false;
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureSeed();
  try {
    const maps = await prisma.decodeMap.findMany({
      where: {
        workspace: {
          members: { some: { userId: session.user.id as string } }
        }
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
        where: { members: { some: { userId: session.user.id as string } } },
        include: { members: true }
      })
    });
  } catch (err) {
    console.error("Prisma fetch failed, using fallback", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { name, description = "", ownerUserId, workspaceId } = body ?? {};
  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  try {
    const creatorId = session.user.id as string; // force creator to be current user
    const owner = await prisma.user.findUnique({ where: { id: creatorId } });
    if (owner?.plan === "free") {
      const count = await prisma.decodeMap.count({
        where: { OR: [{ ownerId: creatorId }, { ownerId: null }] }
      });
      if (count >= 1) {
        return NextResponse.json({ error: "Free plan allows 1 map. Upgrade to add more." }, { status: 403 });
      }
    }
    if (workspaceId) {
      const membership = await prisma.workspaceMember.findFirst({
        where: { workspaceId, userId: session.user.id as string }
      });
      if (!membership || (membership.role !== "owner" && membership.role !== "admin")) {
        return NextResponse.json({ error: "Insufficient role to create maps." }, { status: 403 });
      }
    }

    const created = await prisma.decodeMap.create({
      data: {
        name,
        description,
        ownerId: creatorId,
        workspaceId: workspaceId ?? null
      }
    });

    return NextResponse.json({ ...prismaMapToDomain(created), workspaceId });
  } catch (err) {
    console.error("Prisma create map failed", err);
    const creatorId = session?.user?.id as string | undefined;
    if (creatorId) {
      const owner = memoryUsers.find((u) => u.id === creatorId);
      if (owner?.plan === "free") {
        const count = memoryMaps.filter((m) => m.ownerUserId === creatorId || m.ownerUserId == null).length;
        if (count >= 1) {
          return NextResponse.json({ error: "Free plan allows 1 map. Upgrade to add more." }, { status: 403 });
        }
      }
    }
    const id = `map-${Date.now()}`;
    const newMap = {
      id,
      name,
      description,
      ownerUserId: creatorId ?? null,
      sharedUserIds: [],
      workspaceId: workspaceId ?? memoryWorkspaces[0]?.id ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nodes: [],
      edges: [],
      notes: []
    };
    memoryMaps.unshift(newMap as any);
    return NextResponse.json(newMap);
  }
}
