<script lang="ts">
	import { LabCard } from '$lib/components/catalog';
	import { progress } from '$lib/stores/progress';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const completedLabIds = $derived(
		new Set(
			Object.entries($progress)
				.filter(([_, completed]) => completed)
				.map(([id, _]) => id)
		)
	);

	function navigateToLab(labId: string) {
		goto(`/learn/${data.category.id}/${labId}`);
	}
</script>

<svelte:head>
	<title>{data.category.name} Labs - klab</title>
</svelte:head>

<div class="container mx-auto px-4 py-12">
	<div class="mb-12">
		<div class="mb-4 text-6xl">{data.category.icon}</div>
		<h1 class="mb-4 text-4xl font-bold">{data.category.name} Labs</h1>
		<p class="text-lg text-muted-foreground">
			{data.category.description}
		</p>
	</div>

	<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each data.labs as lab}
			<LabCard
				{lab}
				isCompleted={completedLabIds.has(`${lab.category}/${lab.id}`)}
				onclick={() => navigateToLab(lab.id)}
			/>
		{/each}
	</div>
</div>
