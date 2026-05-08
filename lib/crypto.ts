/**
 * Symmetric encryption for at-rest secrets (MCP auth tokens for now).
 *
 * Format:  enc:v1:<base64-iv>:<base64-tag>:<base64-ciphertext>
 *
 * Algorithm: AES-256-GCM with a 12-byte random IV per ciphertext.
 * The key comes from MCP_ENCRYPTION_KEY (32-byte hex, 64 hex chars).
 *
 * If MCP_ENCRYPTION_KEY is not configured, encrypt() throws — we never
 * silently fall back to plaintext for new writes. decrypt() is lenient:
 * a value missing the "enc:v1:" prefix is treated as legacy plaintext
 * and returned as-is, so existing rows keep working until they're rotated.
 */

import crypto from "crypto";

const PREFIX = "enc:v1:";
const KEY_ENV = "MCP_ENCRYPTION_KEY";

let _key: Buffer | null = null;
function getKey(): Buffer {
  if (_key) return _key;
  const raw = process.env[KEY_ENV];
  if (!raw) {
    throw new Error(
      `${KEY_ENV} is not set. Generate one with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
    );
  }
  const cleaned = raw.trim();
  if (!/^[0-9a-fA-F]{64}$/.test(cleaned)) {
    throw new Error(`${KEY_ENV} must be 64 hex characters (32 bytes)`);
  }
  _key = Buffer.from(cleaned, "hex");
  return _key;
}

/**
 * True if the key env var is configured. Use to gate UI hints — never to
 * silently fall back to plaintext.
 */
export function encryptionAvailable(): boolean {
  const raw = process.env[KEY_ENV];
  return !!raw && /^[0-9a-fA-F]{64}$/.test(raw.trim());
}

/**
 * Returns true if `value` is in our encrypted envelope (vs. legacy plaintext).
 */
export function isEncrypted(value: string | null | undefined): boolean {
  return typeof value === "string" && value.startsWith(PREFIX);
}

export function encrypt(plaintext: string): string {
  const key = getKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return [
    PREFIX.slice(0, -1), // "enc:v1"
    iv.toString("base64"),
    tag.toString("base64"),
    ciphertext.toString("base64"),
  ].join(":");
}

/**
 * Decrypt a stored value. Tolerates legacy plaintext (returns it unchanged)
 * so existing rows from before encryption was introduced keep working.
 * Throws on a malformed envelope or auth-tag mismatch.
 */
export function decrypt(stored: string | null | undefined): string | null {
  if (stored == null) return null;
  if (!isEncrypted(stored)) return stored;
  const parts = stored.split(":");
  // Expected: ["enc", "v1", iv, tag, ciphertext]
  if (parts.length !== 5) {
    throw new Error("Malformed encrypted value");
  }
  const [, version, ivB64, tagB64, ctB64] = parts;
  if (version !== "v1") throw new Error(`Unsupported encryption version: ${version}`);
  const key = getKey();
  const iv = Buffer.from(ivB64, "base64");
  const tag = Buffer.from(tagB64, "base64");
  const ciphertext = Buffer.from(ctB64, "base64");
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const plaintext = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]).toString("utf8");
  return plaintext;
}
