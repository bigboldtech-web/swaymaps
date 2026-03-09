import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { generateApiKey } from "../../../lib/apiAuth";

// List API keys
export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const keys = await prisma.apiKey.findMany({
    where: { userId },
    select: { id: true, name: true, keyPrefix: true, permissions: true, lastUsedAt: true, expiresAt: true, createdAt: true, workspaceId: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(keys);
}

// Create API key
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { name, workspaceId, permissions = "read" } = body ?? {};

  if (!name || !workspaceId) {
    return NextResponse.json({ error: "name and workspaceId required" }, { status: 400 });
  }

  // Verify workspace membership
  const member = await prisma.workspaceMember.findUnique({
    where: { userId_workspaceId: { userId, workspaceId } },
  });
  if (!member) return NextResponse.json({ error: "Not a workspace member" }, { status: 403 });

  const { key, prefix, hash } = generateApiKey();

  const apiKey = await prisma.apiKey.create({
    data: { userId, workspaceId, name, keyHash: hash, keyPrefix: prefix, permissions },
    select: { id: true, name: true, keyPrefix: true, permissions: true, createdAt: true },
  });

  // Return the full key ONLY on creation
  return NextResponse.json({ ...apiKey, key });
}

// Delete API key
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const keyId = searchParams.get("id");
  if (!keyId) return NextResponse.json({ error: "id required" }, { status: 400 });

  await prisma.apiKey.deleteMany({ where: { id: keyId, userId } });
  return NextResponse.json({ ok: true });
}
