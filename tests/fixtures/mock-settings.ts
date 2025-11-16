/**
 * Mock settings and profiles for testing
 */

import { WordpressPluginSettings, ApiType, MathJaxOutputType, CommentConvertMode } from '../../src/plugin-settings';
import { WpProfile } from '../../src/wp-profile';
import { PostStatus, CommentStatus } from '../../src/wp-api';
import { WordPressOAuth2Token } from '../../src/oauth2-client';

export const MOCK_PROFILE_XMLRPC: WpProfile = {
  name: 'Test XML-RPC Profile',
  apiType: ApiType.XML_RPC,
  endpoint: 'https://example.com/xmlrpc.php',
  username: 'testuser',
  password: undefined,
  encryptedPassword: undefined,
  saveUsername: true,
  savePassword: false,
  isDefault: true,
  lastSelectedCategories: [],
};

export const MOCK_PROFILE_REST: WpProfile = {
  name: 'Test REST Profile',
  apiType: ApiType.RestApi_ApplicationPasswords,
  endpoint: 'https://example.com/wp-json',
  username: 'restuser',
  password: undefined,
  encryptedPassword: undefined,
  saveUsername: true,
  savePassword: false,
  isDefault: false,
  lastSelectedCategories: [],
};

export const MOCK_PROFILE_OAUTH: WpProfile = {
  name: 'Test OAuth Profile',
  apiType: ApiType.RestApi_WpComOAuth2,
  endpoint: 'https://public-api.wordpress.com',
  username: undefined,
  password: undefined,
  // Mock OAuth2 token - in real usage this would be a WordPressOAuth2Token object
  wpComOAuth2Token: 'mock-oauth-token-12345' as unknown as WordPressOAuth2Token,
  saveUsername: false,
  savePassword: false,
  isDefault: false,
  lastSelectedCategories: [],
};

export const MOCK_PROFILE_WITH_SAVED_PASSWORD: WpProfile = {
  name: 'Profile with Saved Password',
  apiType: ApiType.XML_RPC,
  endpoint: 'https://secure.example.com/xmlrpc.php',
  username: 'secureuser',
  password: undefined,
  encryptedPassword: {
    encrypted: 'encrypted-password-data',
    key: 'encryption-key-data',
    vector: 'encryption-vector-data',
  },
  saveUsername: true,
  savePassword: true,
  isDefault: false,
  lastSelectedCategories: [1, 5, 10],
};

export const MOCK_SETTINGS_DEFAULT: WordpressPluginSettings = {
  version: undefined,
  profiles: [],
  showRibbonIcon: true,
  lang: 'en',
  mathJaxOutputType: MathJaxOutputType.SVG,
  commentConvertMode: CommentConvertMode.Ignore,
  defaultPostStatus: PostStatus.Draft,
  defaultCommentStatus: CommentStatus.Open,
  rememberLastSelectedCategories: true,
  showWordPressEditConfirm: true,
  enableHtml: false,
  uploadRawMarkdown: false,
  replaceMediaLinks: true,
};

export const MOCK_SETTINGS_WITH_PROFILES: WordpressPluginSettings = {
  version: undefined,
  profiles: [MOCK_PROFILE_XMLRPC, MOCK_PROFILE_REST, MOCK_PROFILE_OAUTH],
  showRibbonIcon: true,
  lang: 'en',
  mathJaxOutputType: MathJaxOutputType.SVG,
  commentConvertMode: CommentConvertMode.Ignore,
  defaultPostStatus: PostStatus.Publish,
  defaultCommentStatus: CommentStatus.Closed,
  rememberLastSelectedCategories: true,
  showWordPressEditConfirm: false,
  enableHtml: true,
  uploadRawMarkdown: false,
  replaceMediaLinks: true,
};

export const MOCK_SETTINGS_MINIMAL: WordpressPluginSettings = {
  version: undefined,
  profiles: [MOCK_PROFILE_XMLRPC],
  showRibbonIcon: false,
  lang: 'zh_cn',
  mathJaxOutputType: MathJaxOutputType.TeX,
  commentConvertMode: CommentConvertMode.HTML,
  defaultPostStatus: PostStatus.Draft,
  defaultCommentStatus: CommentStatus.Open,
  rememberLastSelectedCategories: false,
  showWordPressEditConfirm: false,
  enableHtml: false,
  uploadRawMarkdown: true,
  replaceMediaLinks: false,
};
