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
	<Search class="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
	<input
		type="text"
		bind:value={inputValue}
		{placeholder}
		class="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
	/>
</div>
