# klab GUI - Frontend Implementation Plan

## Stack Decision

**SvelteKit + Tailwind CSS v4 + shadcn-svelte + xterm.js + Monaco Editor**

### Rationale

| Requirement      | Solution                                           |
| ---------------- | -------------------------------------------------- |
| SEO              | SvelteKit SSR + pre-rendering                      |
| Performance      | Svelte compiles to vanilla JS, 50% smaller bundles |
| Modern UI        | shadcn-svelte + Tailwind                           |
| Interactive labs | xterm.js (terminal) + Monaco (editor)              |
| High budget      | Custom components offset smaller ecosystem         |

## Architecture

```
src/
├── lib/
│   ├── components/
│   │   ├── ui/              # shadcn-svelte base components
│   │   ├── terminal/        # xterm.js Svelte wrapper
│   │   ├── editor/          # Monaco Svelte wrapper
│   │   ├── lab/             # Lab-specific components
│   │   │   ├── LabContainer.svelte
│   │   │   ├── LabSidebar.svelte
│   │   │   ├── HintPanel.svelte
│   │   │   └── ValidationStatus.svelte
│   │   └── layout/          # Header, Footer, Nav
│   ├── stores/              # Svelte stores for state
│   │   ├── lab.ts           # Current lab state
│   │   ├── terminal.ts      # Terminal session state
│   │   └── progress.ts      # User progress tracking
│   └── utils/               # Helpers, API clients
├── routes/
│   ├── +page.svelte         # Landing page (SEO)
│   ├── +layout.svelte       # Root layout
│   ├── learn/
│   │   ├── +page.svelte     # Course catalog
│   │   └── [category]/
│   │       ├── +page.svelte # Category overview
│   │       └── [lab]/
│   │           ├── +page.svelte      # Lab interface
│   │           ├── +page.server.ts   # Load lab data
│   │           └── knowledge/
│   │               └── +page.svelte  # Knowledge article
│   └── api/
│       ├── labs/            # Lab management endpoints
│       ├── terminal/        # WebSocket terminal proxy
│       └── validate/        # Solution validation
├── app.css                  # Tailwind + design tokens
└── app.html                 # HTML template
```

## Dependencies

```json
{
	"dependencies": {
		"@sveltejs/kit": "^2.x",
		"@xterm/xterm": "^5.x",
		"@xterm/addon-fit": "^0.10.x",
		"@xterm/addon-web-links": "^0.11.x",
		"monaco-editor": "^0.50.x",
		"lucide-svelte": "^0.400.x",
		"motion": "^11.x",
		"zod": "^3.x"
	},
	"devDependencies": {
		"tailwindcss": "^4.x",
		"@tailwindcss/typography": "^0.5.x",
		"shadcn-svelte": "^0.x",
		"sveltekit-superforms": "^2.x",
		"svelte-check": "^4.x",
		"typescript": "^5.x"
	}
}
```

## Implementation Phases

### Phase 1: Foundation

- [ ] Scaffold SvelteKit project
- [ ] Configure Tailwind v4 + design tokens
- [ ] Initialize shadcn-svelte
- [ ] Define color palette, typography, spacing scale
- [ ] Create base layout components (Header, Footer, Nav)
- [ ] Set up route structure

### Phase 2: Core Components ✅

- [x] Terminal component (xterm.js wrapper)
  - WebSocket connection to backend
  - Fit addon for responsive sizing
  - Copy/paste support
  - Custom theme matching design system
- [x] Code editor component (Monaco wrapper)
  - Syntax highlighting for bash, yaml, json
  - Read-only mode for solutions
  - Diff view for comparing user vs expected
- [x] Lab container layout
  - Split pane (resizable)
  - Knowledge panel
  - Hints drawer

### Phase 3: Lab Experience

- [ ] Lab catalog page with filtering/search
- [ ] Lab detail page with:
  - Objective display
  - Interactive terminal
  - Hint system (progressive reveal)
  - Validation button + feedback
  - Solution reveal (after completion)
- [ ] Knowledge article rendering (markdown → HTML)
- [ ] Progress tracking (localStorage + optional backend)

### Phase 4: Polish

- [ ] Dark/light theme toggle
- [ ] Responsive design (mobile-friendly knowledge, desktop for labs)
- [ ] Loading states + skeletons
- [ ] Error boundaries
- [ ] Keyboard shortcuts
- [ ] Accessibility audit (a11y)

### Phase 5: Backend Integration

- [ ] WebSocket terminal proxy (connect to lab containers)
- [ ] Lab state management API
- [ ] Validation endpoint (run check scripts)
- [ ] User progress persistence (optional auth)

## Design System Tokens

```css
/* app.css */
:root {
	/* Colors - Dark theme default */
	--background: 224 71% 4%;
	--foreground: 213 31% 91%;
	--primary: 210 40% 98%;
	--primary-foreground: 222.2 47.4% 11.2%;
	--muted: 223 47% 11%;
	--muted-foreground: 215.4 16.3% 56.9%;
	--accent: 216 34% 17%;
	--accent-foreground: 210 40% 98%;
	--destructive: 0 63% 31%;
	--border: 216 34% 17%;
	--ring: 216 34% 17%;

	/* Terminal */
	--terminal-bg: 0 0% 0%;
	--terminal-fg: 120 100% 50%;
	--terminal-cursor: 120 100% 50%;

	/* Typography */
	--font-sans: 'Inter', system-ui, sans-serif;
	--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

	/* Spacing */
	--radius: 0.5rem;
}
```

## Key Component APIs

### Terminal

```svelte
<Terminal bind:this={terminal} onData={(data) => ws.send(data)} theme="dark" fontSize={14} />
```

### Lab Container

```svelte
<LabContainer {lab}>
	<svelte:fragment slot="sidebar">
		<LabObjective {lab} />
		<HintPanel hints={lab.hints} />
	</svelte:fragment>

	<svelte:fragment slot="main">
		<Terminal bind:this={term} />
	</svelte:fragment>

	<svelte:fragment slot="actions">
		<Button on:click={validate}>Check Solution</Button>
		<Button variant="ghost" on:click={showSolution}>Give Up</Button>
	</svelte:fragment>
</LabContainer>
```

## SEO Strategy

- SSR for all marketing/catalog pages
- Pre-render knowledge articles at build time
- Dynamic OG images per lab
- Structured data (JSON-LD) for courses
- Sitemap generation

## Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm preview          # Preview production build

# Quality
pnpm check            # Svelte + TypeScript check
pnpm lint             # ESLint + Prettier
pnpm test             # Vitest unit tests
pnpm test:e2e         # Playwright E2E tests
```

## Open Questions

1. **Auth**: Anonymous progress vs user accounts?
2. **Backend**: Separate API service or SvelteKit endpoints?
3. **Terminal backend**: Direct container access or API proxy?
4. **Hosting**: Vercel, Cloudflare Pages, or self-hosted?
