import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

interface Params {
  params: { id: string };
}

export async function PUT(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { name } = body ?? {};
  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const ws = await prisma.workspace.findUnique({
    where: { id: params.id },
    include: { members: true }
  });
  if (!ws) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const role = ws.members.find((m) => m.userId === session.user.id)?.role ?? "viewer";
  if (role !== "owner" && role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await prisma.workspace.update({
    where: { id: params.id },
    data: { name },
    include: { members: true }
  });

  return NextResponse.json(updated);
}
