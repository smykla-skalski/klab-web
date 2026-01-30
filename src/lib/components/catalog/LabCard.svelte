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
		Beginner: 'bg-green-100 text-green-800',
		Intermediate: 'bg-yellow-100 text-yellow-800',
		Advanced: 'bg-red-100 text-red-800'
	};
</script>

<button
	{onclick}
	aria-label="Open {lab.title} lab"
	class="group relative block w-full rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm transition-all hover:border-blue-500 hover:shadow-md"
>
	{#if isCompleted}
		<div class="absolute right-4 top-4" aria-label="Completed">
			<CheckCircle2 class="h-6 w-6 text-green-500" />
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

	<h3 class="mb-2 text-lg font-semibold text-gray-900 group-hover:text-blue-600">
		{lab.title}
	</h3>

	<p class="mb-4 line-clamp-2 text-sm text-gray-600">
		{lab.description}
	</p>

	<div class="flex items-center justify-between">
		<div class="flex items-center gap-1 text-sm text-gray-500">
			<Clock class="h-4 w-4" />
			<span>{lab.duration}</span>
		</div>

		<div class="flex flex-wrap gap-1">
			{#each lab.tags.slice(0, 3) as tag}
				<span class="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
					{tag}
				</span>
			{/each}
		</div>
	</div>
</button>
