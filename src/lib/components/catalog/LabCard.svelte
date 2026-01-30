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

	const difficultyColors = {
		Beginner: 'bg-muted/50 text-green-600 dark:text-green-400',
		Intermediate: 'bg-muted/50 text-yellow-600 dark:text-yellow-400',
		Advanced: 'bg-muted/50 text-red-600 dark:text-red-400'
	};
</script>

<button
	{onclick}
	aria-label="Open {lab.title} lab"
	class="group relative block w-full rounded-lg border-border bg-background p-6 text-left shadow-sm transition-all hover:border-primary hover:shadow-md"
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

	<h3 class="mb-2 text-lg font-semibold text-foreground group-hover:text-primary">
		{lab.title}
	</h3>

	<p class="mb-4 line-clamp-2 text-sm text-muted-foreground">
		{lab.description}
	</p>

	<div class="flex items-center justify-between">
		<div class="flex items-center gap-1 text-sm text-muted-foreground">
			<Clock class="h-4 w-4" />
			<span>{lab.duration}</span>
		</div>

		<div class="flex flex-wrap gap-1">
			{#each lab.tags.slice(0, 3) as tag}
				<span class="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
					{tag}
				</span>
			{/each}
		</div>
	</div>
</button>
