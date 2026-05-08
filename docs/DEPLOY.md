# SwayMaps Deployment Runbook

This is the single source of truth for getting SwayMaps from a clean checkout to a running production deployment. Every blocker we hit during dev is captured here.

---

## 1. Prerequisites

- **Node.js** 20.x or later
- **PostgreSQL** 14+
- **Domain** with HTTPS terminator (Cloudflare, fly.io, Vercel, etc.)
- Optional: an Anthropic API key, an SMTP provider (Resend), a Stripe account

---

## 2. Database setup

### 2a. Create the database

```sql
CREATE DATABASE swaymaps;
CREATE USER swaymaps_app WITH ENCRYPTED PASSWORD '<strong-random-password>';
```

### 2b. Grant the **schema-create** privileges (load-bearing)

The app and the BoxyHQ Jackson SSO library both need to create tables in the `public` schema. The default Postgres setup denies this. **You must run these grants as the database owner (or a superuser), not as the app user.**

```sql
GRANT CREATE, USAGE ON SCHEMA public TO swaymaps_app;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO swaymaps_app;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO swaymaps_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO swaymaps_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO swaymaps_app;
```

**Symptom if you skip this:**
- `prisma migrate deploy` fails with `permission denied for schema public` (P3018).
- SSO admin actions return 503 with the message: *"the database user lacks CREATE permission on the public schema"*. The app self-diagnoses this case via `JacksonNotConfiguredError` — you will see the actionable message in `toast.error` rather than a generic 500.

---

## 3. Environment variables

Set these on the host. We ship a strict env validator (`lib/env.ts`) that fails fast at startup if any required variable is missing or malformed.

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | yes | `postgresql://swaymaps_app:<pw>@host:5432/swaymaps` |
| `NEXTAUTH_URL` | yes | Public origin, e.g. `https://swaymaps.com`. Used for SAML redirect URIs. |
| `NEXTAUTH_SECRET` | yes | Random 32+ bytes. Generate: `openssl rand -hex 32` |
| `MCP_ENCRYPTION_KEY` | yes if MCP is in use | 32 bytes hex (64 chars). Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `ANTHROPIC_API_KEY` | optional | Without it the Sidekick UI shows a clear "not configured" banner. |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | optional | Enables Google OAuth. |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | optional | Enables GitHub OAuth. |
| `STRIPE_SECRET_KEY` | optional | Required only if billing flows are exercised. |
| `RESEND_API_KEY` | optional | Required for transactional email (welcome, invite, etc.). |
| `SAML_AUDIENCE` | optional | Defaults to `https://saml.swaymaps.com`. |

### Generating the encryption key

`MCP_ENCRYPTION_KEY` is used to encrypt MCP server auth tokens at rest (AES-256-GCM). The app **refuses** to store a plaintext token — adding an MCP token without the key set returns 503 with a clear error.

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Treat this like a database password: never commit, rotate via re-encrypting all stored tokens (see [scripts/encrypt-mcp-tokens.ts](../scripts/encrypt-mcp-tokens.ts) for the rotation pattern).

---

## 4. Apply migrations

```bash
npx prisma migrate deploy
```

There is one consolidated `init` migration (`prisma/migrations/20260515_init`) that creates the entire schema (32 tables, 5 enums) from empty.

### If you are migrating an **existing** SwayMaps deployment

The legacy SQLite-era migrations (archived in `prisma/_archived_migrations/`) targeted a SQLite schema that never matched Postgres. If your existing production database has the original 21-table schema applied via some other path, you'll need to baseline it before applying the new init:

1. **Inspect the existing schema** to confirm it matches the 21-table baseline (see "Schema state matrix" at the bottom of this doc).
2. **Apply the deltas only** — manually port the relevant ALTER/CREATE statements from the archived migrations 20260508–20260514 into a single transitional migration. (Reach out to the team for a tested upgrade script before doing this on production data.)

For a fresh deploy you can skip this section.

---

## 5. Backfill MCP tokens (only if migrating from a pre-encryption deployment)

If you previously ran SwayMaps with plaintext MCP tokens and are now adding `MCP_ENCRYPTION_KEY` for the first time, run the idempotent backfill:

```bash
MCP_ENCRYPTION_KEY=<your-key> npx tsx scripts/encrypt-mcp-tokens.ts
```

