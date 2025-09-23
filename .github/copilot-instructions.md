# Large Number Card - Home Assistant Custom Card

**Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

This is a TypeScript/JavaScript Home Assistant Lovelace custom card that displays large numbers prominently. The card is built using Lit web components, compiled with Rollup, and distributed as a single JavaScript file.

## Working Effectively

### Bootstrap and Dependencies
- Install Node.js dependencies: `npm install` - takes ~15 seconds. NEVER CANCEL.
- Ensure Node.js v20+ is available (check with `node --version && npm --version`)

### Build System
- **Production build**: `npm run build` - takes ~5 seconds total but FAILS due to intentional linting errors
- **Build only (skip linting)**: `npm run rollup` - takes ~3 seconds, produces `dist/large-number-card.js`
- **Development watch mode**: `npm start` - runs Rollup in watch mode, rebuilds automatically on file changes
- **NEVER CANCEL**: Set timeout to 60+ seconds for build commands to account for slower environments

### Code Quality
- **Linting check**: `npm run check` - takes ~1 second but INTENTIONALLY FAILS with 7 TypeScript errors
- **Auto-format code**: `npm run format` - fixes formatting but not TypeScript `any` type errors
- **IMPORTANT**: The codebase intentionally uses `any` types for Home Assistant integration due to dynamic object shapes
- **DO NOT attempt to fix the TypeScript `any` type warnings** - they are documented as intentional in the code comments

### Development Environment
- Start Home Assistant: `docker compose up -d` - takes ~50 seconds (Docker image download ~700MB). NEVER CANCEL.
- Stop environment: `docker compose down` - takes ~4 seconds
- Development URL: http://localhost:8123/ (returns 302 redirect when healthy)
- Card files are mounted to `/config/www/large-number-card/` in the container
- **NEVER CANCEL**: Docker operations can take up to 2 minutes on first run. Set timeout to 180+ seconds.

### Release Process
- Release command: `npm run release` - runs linting (will fail) then release-it
- Releases are automated via GitHub Actions on tag pushes
- Built file is uploaded as `large-number-card.js` to GitHub releases

## Validation

### Always Run These Steps After Changes
1. **Build validation**: `npm run rollup` - must complete successfully
2. **Development environment**: 
   - `docker compose up -d` - wait for container to be "Up" status
   - `npm start` - verify watch mode starts and shows "waiting for changes..."
   - Test that http://localhost:8123 returns HTTP 302
3. **Manual testing scenario**:
   - Build the project with `npm run rollup`
   - Verify `dist/large-number-card.js` exists and is not empty
   - Start Home Assistant development environment
   - Access http://localhost:8123 and complete initial setup
   - Add a dashboard with the Large Number Card
   - Verify the card displays correctly with a numeric entity

### CI/CD Validation
- **CRITICAL**: The CI workflow (`.github/workflows/ci.yml`) runs `npm run check` which WILL FAIL due to intentional TypeScript warnings
- **DO NOT modify the TypeScript `any` type usage** - it is required for Home Assistant integration
- Only the build process (`npm run rollup`) needs to succeed
- The CD workflow builds and releases on git tags

## Repository Structure

### Key Files and Directories
```
/
├── .github/workflows/        # CI/CD pipelines
│   ├── ci.yml               # Linting check (expects failures)
│   ├── cd.yml               # Release automation
│   └── hacs.yml             # HACS validation
├── src/                     # Source code
│   ├── large-number-card.ts # Main component (intentionally uses 'any' types)
│   ├── const.ts             # Default configuration
│   └── style.ts             # CSS styles
├── dist/                    # Build output (large-number-card.js)
├── docker-compose.yaml      # Home Assistant dev environment
├── configuration.yaml       # HA config for development
├── package.json            # Build scripts and dependencies
├── rollup.config.js        # Production build config
├── rollup.config.dev.js    # Development build config
├── tsconfig.json           # TypeScript configuration
└── eslint.config.js        # ESLint rules (strict, causes intentional failures)
```

### Build Configurations
- **Production**: Uses `rollup.config.js` - includes terser minification
- **Development**: Uses `rollup.config.dev.js` - no minification, watch mode
- **TypeScript**: Configured in `tsconfig.json` with strict rules but `noImplicitAny: false`

## Common Tasks

### Quick Development Workflow
```bash
npm install                    # Install dependencies (~15s)
npm run rollup                # Build without linting (~3s)
docker compose up -d          # Start HA (~50s first time)
npm start                     # Watch mode
# Make changes, verify rebuild
docker compose down           # Cleanup
```

### Troubleshooting
- **"npm run build" fails**: Expected due to intentional TypeScript `any` usage. Use `npm run rollup` instead.
- **Container won't start**: Ensure port 8123 is available, check `docker compose ps`
- **Watch mode not working**: Kill any existing `npm start` processes
- **Build outputs are empty**: Check for syntax errors in TypeScript files

### Repository Specifics
- This is a **Home Assistant Lovelace custom card**, not a standalone web application
- Uses **Lit web components** and **@customElement** decorator
- Integrates with Home Assistant's `hass` object and entity system
- Supports **HACS** (Home Assistant Community Store) for distribution
- **Build output must be a single JavaScript file** for Home Assistant compatibility

## Performance Expectations
- npm install: ~15 seconds
- Build (rollup): ~3 seconds  
- Docker startup: ~50 seconds (first time), ~10 seconds (subsequent)
- Linting: ~1 second (but fails intentionally)
- Full development setup: ~70 seconds total

**CRITICAL**: Never cancel Docker operations or builds. Always set timeouts of 120+ seconds for Docker commands and 60+ seconds for builds.