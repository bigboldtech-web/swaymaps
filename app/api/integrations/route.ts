import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { prisma } from "../../../lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get("workspaceId");
  if (!workspaceId) return NextResponse.json({ error: "workspaceId required" }, { status: 400 });

  const member = await prisma.workspaceMember.findUnique({
    where: { userId_workspaceId: { userId, workspaceId } },
  });
  if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const integrations = await prisma.integration.findMany({
    where: { workspaceId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(integrations);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { workspaceId, type, name, webhookUrl, events = "all" } = body ?? {};

  if (!workspaceId || !type || !name || !webhookUrl) {
    return NextResponse.json({ error: "workspaceId, type, name, and webhookUrl required" }, { status: 400 });
  }

  // Verify admin/owner
  const member = await prisma.workspaceMember.findUnique({
    where: { userId_workspaceId: { userId, workspaceId } },
  });
  if (!member || !["owner", "admin"].includes(member.role)) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  // Validate webhook URL pattern
  if (type === "slack" && !webhookUrl.startsWith("https://hooks.slack.com/")) {
    return NextResponse.json({ error: "Invalid Slack webhook URL" }, { status: 400 });
  }
  if (type === "teams" && !webhookUrl.includes("webhook.office.com")) {
    return NextResponse.json({ error: "Invalid Teams webhook URL" }, { status: 400 });
  }

  const integration = await prisma.integration.create({
    data: { workspaceId, type, name, webhookUrl, events },
  });

  return NextResponse.json(integration);
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const workspaceId = searchParams.get("workspaceId");
  if (!id || !workspaceId) return NextResponse.json({ error: "id and workspaceId required" }, { status: 400 });

  const member = await prisma.workspaceMember.findUnique({
    where: { userId_workspaceId: { userId, workspaceId } },
  });
  if (!member || !["owner", "admin"].includes(member.role)) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  await prisma.integration.deleteMany({ where: { id, workspaceId } });
  return NextResponse.json({ ok: true });
}
