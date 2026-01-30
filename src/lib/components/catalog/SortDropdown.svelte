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
	<ArrowUpDown class="h-4 w-4 text-gray-500" />
	<select
		bind:value
		class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
	>
		{#each options as option}
			<option value={option.value}>{option.label}</option>
		{/each}
	</select>
</div>
