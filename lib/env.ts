/**
 * Strict environment validation for SwayMaps.
 *
 * Imported at the top of the auth module so Node fails fast on startup if
 * a required variable is missing — beats discovering it via a 500 the first
 * time a user tries to sign in.
 *
 * Optional variables produce a one-time console warning the first time they
 * matter (e.g. ANTHROPIC_API_KEY only matters when the Sidekick is hit).
 *
 * Usage:
 *   import { ensureRequiredEnv } from "@/lib/env";
 *   ensureRequiredEnv();
 */

const REQUIRED = [
  {
    key: "DATABASE_URL",
    validate: (v: string) => /^postgres(ql)?:\/\//.test(v) || "must start with postgresql://",
  },
  {
    key: "NEXTAUTH_SECRET",
    validate: (v: string) =>
      v.length >= 32 ||
      "must be at least 32 characters (generate with: openssl rand -hex 32)",
  },
];

const PRODUCTION_REQUIRED = [
  {
    key: "NEXTAUTH_URL",
    validate: (v: string) => /^https?:\/\//.test(v) || "must start with http:// or https://",
  },
];

const OPTIONAL_WITH_FORMAT = [
  {
    key: "MCP_ENCRYPTION_KEY",
    validate: (v: string) =>
      /^[0-9a-fA-F]{64}$/.test(v) ||
      "must be 64 hex characters (32 bytes). Generate: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"",
  },
];

let _validated = false;

export function ensureRequiredEnv(): void {
  if (_validated) return;
  _validated = true;

  const errors: string[] = [];
  const warnings: string[] = [];

  for (const { key, validate } of REQUIRED) {
    const v = process.env[key];
    if (!v) {
      errors.push(`Missing required env var: ${key}`);
      continue;
    }
    const ok = validate(v);
    if (ok !== true) errors.push(`${key} ${ok}`);
  }

  if (process.env.NODE_ENV === "production") {
    for (const { key, validate } of PRODUCTION_REQUIRED) {
      const v = process.env[key];
      if (!v) {
        errors.push(`Missing required env var (production): ${key}`);
        continue;
      }
      const ok = validate(v);
      if (ok !== true) errors.push(`${key} ${ok}`);
    }
  }

  for (const { key, validate } of OPTIONAL_WITH_FORMAT) {
    const v = process.env[key];
    if (!v) continue;
    const ok = validate(v);
    if (ok !== true) errors.push(`${key} ${ok}`);
  }

  // Soft warnings for optional features that produce clear in-app errors anyway
  if (!process.env.ANTHROPIC_API_KEY) {
    warnings.push("ANTHROPIC_API_KEY not set — Sidekick will show a 'not configured' banner.");
  }
  if (!process.env.MCP_ENCRYPTION_KEY) {
    warnings.push(
      "MCP_ENCRYPTION_KEY not set — MCP server tokens cannot be added until you set this."
    );
  }

  if (warnings.length > 0) {
    console.warn("[swaymaps env]", warnings.join("\n  "));
  }

  if (errors.length > 0) {
    const message =
      "[swaymaps env] startup aborted — fix these before continuing:\n  " +
      errors.join("\n  ") +
      "\n\nSee docs/DEPLOY.md §3 for the full env reference.";
    if (process.env.NODE_ENV === "production") {
      // In production we want to crash loudly so the orchestrator restarts
      // with a clear log line instead of serving 500s.
      throw new Error(message);
    } else {
      console.error(message);
    }
  }
}
