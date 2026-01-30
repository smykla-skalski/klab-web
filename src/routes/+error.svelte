<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/button.svelte';
	import { Home, RefreshCw } from 'lucide-svelte';
</script>

<svelte:head>
	<title>Error - klab</title>
</svelte:head>

<main class="bg-background flex min-h-screen items-center justify-center px-4">
	<div class="text-center">
		{#if $page.status === 404}
			<h1 class="text-foreground mb-4 text-6xl font-bold">404</h1>
			<h2 class="text-foreground mb-4 text-2xl font-semibold">Page Not Found</h2>
			<p class="text-muted-foreground mb-8">The page you're looking for doesn't exist.</p>
		{:else}
			<h1 class="text-foreground mb-4 text-6xl font-bold">{$page.status}</h1>
			<h2 class="text-foreground mb-4 text-2xl font-semibold">Something went wrong</h2>
			<p class="text-muted-foreground mb-8">
				{$page.error?.message || 'An unexpected error occurred'}
			</p>
		{/if}
		<div class="flex justify-center gap-4">
			<Button href="/learn" variant="default">
				<Home class="mr-2 h-4 w-4" />
				Back to Labs
			</Button>
			<Button onclick={() => window.location.reload()} variant="outline">
				<RefreshCw class="mr-2 h-4 w-4" />
				Retry
			</Button>
		</div>
	</div>
</main>
