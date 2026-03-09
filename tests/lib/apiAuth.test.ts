import { describe, it, expect } from 'vitest';
import { hashApiKey, generateApiKey } from '../../lib/apiAuth';

describe('API Key Authentication', () => {
  describe('generateApiKey', () => {
    it('generates keys with sm_ prefix and 64 hex chars', () => {
      const { key, prefix, hash } = generateApiKey();
      expect(key).toMatch(/^sm_[a-f0-9]{64}$/);
      expect(prefix).toBe(key.slice(0, 10));
      expect(hash).toBeTruthy();
      expect(typeof hash).toBe('string');
    });

    it('generates unique keys each time', () => {
      const a = generateApiKey();
      const b = generateApiKey();
      expect(a.key).not.toBe(b.key);
      expect(a.hash).not.toBe(b.hash);
    });

    it('hash matches hashApiKey of the generated key', () => {
      const { key, hash } = generateApiKey();
      expect(hashApiKey(key)).toBe(hash);
    });
  });

  describe('hashApiKey', () => {
    it('produces a consistent SHA-256 hex hash', () => {
      const hash1 = hashApiKey('test-key');
      const hash2 = hashApiKey('test-key');
      expect(hash1).toBe(hash2);
      expect(hash1).toMatch(/^[a-f0-9]{64}$/);
    });

    it('produces different hashes for different keys', () => {
      const hash1 = hashApiKey('key-1');
      const hash2 = hashApiKey('key-2');
      expect(hash1).not.toBe(hash2);
    });

    it('handles empty string', () => {
      const hash = hashApiKey('');
      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });
  });
});
