import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { prisma } from "../../../lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/workspaces — list workspaces the current user is a member of.
 * Used by every settings page (audit, sso, scim, mcp) to populate the
 * workspace switcher.
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const workspaces = await prisma.workspace.findMany({
    where: { members: { some: { userId } } },
    select: {
      id: true,
      name: true,
      ownerId: true,
      createdAt: true,
      _count: { select: { members: true, maps: true } },
    },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({ workspaces });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { name } = body ?? {};
  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const workspace = await prisma.workspace.create({
    data: {
      name,
      ownerId: userId as string,
      members: {
        create: { userId: userId as string, role: "OWNER" }
      }
    },
    include: { members: true }
  });

  return NextResponse.json(workspace);
}
