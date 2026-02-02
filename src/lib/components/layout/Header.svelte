<script lang="ts">
	import { Menu, Sun, Moon } from 'lucide-svelte';
	import Button from '$lib/components/ui/button.svelte';
	import { mode, toggleMode } from '$lib/stores/theme';

	let mobileMenuOpen = $state(false);
</script>

<header class="border-border bg-background border-b">
	<div class="flex h-16 w-full items-center justify-between px-4">
		<a href="/" class="text-foreground text-xl font-bold">klab</a>

		<!-- Desktop Navigation -->
		<nav class="hidden items-center gap-6 md:flex">
			<a href="/learn" class="text-foreground hover:text-primary text-sm transition-colors">Learn</a
			>
			<a href="/about" class="text-foreground hover:text-primary text-sm transition-colors">About</a
			>
			<a href="/docs" class="text-foreground hover:text-primary text-sm transition-colors">Docs</a>
			<Button variant="ghost" size="icon" onclick={toggleMode} aria-label="Toggle theme">
				{#if mode.current === 'dark'}
					<Sun class="h-5 w-5" />
				{:else}
					<Moon class="h-5 w-5" />
				{/if}
			</Button>
		</nav>

		<!-- Mobile Menu Button -->
		<Button
			variant="ghost"
			size="icon"
			class="md:hidden"
			onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
			aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
			aria-expanded={mobileMenuOpen}
			aria-controls="mobile-nav"
		>
			<Menu class="h-5 w-5" aria-hidden="true" />
		</Button>
	</div>

	<!-- Mobile Navigation -->
	{#if mobileMenuOpen}
		<nav id="mobile-nav" class="border-border bg-background border-t px-4 py-4 md:hidden">
			<div class="flex flex-col gap-4">
				<a
					href="/learn"
					class="text-foreground hover:text-primary text-sm transition-colors"
					onclick={() => (mobileMenuOpen = false)}
				>
					Learn
				</a>
				<a
					href="/about"
					class="text-foreground hover:text-primary text-sm transition-colors"
					onclick={() => (mobileMenuOpen = false)}
				>
					About
				</a>
				<a
					href="/docs"
					class="text-foreground hover:text-primary text-sm transition-colors"
					onclick={() => (mobileMenuOpen = false)}
				>
					Docs
				</a>
				<Button variant="ghost" size="sm" onclick={toggleMode} class="justify-start">
					{#if mode.current === 'dark'}
						<Sun class="mr-2 h-4 w-4" />
						Light mode
					{:else}
						<Moon class="mr-2 h-4 w-4" />
						Dark mode
					{/if}
				</Button>
			</div>
		</nav>
	{/if}
</header>
