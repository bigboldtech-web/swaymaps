import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { isAdmin } from "../../../../lib/adminCheck";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const adminUser = await isAdmin();
  if (!adminUser) {
    return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
  }

  try {
    // Try AuditLog first, then Activity
    let activities: any[] = [];

    try {
      const auditLogs = await prisma.auditLog.findMany({
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
        take: 100,
      });
      activities = auditLogs.map((log) => ({
        id: log.id,
        action: log.action,
        entityType: log.entityType ?? undefined,
        entityId: log.entityId ?? undefined,
        userId: log.userId,
        userName: (log as any).user?.name ?? "Unknown",
        metadata: log.metadata ? JSON.stringify(log.metadata) : undefined,
        createdAt: log.createdAt.toISOString(),
      }));
    } catch {
      // AuditLog table might not exist
    }

    if (activities.length === 0) {
      try {
        const activityRows = await (prisma as any).activity.findMany({
          include: { user: { select: { name: true, email: true } } },
          orderBy: { createdAt: "desc" },
          take: 100,
        });
        activities = activityRows.map((a: any) => ({
          id: a.id,
          action: a.action,
          entityType: a.entityType ?? undefined,
          entityId: a.entityId ?? undefined,
          userId: a.userId,
          userName: a.user?.name ?? "Unknown",
          metadata: a.metadata ? JSON.stringify(a.metadata) : undefined,
          createdAt: a.createdAt.toISOString(),
        }));
      } catch {
        // Activity table might not exist either
      }
    }

    return NextResponse.json({ activities });
  } catch (err) {
    console.error("Admin activity fetch failed", err);
    return NextResponse.json({ activities: [] });
  }
}
