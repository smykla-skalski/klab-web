<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/button.svelte';
	import { BookOpen } from 'lucide-svelte';

	const category = $derived($page.params.category);
	const labId = $derived($page.params.lab);
</script>

<svelte:head>
	<title>{category} - {labId} - klab</title>
</svelte:head>

<div class="container mx-auto px-4 py-12">
	<div class="mb-8">
		<a href="/learn/{category}" class="text-muted-foreground hover:text-primary text-sm">
			← Back to {category} labs
		</a>
	</div>

	<div class="border-border bg-accent/50 rounded-lg border p-8 text-center">
		<h1 class="mb-4 text-3xl font-bold capitalize">{labId} Lab</h1>
		<p class="text-muted-foreground mb-6">Lab interface will be implemented in Phase 3</p>
		<div class="flex justify-center gap-4">
			<Button>
				<BookOpen class="mr-2 h-4 w-4" />
				View Knowledge Article
			</Button>
		</div>
	</div>
</div>
