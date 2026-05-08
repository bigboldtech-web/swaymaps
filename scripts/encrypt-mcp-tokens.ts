#!/usr/bin/env node
/**
 * One-time backfill: encrypt any plaintext MCP auth tokens that were
 * created before encryption was added.
 *
 * Usage:
 *   MCP_ENCRYPTION_KEY=<64-hex-chars> npx tsx scripts/encrypt-mcp-tokens.ts
 *
 * Safe to re-run — already-encrypted rows are skipped.
 */

import { prisma } from "../lib/prisma";
import { encrypt, isEncrypted, encryptionAvailable } from "../lib/crypto";

async function main() {
  if (!encryptionAvailable()) {
    console.error(
      "MCP_ENCRYPTION_KEY is not set or invalid. Generate one with:\n" +
        '  node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"\n' +
        "Then re-run this script with that key in MCP_ENCRYPTION_KEY."
    );
    process.exit(1);
  }

  const rows = await prisma.mcpServer.findMany({
    where: { authToken: { not: null } },
    select: { id: true, name: true, authToken: true, workspaceId: true },
  });

  let alreadyEncrypted = 0;
  let migrated = 0;
  let failed = 0;

  for (const row of rows) {
    if (!row.authToken) continue;
    if (isEncrypted(row.authToken)) {
      alreadyEncrypted++;
      continue;
    }
    try {
      const enc = encrypt(row.authToken);
      await prisma.mcpServer.update({
        where: { id: row.id },
        data: { authToken: enc },
      });
      migrated++;
      console.log(`✓ ${row.workspaceId}/${row.name} (${row.id})`);
    } catch (e: any) {
      failed++;
      console.error(`✗ ${row.workspaceId}/${row.name} (${row.id}): ${e?.message ?? "unknown"}`);
    }
  }

  console.log("");
  console.log(`Already encrypted: ${alreadyEncrypted}`);
  console.log(`Newly encrypted:   ${migrated}`);
  console.log(`Failed:            ${failed}`);
  await prisma.$disconnect();
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
