# Testing Guide for Obsidian WordPress Reloaded

This document describes the testing framework and how to write tests for this Obsidian plugin.

## Overview

The testing framework uses:
- **Jest**: Test runner and assertion library
- **ts-jest**: TypeScript support for Jest
- **jsdom**: DOM environment simulation
- **@testing-library**: DOM testing utilities

## Directory Structure

```
tests/
├── unit/              # Unit tests for individual functions/classes
├── integration/       # Integration tests (future)
├── fixtures/          # Test data and mock objects
├── mocks/             # Mock implementations
│   └── obsidian.ts   # Mock Obsidian API
└── setup/             # Test configuration
    ├── jest-setup.ts  # Global test setup
    └── test-utils.ts  # Shared test utilities
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration
```

## Writing Tests

### Unit Test Example

```typescript
import { isValidUrl } from '../../src/utils';

describe('Utils', () => {
  describe('isValidUrl', () => {
    test('should return true for valid URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
    });

    test('should return false for invalid URLs', () => {
      expect(isValidUrl('not a url')).toBe(false);
    });
  });
});
```

### Testing Async Functions

```typescript
import { PassCrypto } from '../../src/pass-crypto';

test('should encrypt and decrypt correctly', async () => {
  const crypto = new PassCrypto();
  const message = 'secret';

  const { encrypted, key, vector } = await crypto.encrypt(message);
  const decrypted = await crypto.decrypt(encrypted, key, vector);

  expect(decrypted).toBe(message);
});
```

### Using Test Utilities

```typescript
import { createMockProfile, createMockSettings } from '../setup/test-utils';

test('should work with mock profile', () => {
  const profile = createMockProfile({
    name: 'Custom Profile',
    endpoint: 'https://custom.com'
  });

  expect(profile.name).toBe('Custom Profile');
});
```

## Mock Obsidian API

The Obsidian API is fully mocked in `tests/mocks/obsidian.ts`. This includes:

- `Plugin` - Base plugin class
- `Modal` - Modal dialogs
- `Notice` - Notifications
- `Setting` - Settings UI
- `TFile` - File objects
- `Vault` - File system operations
- `App` - Main application object
- `Events` - Event system

### Example Usage

```typescript
import { Modal, App } from 'obsidian';
import { createMockApp } from '../mocks/obsidian';

test('should create modal', () => {
  const app = createMockApp();
  const modal = new Modal(app);

  expect(modal.containerEl).toBeDefined();
});
```

## Coverage Goals

| Type | Target Coverage |
|------|----------------|
| Pure functions (utils, crypto) | 90%+ |
| Business logic (clients, API) | 70-80% |
| UI components (modals, settings) | 40-50% |
| Overall project | 60-70% |

## Current Test Coverage

Run `npm run test:coverage` to see detailed coverage report.

Key metrics:
- **pass-crypto.ts**: 97% coverage ✅
- **utils.ts**: 38% coverage (testing core functions)

## Best Practices

### 1. Test File Naming
- Use `.test.ts` suffix
- Match source file name: `utils.ts` → `utils.test.ts`

### 2. Test Organization
- Use `describe` blocks to group related tests
- Use descriptive test names starting with "should"
- One assertion per test (when possible)

### 3. Mock Dependencies
- Use Jest mocks for external dependencies
- Keep mocks simple and focused
- Reset mocks between tests

### 4. Test Data
- Store reusable test data in `fixtures/`
- Use factory functions for creating test objects
- Avoid hardcoding data in tests

### 5. Async Testing
- Always use `async/await` for async tests
- Handle both success and error cases
- Use `expect().rejects` for error testing

## Common Patterns

### Testing with Obsidian Mocks

```typescript
import { TFile } from 'obsidian';
import { mockApp } from '../mocks/obsidian';

test('should read file', async () => {
  const file = new TFile('test.md');
  mockApp.vault.read = jest.fn().mockResolvedValue('file content');

  const content = await mockApp.vault.read(file);
  expect(content).toBe('file content');
});
```

### Testing Error Conditions

```typescript
test('should throw error for invalid input', async () => {
  await expect(someFunction('invalid')).rejects.toThrow('Error message');
});
```

### Testing with Fixtures

```typescript
import { SAMPLE_MARKDOWN_POST } from '../fixtures/sample-posts';

test('should parse frontmatter', () => {
  const result = parseFrontmatter(SAMPLE_MARKDOWN_POST);
  expect(result.title).toBe('Sample Blog Post');
});
```

## Debugging Tests

### Run specific test file
```bash
npx jest tests/unit/utils.test.ts
```

### Run specific test
```bash
npx jest -t "should return true for valid URLs"
```

### Debug in VS Code
Add breakpoints and use the "Jest: Debug" configuration.

## Troubleshooting

### Issue: Tests fail with "Cannot find module 'obsidian'"
**Solution**: The Obsidian API is mocked. Make sure imports use the mocked version.

### Issue: "crypto is not defined"
**Solution**: The crypto API is polyfilled in `jest-setup.ts`. This should work automatically.

### Issue: "lodash-es" import errors
**Solution**: lodash-es is mapped to lodash in Jest config for compatibility.

## Next Steps

To expand test coverage:

1. Add tests for WordPress API clients (`wp-rest-client.ts`, `wp-xml-rpc-client.ts`)
2. Add tests for Markdown parsers
3. Add integration tests for publishing workflow
4. Add tests for settings management
5. Add tests for profile management

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [Obsidian API Reference](https://github.com/obsidianmd/obsidian-api)