Re-run safely — already-encrypted rows are skipped.

---

## 6. Build & start

```bash
npm ci
npx prisma generate
npm run build
npm run start
```

Default port is `3000`. Override with `PORT=3001` env var.

For Vercel/Fly/Render, the standard Next.js build flow applies. Make sure migrations run as a build step (Prisma postinstall + `prisma migrate deploy` in your CI/deploy script).

---

## 7. Verification checklist

After the app is running, verify each surface:

### Public
- [ ] `GET /` → 200, hero "The visual workspace for systems, ideas, and teams"
- [ ] `GET /pricing` → 200, four tiers
- [ ] `GET /trust`, `/security` → 200 (these were briefly broken behind auth in dev — fix shipped)
- [ ] `GET /docs/getting-started` → 200, sticky-TOC sidebar
- [ ] `GET /sitemap.xml`, `/robots.txt` → 200

### Auth
- [ ] Sign up at `/auth/signup` — should auto-create a workspace
- [ ] Sign in at `/auth/signin`
- [ ] OAuth providers (if configured) work end-to-end

### Editor
- [ ] `/app` loads, sidebar shows the auto-created workspace
- [ ] "+ New map" opens the format picker with 7 cards
- [ ] Create one of each map type — all 7 editors load (DEPENDENCY, WHITEBOARD, MINDMAP, FLOWCHART, KANBAN, ORGCHART, PRODUCTFLOW)
- [ ] Whiteboard auto-saves: drop a sticky, refresh, sticky persists
- [ ] Folders: create folder, drag map into it
- [ ] Right-click a node → "Ask Sidekick about this node" opens panel pre-loaded

### Settings (each settings page should load with workspace dropdown populated)
- [ ] `/app/settings/audit` — see the events from your map/folder activity above
- [ ] `/app/settings/sso` — workspace dropdown populated, SP metadata link works
- [ ] `/app/settings/scim` — workspace dropdown populated
- [ ] `/app/settings/mcp` — workspace dropdown populated
  - Try to add an MCP server without `MCP_ENCRYPTION_KEY` set → should 503 with actionable message (working as designed)

### Sidekick (optional — requires `ANTHROPIC_API_KEY`)
- [ ] Hit ⌘J → palette opens
- [ ] Hit ⌘⇧J → workspace-scoped Sidekick opens directly
- [ ] Send "what are the most-connected nodes?" → tokens stream live
- [ ] If `ANTHROPIC_API_KEY` is unset, panel shows a yellow "not configured" banner instead of 503-ing on send

---

## 8. Common deployment failures

| Symptom | Cause | Fix |
|---|---|---|
| `permission denied for schema public` | DB user lacks CREATE on `public` schema | Section 2b grants |
| `prisma migrate deploy` reports failed migration | A prior migration was marked failed | `npx prisma migrate resolve --rolled-back <name>` |
| `/trust` or `/security` redirects to `/auth/signin` | Public-route allowlist in middleware out of date | Already fixed; check `middleware.ts` |
| Settings page workspace dropdown is empty | `GET /api/workspaces` was previously 404 | Already fixed; route handler exists |
| MCP "add server" returns 503 | `MCP_ENCRYPTION_KEY` not set | Section 3 — generate and set the key |
| Sidekick send returns 503 with "not configured" | `ANTHROPIC_API_KEY` not set | Section 3 — set the key |
| `JacksonNotConfiguredError: permission ...` from `/api/sso/*` | DB user lacks CREATE on `public` schema (Jackson tries to create `jackson_store`) | Section 2b grants |

---

## 9. Schema state matrix

The app expects this schema at runtime. After `prisma migrate deploy` you should have:

- 32 base tables
- 5 enums: `WorkspaceRole`, `FolderPermission`, `MapType`, `SidekickRole`, `SidekickAttachmentKind`
- All foreign keys + indexes from `prisma/schema.prisma`

Verify with:
```sql
SELECT count(*) FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE';
-- Expect: 32
SELECT count(*) FROM pg_type t JOIN pg_namespace n ON t.typnamespace = n.oid
WHERE n.nspname='public' AND t.typtype='e';
-- Expect: 5
```

If the counts don't match, do not start the app — open the Prisma migration log and resolve before continuing. Running with a half-applied schema produces obscure 500s.
