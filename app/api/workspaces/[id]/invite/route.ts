import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../../lib/prisma";
import { WorkspaceRole } from "../../../../../types/map";
import crypto from "crypto";

interface Params {
  params: { id: string };
}

export async function POST(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { email, role } = body as { email?: string; role?: WorkspaceRole };
  if (!email || !role) {
    return NextResponse.json({ error: "Email and role are required." }, { status: 400 });
  }

  const workspace = await prisma.workspace.findUnique({
    where: { id: params.id },
    include: { members: true }
  });
  if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

  const callerRole = workspace.members.find((m) => m.userId === session.user.id)?.role ?? "viewer";
  if (callerRole !== "owner" && callerRole !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Free plan restriction: can only invite viewers
  const inviter = await prisma.user.findUnique({ where: { id: session.user.id as string } });
  if (inviter?.plan === "pro") {
    return NextResponse.json({ error: "Pro plan is single-user. Upgrade to Team to invite members." }, { status: 403 });
  }
  const effectiveRole =
    inviter?.plan === "free" ? ("viewer" as WorkspaceRole) : (role as WorkspaceRole);
  if (inviter?.plan === "free" && role !== "viewer") {
    return NextResponse.json({ error: "Free plan can only invite viewers." }, { status: 403 });
  }

  // If already a member, just update role and return
  const existingMember = await prisma.workspaceMember.findFirst({
    where: { workspaceId: params.id, user: { email: email.toLowerCase() } }
  });
  if (existingMember) {
    await prisma.workspaceMember.update({
      where: { id: existingMember.id },
      data: { role: effectiveRole }
    });
    return NextResponse.json({ ok: true, alreadyMember: true });
  }

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days
  await prisma.workspaceInvite.create({
    data: {
      token,
      email: email.toLowerCase(),
      workspaceId: params.id,
      role: effectiveRole,
      inviterUserId: session.user.id as string,
      expiresAt
    }
  });

  const url = `${process.env.NEXTAUTH_URL ?? ""}/invite/${token}`;
  return NextResponse.json({ ok: true, token, url, expiresAt });
}
