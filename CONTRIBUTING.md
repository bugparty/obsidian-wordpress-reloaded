# Contributing to Obsidian WordPress Reloaded

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)
- [Feature Requests](#feature-requests)

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, discrimination, or exclusionary behavior
- Trolling, insulting/derogatory comments
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

## Getting Started

### Prerequisites

Before you begin, ensure you have:

- **Node.js 20.x** or higher
- **pnpm 8.x** (install via `npm install -g pnpm`)
- **Git** for version control
- **Obsidian** installed for testing
- Basic knowledge of TypeScript and Obsidian plugin development

### Setting Up Development Environment

1. **Fork the repository**

   Click the "Fork" button on GitHub to create your own copy.

2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/obsidian-wordpress-reloaded.git
   cd obsidian-wordpress-reloaded
   ```

3. **Install dependencies**

   ```bash
   pnpm install
   ```

4. **Build the plugin**

   ```bash
   pnpm run build
   ```

5. **Link to Obsidian vault** (for testing)

   ```bash
   # Create symlink to your test vault's plugins directory
   ln -s $(pwd) /path/to/your/vault/.obsidian/plugins/obsidian-wordpress-reloaded
   ```

6. **Enable the plugin in Obsidian**

   Open Obsidian → Settings → Community Plugins → Enable "Obsidian WordPress Reloaded"

### Development Mode

For active development with auto-rebuild:

```bash
pnpm run dev
```

This will watch for file changes and rebuild automatically.

## Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/my-new-feature
# or
git checkout -b fix/bug-description
```

**Branch Naming Convention:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Maintenance tasks

### 2. Make Your Changes

- Write clean, readable code
- Follow the existing code style
- Add comments for complex logic
- Update documentation if needed

### 3. Test Your Changes

Before committing:

```bash
# Run type check
pnpm run typecheck

# Run linter
pnpm run lint

# Fix auto-fixable lint issues
pnpm run lint:fix

# Build the plugin
pnpm run build
```

**Manual Testing:**
- Test in Obsidian with a test WordPress site
- Test both REST API and XML-RPC protocols
- Test OAuth2 authentication flow
- Verify image uploads work correctly
- Check frontmatter updates

### 4. Commit Your Changes

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```bash
git add .
git commit -m "type: brief description"
```

**Commit Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks
- `perf:` - Performance improvements

**Examples:**
```bash
git commit -m "feat: add support for custom post types"
git commit -m "fix: resolve image upload failure on WordPress 6.x"
git commit -m "docs: update API documentation for WpClient"
git commit -m "refactor: extract common logic to utility function"
```

### 5. Push to Your Fork

```bash
git push origin feature/my-new-feature
```

### 6. Create a Pull Request

1. Go to your fork on GitHub
2. Click "Pull Request"
3. Select your branch
4. Fill in the PR template with:
   - Description of changes
   - Related issue number (if applicable)
   - Testing steps
   - Screenshots (if UI changes)

## Coding Standards

### TypeScript

1. **Use TypeScript strict mode**
   - No implicit `any`
   - Strict null checks enabled
   - No unused variables

2. **Prefer explicit types**
   ```typescript
   // Good
   function publishPost(params: WordPressPostParams): Promise<WpResponse>

   // Avoid
   function publishPost(params: any): Promise<any>
   ```

3. **Avoid `SafeAny`**
   - Only use for legacy code
   - Prefer proper types or `unknown`

4. **Use const for immutable values**
   ```typescript
   // Good
   const maxRetries = 3;

   // Avoid
   let maxRetries = 3;
   ```

### Code Style

1. **Use descriptive names**
   ```typescript
   // Good
   const wordPressClient = createWpClient(plugin, profile);

   // Avoid
   const wpc = createWpClient(plugin, profile);
   ```

2. **Keep functions small and focused**
   - One function, one responsibility
   - Extract complex logic to helper functions
   - Aim for < 50 lines per function

3. **Add JSDoc comments for public APIs**
   ```typescript
   /**
    * Publishes a post to WordPress
    * @param params - Post parameters including title, content, etc.
    * @returns Promise resolving to the published post data
    * @throws Error if publication fails
    */
   async publishPost(params: WordPressPostParams): Promise<WpResponse>
   ```

4. **Handle errors properly**
   ```typescript
   // Good
   try {
     await client.publishPost(params);
   } catch (error) {
     if (error instanceof Error) {
       Logger.error('Failed to publish:', error.message);
       showError(error);
     }
   }

   // Avoid
   client.publishPost(params).then(); // Errors swallowed
   ```

5. **Use async/await over Promises**
   ```typescript
   // Good
   async function publish() {
     const result = await client.publishPost(params);
     return result;
   }

   // Avoid
   function publish() {
     return client.publishPost(params).then(result => {
       return result;
     });
   }
   ```

### Linting

The project uses ESLint. Before committing:

```bash
pnpm run lint
pnpm run lint:fix  # Auto-fix issues
```

**Key Rules:**
- No unused variables
- Prefer `const` over `let`
- No `console.log` (use `Logger` instead)
- Consistent spacing and formatting

### File Organization

```
src/
├── main.ts              # Plugin entry point
├── wp-*.ts              # WordPress-related modules
├── markdown-it-*.ts     # Markdown plugins
├── *-modal.ts           # UI modals
├── utils.ts             # Shared utilities
├── types.ts             # Type definitions
└── i18n/                # Translations
    ├── en.ts
    └── zh-cn.ts
```

## Submitting Changes

### Pull Request Guidelines

1. **One feature per PR**
   - Keep PRs focused and small
   - Split large changes into multiple PRs

2. **Update documentation**
   - Update README if adding features
   - Update API docs if changing interfaces
   - Add JSDoc comments to new functions

3. **Add tests** (when test framework is available)
   - Unit tests for utilities
   - Integration tests for clients
   - E2E tests for critical flows

4. **Ensure CI passes**
   - All checks must pass (lint, typecheck, build)
   - Fix any errors before requesting review

5. **Request review**
   - Tag relevant maintainers
   - Respond to feedback promptly
   - Make requested changes

### PR Template

```markdown
## Description
[Brief description of what this PR does]

## Related Issue
Fixes #[issue number]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
[How did you test this? Steps for reviewers to test]

## Screenshots
[If applicable, add screenshots]

## Checklist
- [ ] Code follows project style guidelines
- [ ] Lint and typecheck pass
- [ ] Documentation updated
- [ ] Tests added/updated (when available)
- [ ] Tested manually in Obsidian
```

## Reporting Issues

### Before Reporting

1. **Search existing issues** - Your issue might already be reported
2. **Update to latest version** - Issue might be fixed
3. **Reproduce the issue** - Ensure it's reproducible

### Creating an Issue

Use the issue templates and provide:

1. **Clear title** - Summarize the issue
2. **Description** - What happened vs. what you expected
3. **Steps to reproduce**
   ```
   1. Go to...
   2. Click on...
   3. See error
   ```
4. **Environment**
   - Obsidian version
   - Plugin version
   - OS (Windows/Mac/Linux)
   - WordPress version
   - API type (REST/XML-RPC)
5. **Error messages** - Copy full error text
6. **Screenshots** - If applicable
7. **Logs** - From developer console

### Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `priority: high` - Critical issues
- `priority: low` - Nice to have

## Feature Requests

We welcome feature requests! Please:

1. **Check existing requests** - Avoid duplicates
2. **Describe the use case** - Why is this needed?
3. **Propose a solution** - How might it work?
4. **Consider alternatives** - Other ways to achieve the goal?

## Development Tips

### Debugging

1. **Enable developer console**
   - View → Toggle Developer Tools

2. **Use Logger**
   ```typescript
   Logger.log('Debug info:', data);
   Logger.warn('Warning:', issue);
   Logger.error('Error:', error);
   ```

3. **Check network requests**
   - Network tab in DevTools
   - View API requests/responses

### Common Issues

**"Module not found" errors**
```bash
rm -rf node_modules
pnpm install
```

**Build failures**
```bash
pnpm run typecheck  # Check for type errors
pnpm run lint       # Check for lint errors
```

**Plugin not loading in Obsidian**
- Check console for errors
- Ensure `manifest.json` is valid
- Verify `main.js` exists after build

## Resources

- [Obsidian Plugin Developer Docs](https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin)
- [WordPress REST API Handbook](https://developer.wordpress.org/rest-api/)
- [WordPress XML-RPC API](https://codex.wordpress.org/XML-RPC_Support)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Getting Help

- **Questions** - Open a GitHub Discussion
- **Bugs** - Open an Issue
- **Security** - Email maintainers privately
- **Chat** - Join our community (if available)

## Recognition

Contributors will be:
- Listed in CHANGELOG for their contributions
- Mentioned in release notes
- Added to the contributors list

Thank you for contributing!
