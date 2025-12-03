const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

(async () => {
  const users = [
    { id: 'user-1', name: 'Alex Rivera', email: 'alex@demo.com', plan: 'free' },
    { id: 'user-2', name: 'Maya Patel', email: 'maya@demo.com', plan: 'pro' }
  ];
  for (const u of users) {
    await p.user.upsert({
      where: { email: u.email },
      update: {},
      create: { ...u, passwordHash: await bcrypt.hash('demo', 10) }
    });
  }
  console.log('Seeded demo users');
  await p.$disconnect();
})().catch(async (e) => {
  console.error(e);
  await p.$disconnect();
  process.exit(1);
});
