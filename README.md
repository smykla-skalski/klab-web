# klab-web

Interactive learning platform built with SvelteKit + Tailwind v4.

## Tech Stack

- **Framework**: SvelteKit 2
- **Styling**: Tailwind CSS v4 + shadcn-svelte
- **Terminal**: xterm.js
- **Editor**: Monaco Editor
- **Package Manager**: pnpm

## Development

```bash
# Install dependencies
pnpm install

# Start dev server with mocks (recommended)
# Includes real terminal via node-pty + WebSocket server
mise dev

# Or start dev server without mocks
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Quality

```bash
# Lint with oxlint
pnpm lint

# Type check
pnpm check

# Format with prettier
pnpm format

# Run unit tests
pnpm test

# Run E2E tests
pnpm test:e2e
```

## Terminal Server

Local development uses real terminal via `node-pty`:
- **Server**: `mocks/ws-server.js` (WebSocket on port 8080)
- **PTY**: Spawns actual shell (bash/zsh)
- **Features**: Real commands, interactive programs (vim, nano), colors, progress bars
- **Security**: Localhost only, same user permissions
- **Requirements**: Native compilation (Xcode CLI Tools on macOS)

⚠️ **Never expose to internet** - runs at parent process permissions with full shell access.

### First-time Setup (macOS/Nix)

If terminal fails with "posix_spawnp failed", rebuild node-pty from source:

```bash
cd node_modules/.pnpm/node-pty@1.1.0/node_modules/node-pty
npx node-gyp rebuild
cd ../../../../..
```

## Architecture

See [gui-plan.md](./gui-plan.md) for detailed implementation plan.
