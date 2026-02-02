<script lang="ts">
	import { Clock, CheckCircle2 } from 'lucide-svelte';
	import type { Lab } from '$lib/schemas/lab.schema';

	let {
		lab,
		isCompleted = false,
		onclick
	}: {
		lab: Lab;
		isCompleted?: boolean;
		onclick?: () => void;
	} = $props();

	// Nord color mapping (OKLCH values):
	// Beginner (hue 135) → nord14 (green)
	// Intermediate (hue 85) → nord13 (yellow)
	// Advanced (hue 15) → nord11 (red)
	const difficultyColors = {
		Beginner: 'bg-[oklch(85%_0.06_135)] text-[oklch(40%_0.08_135)] dark:bg-[oklch(35%_0.06_135)] dark:text-[oklch(75%_0.08_135)]',
		Intermediate: 'bg-[oklch(90%_0.08_85)] text-[oklch(50%_0.10_85)] dark:bg-[oklch(40%_0.08_85)] dark:text-[oklch(82%_0.10_85)]',
		Advanced: 'bg-[oklch(85%_0.08_15)] text-[oklch(40%_0.10_15)] dark:bg-[oklch(35%_0.08_15)] dark:text-[oklch(58%_0.115_15)]'
	};
</script>

<button
	{onclick}
	aria-label="Open {lab.title} lab"
	class="group border-border/60 bg-card hover:border-primary hover:bg-card/80 dark:border-border/60 dark:bg-card/50 dark:hover:bg-card/70 focus-visible:ring-primary relative block w-full rounded-lg border p-6 text-left shadow-md transition-all hover:shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]"
>
	{#if isCompleted}
		<div class="absolute top-4 right-4" aria-label="Completed">
			<CheckCircle2 class="h-6 w-6 text-green-600 dark:text-green-400" />
		</div>
	{/if}

	<div class="mb-3">
		<span
			class="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium {difficultyColors[
				lab.difficulty
			]}"
		>
			{lab.difficulty}
		</span>
	</div>

	<h3 class="text-foreground group-hover:text-primary mb-2 text-lg font-semibold">
		{lab.title}
	</h3>

	<p class="text-muted-foreground mb-4 line-clamp-2 text-sm">
		{lab.description}
	</p>

	<div class="flex items-center justify-between">
		<div class="text-muted-foreground flex items-center gap-1 text-sm">
			<Clock class="h-4 w-4" />
			<span>{lab.duration}</span>
		</div>

		<div class="flex flex-wrap gap-1">
			{#each lab.tags.slice(0, 3) as tag}
				<span
					class="bg-muted/70 text-foreground/80 dark:bg-muted/70 dark:text-foreground rounded px-2 py-0.5 text-xs"
				>
					{tag}
				</span>
			{/each}
		</div>
	</div>
</button>
