# Architecture Documentation

This document describes the architecture and design of the Obsidian WordPress Reloaded plugin.

## Table of Contents

- [Overview](#overview)
- [Architecture Diagram](#architecture-diagram)
- [Core Components](#core-components)
- [Data Flow](#data-flow)
- [Plugin Lifecycle](#plugin-lifecycle)
- [Design Patterns](#design-patterns)
- [Authentication Flow](#authentication-flow)

## Overview

The Obsidian WordPress Reloaded plugin is designed as a modular system that enables publishing Obsidian documents to WordPress using multiple protocols (REST API and XML-RPC).

### Key Design Principles

1. **Separation of Concerns**: Each component has a single, well-defined responsibility
2. **Protocol Abstraction**: Common interface for different WordPress API protocols
3. **Type Safety**: TypeScript for compile-time error detection
4. **Extensibility**: Easy to add new features or protocols
5. **Security**: Encrypted password storage and secure authentication

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Obsidian Plugin API                       │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                   WordpressPlugin (main.ts)                  │
│  - Plugin lifecycle management                               │
│  - Command registration                                      │
│  - Settings management                                       │
└───────────┬──────────────────────────┬──────────────────────┘
            │                          │
┌───────────▼───────────┐  ┌──────────▼───────────────────────┐
│   UI Components       │  │   Core Services                  │
├───────────────────────┤  ├──────────────────────────────────┤
│ - WpPublishModal      │  │ - WpClients (Factory)            │
│ - WpProfileModal      │  │ - PassCrypto                     │
│ - WpLoginModal        │  │ - I18n                           │
│ - ProfileChooserModal │  │ - AppState                       │
│ - SettingTab          │  │ - Logger                         │
└───────────┬───────────┘  └──────────┬───────────────────────┘
            │                         │
            │              ┌──────────▼───────────────────────┐
            │              │   WpClient (Abstract Interface)  │
            │              └──────────┬───────────────────────┘
            │                         │
            │              ┌──────────┴───────────────────────┐
            │              │                                  │
            │    ┌─────────▼─────────┐          ┌───────────▼──────────┐
            │    │  WpRestClient      │          │  WpXmlRpcClient      │
            │    ├────────────────────┤          ├──────────────────────┤
            │    │ - REST API impl    │          │ - XML-RPC impl       │
            │    │ - OAuth2 support   │          │ - Basic auth         │
            │    └─────────┬──────────┘          └───────────┬──────────┘
            │              │                                  │
            └──────────────┼──────────────────────────────────┘
                           │
              ┌────────────▼─────────────┐
              │  WordPress API           │
              │  (REST / XML-RPC)        │
              └──────────────────────────┘
```

## Core Components

### 1. Plugin Entry Point

**File**: `src/main.ts`

The main plugin class that extends Obsidian's `Plugin` base class.

**Responsibilities**:
- Initialize plugin settings
- Register commands (Publish, Manage Profiles, etc.)
- Set up protocol handlers (OAuth2 redirect)
- Manage plugin lifecycle (load/unload)
- Create UI ribbons and modals

**Key Methods**:
- `onload()`: Plugin initialization
- `onunload()`: Cleanup
- `loadSettings()`: Load and upgrade settings
- `saveSettings()`: Persist settings

### 2. Client Factory

**File**: `src/wp-clients.ts`

Factory pattern implementation for creating WordPress API clients.

**Responsibilities**:
- Create appropriate client based on API type (REST/XML-RPC)
- Instantiate client with proper configuration
- Provide unified client creation interface

**API**:
```typescript
export function createWpClient(
  plugin: WordpressPlugin,
  profile: WpProfile
): WpClient
```

### 3. WordPress Clients

#### Abstract Base Client

**File**: `src/abstract-wp-client.ts`

Abstract base class providing common functionality for all WordPress clients.

**Responsibilities**:
- Image upload handling
- Markdown parsing
- Content transformation
- Error handling
- Media attachment management

**Key Methods**:
- `publishPost()`: Abstract method to publish post
- `uploadImages()`: Upload local images to WordPress
- `uploadMedia()`: Upload single media file
- `parseContent()`: Parse Markdown to HTML

#### REST API Client

**File**: `src/wp-rest-client.ts`

WordPress REST API implementation.

**Responsibilities**:
- REST API authentication (OAuth2 or Application Password)
- Post CRUD operations via REST endpoints
- Category and tag management
- Media upload via REST API

**Endpoints Used**:
- `/wp/v2/posts` - Post operations
- `/wp/v2/categories` - Category operations
- `/wp/v2/tags` - Tag operations
- `/wp/v2/media` - Media uploads

#### XML-RPC Client

**File**: `src/wp-xml-rpc-client.ts`

WordPress XML-RPC API implementation.

**Responsibilities**:
- XML-RPC protocol communication
- Basic authentication
- Legacy WordPress site support
- Post operations via XML-RPC methods

**Methods Used**:
- `wp.newPost` - Create new post
- `wp.editPost` - Update existing post
- `wp.uploadFile` - Upload media files

### 4. Authentication

#### Password Encryption

**File**: `src/pass-crypto.ts`

Handles secure password storage using Web Crypto API.

**Responsibilities**:
- Encrypt passwords before storage
- Decrypt passwords when needed
- Fallback to base64 encoding (legacy)

**Security Note**: The fallback mechanism is weak and should be avoided in production.

#### OAuth2 Client

**File**: `src/oauth2-client.ts`

OAuth2 authentication flow for WordPress.com and compatible sites.

**Responsibilities**:
- OAuth2 authorization code flow
- Token management (access/refresh)
- Token validation
- Automatic token refresh

**Flow**:
1. Generate authorization URL
2. User authorizes in browser
3. Receive authorization code via protocol handler
4. Exchange code for access token
5. Use access token for API requests

### 5. UI Components

#### Publish Modal

**File**: `src/wp-publish-modal.ts`

Main modal for publishing content to WordPress.

**Features**:
- Post title editing
- Status selection (publish, draft, pending, private)
- Comment status configuration
- Featured image selection
- Schedule publishing
- Category and tag management

#### Profile Management

**Files**:
- `src/wp-profile-modal.ts` - Create/edit profile
- `src/wp-profile-manage-modal.ts` - List and manage profiles
- `src/wp-profile-chooser-modal.ts` - Choose profile for publishing

**Profile Settings**:
- Profile name
- API type (REST/XML-RPC)
- Endpoint URL
- Authentication credentials
- Default post type

#### Settings Tab

**File**: `src/settings.ts`

Plugin settings UI integrated with Obsidian's settings.

**Settings**:
- Default profile selection
- Language preference
- Ribbon icon visibility
- Profile management access

### 6. Markdown Processing

**Files**:
- `src/markdown-it-image-plugin.ts` - Image processing
- `src/markdown-it-mathjax3-plugin.ts` - Math equation rendering
- `src/markdown-it-comment-plugin.ts` - Comment handling

**Processing Pipeline**:
1. Parse Obsidian-flavored Markdown
2. Extract and upload images
3. Convert math equations (MathJax)
4. Transform internal links
5. Generate WordPress-compatible HTML

### 7. Utilities and Helpers

#### Application State

**File**: `src/app-state.ts`

Global application state management.

**Contains**:
- Event emitter for cross-component communication
- Shared MarkdownIt parser instance
- Global state variables

#### Internationalization

**File**: `src/i18n.ts`

Multi-language support.

**Supported Languages**:
- English (en)
- Chinese (zh-cn)

**Usage**:
```typescript
const i18n = new I18n('en');
const text = i18n.t('key');
```

#### Logger

**File**: `src/logger.ts`

Centralized logging utility.

**Features**:
- Environment-aware logging (production vs development)
- Console wrapper methods (log, warn, error)
- Production logging suppression (except errors)

## Data Flow

### Publishing Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User triggers "Publish" command                          │
└───────────────────────┬─────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Open WpPublishModal                                      │
│    - Load post metadata from frontmatter                    │
│    - Display current settings                               │
└───────────────────────┬─────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. User configures and confirms                             │
└───────────────────────┬─────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. doClientPublish() orchestrates the process               │
│    a. Parse Markdown content                                │
│    b. Extract and upload images                             │
│    c. Transform content to WordPress format                 │
└───────────────────────┬─────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Client.publishPost()                                     │
│    - REST: POST to /wp/v2/posts                             │
│    - XML-RPC: Call wp.newPost/wp.editPost                   │
└───────────────────────┬─────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Update frontmatter with post ID and metadata             │
└───────────────────────┬─────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. Show success notification                                │
└─────────────────────────────────────────────────────────────┘
```

### Authentication Flow (OAuth2)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User clicks "Login with WordPress.com"                   │
└───────────────────────────┬─────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Generate OAuth2 authorization URL                        │
│    - client_id, redirect_uri, scope                         │
└───────────────────────┬─────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Open browser for user authorization                      │
└───────────────────────┬─────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. WordPress redirects with authorization code              │
│    obsidian://oauth2?code=XXX                               │
└───────────────────────┬─────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Protocol handler catches redirect                        │
│    - Emit OAUTH2_TOKEN_GOT event                            │
└───────────────────────┬─────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. OAuth2Client.exchangeToken()                             │
│    - Exchange code for access token                         │
│    - Store token in profile                                 │
└───────────────────────┬─────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. Profile ready for use                                    │
└─────────────────────────────────────────────────────────────┘
```

## Plugin Lifecycle

### Initialization

1. **Load Settings** (`loadSettings`)
   - Read settings from disk
   - Upgrade from older versions if needed
   - Decrypt stored passwords

2. **Initialize I18n**
   - Set language based on settings
   - Load translation strings

3. **Setup Markdown Parser**
   - Configure MarkdownIt instance
   - Register custom plugins (images, math, comments)

4. **Register Commands**
   - "Publish to WordPress" - Main publish command
   - "Publish with default profile" - Quick publish
   - "Manage profiles" - Profile management

5. **Setup Protocol Handler**
   - Register `obsidian://oauth2` for OAuth callbacks

6. **Update UI**
   - Show/hide ribbon icon based on settings

### Unload

1. **Cleanup Resources**
   - Remove ribbon icon
   - Unregister protocol handlers
   - Clear event listeners

## Design Patterns

### 1. Factory Pattern

The `createWpClient()` function in `wp-clients.ts` implements the Factory pattern to create appropriate client instances based on configuration.

**Benefits**:
- Centralized client creation logic
- Easy to add new client types
- Decouples client creation from usage

### 2. Strategy Pattern

Different WordPress client implementations (`WpRestClient`, `WpXmlRpcClient`) implement the same `WpClient` interface.

**Benefits**:
- Interchangeable protocols
- Consistent interface for publishing
- Easy testing with mock clients

### 3. Template Method Pattern

`AbstractWpClient` provides common functionality while leaving specific operations to subclasses.

**Benefits**:
- Code reuse for common operations
- Enforced structure for implementations
- Flexibility for protocol-specific logic

### 4. Singleton Pattern

`AppState` maintains global state using module-level variables.

**Benefits**:
- Single source of truth
- Shared state across components
- Event-based communication

## Settings Management

### Settings Schema

```typescript
interface WordpressPluginSettings {
  version: SettingsVersion;
  profiles: WpProfile[];
  defaultProfile?: string;
  lang?: string;
  showRibbon?: boolean;
}
```

### Settings Migration

The plugin supports automatic migration from older settings versions:

1. **Version 0 → 1**: Initial version, no migration needed
2. **Future versions**: Implement migration logic in `upgradeSettings()`

**Migration Process**:
```typescript
export function upgradeSettings(
  settings: WordpressPluginSettings
): WordpressPluginSettings {
  if (settings.version === SettingsVersion.V0) {
    // Migrate to V1
    settings.version = SettingsVersion.V1;
  }
  return settings;
}
```

## Error Handling

### Error Flow

1. **Client Errors**: Thrown by WordPress API
2. **Caught in Client**: Wrapped with context
3. **Propagated to UI**: Displayed to user
4. **Logged**: Via Logger utility

### Error Display

```typescript
export function showError(error: Error | string): void {
  const message = error instanceof Error ? error.message : error;
  new Notice(`Error: ${message}`);
  Logger.error(error);
}
```

## Security Considerations

### Password Storage

- **Preferred**: Web Crypto API (AES-GCM)
- **Fallback**: Base64 encoding (NOT SECURE)

**Recommendation**: Always use modern browsers with Web Crypto API support.

### OAuth2 Tokens

- Stored encrypted in plugin settings
- Access tokens have expiration
- Refresh tokens used for renewal

### Sensitive Data

- Passwords never logged in production
- Tokens not exposed in error messages
- HTTPS enforced for API communication

## Extension Points

### Adding a New Client Type

1. Create new client class extending `AbstractWpClient`
2. Implement required abstract methods
3. Add to `ApiType` enum in `plugin-settings.ts`
4. Update factory in `wp-clients.ts`

### Adding New Markdown Plugins

1. Create plugin file in `src/markdown-it-*.ts`
2. Implement MarkdownIt plugin interface
3. Register in `setupMarkdownParser()` in `utils.ts`

### Adding New Commands

1. Add command definition in `main.ts` `onload()`
2. Implement command callback
3. Add translation keys to i18n files

## Performance Considerations

### Image Upload

- Images uploaded sequentially (not parallel)
- Each upload waits for completion
- Consider adding parallel upload with concurrency limit

### Content Parsing

- MarkdownIt instance shared globally
- Parsing done once per publish
- Cached parsed content not implemented

### Settings Persistence

- Settings saved on every change
- Consider debouncing for rapid changes
- Encryption/decryption overhead on each save/load

## Testing Strategy

Currently, the project has no automated tests. Recommended test coverage:

1. **Unit Tests**
   - PassCrypto encryption/decryption
   - Markdown plugins
   - Settings migration
   - Utility functions

2. **Integration Tests**
   - Client publish flows
   - OAuth2 authentication
   - Image upload

3. **E2E Tests**
   - Full publish workflow
   - Profile management
   - Settings persistence

## Dependencies

### Runtime Dependencies

All dependencies are in `devDependencies` as this is an Obsidian plugin:

- `obsidian` - Obsidian API
- `markdown-it` - Markdown parser
- `mathjax-full` - Math equation rendering
- `lodash-es` - Utility functions
- `date-fns` - Date manipulation
- `imask` - Input masking
- `juice` - CSS inlining

### Build Dependencies

- `typescript` - Type checking
- `esbuild` - Bundling
- `eslint` - Linting

## Future Improvements

1. **Add comprehensive test suite**
2. **Improve type safety** (remove `SafeAny` usage)
3. **Add retry logic** for network failures
4. **Implement caching** for parsed content
5. **Parallel image uploads** with concurrency limit
6. **Better error recovery** from partial failures
7. **Offline support** with queue mechanism
8. **Plugin architecture** for extensibility
