# Development Guide

This guide covers local development setup, workflows, and best practices for developing the Obsidian WordPress Reloaded plugin.

## Table of Contents

- [Quick Start](#quick-start)
- [Development Environment](#development-environment)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Debugging](#debugging)
- [Common Tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)

## Quick Start

### TL;DR

```bash
# Clone and setup
git clone https://github.com/bugparty/obsidian-wordpress-reloaded.git
cd obsidian-wordpress-reloaded
pnpm install

# Development mode (auto-rebuild)
pnpm run dev

# Build for production
pnpm run build

# Run checks
pnpm run typecheck
pnpm run lint
```

## Development Environment

### Required Tools

1. **Node.js 20.x**
   ```bash
   # Using nvm (recommended)
   nvm install 20
   nvm use 20

   # Or download from nodejs.org
   ```

2. **pnpm 8.x**
   ```bash
   npm install -g pnpm@8
   ```

3. **Git**
   ```bash
   git --version  # Verify installation
   ```

4. **Obsidian**
   - Download from [obsidian.md](https://obsidian.md)
   - Create a test vault for development

5. **Code Editor**
   - **VS Code** (recommended)
   - Extensions:
     - ESLint
     - TypeScript and JavaScript Language Features
     - Prettier (optional)

### Optional Tools

- **Volta** - For automatic Node.js version switching
  ```bash
  curl https://get.volta.sh | bash
  ```

- **WordPress Test Site**
  - Local: Use [Local by Flywheel](https://localwp.com/)
  - Docker: Use [wordpress-docker](https://github.com/nezhar/wordpress-docker-compose)
  - Cloud: Free tier on WordPress.com

## Project Structure

```
obsidian-wordpress-reloaded/
├── .github/
│   └── workflows/          # CI/CD configurations
│       └── ci.yml
├── docs/                   # Documentation
│   ├── api/                # API documentation
│   ├── index.md            # User guide
│   └── development.md      # This file
├── src/                    # Source code
│   ├── main.ts             # Plugin entry point
│   ├── wp-*.ts             # WordPress clients
│   ├── *-modal.ts          # UI modals
│   ├── i18n/               # Translations
│   └── ...
├── .eslintrc               # ESLint configuration
├── .gitignore
├── ARCHITECTURE.md         # Architecture documentation
├── CHANGELOG.md
├── CONTRIBUTING.md         # Contributing guidelines
├── esbuild.config.mjs      # Build configuration
├── manifest.json           # Obsidian plugin manifest
├── package.json
├── pnpm-lock.yaml
├── README.md
├── tsconfig.json           # TypeScript configuration
└── versions.json           # Version history
```

### Key Files

- **`src/main.ts`** - Plugin entry point, lifecycle management
- **`src/wp-clients.ts`** - Client factory
- **`src/abstract-wp-client.ts`** - Base client class
- **`src/plugin-settings.ts`** - Settings schema and migrations
- **`manifest.json`** - Plugin metadata (version, name, etc.)
- **`esbuild.config.mjs`** - Build configuration
- **`tsconfig.json`** - TypeScript compiler options

## Development Workflow

### 1. Initial Setup

```bash
# Fork the repository on GitHub

# Clone your fork
git clone https://github.com/YOUR_USERNAME/obsidian-wordpress-reloaded.git
cd obsidian-wordpress-reloaded

# Install dependencies
pnpm install

# Verify setup
pnpm run build
```

### 2. Link to Obsidian Vault

**Method 1: Symbolic Link (Recommended)**

```bash
# Linux/Mac
ln -s "$(pwd)" "/path/to/vault/.obsidian/plugins/obsidian-wordpress-reloaded"

# Windows (PowerShell as Administrator)
New-Item -ItemType SymbolicLink -Path "C:\path\to\vault\.obsidian\plugins\obsidian-wordpress-reloaded" -Target "$(pwd)"
```

**Method 2: Copy on Build**

Add to `package.json`:
```json
{
  "scripts": {
    "dev:copy": "node esbuild.config.mjs && cp main.js manifest.json /path/to/vault/.obsidian/plugins/obsidian-wordpress-reloaded/"
  }
}
```

### 3. Development Loop

```bash
# Terminal 1: Watch mode (auto-rebuild)
pnpm run dev

# Terminal 2: Obsidian
# Open Obsidian with your test vault
# Settings → Community Plugins → Reload plugins (Ctrl+R)
```

**After each code change:**
1. Save the file
2. Wait for rebuild (watch mode)
3. Reload Obsidian plugins (Ctrl+R or restart)
4. Test your changes

### 4. Running Checks

Before committing:

```bash
# Type check
pnpm run typecheck

# Lint
pnpm run lint

# Auto-fix lint issues
pnpm run lint:fix

# Full check
pnpm run typecheck && pnpm run lint && pnpm run build
```

### 5. Committing Changes

```bash
# Stage changes
git add .

# Commit with conventional commit message
git commit -m "feat: add support for custom taxonomies"

# Push to your fork
git push origin feature/custom-taxonomies
```

## Testing

### Manual Testing

Currently, the project relies on manual testing. Use this checklist:

#### Basic Publish Flow
- [ ] Create a new note in Obsidian
- [ ] Add frontmatter with title and tags
- [ ] Run "Publish to WordPress" command
- [ ] Verify post appears on WordPress
- [ ] Check post title, content, and tags
- [ ] Edit the note and republish
- [ ] Verify post updates correctly

#### Image Upload
- [ ] Add local images to note
- [ ] Use Obsidian image syntax: `![[image.png]]`
- [ ] Publish note
- [ ] Verify images uploaded to WordPress media library
- [ ] Check images display in published post

#### Profile Management
- [ ] Create a new profile
- [ ] Configure REST API profile
- [ ] Configure XML-RPC profile
- [ ] Test OAuth2 authentication (WordPress.com)
- [ ] Switch between profiles
- [ ] Edit profile settings
- [ ] Delete profile

#### Edge Cases
- [ ] Large images (>5MB)
- [ ] Special characters in title
- [ ] Markdown with code blocks
- [ ] Math equations (MathJax)
- [ ] Internal links
- [ ] Empty content
- [ ] Network errors (disconnect WiFi)

### Test WordPress Sites

**Local Development:**
```bash
# Using Local by Flywheel
# 1. Create new WordPress site
# 2. Enable REST API (default in WP 4.7+)
# 3. Create application password:
#    Users → Your Profile → Application Passwords
```

**WordPress.com (OAuth2 Testing):**
1. Create free account at WordPress.com
2. Create test blog
3. Use OAuth2 authentication in plugin

### Automated Testing (Future)

Structure for future test implementation:

```
tests/
├── unit/
│   ├── pass-crypto.test.ts
│   ├── utils.test.ts
│   └── markdown-plugins.test.ts
├── integration/
│   ├── rest-client.test.ts
│   └── xmlrpc-client.test.ts
└── e2e/
    └── publish-flow.test.ts
```

## Debugging

### Console Logging

Use the Logger utility instead of console.log:

```typescript
import { Logger } from './logger';

Logger.log('Debug info:', data);        // Hidden in production
Logger.warn('Warning:', issue);          // Hidden in production
Logger.error('Error occurred:', error);  // Always shown
```

### Developer Tools

**Open Console:**
- View → Toggle Developer Tools (Ctrl+Shift+I)

**View Network Requests:**
1. Open DevTools
2. Go to Network tab
3. Trigger publish action
4. Inspect API requests/responses

**Inspect Variables:**
```typescript
// In your code, add debugger statement
async publishPost(params: WordPressPostParams) {
  debugger;  // Execution will pause here
  // ...
}
```

### Common Debug Points

1. **Check profile configuration**
   ```typescript
   Logger.log('Profile:', JSON.stringify(profile, null, 2));
   ```

2. **Inspect post parameters**
   ```typescript
   Logger.log('Publishing with params:', postParams);
   ```

3. **View API responses**
   ```typescript
   Logger.log('WordPress response:', response);
   ```

4. **Check image processing**
   ```typescript
   Logger.log('Found images:', images);
   Logger.log('Upload result:', uploadResult);
   ```

### Debugging OAuth2

1. **Enable verbose logging**
   ```typescript
   // In oauth2-client.ts
   Logger.log('Auth URL:', authUrl);
   Logger.log('Token response:', tokenResponse);
   ```

2. **Check protocol handler**
   ```typescript
   // In main.ts registerProtocolHandler()
   Logger.log('Received OAuth callback:', url);
   ```

3. **Test redirect manually**
   - Copy authorization URL from logs
   - Open in browser
   - Authorize
   - Should redirect to `obsidian://oauth2?code=...`

## Common Tasks

### Adding a New Feature

1. **Plan the feature**
   - Write design doc (if large feature)
   - Identify affected components
   - Consider backward compatibility

2. **Implement**
   ```bash
   git checkout -b feature/my-feature
   # Make changes
   pnpm run dev  # Test as you go
   ```

3. **Update types** (if needed)
   - Add to `types.ts`
   - Update interfaces
   - Export new types

4. **Add translations**
   ```typescript
   // In i18n/en.ts
   export const en = {
     'new_feature_label': 'My New Feature',
     // ...
   };

   // In i18n/zh-cn.ts
   export const zhCN = {
     'new_feature_label': '我的新功能',
     // ...
   };
   ```

5. **Update documentation**
   - README.md (if user-facing)
   - ARCHITECTURE.md (if architectural change)
   - API docs (if API change)

6. **Test thoroughly**
   - Manual testing checklist
   - All existing features still work
   - New feature works as expected

### Fixing a Bug

1. **Reproduce the issue**
   - Follow steps in bug report
   - Verify issue exists
   - Identify root cause

2. **Write a fix**
   ```bash
   git checkout -b fix/issue-123
   # Make minimal changes
   ```

3. **Test the fix**
   - Verify bug is fixed
   - Test related functionality
   - Ensure no regression

4. **Add test** (when framework available)
   ```typescript
   test('should handle edge case', () => {
     // Test the fix
   });
   ```

### Updating Dependencies

```bash
# Check outdated packages
pnpm outdated

# Update specific package
pnpm update package-name

# Update all packages (careful!)
pnpm update

# Test after updates
pnpm run build
pnpm run typecheck
pnpm run lint
```

**After updating:**
- Test all major features
- Check for breaking changes
- Update code if needed
- Commit: `chore: update dependencies`

### Creating a Release

```bash
# Update version (creates git tag)
pnpm run release

# Preview changes
pnpm run release-test

# For major version
pnpm run release-major

# For minor version
pnpm run release-minor
```

This runs `standard-version` which:
1. Bumps version in `package.json`
2. Updates `CHANGELOG.md`
3. Updates `manifest.json` and `versions.json`
4. Creates a git tag

## Troubleshooting

### Build Errors

**"Cannot find module X"**
```bash
pnpm install
```

**"Module not found" after adding dependency**
```bash
pnpm install
pnpm run build
```

**Type errors in build**
```bash
pnpm run typecheck  # See detailed errors
```

### Plugin Not Loading

**Plugin not in list**
- Check `.obsidian/plugins/obsidian-wordpress-reloaded` exists
- Verify `main.js` and `manifest.json` are present
- Restart Obsidian

**Plugin fails to load**
- Open DevTools console
- Look for error messages
- Check `manifest.json` is valid JSON

**Changes not reflected**
- Save all files
- Wait for rebuild (watch mode)
- Reload plugins (Ctrl+R)
- If still not working, restart Obsidian

### pnpm Issues

**"Lockfile not compatible"**
```bash
pnpm install --force
```

**"No pnpm version is currently active"**
```bash
# Install pnpm globally
npm install -g pnpm@8
```

### Git Issues

**Merge conflicts**
```bash
# Update from main
git fetch upstream
git merge upstream/main

# Resolve conflicts in editor
# Then:
git add .
git commit
```

**Accidentally committed to main**
```bash
# Create new branch with changes
git branch my-feature

# Reset main
git checkout main
git reset --hard origin/main

# Continue on branch
git checkout my-feature
```

## Performance Tips

### Fast Rebuilds

Use watch mode for development:
```bash
pnpm run dev  # Only rebuilds changed files
```

### Skip Type Checking in Dev

For faster builds during development, edit `esbuild.config.mjs`:
```javascript
// Comment out tsc step for dev builds
// But run before committing!
```

### Reduce Bundle Size

- Import only what you need:
  ```typescript
  // Good
  import { cloneDeep } from 'lodash-es';

  // Avoid (imports entire library)
  import _ from 'lodash-es';
  ```

## Resources

### Documentation
- [ARCHITECTURE.md](../ARCHITECTURE.md) - Architecture overview
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines
- [docs/api/](./api/) - API documentation

### External Resources
- [Obsidian Plugin API](https://github.com/obsidianmd/obsidian-api)
- [Obsidian Plugin Developer Docs](https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin)
- [WordPress REST API](https://developer.wordpress.org/rest-api/)
- [WordPress XML-RPC](https://codex.wordpress.org/XML-RPC_Support)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

### Community
- [GitHub Issues](https://github.com/bugparty/obsidian-wordpress-reloaded/issues)
- [GitHub Discussions](https://github.com/bugparty/obsidian-wordpress-reloaded/discussions)

## Next Steps

- Read [ARCHITECTURE.md](../ARCHITECTURE.md) to understand the codebase
- Check [open issues](https://github.com/bugparty/obsidian-wordpress-reloaded/issues) for tasks to work on
- Look for issues labeled `good first issue` if you're new
- Join discussions and ask questions

Happy coding!
