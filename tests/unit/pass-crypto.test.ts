/**
 * Unit tests for PassCrypto encryption/decryption
 */

import { PassCrypto } from '../../src/pass-crypto';

describe('PassCrypto', () => {
  let crypto: PassCrypto;

  beforeEach(() => {
    crypto = new PassCrypto();
  });

  describe('canUse', () => {
    test('should return true when crypto API is available', () => {
      // In our test environment with jsdom, crypto should be available
      expect(crypto.canUse()).toBe(true);
    });
  });

  describe('encrypt and decrypt', () => {
    test('should encrypt a simple string', async () => {
      const message = 'my-secret-password';
      const result = await crypto.encrypt(message);

      expect(result.encrypted).toBeTruthy();
      expect(result.encrypted).not.toBe(message);
      expect(typeof result.encrypted).toBe('string');
    });

    test('should provide key and vector when crypto is available', async () => {
      const message = 'test-password';
      const result = await crypto.encrypt(message);

      if (crypto.canUse()) {
        expect(result.key).toBeTruthy();
        expect(result.vector).toBeTruthy();
        expect(typeof result.key).toBe('string');
        expect(typeof result.vector).toBe('string');
      }
    });

    test('should decrypt encrypted message correctly', async () => {
      const message = 'my-secret-password';
      const { encrypted, key, vector } = await crypto.encrypt(message);

      const decrypted = await crypto.decrypt(encrypted, key, vector);
      expect(decrypted).toBe(message);
    });

    test('should handle empty strings', async () => {
      const message = '';
      const { encrypted, key, vector } = await crypto.encrypt(message);

      const decrypted = await crypto.decrypt(encrypted, key, vector);
      expect(decrypted).toBe(message);
    });

    test('should handle strings with special characters', async () => {
      const message = 'p@ssw0rd!@#$%^&*()_+-=[]{}|;:,.<>?';
      const { encrypted, key, vector } = await crypto.encrypt(message);

      const decrypted = await crypto.decrypt(encrypted, key, vector);
      expect(decrypted).toBe(message);
    });

    test('should handle unicode characters', async () => {
      const message = '密码测试🔒🔑';
      const { encrypted, key, vector } = await crypto.encrypt(message);

      const decrypted = await crypto.decrypt(encrypted, key, vector);
      expect(decrypted).toBe(message);
    });

    test('should handle long strings', async () => {
      const message = 'a'.repeat(1000);
      const { encrypted, key, vector } = await crypto.encrypt(message);

      const decrypted = await crypto.decrypt(encrypted, key, vector);
      expect(decrypted).toBe(message);
    });

    test('should produce different encrypted values for same input', async () => {
      const message = 'test-password';
      const result1 = await crypto.encrypt(message);
      const result2 = await crypto.encrypt(message);

      // Because random IV is used, encrypted values should be different
      if (crypto.canUse()) {
        expect(result1.encrypted).not.toBe(result2.encrypted);
        expect(result1.vector).not.toBe(result2.vector);
      }
    });

    test('should handle whitespace in messages', async () => {
      const message = '  password with spaces  ';
      const { encrypted, key, vector } = await crypto.encrypt(message);

      const decrypted = await crypto.decrypt(encrypted, key, vector);
      expect(decrypted).toBe(message);
    });

    test('should handle newlines in messages', async () => {
      const message = 'line1\nline2\nline3';
      const { encrypted, key, vector } = await crypto.encrypt(message);

      const decrypted = await crypto.decrypt(encrypted, key, vector);
      expect(decrypted).toBe(message);
    });
  });

  describe('encryption consistency', () => {
    test('should maintain data integrity through multiple encrypt/decrypt cycles', async () => {
      let message = 'original-password';

      for (let i = 0; i < 5; i++) {
        const { encrypted, key, vector } = await crypto.encrypt(message);
        const decrypted = await crypto.decrypt(encrypted, key, vector);
        expect(decrypted).toBe(message);
        message = decrypted; // Use decrypted as input for next cycle
      }
    });

    test('should fail to decrypt with wrong key', async () => {
      const message = 'secret';
      const { encrypted, vector } = await crypto.encrypt(message);
      const { key: wrongKey } = await crypto.encrypt('different');

      if (crypto.canUse() && vector && wrongKey) {
        // This should throw an error when trying to decrypt with wrong key
        await expect(crypto.decrypt(encrypted, wrongKey, vector)).rejects.toThrow();
      }
    });

    test('should fail to decrypt with wrong vector', async () => {
      const message = 'secret';
      const { encrypted, key } = await crypto.encrypt(message);
      const { vector: wrongVector } = await crypto.encrypt('different');

      if (crypto.canUse() && key && wrongVector) {
        // This should throw an error when trying to decrypt with wrong vector
        await expect(crypto.decrypt(encrypted, key, wrongVector)).rejects.toThrow();
      }
    });
  });

  describe('fallback encryption', () => {
    test('should use fallback when crypto is not available', async () => {
      // Mock canUse to return false
      jest.spyOn(crypto, 'canUse').mockReturnValue(false);

      const message = 'test-password';
      const { encrypted, key, vector } = await crypto.encrypt(message);

      // Fallback doesn't use key/vector
      expect(key).toBeUndefined();
      expect(vector).toBeUndefined();
      expect(encrypted).toBeTruthy();

      // Should still be able to decrypt
      const decrypted = await crypto.decrypt(encrypted);
      expect(decrypted).toBe(message);
    });
  });
});
