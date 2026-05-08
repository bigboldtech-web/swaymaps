import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/lib/prisma";
import { requirePerm, PermissionDeniedError } from "@/lib/rbac";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/mcp-servers?workspaceId=...
 *   Returns the workspace's MCP server connections (auth tokens redacted).
 *
 * POST /api/mcp-servers
 *   Body: { workspaceId, name, label, url, authToken?, enabled? }
 *   Creates an MCP server connection.
 */
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const workspaceId = url.searchParams.get("workspaceId");
  if (!workspaceId) return NextResponse.json({ error: "workspaceId required" }, { status: 400 });

  try {
    await requirePerm(userId, workspaceId, "mcp.servers.manage");
  } catch (e) {
    if (e instanceof PermissionDeniedError)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    throw e;
  }

  const servers = await prisma.mcpServer.findMany({
    where: { workspaceId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      label: true,
      url: true,
      enabled: true,
      // Never return authToken in lists — only signal whether one is set.
      authToken: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  const redacted = servers.map((s) => ({
    ...s,
    hasAuthToken: !!s.authToken,
    authToken: undefined,
  }));
  return NextResponse.json({ servers: redacted });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { workspaceId, name, label, url, authToken, enabled } = body || {};
  if (!workspaceId || !name?.trim() || !label?.trim() || !url?.trim()) {
    return NextResponse.json({ error: "workspaceId, name, label, url required" }, { status: 400 });
  }

  try {
    await requirePerm(userId, workspaceId, "mcp.servers.manage");
  } catch (e) {
    if (e instanceof PermissionDeniedError)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    throw e;
  }

  // Lightweight validation
  const cleanName = String(name).trim().toLowerCase().replace(/[^a-z0-9_]/g, "_").slice(0, 40);
  if (!cleanName) {
    return NextResponse.json({ error: "name must contain at least one alphanumeric character" }, { status: 400 });
  }
  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: "url is not a valid URL" }, { status: 400 });
  }

  try {
    const created = await prisma.mcpServer.create({
      data: {
        workspaceId,
        name: cleanName,
        label: String(label).trim().slice(0, 80),
        url: String(url).trim(),
        authToken: authToken ? String(authToken) : null,
        enabled: enabled !== false,
        createdById: userId,
      },
    });
    return NextResponse.json({
      server: {
        id: created.id,
        name: created.name,
        label: created.label,
        url: created.url,
        enabled: created.enabled,
        hasAuthToken: !!created.authToken,
        createdAt: created.createdAt,
        updatedAt: created.updatedAt,
      },
    });
  } catch (e: any) {
    if (e?.code === "P2002") {
      return NextResponse.json({ error: "An MCP server with that name already exists in this workspace." }, { status: 409 });
    }
    return NextResponse.json({ error: e?.message ?? "Failed to create" }, { status: 500 });
  }
}
