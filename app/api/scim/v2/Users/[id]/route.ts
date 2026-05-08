import { prisma } from "@/lib/prisma";
import { authenticateSCIM, scimError, scimJson } from "@/lib/scimAuth";

function toSCIMUser(user: any, workspaceId: string) {
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

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const auth = await authenticateSCIM(req.headers.get("authorization"));
  if (!auth) return scimError("Unauthorized", 401);

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: { memberships: { where: { workspaceId: auth.workspaceId } } },
  });
  if (!user || user.memberships.length === 0) return scimError("Not found", 404);
  return scimJson(toSCIMUser(user, auth.workspaceId));
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const auth = await authenticateSCIM(req.headers.get("authorization"));
  if (!auth) return scimError("Unauthorized", 401);

  const body = await req.json().catch(() => null);
  if (!body) return scimError("Invalid body", 400);

  const data: any = {};
  if (body.userName) data.email = body.userName.toLowerCase();
  if (body.name?.formatted) data.name = body.name.formatted;
  else if (body.name?.givenName || body.name?.familyName) {
    data.name = [body.name.givenName, body.name.familyName].filter(Boolean).join(" ");
  }

  const user = await prisma.user.update({
    where: { id: params.id },
    data,
    include: { memberships: { where: { workspaceId: auth.workspaceId } } },
  });

  // Active flag — toggle membership
  if (typeof body.active === "boolean") {
    if (body.active) {
      await prisma.workspaceMember.upsert({
        where: { userId_workspaceId: { userId: user.id, workspaceId: auth.workspaceId } },
        create: {
          userId: user.id,
          workspaceId: auth.workspaceId,
          role: auth.defaultRole as any,
        },
        update: {},
      });
    } else {
      await prisma.workspaceMember.deleteMany({
        where: { userId: user.id, workspaceId: auth.workspaceId },
      });
    }
  }

  const fresh = await prisma.user.findUniqueOrThrow({
    where: { id: user.id },
    include: { memberships: { where: { workspaceId: auth.workspaceId } } },
  });
  return scimJson(toSCIMUser(fresh, auth.workspaceId));
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  // Many IdPs send PATCH with a list of operations. We support the common
  // Replace operation on `active`, `name`, `userName`.
  const auth = await authenticateSCIM(req.headers.get("authorization"));
  if (!auth) return scimError("Unauthorized", 401);

  const body = await req.json().catch(() => null);
  const ops: any[] = body?.Operations ?? [];

  for (const op of ops) {
    const path = op.path?.toLowerCase();
    const value = op.value;
    if (op.op?.toLowerCase() !== "replace") continue;
    if (path === "active") {
      if (value === false || value === "false" || value?.active === false) {
        await prisma.workspaceMember.deleteMany({
          where: { userId: params.id, workspaceId: auth.workspaceId },
        });
      } else if (value === true || value === "true" || value?.active === true) {
        await prisma.workspaceMember.upsert({
          where: { userId_workspaceId: { userId: params.id, workspaceId: auth.workspaceId } },
          create: {
            userId: params.id,
            workspaceId: auth.workspaceId,
            role: auth.defaultRole as any,
          },
          update: {},
        });
      }
    } else if (!path && value && typeof value === "object") {
      // Microsoft Entra-style: { active: false }
      if (typeof value.active === "boolean") {
        if (value.active) {
          await prisma.workspaceMember.upsert({
            where: { userId_workspaceId: { userId: params.id, workspaceId: auth.workspaceId } },
            create: {
              userId: params.id,
              workspaceId: auth.workspaceId,
              role: auth.defaultRole as any,
            },
            update: {},
          });
        } else {
          await prisma.workspaceMember.deleteMany({
            where: { userId: params.id, workspaceId: auth.workspaceId },
          });
        }
      }
    }
  }

  const fresh = await prisma.user.findUnique({
    where: { id: params.id },
    include: { memberships: { where: { workspaceId: auth.workspaceId } } },
  });
  if (!fresh) return scimError("Not found", 404);
  return scimJson(toSCIMUser(fresh, auth.workspaceId));
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const auth = await authenticateSCIM(req.headers.get("authorization"));
  if (!auth) return scimError("Unauthorized", 401);

  await prisma.workspaceMember.deleteMany({
    where: { userId: params.id, workspaceId: auth.workspaceId },
  });
  return new Response(null, { status: 204 });
}
