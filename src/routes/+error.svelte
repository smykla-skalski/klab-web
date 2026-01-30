<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/button.svelte';
	import { Home, RefreshCw } from 'lucide-svelte';
</script>

<svelte:head>
	<title>Error - klab</title>
</svelte:head>

<main class="flex min-h-screen items-center justify-center bg-background px-4">
	<div class="text-center">
		{#if $page.status === 404}
			<h1 class="mb-4 text-6xl font-bold text-foreground">404</h1>
			<h2 class="mb-4 text-2xl font-semibold text-foreground">Page Not Found</h2>
			<p class="mb-8 text-muted-foreground">The page you're looking for doesn't exist.</p>
		{:else}
			<h1 class="mb-4 text-6xl font-bold text-foreground">{$page.status}</h1>
			<h2 class="mb-4 text-2xl font-semibold text-foreground">Something went wrong</h2>
			<p class="mb-8 text-muted-foreground">
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
