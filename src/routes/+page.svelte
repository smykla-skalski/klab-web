<script lang="ts">
	import { onMount } from 'svelte';

	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});
</script>

<svelte:head>
	<title>klab - Interactive Learning Platform</title>
	<meta
		name="description"
		content="Master new skills through interactive labs and hands-on exercises"
	/>
</svelte:head>

<main class="flex min-h-screen items-center justify-center p-8">
	{#if mounted}
		<div class="text-center">
			<h1 class="mb-4 text-4xl font-bold">klab</h1>
			<p class="text-muted-foreground">Interactive Learning Platform</p>
		</div>
	{/if}
</main>
