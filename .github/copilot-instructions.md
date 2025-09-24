# Large Number Card - Home Assistant Custom Card

**Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

This is a TypeScript/JavaScript Home Assistant Lovelace custom card that displays large numbers prominently. The card is built using Lit web components, compiled with Rollup, and distributed as a single JavaScript file.

## Working Effectively

### Bootstrap and Dependencies
- Install Node.js dependencies: `npm install` - takes ~15 seconds. NEVER CANCEL.
- Ensure Node.js v20+ is available (check with `node --version && npm --version`)

### Build System
- **Production build**: `npm run build` - takes ~5 seconds total 
- **Build only (skip linting)**: `npm run rollup` - takes ~3 seconds, produces `dist/large-number-card.js`
- **Development watch mode**: `npm start` - runs Rollup in watch mode, rebuilds automatically on file changes

### Code Quality
- **Linting check**: `npm run check` - takes ~1 second
- **Auto-format code**: `npm run format` - fixes formatting

### Development Environment
- Start Home Assistant: `docker compose up -d` - takes ~50 seconds (Docker image download ~700MB). NEVER CANCEL.
- Stop environment: `docker compose down` - takes ~4 seconds
- Development URL: http://localhost:8123/ (returns 302 redirect when healthy)
- Card files are mounted to `/config/www/large-number-card/` in the container

### Release Process
- Releases are automated via GitHub Actions on tag pushes

## Validation

### Always Run These Steps After Changes
1. **Build validation**: `npm run build` - must complete successfully

### CI/CD Validation
- Only the build process (`npm run rollup`) needs to succeed
- The CD workflow builds and releases on git tags

## Repository Structure

### Key Files and Directories
```
/
├── .github/workflows/        # CI/CD pipelines
│   ├── ci.yml               # Linting check
│   ├── cd.yml               # Release automation
│   └── hacs.yml             # HACS validation
├── src/                     # Source code
│   ├── large-number-card.ts # Main component
│   ├── const.ts             # Default configuration
│   └── style.ts             # CSS styles
├── dist/                    # Build output (large-number-card.js)
├── docker-compose.yaml      # Home Assistant dev environment
├── configuration.yaml       # HA config for development
├── package.json            # Build scripts and dependencies
├── rollup.config.js        # Production build config
├── rollup.config.dev.js    # Development build config
├── tsconfig.json           # TypeScript configuration
└── eslint.config.js        # ESLint rules
```

### Build Configurations
- **Production**: Uses `rollup.config.js` - includes terser minification
- **Development**: Uses `rollup.config.dev.js` - no minification, watch mode
- **TypeScript**: Configured in `tsconfig.json` with strict rules 

### Quick Development Workflow
```bash
npm install                    # Install dependencies (~15s)
npm run rollup                # Build without linting (~3s)
npm start                     # Watch mode
```

### Troubleshooting
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
- Linting: ~1 second