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
	import Skeleton from '$lib/components/ui/skeleton.svelte';
	import { ChevronDown, ChevronUp } from 'lucide-svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let isInitializing = $state(true);
	let filtersExpanded = $state(true);

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
		<p class="text-muted-foreground text-lg">Master new skills through hands-on practice</p>
	</div>

	<!-- Search and Filter Section -->
	<div class="border-border bg-background mb-8 space-y-6 rounded-lg p-6 shadow-sm">
		<!-- Search -->
		<SearchInput bind:value={$searchQuery} />

		<!-- Mobile filter toggle -->
		<button
			onclick={() => (filtersExpanded = !filtersExpanded)}
			class="flex w-full items-center justify-between text-sm font-medium md:hidden"
			aria-expanded={filtersExpanded}
			aria-label="Toggle filters"
		>
			<span>
				Filters
				{#if $selectedDifficulties.length + $selectedCategories.length > 0}
					<span class="bg-primary text-primary-foreground ml-2 rounded-full px-2 py-0.5 text-xs">
						{$selectedDifficulties.length + $selectedCategories.length}
					</span>
				{/if}
			</span>
			{#if filtersExpanded}
				<ChevronUp class="h-4 w-4" />
			{:else}
				<ChevronDown class="h-4 w-4" />
			{/if}
		</button>

		<!-- Filters -->
		<div class="grid gap-6 md:grid-cols-2" class:hidden={!filtersExpanded} class:md:grid={true}>
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
		<div class="border-border flex items-center justify-between border-t pt-4">
			<div class="text-muted-foreground text-sm">
				Showing {sortedLabs.length} of {data.labs.length} labs
			</div>
			<SortDropdown bind:value={$sortBy} />
		</div>
	</div>

	<!-- Labs Grid -->
	{#await data.labs}
		<!-- Loading skeletons -->
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each Array(6) as _, i (i)}
				<div class="border-border bg-background rounded-lg p-6">
					<Skeleton className="mb-3" width="80px" height="20px" />
					<Skeleton className="mb-2" width="100%" height="28px" />
					<Skeleton className="mb-4" width="100%" height="40px" />
					<div class="flex items-center justify-between">
						<Skeleton width="60px" height="20px" />
						<div class="flex gap-1">
							<Skeleton width="50px" height="24px" />
							<Skeleton width="50px" height="24px" />
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:then}
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
			<div class="border-border bg-background rounded-lg p-12 text-center">
				<p class="text-muted-foreground text-lg">No labs match your filters</p>
				<button
					onclick={() => {
						$searchQuery = '';
						$selectedDifficulties = [];
						$selectedCategories = [];
						$completionFilter = null;
					}}
					class="text-primary mt-4 text-sm hover:underline"
				>
					Clear all filters
				</button>
			</div>
		{/if}
	{/await}
</div>
