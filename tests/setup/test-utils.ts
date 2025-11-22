/**
 * Test utility functions and helpers
 * Shared utilities for creating mock data and common test operations
 */

import { WpProfile } from '../../src/wp-profile';
import { WordpressPluginSettings } from '../../src/plugin-settings';

/**
 * Create a mock WordPress profile for testing
 */
export function createMockProfile(overrides?: Partial<WpProfile>): WpProfile {
  return {
    name: 'Test Profile',
    endpoint: 'https://test.wordpress.com/xmlrpc.php',
    username: 'testuser',
    saveUsername: true,
    savePassword: false,
    isDefault: true,
    ...overrides,
  } as WpProfile;
}

/**
 * Create mock plugin settings for testing
 */
export function createMockSettings(
  overrides?: Partial<WordpressPluginSettings>
): WordpressPluginSettings {
  return {
    version: 1,
    profiles: [createMockProfile()],
    showRibbonIcon: true,
    ...overrides,
  } as WordpressPluginSettings;
}

/**
 * Wait for a specified amount of time (useful for async tests)
 */
export function waitFor(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Flush all pending promises
 */
export async function flushPromises(): Promise<void> {
  return new Promise((resolve) => setImmediate(resolve));
}

/**
 * Create a mock Markdown file content with frontmatter
 */
export function createMockMarkdownFile(options: {
  title?: string;
  tags?: string[];
  status?: string;
  content?: string;
}): string {
  const { title = 'Test Post', tags = [], status = 'draft', content = 'Test content' } = options;

  const frontmatter = [
    '---',
    `title: ${title}`,
    tags.length > 0 ? `tags: [${tags.join(', ')}]` : '',
    `status: ${status}`,
    '---',
    '',
  ]
    .filter(Boolean)
    .join('\n');

  return `${frontmatter}${content}`;
}

/**
 * Create a mock WordPress API response
 */
export function createMockWordPressResponse(options: {
  postId?: number;
  title?: string;
  link?: string;
  status?: string;
}) {
  const { postId = 123, title = 'Test Post', link = 'https://example.com/post/123', status = 'publish' } = options;

  return {
    id: postId,
    title: { rendered: title },
    link,
    status,
    date: new Date().toISOString(),
    modified: new Date().toISOString(),
  };
}

/**
 * Mock fetch for testing API calls
 */
export function mockFetch(response: any, status = 200): jest.Mock {
  return jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => response,
    text: async () => JSON.stringify(response),
  });
}

/**
 * Create a DOM element for testing
 */
export function createTestElement(tag = 'div'): HTMLElement {
  return document.createElement(tag);
}

/**
 * Simulate user input in a text field
 */
export function simulateInput(element: HTMLInputElement | HTMLTextAreaElement, value: string): void {
  element.value = value;
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
}

/**
 * Simulate button click
 */
export function simulateClick(element: HTMLElement): void {
  element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

/**
 * Get all error messages from console.error calls
 */
export function getConsoleErrors(): string[] {
  if (jest.isMockFunction(console.error)) {
    return (console.error as jest.Mock).mock.calls.map((call) => call[0]);
  }
  return [];
}

/**
 * Clear all console mocks
 */
export function clearConsoleMocks(): void {
  if (jest.isMockFunction(console.error)) {
    (console.error as jest.Mock).mockClear();
  }
  if (jest.isMockFunction(console.warn)) {
    (console.warn as jest.Mock).mockClear();
  }
  if (jest.isMockFunction(console.log)) {
    (console.log as jest.Mock).mockClear();
  }
}
