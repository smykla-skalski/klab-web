<script lang="ts">
	import { page } from '$app/stores';

	const category = $derived($page.params.category);
	const labId = $derived($page.params.lab);
</script>

<svelte:head>
	<title>Knowledge - {category}/{labId} - klab</title>
</svelte:head>

<div class="container mx-auto px-4 py-12">
	<div class="mb-8">
		<a href="/learn/{category}/{labId}" class="text-muted-foreground hover:text-primary text-sm">
			← Back to lab
		</a>
	</div>

	<article class="prose prose-invert mx-auto max-w-3xl">
		<h1 class="capitalize">{labId} Knowledge Article</h1>

		<p>
			This knowledge article will contain detailed explanations, concepts, and references for the {labId}
			lab.
		</p>

		<h2>Overview</h2>
		<p>Knowledge articles will be implemented in Phase 3 with markdown rendering support.</p>

		<h2>Key Concepts</h2>
		<ul>
			<li>Concept 1</li>
			<li>Concept 2</li>
			<li>Concept 3</li>
		</ul>
	</article>
</div>
