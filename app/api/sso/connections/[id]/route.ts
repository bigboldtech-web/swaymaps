import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/lib/prisma";
import { getJackson } from "@/lib/jackson";
import { requirePerm, PermissionDeniedError } from "@/lib/rbac";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function loadOwned(id: string, userId: string) {
  const conn = await prisma.sSOConnection.findUnique({ where: { id } });
  if (!conn) return { error: NextResponse.json({ error: "Not found" }, { status: 404 }) };
  try {
    await requirePerm(userId, conn.workspaceId, "sso.configure");
  } catch (e) {
    if (e instanceof PermissionDeniedError)
      return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
    throw e;
  }
  return { conn };
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await loadOwned(params.id, userId);
  if ("error" in result) return result.error;

  const body = await req.json().catch(() => ({}));
  const data: any = {};
  if (typeof body.name === "string") data.name = body.name.trim().slice(0, 120);
  if (typeof body.enforced === "boolean") data.enforced = body.enforced;
  if (Array.isArray(body.domains)) data.domains = body.domains.filter(Boolean);
  if (typeof body.defaultRole === "string") data.defaultRole = body.defaultRole;
  if (Object.keys(data).length === 0)
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });

  const updated = await prisma.sSOConnection.update({ where: { id: params.id }, data });
  return NextResponse.json({ connection: updated });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await loadOwned(params.id, userId);
  if ("error" in result) return result.error;
  const conn = result.conn;

  try {
    const { apiController } = await getJackson();
    // Jackson API takes tenant + product; remove all connections for this tenant under this product.
    // Since each workspace is a tenant, this clears the workspace's SSO.
    await apiController.deleteConnections({
      tenant: conn.jacksonTenant,
      product: conn.jacksonProduct,
    } as any);
  } catch {
    // Continue even if Jackson cleanup fails — orphaned Jackson rows are harmless.
  }

  await prisma.sSOConnection.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
