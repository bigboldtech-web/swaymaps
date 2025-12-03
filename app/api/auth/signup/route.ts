import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/prisma";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { name, email, password } = body ?? {};
  if (!name || !email || !password) {
    return NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) {
    return NextResponse.json({ error: "User already exists." }, { status: 400 });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      passwordHash: hash,
      plan: "free"
    }
  });

  // Create a default workspace and membership for this user as owner
  const workspace = await prisma.workspace.create({
    data: {
      name: `${name}'s Workspace`,
      ownerId: user.id,
      members: {
        create: {
          userId: user.id,
          role: "owner"
        }
      }
    }
  });

  return NextResponse.json({ ok: true, userId: user.id });
}
