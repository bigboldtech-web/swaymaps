import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/lib/prisma";
import { requirePerm, PermissionDeniedError } from "@/lib/rbac";

/**
 * GET /api/audit/export-v2?workspaceId=...&format=csv|json&...
 * Same filters as /api/audit. Streams up to 50,000 rows of Activity.
 */
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const workspaceId = url.searchParams.get("workspaceId");
  if (!workspaceId) return NextResponse.json({ error: "workspaceId required" }, { status: 400 });

  try {
    await requirePerm(userId, workspaceId, "audit.export");
  } catch (e) {
    if (e instanceof PermissionDeniedError)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    throw e;
  }

  const action = url.searchParams.get("action");
  const actorId = url.searchParams.get("actorId");
  const entityType = url.searchParams.get("entityType");
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const format = (url.searchParams.get("format") ?? "csv").toLowerCase();

  const where: any = { workspaceId };
  if (action) where.action = action;
  if (actorId) where.userId = actorId;
  if (entityType) where.entityType = entityType;
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to);
  }

  const rows = await prisma.activity.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50000,
    include: { user: { select: { name: true, email: true } } },
  });

  const stamp = new Date().toISOString().split("T")[0];

  if (format === "json") {
    return NextResponse.json({ items: rows });
  }

  const escape = (s: string | null | undefined) =>
    `"${(s ?? "").replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;

  const header = "Timestamp,Actor,Email,Action,Entity Type,Entity ID,Metadata";
  const lines = rows.map((r) =>
    [
      r.createdAt.toISOString(),
      escape(r.user?.name),
      escape(r.user?.email),
      escape(r.action),
      escape(r.entityType),
      escape(r.entityId),
      escape(r.metadata ?? ""),
    ].join(",")
  );

  return new Response([header, ...lines].join("\n"), {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="audit-log-${stamp}.csv"`,
    },
  });
}
