import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/lib/prisma";
import { requirePerm, PermissionDeniedError } from "@/lib/rbac";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const token = await prisma.sCIMToken.findUnique({ where: { id: params.id } });
  if (!token) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    await requirePerm(userId, token.workspaceId, "scim.tokens.manage");
  } catch (e) {
    if (e instanceof PermissionDeniedError)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    throw e;
  }

  await prisma.sCIMToken.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
