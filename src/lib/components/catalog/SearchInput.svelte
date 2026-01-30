<script lang="ts">
	import { Search } from 'lucide-svelte';

	let {
		value = $bindable(''),
		placeholder = 'Search labs...'
	}: {
		value?: string;
		placeholder?: string;
	} = $props();

	let inputValue = $state(value);
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;

	$effect(() => {
		if (debounceTimer) clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			value = inputValue;
		}, 300);

		return () => {
			if (debounceTimer) clearTimeout(debounceTimer);
		};
	});
</script>

<div class="relative">
	<Search class="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
	<input
		type="text"
		bind:value={inputValue}
		{placeholder}
		class="border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-ring w-full rounded-lg border py-2 pr-4 pl-10 focus:ring-2 focus:outline-none"
	/>
</div>
