# Type Definitions

This document describes the core TypeScript types used throughout the plugin.

## WordPress API Types

### PostStatus

```typescript
type PostStatus = 'publish' | 'future' | 'draft' | 'pending' | 'private';
```

Post publication status:
- `publish` - Published and visible
- `future` - Scheduled for future publication
- `draft` - Draft, not published
- `pending` - Pending review
- `private` - Published but only visible to authenticated users

### CommentStatus

```typescript
type CommentStatus = 'open' | 'closed';
```

Comment settings for a post:
- `open` - Comments are enabled
- `closed` - Comments are disabled

### PostType

```typescript
const PostTypeConst = {
  POST: 'post',
  PAGE: 'page'
} as const;

type PostType = typeof PostTypeConst[keyof typeof PostTypeConst];
```

WordPress post types:
- `post` - Standard blog post
- `page` - Static page

## Profile Types

### ApiType

```typescript
enum ApiType {
  REST = 'rest',
  XMLRPC = 'xmlrpc'
}
```

Supported WordPress API protocols:
- `REST` - WordPress REST API (recommended)
- `XMLRPC` - WordPress XML-RPC API (legacy)

### WpProfile

```typescript
interface WpProfile {
  /** Unique profile name */
  name: string;

  /** API protocol type */
  apiType: ApiType;

  /** WordPress site URL */
  endpoint: string;

  /** Username for authentication (optional for OAuth2) */
  username?: string;

  /** Encrypted password (for basic auth or XML-RPC) */
  password?: string;

  /** WordPress application password (REST API) */
  applicationPassword?: string;

  /** OAuth2 token (WordPress.com sites) */
  oauth2Token?: WordPressOAuth2Token;

  /** Default post type when publishing */
  postType?: string;
}
```

### WordPressOAuth2Token

```typescript
interface WordPressOAuth2Token {
  /** OAuth2 access token */
  access_token: string;

  /** Token type (usually 'Bearer') */
  token_type: string;

  /** Blog ID for WordPress.com */
  blog_id: string;

  /** Blog URL */
  blog_url: string;

  /** Token scope */
  scope: string;
}
```

## Post Parameters

### WordPressPostParams

```typescript
interface WordPressPostParams {
  /** Post title */
  title: string;

  /** Post content (HTML) */
  content: string;

  /** Publication status */
  status?: PostStatus;

  /** Comment status */
  commentStatus?: CommentStatus;

  /** Category IDs or names */
  categories?: number[] | string[];

  /** Tag IDs or names */
  tags?: number[] | string[];

  /** Featured image media ID */
  featuredMedia?: number;

  /** Publication date (ISO 8601 format) */
  date?: string;

  /** Post ID (for updates) */
  postId?: number;

  /** Post type */
  postType?: string;

  /** Excerpt/summary */
  excerpt?: string;

  /** Post slug/permalink */
  slug?: string;
}
```

## Response Types

### WpResponse

```typescript
interface WpResponse {
  /** Response data */
  data: {
    /** Post ID */
    id: number;

    /** Post URL */
    url?: string;

    /** Additional fields */
    [key: string]: unknown;
  };

  /** Response status code */
  status: number;

  /** Response status text */
  statusText: string;
}
```

### MediaObject

```typescript
interface MediaObject {
  /** File name */
  name: string;

  /** MIME type */
  type: string;

  /** Binary file data */
  bits: ArrayBuffer;

  /** Whether this is a featured image */
  isFeaturedImage?: boolean;
}
```

## Settings Types

### WordpressPluginSettings

```typescript
interface WordpressPluginSettings {
  /** Settings schema version */
  version: SettingsVersion;

  /** Saved profiles */
  profiles: WpProfile[];

  /** Default profile name */
  defaultProfile?: string;

  /** UI language */
  lang?: string;

  /** Show ribbon icon in sidebar */
  showRibbon?: boolean;
}
```

### SettingsVersion

