/**
 * Mock settings and profiles for testing
 */

import { WordpressPluginSettings } from '../../src/plugin-settings';
import { WpProfile } from '../../src/wp-profile';

export const MOCK_PROFILE_XMLRPC: WpProfile = {
  name: 'Test XML-RPC Profile',
  endpoint: 'https://example.com/xmlrpc.php',
  username: 'testuser',
  password: undefined,
  encryptedPassword: undefined,
  encryptionKey: undefined,
  encryptionVector: undefined,
  saveUsername: true,
  savePassword: false,
  isDefault: true,
  clientType: 'xmlrpc',
};

export const MOCK_PROFILE_REST: WpProfile = {
  name: 'Test REST Profile',
  endpoint: 'https://example.com/wp-json',
  username: 'restuser',
  password: undefined,
  encryptedPassword: undefined,
  encryptionKey: undefined,
  encryptionVector: undefined,
  saveUsername: true,
  savePassword: false,
  isDefault: false,
  clientType: 'rest',
};

export const MOCK_PROFILE_OAUTH: WpProfile = {
  name: 'Test OAuth Profile',
  endpoint: 'https://public-api.wordpress.com',
  username: undefined,
  password: undefined,
  wpComOAuth2Token: 'mock-oauth-token-12345',
  saveUsername: false,
  savePassword: false,
  isDefault: false,
  clientType: 'rest',
};

export const MOCK_PROFILE_WITH_SAVED_PASSWORD: WpProfile = {
  name: 'Profile with Saved Password',
  endpoint: 'https://secure.example.com/xmlrpc.php',
  username: 'secureuser',
  password: undefined,
  encryptedPassword: 'encrypted-password-data',
  encryptionKey: 'encryption-key-data',
  encryptionVector: 'encryption-vector-data',
  saveUsername: true,
  savePassword: true,
  isDefault: false,
  clientType: 'xmlrpc',
};

export const MOCK_SETTINGS_DEFAULT: WordpressPluginSettings = {
  version: 1,
  profiles: [],
  showRibbonIcon: true,
  lang: 'en',
  mathJaxOutputType: 'svg',
  commentConvertMode: 'remove',
};

export const MOCK_SETTINGS_WITH_PROFILES: WordpressPluginSettings = {
  version: 1,
  profiles: [MOCK_PROFILE_XMLRPC, MOCK_PROFILE_REST, MOCK_PROFILE_OAUTH],
  showRibbonIcon: true,
  lang: 'en',
  mathJaxOutputType: 'svg',
  commentConvertMode: 'remove',
};

export const MOCK_SETTINGS_MINIMAL: WordpressPluginSettings = {
  version: 1,
  profiles: [MOCK_PROFILE_XMLRPC],
  showRibbonIcon: false,
  lang: 'zh-cn',
  mathJaxOutputType: 'chtml',
  commentConvertMode: 'keep',
};
