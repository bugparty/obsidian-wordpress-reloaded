# API Documentation

This directory contains detailed API documentation for the Obsidian WordPress Reloaded plugin.

## Overview

The plugin provides a programmatic interface for publishing Obsidian documents to WordPress. This documentation covers the main classes, interfaces, and utilities available.

## Documentation Structure

- [WordPress Client Interface](./wp-client.md) - Core publishing interface
- [REST API Client](./wp-rest-client.md) - WordPress REST API implementation
- [XML-RPC Client](./wp-xml-rpc-client.md) - WordPress XML-RPC implementation
- [OAuth2 Client](./oauth2-client.md) - OAuth2 authentication
- [Password Crypto](./pass-crypto.md) - Secure password storage
- [Utilities](./utils.md) - Helper functions and utilities
- [Types](./types.md) - TypeScript type definitions

## Quick Start

### Publishing a Post

```typescript
import { createWpClient } from './wp-clients';
import { WordPressPostParams } from './wp-client';

// Create a client
const client = createWpClient(plugin, profile);

// Prepare post parameters
const postParams: WordPressPostParams = {
  title: 'My Post Title',
  content: '<p>HTML content here</p>',
  status: 'publish',
  commentStatus: 'open',
  postType: 'post'
};

// Publish
const result = await client.publishPost(postParams);
console.log('Published post ID:', result.data.id);
```

### Creating a Profile

```typescript
import { WpProfile } from './wp-profile';
import { ApiType } from './plugin-settings';

const profile: WpProfile = {
  name: 'My WordPress Site',
  apiType: ApiType.REST,
  endpoint: 'https://example.com',
  username: 'user',
  password: 'encrypted-password',
  postType: 'post'
};
```

### Encrypting Passwords

```typescript
import { PassCrypto } from './pass-crypto';

const crypto = new PassCrypto();
const encrypted = await crypto.encryptString('my-password');
const decrypted = await crypto.decryptString(encrypted);
```

## Common Interfaces

### WpClient

The main interface for WordPress publishing operations.

```typescript
interface WpClient {
  publishPost(params: WordPressPostParams): Promise<WpResponse>;
  uploadMedia(media: MediaObject): Promise<WpResponse>;
}
```

### WordPressPostParams

Parameters for creating or updating a WordPress post.

```typescript
interface WordPressPostParams {
  title: string;
  content: string;
  status?: PostStatus;
  commentStatus?: CommentStatus;
  categories?: number[] | string[];
  tags?: number[] | string[];
  featuredMedia?: number;
  date?: string;
  postId?: number;
  postType?: string;
}
```

### WpProfile

WordPress site profile configuration.

```typescript
interface WpProfile {
  name: string;
  apiType: ApiType;
  endpoint: string;
  username?: string;
  password?: string;
  applicationPassword?: string;
  oauth2Token?: WordPressOAuth2Token;
  postType?: string;
}
```

## Error Handling

All API methods may throw errors. Always wrap calls in try-catch blocks:

```typescript
try {
  const result = await client.publishPost(postParams);
  new Notice('Published successfully!');
} catch (error) {
  if (error instanceof Error) {
    new Notice(`Error: ${error.message}`);
  }
}
```

## Events

The plugin uses an event system for cross-component communication:

```typescript
import { AppState, EventType } from './app-state';

// Listen for events
const ref = AppState.events.on(EventType.OAUTH2_TOKEN_GOT, (token) => {
  console.log('Received OAuth2 token:', token);
});

// Emit events
AppState.events.trigger(EventType.OAUTH2_TOKEN_GOT, token);

// Cleanup
AppState.events.offref(ref);
```

## Best Practices

1. **Always use createWpClient()** - Don't instantiate clients directly
2. **Encrypt passwords** - Use PassCrypto before storing
3. **Handle errors** - Wrap async calls in try-catch
4. **Clean up events** - Always unregister event listeners
5. **Type safety** - Use TypeScript types for all parameters
6. **Validate input** - Check user input before processing

## Migration Guide

### From Original Plugin

The API is mostly compatible with the original plugin. Key differences:

1. **New Logger utility** - Replace console.log with Logger.log
2. **Improved types** - More strict TypeScript types
3. **Better error handling** - Consistent error propagation
4. **OAuth2 support** - New authentication method

## Support

For issues or questions:
- Check [Architecture Documentation](../../ARCHITECTURE.md)
- Read [Development Guide](../development.md)
- File an issue on [GitHub](https://github.com/bugparty/obsidian-wordpress-reloaded/issues)
