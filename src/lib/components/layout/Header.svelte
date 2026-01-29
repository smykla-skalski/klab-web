<script lang="ts">
	import { Menu } from 'lucide-svelte';
	import Button from '$lib/components/ui/button.svelte';

	let mobileMenuOpen = $state(false);
</script>

<header class="border-border bg-background border-b">
	<div class="container mx-auto flex h-16 items-center justify-between px-4">
		<a href="/" class="text-xl font-bold">klab</a>

		<!-- Desktop Navigation -->
		<nav class="hidden items-center gap-6 md:flex">
			<a href="/learn" class="hover:text-primary text-sm transition-colors">Learn</a>
			<a href="/about" class="hover:text-primary text-sm transition-colors">About</a>
			<a href="/docs" class="hover:text-primary text-sm transition-colors">Docs</a>
		</nav>

		<!-- Mobile Menu Button -->
		<Button
			variant="ghost"
			size="icon"
			class="md:hidden"
			onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
		>
			<Menu class="h-5 w-5" />
		</Button>
	</div>

	<!-- Mobile Navigation -->
	{#if mobileMenuOpen}
		<nav class="border-border bg-background border-t px-4 py-4 md:hidden">
			<div class="flex flex-col gap-4">
				<a href="/learn" class="hover:text-primary text-sm transition-colors">Learn</a>
				<a href="/about" class="hover:text-primary text-sm transition-colors">About</a>
				<a href="/docs" class="hover:text-primary text-sm transition-colors">Docs</a>
			</div>
		</nav>
	{/if}
</header>
