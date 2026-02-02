# klab-web Design Guide

Design principles extracted from leading interactive learning platforms (Codecademy, Educative, Mimo, Killercoda) and adapted for klab-web.

## Core Philosophy

### Speed Over Aesthetics

> "Prioritize productivity and movement over aesthetics, with speed and responsiveness being far more important than legibility and whitespace." — [Terminal Design Philosophy](https://brandur.org/interfaces)

**Application:**

- Fast page loads, instant interactions
- Minimal animations (200ms max)
- Immediate feedback on all actions
- Terminal responsiveness is critical

### Learn-by-Doing First

**Key Principles:**

- Zero setup barriers (no installations, immediate access)
- Real environments, not simulations
- Instant validation and feedback
- Progressive disclosure of complexity

### User-Centered Experience

- Natural navigation patterns
- Clear information hierarchy
- Accessibility-first approach
- Support multiple learning styles

## Design Principles

### 1. Modularity & Flexibility

**From 2026 Trends:**

> "Modular design - smaller, flexible chunks of learning allow students to move at their own pace, revisit tricky concepts, and interact with content in ways that suit their needs."

**Implementation:**

- Bite-sized labs (5-15 min focused sessions)
- Self-contained learning modules
- Reusable UI components
- Flexible layouts that adapt to content

**Component Examples:**

```svelte
<!-- ✓ Good: Modular, self-contained -->
<LabCard lab={data} />

<!-- ✗ Avoid: Monolithic, tightly coupled -->
<div><!-- hundreds of lines of mixed logic --></div>
```

### 2. Gamification & Engagement

**From Successful Platforms:**

- **Sololearn:** Progress tracking, badges, rankings
- **Mimo:** Duolingo-style streaks and achievements
- **UXCEL:** Interactive quizzes with sounds/feedback

**Implementation:**

- Visual progress indicators
- Completion badges
- Difficulty levels (color-coded)
- Success animations (subtle, fast)
- Streak tracking
- Lab completion celebrations

### 3. Immediate Feedback

**Interactive Learning Best Practice:**

> "5-minute focused lessons with instant validation"

**Implementation:**

- Real-time validation status
- Clear success/error states
- Contextual hints
- Progress visibility
- Terminal output feedback

### 4. Clean, Focused Interface

**Terminal Design Philosophy:**

> "Neither a terminal nor today's web apps represent the ideal future, but the terminal is closer."

**Implementation:**

- Minimal visual noise
- High information density without clutter
- Clear focus states
- Purposeful whitespace
- Distraction-free learning mode

### 5. Accessibility & Inclusion

**Requirements:**

- WCAG 2.1 AA compliance minimum
- Keyboard navigation for all features
- Screen reader support
- High contrast ratios
- Focus indicators
- Reduced motion support

## Visual Language

### Color System

**OKLCH-based design tokens** for perceptual uniformity and wide gamut support.

#### Semantic Colors

**Dark Theme (Default):**

```css
--color-background: oklch(15% 0.02 240) /* Deep blue-gray */ --color-foreground: oklch(91% 0.01 213)
	/* Near white */ --color-primary: oklch(98% 0.01 210) /* Bright accent */
	--color-card: oklch(18% 0.02 240) /* Elevated surface */ --color-muted: oklch(20% 0.02 223)
	/* Subdued elements */ --color-accent: oklch(25% 0.02 216) /* Interactive hover */
	--color-destructive: oklch(40% 0.15 25) /* Error/danger */;
```

**Light Theme:**

```css
--color-background: oklch(98% 0.01 240) /* Off-white */ --color-foreground: oklch(10% 0.02 240)
	/* Near black */ --color-primary: oklch(15% 0.02 240) /* Dark accent */
	--color-card: oklch(100% 0 0) /* Pure white */;
```

#### Difficulty Level Colors

**From LabCard Component:**

```ts
difficultyColors = {
	Beginner: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300',
	Intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300',
	Advanced: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
};
```

**Usage:**

- Green: Encouraging, safe for beginners
- Yellow: Caution, requires existing knowledge
- Red: Advanced, expertise required

#### Status Colors

```css
/* Success */
.success-dark {
	color: oklch(65% 0.15 145);
}
.success-light {
	color: oklch(55% 0.15 145);
}

/* Error */
.error-dark {
	color: oklch(60% 0.15 25);
}
.error-light {
	color: oklch(50% 0.15 25);
}

/* Warning */
.warning-dark {
	color: oklch(75% 0.15 85);
}
.warning-light {
	color: oklch(65% 0.15 85);
}

/* Info */
.info {
	color: oklch(60% 0.15 220);
}
```

### Typography

**Font Stack:**

```css
--font-family-sans: 'Inter', system-ui, sans-serif;
--font-family-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

**Type Scale:**

```css
/* Headings */
h1: 2.25rem (36px) - font-weight: 700
h2: 1.875rem (30px) - font-weight: 700
h3: 1.5rem (24px) - font-weight: 600
h4: 1.25rem (20px) - font-weight: 600

/* Body */
body: 1rem (16px) - line-height: 1.75
small: 0.875rem (14px)
xs: 0.75rem (12px)
```

**Code Typography:**

```css
/* Terminal */
font-size: 14px (configurable)
font-family: var(--font-family-mono)
line-height: 1.4

/* Inline code */
font-size: 0.875em
background: subtle background
padding: 0.2em 0.4em
border-radius: 0.25rem
```

### Spacing System

**Consistent 4px baseline:**

```
2   = 0.125rem = 2px
4   = 0.25rem  = 4px
8   = 0.5rem   = 8px
12  = 0.75rem  = 12px
16  = 1rem     = 16px
20  = 1.25rem  = 20px
24  = 1.5rem   = 24px
32  = 2rem     = 32px
40  = 2.5rem   = 40px
48  = 3rem     = 48px
```

**Component Spacing:**

- **Cards:** p-6 (24px padding)
- **Buttons:** px-4 py-2 (16px/8px)
- **Sections:** py-20 (80px vertical)
- **Container:** max-w-7xl mx-auto px-4

### Border Radius

```css
--radius: 0.5rem (8px) /* Variants */ rounded-sm: 0.125rem (2px) rounded: 0.25rem (4px)
	rounded-md: 0.375rem (6px) rounded-lg: 0.5rem (8px) rounded-xl: 0.75rem (12px)
	rounded-full: 9999px (pills/badges);
```

### Shadows

**Elevation system:**

```css
/* Cards at rest */
shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1)

