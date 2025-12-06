import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { name } = body ?? {};
  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const workspace = await prisma.workspace.create({
    data: {
      name,
      ownerId: session.user.id as string,
      members: {
        create: { userId: session.user.id as string, role: "owner" }
      }
    },
    include: { members: true }
  });

  return NextResponse.json(workspace);
}
