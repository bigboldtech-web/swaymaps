import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "bigboldtech@gmail.com";
  const password = process.env.ADMIN_PASSWORD!;
  const name = "Bigbold";

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, isAdmin: true, name, plan: "team" },
    create: { email, name, passwordHash, isAdmin: true, plan: "team" },
  });

  const existingWs = await prisma.workspace.findFirst({ where: { ownerId: user.id } });
  const ws =
    existingWs ??
    (await prisma.workspace.create({
      data: {
        name: "Bigbold",
        ownerId: user.id,
        members: { create: { userId: user.id, role: "OWNER" } },
      },
    }));

  console.log(JSON.stringify({ userId: user.id, email: user.email, isAdmin: user.isAdmin, workspaceId: ws.id }, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
