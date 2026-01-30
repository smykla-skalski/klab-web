<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { SearchInput, FilterChipGroup, SortDropdown, LabCard } from '$lib/components/catalog';
	import { filterLabs, sortLabs } from '$lib/services/lab-filter';
	import {
		filters,
		sortBy,
		searchQuery,
		selectedDifficulties,
		selectedCategories,
		completionFilter,
		initializeFiltersFromURL,
		syncFiltersToURL
	} from '$lib/stores/catalog-filters';
	import { progress } from '$lib/stores/progress';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let isInitializing = $state(true);

	// Initialize filters from URL params (once)
	$effect(() => {
		if (isInitializing) {
			initializeFiltersFromURL($page.url.searchParams);
			isInitializing = false;
		}
	});

	// Sync filters to URL when they change (skip during initialization)
	$effect(() => {
		if (!isInitializing) {
			syncFiltersToURL($filters, $sortBy);
		}
	});

	// Get completed lab IDs
	const completedLabIds = $derived(
		new Set(
			Object.entries($progress)
				.filter(([_, completed]) => completed)
				.map(([id, _]) => id)
		)
	);

	// Filter and sort labs
	const filteredLabs = $derived(filterLabs(data.labs, $filters, completedLabIds));
	const sortedLabs = $derived(sortLabs(filteredLabs, $sortBy));

	function navigateToLab(category: string, labId: string) {
		goto(`/learn/${category}/${labId}`);
	}
</script>

<svelte:head>
	<title>Learn - klab</title>
	<meta name="description" content="Browse interactive labs and hands-on exercises" />
</svelte:head>

<div class="container mx-auto px-4 py-12">
	<div class="mb-12 text-center">
		<h1 class="mb-4 text-4xl font-bold">Interactive Labs</h1>
		<p class="text-lg text-gray-600">Master new skills through hands-on practice</p>
	</div>

	<!-- Search and Filter Section -->
	<div class="mb-8 space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
		<!-- Search -->
		<SearchInput bind:value={$searchQuery} />

		<!-- Filters -->
		<div class="grid gap-6 md:grid-cols-2">
			<FilterChipGroup
				label="Difficulty"
				options={['Beginner', 'Intermediate', 'Advanced']}
				bind:selected={$selectedDifficulties}
			/>

			<FilterChipGroup
				label="Category"
				options={data.categories.map((c) => c.id)}
				bind:selected={$selectedCategories}
			/>
		</div>

		<!-- Sort and Stats -->
		<div class="flex items-center justify-between border-t border-gray-200 pt-4">
			<div class="text-sm text-gray-600">
				Showing {sortedLabs.length} of {data.labs.length} labs
			</div>
			<SortDropdown bind:value={$sortBy} />
		</div>
	</div>

	<!-- Labs Grid -->
	{#if sortedLabs.length > 0}
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each sortedLabs as lab (lab.id)}
				<LabCard
					{lab}
					isCompleted={completedLabIds.has(`${lab.category}/${lab.id}`)}
					onclick={() => navigateToLab(lab.category, lab.id)}
				/>
			{/each}
		</div>
	{:else}
		<div class="rounded-lg border border-gray-200 bg-white p-12 text-center">
			<p class="text-lg text-gray-600">No labs match your filters</p>
			<button
				onclick={() => {
					$searchQuery = '';
					$selectedDifficulties = [];
					$selectedCategories = [];
					$completionFilter = null;
				}}
				class="mt-4 text-sm text-blue-600 hover:text-blue-700"
			>
				Clear all filters
			</button>
		</div>
	{/if}
</div>
