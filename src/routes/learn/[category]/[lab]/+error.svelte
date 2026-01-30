<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/button.svelte';
	import { Home, BookOpen, RefreshCw } from 'lucide-svelte';
</script>

<svelte:head>
	<title>Error - klab</title>
</svelte:head>

<main class="bg-background flex min-h-screen items-center justify-center px-4">
	<div class="text-center">
		{#if $page.status === 404}
			<h1 class="text-foreground mb-4 text-4xl font-bold">Lab Not Found</h1>
			<p class="text-muted-foreground mb-8">
				The lab you're looking for doesn't exist or has been moved.
			</p>
		{:else}
			<h1 class="text-foreground mb-4 text-4xl font-bold">Connection Error</h1>
			<p class="text-muted-foreground mb-8">
				{$page.error?.message || 'Failed to connect to lab environment. Please try again.'}
			</p>
		{/if}
		<div class="flex justify-center gap-4">
			<Button href="/learn" variant="default">
				<Home class="mr-2 h-4 w-4" />
				Back to Labs
			</Button>
			{#if $page.status !== 404}
				<Button onclick={() => window.location.reload()} variant="outline">
					<RefreshCw class="mr-2 h-4 w-4" />
					Retry
				</Button>
			{/if}
			<Button href="/learn/{$page.params.category}/{$page.params.lab}/knowledge" variant="ghost">
				<BookOpen class="mr-2 h-4 w-4" />
				View Knowledge Base
			</Button>
		</div>
	</div>
</main>