/* Cards on hover */
shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)

/* Modals/overlays */
shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1)
```

## Component Patterns

### Button Variants

**From button.svelte:**

```svelte
<!-- Primary action -->
<Button variant="default">Submit</Button>

<!-- Secondary action -->
<Button variant="outline">Cancel</Button>

<!-- Tertiary/subtle -->
<Button variant="ghost">Skip</Button>

<!-- Dangerous action -->
<Button variant="destructive">Delete</Button>

<!-- Sizes -->
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>
```

**Design Rules:**

- Max 3 buttons per context
- Primary action = rightmost position
- Destructive actions require confirmation
- Loading states show spinner
- Disabled state = 50% opacity

### Card Patterns

**From LabCard:**

```svelte
<Card>
	<!-- Status indicator (top-right) -->
	{#if completed}<CheckCircle />{/if}

	<!-- Badge (difficulty/category) -->
	<Badge>{difficulty}</Badge>

	<!-- Title (large, semibold) -->
	<h3>{title}</h3>

	<!-- Description (muted, 2-line clamp) -->
	<p class="line-clamp-2">{description}</p>

	<!-- Footer (metadata + tags) -->
	<Footer>
		<Duration />
		<Tags />
	</Footer>
</Card>
```

**Design Rules:**

- Hover: lift shadow + border accent
- Focus: ring-2 ring-primary
- Completed: visual indicator
- Truncate long text (line-clamp)
- Consistent padding (p-6)

### Interactive States

**All interactive elements:**

```css
/* Idle */
transition-colors duration-200

/* Hover */
hover:bg-accent hover:text-accent-foreground

/* Focus (keyboard) */
focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2

/* Active */
active:scale-[0.98]

/* Disabled */
disabled:opacity-50 disabled:pointer-events-none
```

### Validation Status

**From ValidationStatus component:**

```svelte
<!-- States -->
idle → Hidden validating → Blue, spinner success → Green, checkmark error → Red, X icon

<!-- Always include message -->
<ValidationStatus {status} {message} />
```

### Progress Indicators

**Loading States:**

```svelte
<!-- Skeleton for async content -->
<Skeleton width="100%" height="40px" />

<!-- Spinner for actions -->
<Loader class="animate-spin" />

<!-- Progress bar for multi-step -->
<ProgressBar value={3} max={10} />
```

## Layout Patterns

### Split-View Lab Interface

**From lab page:**

```
┌─────────────────────────────────────┐
│ Header (actions, breadcrumb)        │
├──────────────┬──────────────────────┤
│              │                      │
│  Sidebar     │  Main Content        │
│  (resizable) │  (terminal/editor)   │
│              │                      │
│  - Objective │                      │
│  - Hints     │                      │
│  - Progress  │                      │
│              │                      │
├──────────────┴──────────────────────┤
│ Footer (status, tips)               │
└─────────────────────────────────────┘
```

**Design Rules:**

- Sidebar: 320-480px width, collapsible (Ctrl+B)
- Main: flex-1, min-h-0 (prevents overflow)
- Footer: always visible (constrains terminal)
- Responsive: sidebar → drawer on mobile

### Grid Layouts

**Catalog/listing pages:**

```svelte
<!-- Responsive grid -->
<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
	{#each labs as lab}
		<LabCard {lab} />
	{/each}
</div>
```

**Breakpoints:**

- sm: 640px (mobile landscape)
- md: 768px (tablet)
- lg: 1024px (desktop)
- xl: 1280px (large desktop)

### Container Patterns

```svelte
<!-- Page container -->
<div class="container mx-auto px-4 max-w-7xl">

<!-- Section spacing -->
<section class="py-20">

<!-- Card container -->
<div class="bg-card rounded-lg p-6 shadow-md">
```

## Interactive Components

### Terminal

**Design Requirements:**

- Monospace font (JetBrains Mono)
- High contrast (WCAG AA)
- Cursor visibility
- Selection highlighting
- Scroll performance
- Responsive text sizing

**UX Patterns:**

- Auto-focus on load
- Keyboard shortcut (Ctrl+\\)
- Clear input affordance
- Paste support
- Copy/select text

### Code Editor (Monaco)

**Design Requirements:**

- Syntax highlighting
- Line numbers
- Minimap (optional)
- Theme matches app theme
- Tab size: 2 spaces
- Auto-formatting

### Hints Panel

**Progressive Disclosure:**

```
Hint 1 (free)     → Always visible
Hint 2 (revealed) → Click to reveal
Hint 3 (revealed) → Click to reveal
Solution          → Requires confirmation
```

**Design:**

- Accordion-style expansion
- Blur effect on unrevealed hints
- Keyboard shortcut (Ctrl+H)
- "Give Up" requires modal confirmation

## Motion & Animation

### Animation Principles

**Speed:**

- Micro-interactions: 100-200ms
- Page transitions: 200-300ms
- Complex animations: 300-500ms
- Never exceed 500ms

**Easing:**

```css
/* Default transitions */
transition-colors duration-200

/* Enter */
ease-out

/* Exit */
ease-in

/* Move */
ease-in-out
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
	* {
		animation-duration: 0.01ms !important;
		transition-duration: 0.01ms !important;
	}
}
```

### Common Animations

```svelte
<!-- Fade in -->
<div in:fade={{ duration: 200 }}>

<!-- Slide in from right -->
<div in:fly={{ x: 20, duration: 200 }}>

<!-- Scale on press -->
<button class="active:scale-[0.98] transition-transform">
```

## Accessibility

### Keyboard Navigation

**Global Shortcuts:**

```
Ctrl+Enter → Validate solution
Ctrl+\     → Focus terminal
Ctrl+B     → Toggle sidebar
Ctrl+H     → Reveal hint
Shift+/    → Show help modal
```

**Component Shortcuts:**

- Tab: Navigate focusable elements
- Enter/Space: Activate buttons/links
- Escape: Close modals/dropdowns
- Arrow keys: Navigate lists/menus

### Focus Management

**Requirements:**

- Visible focus indicators (ring-2)
- Logical tab order
- Skip links for main content
- Focus trap in modals
- Return focus after modal close

### ARIA Labels

```svelte
<!-- Buttons -->
<button aria-label="Open {lab.title} lab">

<!-- Status updates -->
<div role="status" aria-live="polite">

<!-- Loading states -->
<div aria-busy="true" aria-label="Loading content">

<!-- Icon buttons -->
<button aria-label="Toggle theme">
  <Icon aria-hidden="true" />
</button>
```

### Color Contrast

**Minimum Ratios:**

- Normal text: 4.5:1 (WCAG AA)
- Large text (18px+): 3:1
- UI components: 3:1
- Target: WCAG AAA where possible

**Testing:**

```bash
# Use contrast checker
https://webaim.org/resources/contrastchecker/
```

## Responsive Design

### Mobile-First Approach

```svelte
<!-- Base: Mobile -->
<div class="flex-col">

<!-- Tablet+ -->
<div class="md:flex-row">

<!-- Desktop+ -->
<div class="lg:grid lg:grid-cols-3">
```

### Breakpoint Strategy

**Mobile (< 768px):**

- Single column layout
- Collapsible sidebar → drawer
- Stacked navigation
- Full-width terminal
- Large touch targets (44px min)

**Tablet (768px - 1024px):**

- 2-column grids
- Side-by-side content
- Persistent sidebar (optional)

**Desktop (> 1024px):**

- 3-column grids
- Full split-view
- Persistent sidebar
- Keyboard shortcuts prominent

### Touch Targets

**Minimum sizes:**

- Buttons: 44x44px (iOS)
- Links: 48x48px (Android)
- Icons: 24x24px minimum
- Spacing: 8px between targets

## Performance

### Loading Strategy

**Critical Path:**

1. HTML + inline CSS (< 14KB)
2. JS for interactivity
3. Fonts (preload)
4. Images (lazy load)
5. Terminal/Editor (code split)

**Code Splitting:**

```ts
// Lazy load heavy components
const Terminal = await import('$lib/components/terminal');
const Monaco = await import('$lib/components/editor');
```

### Image Optimization

```svelte
<!-- Responsive images -->
<img src="image.webp" alt="Description" loading="lazy" width="800" height="600" />

<!-- Avoid images where possible -->
<!-- Use SVG icons, CSS gradients -->
```

### Skeleton States

```svelte
<!-- Show structure while loading -->
{#if loading}
	<Skeleton />
{:else}
	<Content />
{/if}
```

## Content Guidelines

### Microcopy

**Tone:**

- Encouraging, not condescending
- Clear, not clever
- Concise, not terse
- Helpful, not verbose

**Examples:**

✓ **Good:**

- "Check Solution" (action-oriented)
- "All checks passed!" (celebratory)
- "Try adjusting the replicas count" (specific hint)

✗ **Avoid:**

- "Click here" (vague)
- "Oops! Something went wrong" (unhelpful)
- "Are you sure you want to do this?" (obvious)

### Error Messages

**Structure:**

1. What happened
2. Why it happened (if known)
3. How to fix it

**Example:**

```
❌ Validation failed
Your deployment has 2 replicas, but 3 are required.

→ Update the replicas field to 3 and try again.
```

### Success Messages

**Celebrate achievements:**

```
✓ Lab completed!
You've mastered [Lab Title]

🎉 [Badge Unlocked]
```

## Dark Mode

### Theme Toggle

**Behavior:**

- System preference by default
- User override persists
- Smooth transitions (200ms)
- No flash of wrong theme

**Implementation:**

```svelte
<script>
	import { mode, setMode } from 'mode-watcher';
</script>

<button onclick={() => setMode($mode === 'dark' ? 'light' : 'dark')}> Toggle Theme </button>
```

### Color Adjustments

**Dark mode considerations:**

- Reduce pure whites (use 91% lightness)
- Avoid pure blacks (use 15% lightness)
- Increase color saturation slightly
- Reduce shadow opacity
- Test all states in both modes

## Best Practices

### Do's ✓

- Use semantic HTML
- Follow established patterns
- Test keyboard navigation
- Validate color contrast
- Provide loading states
- Show clear error messages
- Celebrate user success
- Keep animations subtle
- Optimize for performance
- Support reduced motion

### Don'ts ✗

- Don't use placeholder as label
- Don't auto-play audio/video
- Don't disable zoom
- Don't use pure black backgrounds
- Don't sacrifice accessibility for aesthetics
- Don't nest interactive elements
- Don't rely on color alone
- Don't use tiny fonts (< 14px body)
- Don't auto-advance without control
- Don't block keyboard navigation

## Component Checklist

When creating new components:

- [ ] Responsive across breakpoints
- [ ] Keyboard accessible
- [ ] Focus indicators visible
- [ ] ARIA labels where needed
- [ ] Loading state defined
- [ ] Error state handled
- [ ] Dark mode tested
- [ ] High contrast verified
- [ ] Touch targets sized correctly
- [ ] Reduced motion supported
- [ ] Screen reader tested
- [ ] Type-safe props
- [ ] Documented variants
- [ ] Reusable/composable

## Resources

### Design Inspiration

- [Codecademy](https://www.codecademy.com/) - Browser-based learning
- [Killercoda](https://killercoda.com/) - Terminal-based scenarios
- [Mimo](https://mimo.org/) - Gamification approach
- [shadcn/ui Examples](https://www.shadcn.io/template)

### Tools

- [OKLCH Color Picker](https://oklch.com/)
- [Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Lucide Icons](https://lucide.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/)

### References

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Inclusive Components](https://inclusive-components.design/)
- [Material Design Motion](https://m2.material.io/design/motion/)
- [Terminal Design Philosophy](https://brandur.org/interfaces)

---

**Last Updated:** 2026-02-02
**Version:** 1.0.0
