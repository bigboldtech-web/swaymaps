import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format") || "json";
  const workspaceId = searchParams.get("workspaceId");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!workspaceId) return NextResponse.json({ error: "workspaceId required" }, { status: 400 });

  // Verify admin/owner role
  const member = await prisma.workspaceMember.findUnique({
    where: { userId_workspaceId: { userId, workspaceId } },
  });
  if (!member || !["owner", "admin"].includes(member.role)) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const where: any = {};
  // Get all user IDs in workspace
  const members = await prisma.workspaceMember.findMany({
    where: { workspaceId },
    select: { userId: true },
  });
  where.userId = { in: members.map(m => m.userId) };
  if (from) where.createdAt = { ...where.createdAt, gte: new Date(from) };
  if (to) where.createdAt = { ...where.createdAt, lte: new Date(to) };

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 10000,
    include: { user: { select: { name: true, email: true } } },
  });

  if (format === "csv") {
    const header = "Timestamp,User,Email,Action,Entity Type,Entity ID,Metadata";
    const rows = logs.map(l =>
      `${l.createdAt.toISOString()},"${l.user.name}","${l.user.email}","${l.action}","${l.entityType}","${l.entityId}","${(l.metadata || '').replace(/"/g, '""')}"`
    );
    const csv = [header, ...rows].join("\n");
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="audit-log-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  }

  return NextResponse.json({ logs, total: logs.length });
}
