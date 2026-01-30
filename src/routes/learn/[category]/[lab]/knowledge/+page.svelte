<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';
	import { ArticleRenderer } from '$lib/components/knowledge';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Knowledge - {data.labId} - klab</title>
</svelte:head>

<div class="container mx-auto px-4 py-12">
	<div class="mb-8">
		<a
			href="/learn/{data.category}/{data.labId}"
			class="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80"
		>
			<ArrowLeft class="h-4 w-4" />
			Back to lab
		</a>
	</div>

	<div class="mx-auto max-w-4xl rounded-lg border border-border bg-background p-8 shadow-sm">
		<ArticleRenderer html={data.html} />
	</div>
</div>
