<script lang="ts">
	import { ArrowUpDown } from 'lucide-svelte';
	import type { SortOption } from '$lib/services/lab-filter';

	let {
		value = $bindable('title' as SortOption)
	}: {
		value?: SortOption;
	} = $props();

	const options: { value: SortOption; label: string }[] = [
		{ value: 'title', label: 'Title (A-Z)' },
		{ value: 'difficulty', label: 'Difficulty' },
		{ value: 'duration', label: 'Duration' }
	];
</script>

<div class="flex items-center gap-2">
	<ArrowUpDown class="text-muted-foreground h-4 w-4" />
	<select
		bind:value
		aria-label="Sort labs by"
		class="border-border bg-background text-foreground focus:ring-ring rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
	>
		{#each options as option}
			<option value={option.value}>{option.label}</option>
		{/each}
	</select>
</div>
