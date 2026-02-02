# Design Quick Reference

Fast lookup for common patterns and values.

## Core Principles

1. **Speed > Aesthetics** - Instant feedback, < 200ms transitions
2. **Zero Friction** - No setup, immediate learning
3. **Modular** - 5-15min focused sessions
4. **Gamified** - Progress, badges, celebrations
5. **Accessible** - WCAG AA, keyboard-first

## Colors

### Semantic (Dark)

```css
background: oklch(15% 0.02 240)
foreground: oklch(91% 0.01 213)
primary: oklch(98% 0.01 210)
card: oklch(18% 0.02 240)
muted: oklch(20% 0.02 223)
```

### Difficulty

```ts
Beginner: green - 100 / 800;
Intermediate: yellow - 100 / 800;
Advanced: red - 100 / 800;
```

### Status

```ts
Success: oklch(65% 0.15 142)
Error: oklch(50% 0.15 25)
Warning: oklch(55% 0.15 85)
```

## Typography

```
Fonts: Inter (sans) | JetBrains Mono (mono)

h1: 36px/700
h2: 30px/700
h3: 24px/600
h4: 20px/600
body: 16px/1.75
small: 14px
xs: 12px
```

## Spacing

```
2  4  8  12  16  20  24  32  40  48
(px)
```

Cards: `p-6`
Buttons: `px-4 py-2`
Sections: `py-20`

## Buttons

```svelte
<Button variant="default">      <!-- Primary -->
<Button variant="outline">      <!-- Secondary -->
<Button variant="ghost">        <!-- Tertiary -->
<Button variant="destructive">  <!-- Danger -->

<Button size="sm|default|lg|icon">
```

## Interactive States

```css
hover:bg-accent
focus-visible:ring-2 ring-ring ring-offset-2
active:scale-[0.98]
disabled:opacity-50
transition-colors duration-200
```

## Shortcuts

```
Ctrl+Enter → Validate
Ctrl+\     → Focus terminal
Ctrl+B     → Toggle sidebar
Ctrl+H     → Reveal hint
?          → Help
```

## Responsive

```svelte
sm: 640px (mobile landscape) md: 768px (tablet) lg: 1024px (desktop) xl: 1280px (large)
```

Mobile-first: `class="flex-col md:flex-row lg:grid"`

## Accessibility

```svelte
<!-- Min contrast: 4.5:1 -->
<!-- Touch targets: 44x44px -->
<!-- Focus: ring-2 ring-primary -->

aria-label="Action description" role="status" aria-live="polite" aria-busy="true"
```

## Animation

```
Micro: 100-200ms
Page: 200-300ms
Max: 500ms

Easing: ease-out (enter) | ease-in (exit)
```

## Loading

```svelte
{#if loading}
	<Skeleton width="100%" height="40px" />
{:else}
	<Content />
{/if}
```

## Validation

```svelte
idle → Hidden validating → Blue + spinner success → Green + checkmark error → Red + X + message
```

## Card Pattern

```svelte
<Card class="rounded-lg p-6 shadow-md hover:shadow-lg">
	<Badge>{difficulty}</Badge>
	<h3 class="text-lg font-semibold">{title}</h3>
	<p class="text-muted-foreground line-clamp-2">{desc}</p>
	<Footer />
</Card>
```

## Grid Layout

```svelte
<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
	{#each items as item}
		<Item {item} />
	{/each}
</div>
```

## Error Messages

```
❌ What happened
Why it happened
→ How to fix
```

## Don'ts

- ❌ Animations > 500ms
- ❌ Auto-play media
- ❌ Fonts < 14px (body)
- ❌ Pure black/white
- ❌ Color-only indicators
- ❌ Nested interactive elements
- ❌ Vague error messages

## Component Checklist

- [ ] Responsive
- [ ] Keyboard accessible
- [ ] Focus visible
- [ ] ARIA labels
- [ ] Loading state
- [ ] Error state
- [ ] Dark mode
- [ ] Touch targets 44px+
- [ ] Reduced motion
