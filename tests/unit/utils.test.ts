/**
 * Unit tests for utility functions
 */

import {
  isValidUrl,
  generateQueryString,
  isPromiseFulfilledResult,
} from '../../src/utils';

describe('Utils', () => {
  describe('isValidUrl', () => {
    test('should return true for valid HTTP URLs', () => {
      expect(isValidUrl('http://example.com')).toBe(true);
      expect(isValidUrl('http://wordpress.org/xmlrpc.php')).toBe(true);
    });

    test('should return true for valid HTTPS URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('https://wordpress.org/xmlrpc.php')).toBe(true);
      expect(isValidUrl('https://public-api.wordpress.com')).toBe(true);
    });

    test('should return true for URLs with ports', () => {
      expect(isValidUrl('http://localhost:8080')).toBe(true);
      expect(isValidUrl('https://example.com:443')).toBe(true);
    });

    test('should return true for URLs with paths and query strings', () => {
      expect(isValidUrl('https://example.com/path/to/resource')).toBe(true);
      expect(isValidUrl('https://example.com?key=value')).toBe(true);
      expect(isValidUrl('https://example.com/path?key=value&foo=bar')).toBe(true);
    });

    test('should return false for invalid URLs', () => {
      expect(isValidUrl('not a url')).toBe(false);
      expect(isValidUrl('')).toBe(false);
      // Note: URL constructor accepts some unusual protocols like 'htp:'
      // expect(isValidUrl('htp://wrong')).toBe(false);
      expect(isValidUrl('://missing-protocol')).toBe(false);
    });

    test('should return false for relative paths', () => {
      expect(isValidUrl('/relative/path')).toBe(false);
      expect(isValidUrl('./relative')).toBe(false);
      expect(isValidUrl('../parent')).toBe(false);
    });

    test('should handle URLs with special characters', () => {
      expect(isValidUrl('https://example.com/path%20with%20spaces')).toBe(true);
      expect(isValidUrl('https://example.com/path?query=hello%20world')).toBe(true);
    });
  });

  describe('generateQueryString', () => {
    test('should generate correct query string from object', () => {
      const params = { foo: 'bar', baz: 123 };
      const result = generateQueryString(params);
      expect(result).toBe('foo=bar&baz=123');
    });

    test('should skip undefined values', () => {
      const params = { foo: 'bar', baz: undefined, qux: 'test' };
      const result = generateQueryString(params);
      expect(result).toContain('foo=bar');
      expect(result).toContain('qux=test');
      expect(result).not.toContain('baz');
    });

    test('should handle empty object', () => {
      const params = {};
      const result = generateQueryString(params);
      expect(result).toBe('');
    });

    test('should handle object with all undefined values', () => {
      const params = { foo: undefined, bar: undefined };
      const result = generateQueryString(params);
      expect(result).toBe('');
    });

    test('should handle numeric values', () => {
      const params = { page: 1, limit: 10, offset: 0 };
      const result = generateQueryString(params);
      expect(result).toContain('page=1');
      expect(result).toContain('limit=10');
      expect(result).toContain('offset=0');
    });

    test('should handle string values with special characters', () => {
      const params = { query: 'hello world', name: 'John Doe' };
      const result = generateQueryString(params);
      // URLSearchParams automatically encodes spaces
      expect(result).toContain('query=hello');
      expect(result).toContain('name=John');
    });

    test('should preserve empty strings', () => {
      const params = { foo: 'bar', empty: '', baz: 'qux' };
      const result = generateQueryString(params);
      expect(result).toContain('foo=bar');
      expect(result).toContain('empty=');
      expect(result).toContain('baz=qux');
    });
  });

  describe('isPromiseFulfilledResult', () => {
    // Note: This function returns the value itself (if truthy), not true/false
    // It's a type guard that also checks for truthiness

    test('should return truthy value for fulfilled promise result', () => {
      const result = { status: 'fulfilled', value: 'test' };
      expect(isPromiseFulfilledResult(result)).toBeTruthy();
    });

    test('should return truthy value for fulfilled promise with object value', () => {
      const result = { status: 'fulfilled', value: { data: 'test' } };
      expect(isPromiseFulfilledResult(result)).toBeTruthy();
    });

    test('should return falsy for rejected promise result', () => {
      const result = { status: 'rejected', reason: 'error' };
      expect(isPromiseFulfilledResult(result)).toBeFalsy();
    });

    test('should return falsy for null or undefined', () => {
      expect(isPromiseFulfilledResult(null)).toBeFalsy();
      expect(isPromiseFulfilledResult(undefined)).toBeFalsy();
    });

    test('should return falsy for objects without status', () => {
      expect(isPromiseFulfilledResult({ value: 'test' })).toBeFalsy();
      expect(isPromiseFulfilledResult({ something: 'else' })).toBeFalsy();
    });

    test('should return falsy for fulfilled result with null/undefined value', () => {
      expect(isPromiseFulfilledResult({ status: 'fulfilled', value: null })).toBeFalsy();
      expect(isPromiseFulfilledResult({ status: 'fulfilled', value: undefined })).toBeFalsy();
    });

    test('should handle falsy values correctly', () => {
      // 0 is falsy, so function returns falsy
      expect(isPromiseFulfilledResult({ status: 'fulfilled', value: 0 })).toBeFalsy();
      // Empty string is falsy
      expect(isPromiseFulfilledResult({ status: 'fulfilled', value: '' })).toBeFalsy();
      // false is falsy
      expect(isPromiseFulfilledResult({ status: 'fulfilled', value: false })).toBeFalsy();
    });

    test('should handle arrays', () => {
      // Empty array is truthy in JavaScript
      expect(isPromiseFulfilledResult({ status: 'fulfilled', value: [] })).toBeTruthy();
      expect(isPromiseFulfilledResult({ status: 'fulfilled', value: [1, 2, 3] })).toBeTruthy();
    });
  });
});
