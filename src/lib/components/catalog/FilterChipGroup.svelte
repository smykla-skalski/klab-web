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
		<div class="text-foreground text-sm font-medium">{label}</div>
		{#if selected.length > 0}
			<button
				onclick={clearAll}
				class="text-primary hover:text-primary/80 flex items-center gap-1 text-xs transition-transform active:scale-[0.98]"
			>
				<X class="h-3 w-3" aria-hidden="true" />
				Clear
			</button>
		{/if}
	</div>
	<div class="flex flex-wrap gap-2" role="group" aria-label={label}>
		{#each options as option}
			<button
				onclick={() => toggleOption(option)}
				aria-pressed={selected.includes(option)}
				class="rounded-full px-3 py-1 text-sm font-medium transition-all active:scale-[0.98] {selected.includes(
					option
				)
					? 'bg-primary text-primary-foreground'
					: 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}"
			>
				{option}
			</button>
		{/each}
	</div>
</div>
