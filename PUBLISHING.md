# Publishing Guide

This guide explains how to publish the Google Analytics plugin to npm.

## Prerequisites

1. **npm Account**: Create an account at [npmjs.com](https://www.npmjs.com/)
2. **npm CLI**: Ensure you have npm installed and are logged in:
   ```bash
   npm login
   ```
3. **Package Name**: The package name `@payloadcms/plugin-google-analytics` requires access to the `@payloadcms` scope

## Package Scope Options

### Option 1: Use Official @payloadcms Scope (Recommended)

If you have access to publish under `@payloadcms`:
- Keep the current package name: `@payloadcms/plugin-google-analytics`
- This makes it clear it's an official or community plugin for Payload

### Option 2: Use Your Own Scope

If you don't have access to `@payloadcms`, change the package name in `package.json`:

```json
{
  "name": "@your-username/payload-plugin-google-analytics"
}
```

Then update:
1. The ComponentPath references in `src/index.ts`
2. Import examples in `README.md`

### Option 3: Unscoped Package

Use a unique unscoped name:

```json
{
  "name": "payload-google-analytics-plugin"
}
```

## Pre-Publishing Checklist

- [ ] Update `version` in `package.json`
- [ ] Update `CHANGELOG.md` with changes
- [ ] Update `author` field in `package.json`
- [ ] Add `repository`, `bugs`, and `homepage` URLs in `package.json`
- [ ] Ensure all dependencies are correct
- [ ] Run `pnpm install` to update lockfile
- [ ] Test the build: `pnpm run build`
- [ ] Review the `dist/` output
- [ ] Check that `files` array includes all necessary files

## Update Package Metadata

Before publishing, update these fields in `package.json`:

```json
{
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/payload-plugin-google-analytics"
  },
  "bugs": {
    "url": "https://github.com/your-username/payload-plugin-google-analytics/issues"
  },
  "homepage": "https://github.com/your-username/payload-plugin-google-analytics#readme"
}
```

## Publishing Steps

### 1. Clean and Build

```bash
# Remove old build
rm -rf dist

# Install dependencies
pnpm install

# Build the package
pnpm run build
```

### 2. Test the Package Locally

Test in a local Payload project before publishing:

```bash
# In the plugin directory
npm link

# In your Payload project
npm link @payloadcms/plugin-google-analytics

# Test that everything works

# Unlink when done testing
npm unlink @payloadcms/plugin-google-analytics
```

### 3. Check Package Contents

Preview what will be published:

```bash
npm pack --dry-run
```

This shows all files that will be included.

### 4. Publish to npm

For first-time publication with a scoped package:

```bash
npm publish --access public
```

For subsequent updates:

```bash
npm publish
```

### 5. Verify Publication

1. Check the package page: `https://www.npmjs.com/package/@payloadcms/plugin-google-analytics`
2. Try installing in a test project:
   ```bash
   npm install @payloadcms/plugin-google-analytics
   ```
3. Verify the widgets appear in the dashboard

## Version Management

Follow [Semantic Versioning](https://semver.org/):

- **Patch** (1.0.x): Bug fixes
- **Minor** (1.x.0): New features (backward compatible)
- **Major** (x.0.0): Breaking changes

Update version:

```bash
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0
```

## Post-Publishing

1. **Create GitHub Release**: Tag the version and publish release notes
2. **Update Documentation**: Ensure README is up to date
3. **Announce**: Share on:
   - Payload Discord community
   - Twitter/X
   - Your blog or social media

## Troubleshooting

### "You do not have permission to publish"

- Check you're logged in: `npm whoami`
- Verify package name isn't taken: Search on npmjs.com
- For scoped packages, ensure you have access to the scope

### "Package name too similar to existing package"

- Choose a more unique name
- Add your username as scope: `@your-username/package-name`

### Build Errors

- Check TypeScript configuration
- Ensure all imports are valid
- Verify path mappings work in compiled output

## Unpublishing (Emergency Only)

⚠️ Only use within 72 hours of publishing:

```bash
npm unpublish @payloadcms/plugin-google-analytics@1.0.0
```

For older versions, use deprecation instead:

```bash
npm deprecate @payloadcms/plugin-google-analytics@1.0.0 "Reason for deprecation"
```

## Resources

- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semantic Versioning](https://semver.org/)
- [Creating npm Packages](https://docs.npmjs.com/creating-node-js-modules)
