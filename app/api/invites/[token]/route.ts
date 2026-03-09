import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
import { logActivity } from "../../../../lib/activityLog";
import { notifyWorkspaceMembers } from "../../../../lib/notify";

interface Params {
  params: { token: string };
}

export async function GET(_req: Request, { params }: Params) {
  const invite = await prisma.workspaceInvite.findUnique({
    where: { token: params.token },
    include: { workspace: true }
  });
  if (!invite) return NextResponse.json({ error: "Invite not found" }, { status: 404 });
  const isExpired = invite.expiresAt < new Date();
  return NextResponse.json({
    email: invite.email,
    workspaceName: invite.workspace.name,
    role: invite.role,
    isExpired,
    acceptedAt: invite.acceptedAt
  });
}

export async function POST(req: Request, { params }: Params) {
  const body = await req.json().catch(() => ({}));
  const { name, password } = body as { name?: string; password?: string };

  const invite = await prisma.workspaceInvite.findUnique({
    where: { token: params.token }
  });
  if (!invite) return NextResponse.json({ error: "Invite not found" }, { status: 404 });
  if (invite.acceptedAt) return NextResponse.json({ error: "Invite already accepted" }, { status: 400 });
  if (invite.expiresAt < new Date()) return NextResponse.json({ error: "Invite expired" }, { status: 400 });

  let user = await prisma.user.findUnique({ where: { email: invite.email.toLowerCase() } });
  if (!user) {
    if (!name || !password) {
      return NextResponse.json({ error: "Name and password required to create account" }, { status: 400 });
    }
    const hash = await bcrypt.hash(password, 10);
    user = await prisma.user.create({
      data: {
        name,
        email: invite.email.toLowerCase(),
        passwordHash: hash,
        plan: "free"
      }
    });
  }

  const existingMember = await prisma.workspaceMember.findFirst({
    where: { workspaceId: invite.workspaceId, userId: user.id }
  });
  if (!existingMember) {
    await prisma.workspaceMember.create({
      data: {
        workspaceId: invite.workspaceId,
        userId: user.id,
        role: invite.role
      }
    });
  }

  await prisma.workspaceInvite.update({
    where: { id: invite.id },
    data: { acceptedAt: new Date(), acceptedByUserId: user.id }
  });

  await logActivity({
    workspaceId: invite.workspaceId,
    userId: user.id,
    action: "invite.accepted",
    entityType: "invite",
    entityId: invite.id,
    metadata: { email: invite.email, role: invite.role },
  });
  await logActivity({
    workspaceId: invite.workspaceId,
    userId: user.id,
    action: "member.joined",
    entityType: "workspace",
    entityId: invite.workspaceId,
    metadata: { role: invite.role },
  });

  // Notify workspace members about new member
  await notifyWorkspaceMembers(invite.workspaceId, user.id, {
    type: "member_joined",
    title: "New Team Member",
    body: `${user.name ?? invite.email} joined the workspace as ${invite.role}.`,
    link: "/app",
  });

  return NextResponse.json({ ok: true, userId: user.id, workspaceId: invite.workspaceId });
}
