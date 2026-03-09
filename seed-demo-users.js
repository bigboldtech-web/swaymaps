const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

(async () => {
  const users = [
    { id: 'user-1', name: 'Alex Rivera', email: 'alex@demo.com', plan: 'free' },
    { id: 'user-2', name: 'Maya Patel', email: 'maya@demo.com', plan: 'pro' }
  ];
  for (const u of users) {
    const user = await p.user.upsert({
      where: { email: u.email },
      update: {},
      create: { ...u, passwordHash: await bcrypt.hash('demo', 10) }
    });

    // Ensure workspace + owner membership exists
    const existing = await p.workspace.findFirst({
      where: { ownerId: user.id }
    });
    if (!existing) {
      await p.workspace.create({
        data: {
          name: `${u.name}'s Workspace`,
          ownerId: user.id,
          members: {
            create: {
              userId: user.id,
              role: 'owner'
            }
          }
        }
      });
      console.log(`Created workspace for ${u.email}`);
    }
  }
  console.log('Seeded demo users');
  await p.$disconnect();
})().catch(async (e) => {
  console.error(e);
  await p.$disconnect();
  process.exit(1);
});
