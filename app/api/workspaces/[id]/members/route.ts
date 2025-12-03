import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../../lib/prisma";
import { WorkspaceRole } from "../../../../../types/map";

interface Params {
  params: { id: string };
}

const memberIncludes = {
  members: true
};

async function authorize(params: Params, sessionUserId?: string) {
  if (!sessionUserId) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };

  const workspace = await prisma.workspace.findUnique({
    where: { id: params.params.id },
    include: memberIncludes
  });
  if (!workspace) {
    return { error: NextResponse.json({ error: "Workspace not found" }, { status: 404 }) };
  }
  const callerRole = workspace.members.find((m) => m.userId === sessionUserId)?.role ?? "viewer";
  if (callerRole !== "owner" && callerRole !== "admin") {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { workspace, callerRole };
}

export async function PUT(req: Request, params: Params) {
  const session = await getServerSession(authOptions);
  const auth = await authorize(params, session?.user?.id as string | undefined);
  if ("error" in auth) return auth.error;
  const { workspace } = auth;

  const body = await req.json().catch(() => ({}));
  const { userId, role } = body as { userId?: string; role?: WorkspaceRole };
  if (!userId || !role) {
    return NextResponse.json({ error: "userId and role are required" }, { status: 400 });
  }

  if (userId === workspace.ownerId && role !== "owner") {
    return NextResponse.json({ error: "Cannot change the owner role" }, { status: 400 });
  }

  const member = await prisma.workspaceMember.findFirst({
    where: { workspaceId: workspace.id, userId }
  });
  if (!member) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  await prisma.workspaceMember.update({
    where: { id: member.id },
    data: { role }
  });

  const updated = await prisma.workspace.findUnique({
    where: { id: workspace.id },
    include: memberIncludes
  });

  return NextResponse.json({ workspace: updated });
}

export async function DELETE(req: Request, params: Params) {
  const session = await getServerSession(authOptions);
  const auth = await authorize(params, session?.user?.id as string | undefined);
  if ("error" in auth) return auth.error;
  const { workspace } = auth;

  const body = await req.json().catch(() => ({}));
  const { userId } = body as { userId?: string };
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  if (userId === workspace.ownerId) {
    return NextResponse.json({ error: "Cannot remove the workspace owner" }, { status: 400 });
  }

  const member = await prisma.workspaceMember.findFirst({
    where: { workspaceId: workspace.id, userId }
  });
  if (!member) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  await prisma.workspaceMember.delete({ where: { id: member.id } });

  const updated = await prisma.workspace.findUnique({
    where: { id: workspace.id },
    include: memberIncludes
  });

  return NextResponse.json({ workspace: updated });
}
