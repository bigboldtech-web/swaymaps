import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/lib/prisma";
import { requirePerm, PermissionDeniedError } from "@/lib/rbac";
import { encrypt, encryptionAvailable } from "@/lib/crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function load(id: string, userId: string) {
  const server = await prisma.mcpServer.findUnique({ where: { id } });
  if (!server) return { error: NextResponse.json({ error: "Not found" }, { status: 404 }) };
  try {
    await requirePerm(userId, server.workspaceId, "mcp.servers.manage");
  } catch (e) {
    if (e instanceof PermissionDeniedError)
      return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
    throw e;
  }
  return { server };
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await load(params.id, userId);
  if ("error" in result) return result.error;

  const body = await req.json().catch(() => ({}));
  const data: any = {};
  if (typeof body.label === "string") data.label = body.label.trim().slice(0, 80);
  if (typeof body.url === "string") {
    try {
      new URL(body.url);
    } catch {
      return NextResponse.json({ error: "url is not a valid URL" }, { status: 400 });
    }
    data.url = body.url.trim();
  }
  if (typeof body.enabled === "boolean") data.enabled = body.enabled;
  // authToken: empty string clears, undefined leaves alone, anything else replaces.
  // Encryption is required for any new token write.
  if (body.authToken === "" || body.authToken === null) {
    data.authToken = null;
  } else if (typeof body.authToken === "string") {
    if (!encryptionAvailable()) {
      return NextResponse.json(
        {
          error:
            "MCP_ENCRYPTION_KEY is not configured on the server. Refusing to store the token in plaintext.",
        },
        { status: 503 }
      );
    }
    try {
      data.authToken = encrypt(body.authToken);
    } catch (e: any) {
      return NextResponse.json(
        { error: e?.message ?? "Failed to encrypt auth token" },
        { status: 500 }
      );
    }
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const updated = await prisma.mcpServer.update({
    where: { id: params.id },
    data,
  });

  return NextResponse.json({
    server: {
      id: updated.id,
      name: updated.name,
      label: updated.label,
      url: updated.url,
      enabled: updated.enabled,
      hasAuthToken: !!updated.authToken,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    },
  });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await load(params.id, userId);
  if ("error" in result) return result.error;

  await prisma.mcpServer.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
