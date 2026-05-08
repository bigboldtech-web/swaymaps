import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/lib/prisma";
import { requirePerm, PermissionDeniedError } from "@/lib/rbac";
import { generateSCIMToken } from "@/lib/scimAuth";

/**
 * GET /api/scim/tokens?workspaceId=...
 * POST /api/scim/tokens — { workspaceId, name, defaultRole? }
 */
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const workspaceId = url.searchParams.get("workspaceId");
  if (!workspaceId) return NextResponse.json({ error: "workspaceId required" }, { status: 400 });

  try {
    await requirePerm(userId, workspaceId, "scim.tokens.manage");
  } catch (e) {
    if (e instanceof PermissionDeniedError)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    throw e;
  }

  const tokens = await prisma.sCIMToken.findMany({
    where: { workspaceId },
    select: {
      id: true,
      name: true,
      tokenPrefix: true,
      defaultRole: true,
      lastUsedAt: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ tokens });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { workspaceId, name, defaultRole } = body || {};
  if (!workspaceId || !name) {
    return NextResponse.json({ error: "workspaceId and name required" }, { status: 400 });
  }

  try {
    await requirePerm(userId, workspaceId, "scim.tokens.manage");
  } catch (e) {
    if (e instanceof PermissionDeniedError)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    throw e;
  }

  const { token, tokenHash, tokenPrefix } = generateSCIMToken();

  const created = await prisma.sCIMToken.create({
    data: {
      workspaceId,
      name: String(name).slice(0, 80),
      tokenHash,
      tokenPrefix,
      defaultRole: defaultRole ?? "EDITOR",
    },
    select: {
      id: true,
      name: true,
      tokenPrefix: true,
      defaultRole: true,
      createdAt: true,
    },
  });

  // Token is shown once and never returned again.
  return NextResponse.json({ token, ...created }, { status: 201 });
}
