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
		<h1 class="mb-4 text-4xl font-bold text-foreground">Unable to load labs</h1>
		<p class="mb-8 text-muted-foreground">
			{$page.error?.message || 'Failed to fetch lab catalog. Please try again.'}
		</p>
		<div class="flex justify-center gap-4">
			<Button onclick={() => window.location.reload()} variant="default">
				<RefreshCw class="mr-2 h-4 w-4" />
				Retry
			</Button>
			<Button href="/" variant="outline">
				<Home class="mr-2 h-4 w-4" />
				Home
			</Button>
		</div>
	</div>
</main>
