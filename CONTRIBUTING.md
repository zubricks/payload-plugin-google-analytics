# Contributing to Payload Google Analytics Plugin

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Build the package:
   ```bash
   pnpm run build
   ```

## Development Workflow

### Making Changes

1. Create a new branch for your feature or fix
2. Make your changes in the `src/` directory
3. Build and test your changes:
   ```bash
   pnpm run build
   ```

### Testing Locally

To test your changes in a local Payload project:

1. Build the plugin:
   ```bash
   pnpm run build
   ```

2. Link the package in your Payload project:
   ```bash
   cd /path/to/payload-plugin-google-analytics
   npm link

   cd /path/to/your-payload-project
   npm link @payloadcms/plugin-google-analytics
   ```

3. Or use `pnpm link`:
   ```bash
   cd /path/to/payload-plugin-google-analytics
   pnpm link --global

   cd /path/to/your-payload-project
   pnpm link --global @payloadcms/plugin-google-analytics
   ```

### Code Style

- Use TypeScript for all source files
- Follow the existing code style
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### Widget Development

Widgets are React Server Components located in `src/widgets/`:
- Use inline styles with Payload's CSS custom properties for theming
- Accept `WidgetServerProps` as props
- Handle loading and error states gracefully

### API Routes

API routes are located in `src/api/analytics/`:
- Follow Next.js App Router conventions
- Use proper error handling
- Support both real GA4 data and demo mode

## Submitting Changes

1. Ensure your code builds without errors
2. Test your changes thoroughly
3. Update documentation if needed
4. Submit a pull request with a clear description of your changes

## Reporting Issues

When reporting issues, please include:
- Plugin version
- Payload version
- Node.js version
- Steps to reproduce
- Expected vs actual behavior
- Any error messages or screenshots

## Release Process

Releases are handled by maintainers:

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Build the package: `pnpm run build`
4. Publish to npm: `npm publish --access public`

## Questions?

Feel free to open an issue for any questions or concerns!