```typescript
enum SettingsVersion {
  /** Initial version */
  V0 = 0,

  /** Current version */
  V1 = 1
}
```

## Client Interface

### WpClient

```typescript
interface WpClient {
  /** Plugin instance */
  plugin: WordpressPlugin;

  /** Profile configuration */
  profile: WpProfile;

  /**
   * Publish a post to WordPress
   * @param params Post parameters
   * @returns Promise with post data
   */
  publishPost(params: WordPressPostParams): Promise<WpResponse>;

  /**
   * Upload media file to WordPress
   * @param media Media file data
   * @returns Promise with media data
   */
  uploadMedia(media: MediaObject): Promise<WpResponse>;
}
```

## Encryption Types

### EncryptedData

```typescript
interface EncryptedData {
  /** Encrypted content */
  encrypted: string;

  /** Initialization vector (IV) for AES-GCM */
  iv?: string;
}
```

## Image Processing Types

### ImageInfo

```typescript
interface ImageInfo {
  /** Original markdown image syntax */
  original: string;

  /** Image source path */
  src: string;

  /** Image width (if specified) */
  width?: number;

  /** Image height (if specified) */
  height?: number;

  /** Image alt text */
  alt?: string;
}
```

## Event Types

### EventType

```typescript
enum EventType {
  /** Fired when OAuth2 token is received */
  OAUTH2_TOKEN_GOT = 'oauth2-token-got'
}
```

## Utility Types

### SafeAny

```typescript
type SafeAny = any; // eslint-disable-line @typescript-eslint/no-explicit-any
```

**Note**: This type is used for backward compatibility but should be avoided in new code. Use proper types instead.

## Type Guards

### isWpProfile

```typescript
function isWpProfile(obj: unknown): obj is WpProfile {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'name' in obj &&
    'apiType' in obj &&
    'endpoint' in obj
  );
}
```

### isWordPressOAuth2Token

```typescript
function isWordPressOAuth2Token(obj: unknown): obj is WordPressOAuth2Token {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'access_token' in obj &&
    'token_type' in obj &&
    'blog_id' in obj
  );
}
```

## Examples

### Complete Post Submission

```typescript
const postParams: WordPressPostParams = {
  title: 'My Blog Post',
  content: '<p>This is the content</p>',
  status: 'publish',
  commentStatus: 'open',
  categories: ['Technology', 'Tutorials'],
  tags: ['typescript', 'obsidian'],
  date: new Date().toISOString(),
  postType: 'post'
};

const response: WpResponse = await client.publishPost(postParams);
console.log('Post published:', response.data.url);
```

### Profile Configuration

```typescript
const profile: WpProfile = {
  name: 'My WordPress Blog',
  apiType: ApiType.REST,
  endpoint: 'https://myblog.com',
  username: 'admin',
  applicationPassword: 'xxxx xxxx xxxx xxxx',
  postType: 'post'
};
```

### Media Upload

```typescript
const media: MediaObject = {
  name: 'image.png',
  type: 'image/png',
  bits: arrayBuffer,
  isFeaturedImage: true
};

const mediaResponse: WpResponse = await client.uploadMedia(media);
const mediaId: number = mediaResponse.data.id;
```

## Deprecated Types

These types are deprecated and will be removed in future versions:

### LegacySettings

```typescript
/** @deprecated Use WordpressPluginSettings instead */
interface LegacySettings {
  // Old settings structure
}
```

## Type Conversion Utilities

### toPostStatus

```typescript
function toPostStatus(value: string): PostStatus | undefined {
  const validStatuses: PostStatus[] = ['publish', 'future', 'draft', 'pending', 'private'];
  return validStatuses.includes(value as PostStatus) ? value as PostStatus : undefined;
}
```

### toCommentStatus

```typescript
function toCommentStatus(value: string): CommentStatus | undefined {
  return value === 'open' || value === 'closed' ? value : undefined;
}
```
