/**
 * Jest setup file - runs before all tests
 * Configure global test environment and polyfills
 */

import '@testing-library/jest-dom';

// Mock crypto API for Node.js environment using built-in crypto
const nodeCrypto = require('crypto').webcrypto || require('crypto');

if (!global.crypto || !global.crypto.subtle) {
  Object.defineProperty(global, 'crypto', {
    value: nodeCrypto,
    writable: true,
    configurable: true
  });
}

// Mock btoa and atob for Node.js environment
// These must match browser behavior exactly for crypto operations
if (typeof global.btoa === 'undefined') {
  global.btoa = (str: string): string => {
    // Convert binary string to base64
    return Buffer.from(str, 'binary').toString('base64');
  };
}

if (typeof global.atob === 'undefined') {
  global.atob = (str: string): string => {
    // Decode from base64 to binary string (not UTF-8!)
    return Buffer.from(str, 'base64').toString('binary');
  };
}

// Mock TextEncoder and TextDecoder
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Suppress console errors in tests (optional - can be removed if you want to see all console output)
// global.console = {
//   ...console,
//   error: jest.fn(),
//   warn: jest.fn(),
// };

// Set up DOM environment
document.body.innerHTML = '<div id="root"></div>';
