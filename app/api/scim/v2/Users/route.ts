import { prisma } from "@/lib/prisma";
import { authenticateSCIM, scimError, scimJson } from "@/lib/scimAuth";
import bcrypt from "bcryptjs";
import crypto from "crypto";

interface SCIMUser {
  schemas: string[];
  id: string;
  userName: string;
  externalId?: string;
  active: boolean;
  emails: Array<{ value: string; primary?: boolean }>;
  name?: { givenName?: string; familyName?: string; formatted?: string };
  meta: { resourceType: string; created: string; lastModified: string };
}

function toSCIMUser(user: any, workspaceId: string): SCIMUser {
  return {
    schemas: ["urn:ietf:params:scim:schemas:core:2.0:User"],
    id: user.id,
    userName: user.email,
    externalId: user.email,
    active: !!user.memberships?.find((m: any) => m.workspaceId === workspaceId),
    emails: [{ value: user.email, primary: true }],
    name: { formatted: user.name },
    meta: {
      resourceType: "User",
      created: user.createdAt.toISOString(),
      lastModified: user.updatedAt.toISOString(),
    },
  };
}

/**
 * GET /api/scim/v2/Users — list with filter/pagination.
 */
export async function GET(req: Request) {
  const auth = await authenticateSCIM(req.headers.get("authorization"));
  if (!auth) return scimError("Unauthorized", 401);

  const url = new URL(req.url);
  const filter = url.searchParams.get("filter") ?? undefined;
  const startIndex = parseInt(url.searchParams.get("startIndex") ?? "1", 10);
  const count = Math.min(parseInt(url.searchParams.get("count") ?? "100", 10), 500);

  const where: any = {
    memberships: { some: { workspaceId: auth.workspaceId } },
  };
  // Support: filter=userName eq "alice@acme.com"
  if (filter) {
    const m = filter.match(/userName\s+eq\s+"([^"]+)"/i);
    if (m) where.email = m[1].toLowerCase();
  }

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      include: { memberships: { where: { workspaceId: auth.workspaceId } } },
      skip: Math.max(startIndex - 1, 0),
      take: count,
      orderBy: { createdAt: "asc" },
    }),
  ]);

  return scimJson({
    schemas: ["urn:ietf:params:scim:api:messages:2.0:ListResponse"],
    totalResults: total,
    startIndex,
    itemsPerPage: users.length,
    Resources: users.map((u) => toSCIMUser(u, auth.workspaceId)),
  });
}

/**
 * POST /api/scim/v2/Users — create (or attach existing) and add to workspace.
 */
export async function POST(req: Request) {
  const auth = await authenticateSCIM(req.headers.get("authorization"));
  if (!auth) return scimError("Unauthorized", 401);

  const body = await req.json().catch(() => null);
  if (!body) return scimError("Invalid body", 400);

  const email = (body.userName ?? body.emails?.[0]?.value ?? "").toLowerCase();
  if (!email) return scimError("userName required", 400);

  const name =
    body.name?.formatted ??
    [body.name?.givenName, body.name?.familyName].filter(Boolean).join(" ") ??
    email.split("@")[0];

  // Idempotent upsert
  const user = await prisma.user.upsert({
    where: { email },
    update: { name },
    create: {
      email,
      name,
      // SCIM-provisioned users get a random password they can't log in with;
      // they sign in via SSO.
      passwordHash: await bcrypt.hash(crypto.randomBytes(24).toString("hex"), 10),
      plan: "free",
    },
  });

  await prisma.workspaceMember.upsert({
    where: { userId_workspaceId: { userId: user.id, workspaceId: auth.workspaceId } },
    create: {
      userId: user.id,
      workspaceId: auth.workspaceId,
      role: auth.defaultRole as any,
    },
    update: {},
  });

  const fullUser = await prisma.user.findUniqueOrThrow({
    where: { id: user.id },
    include: { memberships: { where: { workspaceId: auth.workspaceId } } },
  });

  return scimJson(toSCIMUser(fullUser, auth.workspaceId), 201);
}
