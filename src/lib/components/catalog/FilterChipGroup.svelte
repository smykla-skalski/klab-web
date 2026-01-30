<script lang="ts">
	import { X } from 'lucide-svelte';

	let {
		label,
		options,
		selected = $bindable([])
	}: {
		label: string;
		options: string[];
		selected?: string[];
	} = $props();

	function toggleOption(option: string) {
		if (selected.includes(option)) {
			selected = selected.filter((s) => s !== option);
		} else {
			selected = [...selected, option];
		}
	}

	function clearAll() {
		selected = [];
	}
</script>

<div class="space-y-2">
	<div class="flex items-center justify-between">
		<div class="text-sm font-medium text-gray-700">{label}</div>
		{#if selected.length > 0}
			<button
				onclick={clearAll}
				class="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
			>
				<X class="h-3 w-3" />
				Clear
			</button>
		{/if}
	</div>
	<div class="flex flex-wrap gap-2">
		{#each options as option}
			<button
				onclick={() => toggleOption(option)}
				class="rounded-full px-3 py-1 text-sm font-medium transition-colors {selected.includes(
					option
				)
					? 'bg-blue-600 text-white'
					: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
			>
				{option}
			</button>
		{/each}
	</div>
</div>
