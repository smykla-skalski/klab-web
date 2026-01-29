<script lang="ts">
	import { page } from '$app/stores';
	import { CheckCircle, Clock } from 'lucide-svelte';
	import { progress } from '$lib/stores/progress';

	const category = $derived($page.params.category);

	// Placeholder data - will be replaced with dynamic content from CMS in Phase 3
	const labs = [
		{
			id: 'intro',
			title: 'Getting Started',
			description: 'Learn the basics and set up your environment',
			duration: '15 min',
			difficulty: 'Beginner'
		},
		{
			id: 'intermediate',
			title: 'Intermediate Concepts',
			description: 'Dive deeper into advanced topics',
			duration: '30 min',
			difficulty: 'Intermediate'
		},
		{
			id: 'advanced',
			title: 'Advanced Techniques',
			description: 'Master complex scenarios',
			duration: '45 min',
			difficulty: 'Advanced'
		}
	];

	const isCompleted = (labId: string) => $progress.completedLabs.includes(`${category}/${labId}`);
</script>

<svelte:head>
	<title>{category} Labs - klab</title>
</svelte:head>

<div class="container mx-auto px-4 py-12">
	<div class="mb-12">
		<h1 class="mb-4 text-4xl font-bold capitalize">{category} Labs</h1>
		<p class="text-muted-foreground text-lg">
			Complete these labs to master {category}
		</p>
	</div>

	<div class="grid gap-6">
		{#each labs as lab}
			<a
				href="/learn/{category}/{lab.id}"
				class="group border-border hover:bg-accent flex items-start gap-4 rounded-lg border p-6 transition-colors"
			>
				<div class="mt-1">
					{#if isCompleted(lab.id)}
						<CheckCircle class="h-6 w-6 text-green-500" />
					{:else}
						<div class="border-muted h-6 w-6 rounded-full border-2"></div>
					{/if}
				</div>

				<div class="flex-1">
					<h2 class="group-hover:text-primary mb-2 text-xl font-semibold">{lab.title}</h2>
					<p class="text-muted-foreground mb-4 text-sm">{lab.description}</p>
					<div class="text-muted-foreground flex gap-4 text-sm">
						<span class="inline-flex items-center gap-1">
							<Clock class="h-4 w-4" />
							{lab.duration}
						</span>
						<span class="bg-muted rounded-full px-2 py-1 text-xs">{lab.difficulty}</span>
					</div>
				</div>
			</a>
		{/each}
	</div>
</div>
