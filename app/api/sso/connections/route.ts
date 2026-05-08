import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/lib/prisma";
import { getJackson, JacksonNotConfiguredError } from "@/lib/jackson";
import { requirePerm, PermissionDeniedError } from "@/lib/rbac";
import { logActivity } from "@/lib/activityLog";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /api/sso/connections?workspaceId=...
 * Lists SSO connections for the workspace.
 */
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const workspaceId = url.searchParams.get("workspaceId");
  if (!workspaceId) return NextResponse.json({ error: "workspaceId required" }, { status: 400 });

  try {
    await requirePerm(userId, workspaceId, "sso.read");
  } catch (e) {
    if (e instanceof PermissionDeniedError)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    throw e;
  }

  const connections = await prisma.sSOConnection.findMany({
    where: { workspaceId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ connections });
}

/**
 * POST /api/sso/connections
 * Body: { workspaceId, name, type: 'saml'|'oidc', metadata?: string, metadataUrl?: string,
 *         oidcDiscoveryUrl?, oidcClientId?, oidcClientSecret?,
 *         defaultRole?, enforced?, domains?: string[] }
 *
 * Creates the Jackson tenant connection AND records the SwayMaps-side row.
 */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const {
    workspaceId,
    name,
    type,
    metadata,
    metadataUrl,
    oidcDiscoveryUrl,
    oidcClientId,
    oidcClientSecret,
    defaultRole,
    enforced,
    domains,
  } = body || {};

  if (!workspaceId || !name || !type) {
    return NextResponse.json({ error: "workspaceId, name, type required" }, { status: 400 });
  }
  if (!["saml", "oidc"].includes(type)) {
    return NextResponse.json({ error: "type must be saml or oidc" }, { status: 400 });
  }

  try {
    await requirePerm(userId, workspaceId, "sso.configure");
  } catch (e) {
    if (e instanceof PermissionDeniedError)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    throw e;
  }

  const product = "swaymaps";
  const baseUrl =
    process.env.NEXTAUTH_URL || process.env.APP_URL || "http://localhost:3000";

  try {
    const { apiController } = await getJackson();

    if (type === "saml") {
      if (!metadata && !metadataUrl) {
        return NextResponse.json(
          { error: "Provide metadata XML or metadataUrl" },
          { status: 400 }
        );
      }
      await apiController.createSAMLConnection({
        name,
        encodedRawMetadata: metadata
          ? Buffer.from(metadata).toString("base64")
          : undefined,
        metadataUrl: metadataUrl || undefined,
        defaultRedirectUrl: `${baseUrl}/auth/sso-callback`,
        redirectUrl: [`${baseUrl}/auth/sso-callback`, `${baseUrl}/api/auth/callback/boxyhq-saml`],
        tenant: workspaceId,
        product,
      } as any);
    } else {
      if (!oidcDiscoveryUrl || !oidcClientId || !oidcClientSecret) {
        return NextResponse.json(
          { error: "OIDC requires discoveryUrl, clientId, clientSecret" },
          { status: 400 }
        );
      }
      await apiController.createOIDCConnection({
        name,
        oidcDiscoveryUrl,
        oidcClientId,
        oidcClientSecret,
        defaultRedirectUrl: `${baseUrl}/auth/sso-callback`,
        redirectUrl: [`${baseUrl}/auth/sso-callback`, `${baseUrl}/api/auth/callback/boxyhq-saml`],
        tenant: workspaceId,
        product,
      } as any);
    }

    const conn = await prisma.sSOConnection.create({
      data: {
        workspaceId,
        type,
        name,
        jacksonTenant: workspaceId,
        jacksonProduct: product,
        metadata: metadata ?? metadataUrl ?? null,
        defaultRole: defaultRole ?? "EDITOR",
        enforced: !!enforced,
        domains: Array.isArray(domains) ? domains.filter(Boolean) : [],
      },
    });

    await logActivity({
      workspaceId,
      userId,
      action: "member.role_changed", // closest existing action; refine in next pass
      entityType: "sso_connection",
      entityId: conn.id,
      metadata: { type, name, enforced: !!enforced },
    }).catch(() => {});

    return NextResponse.json({ connection: conn }, { status: 201 });
  } catch (e: any) {
    if (e instanceof JacksonNotConfiguredError) {
      return NextResponse.json({ error: e.message, reason: e.reason }, { status: 503 });
    }
    return NextResponse.json(
      { error: e?.message ?? "Failed to create connection" },
      { status: e?.statusCode ?? 500 }
    );
  }
}
