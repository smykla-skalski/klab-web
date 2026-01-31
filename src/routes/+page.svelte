<script lang="ts">
	import { ArrowRight, Code, Terminal, BookOpen } from 'lucide-svelte';
	import Button from '$lib/components/ui/button.svelte';
</script>

<svelte:head>
	<title>klab - Interactive Learning Platform</title>
	<meta
		name="description"
		content="Master new skills through interactive labs and hands-on exercises"
	/>
</svelte:head>

<!-- Hero Section -->
<section class="flex min-h-[80vh] flex-col items-center justify-center text-center px-4">
	<h1 class="mb-6 text-5xl font-bold md:text-6xl">
		Learn by <span class="text-primary">Doing</span>
	</h1>
	<p class="text-muted-foreground mb-8 max-w-2xl text-lg">
		Master technical skills through interactive labs in real environments. No setup required,
		start learning immediately.
	</p>
	<div class="flex gap-4">
		<Button href="/learn" size="lg">
			Browse Labs
			<ArrowRight class="ml-2 h-4 w-4" />
		</Button>
		<Button href="/about" variant="outline" size="lg">Learn More</Button>
	</div>
</section>

<!-- Features Section -->
<section class="py-20 px-4">
	<h2 class="mb-12 text-center text-3xl font-bold">Why klab?</h2>
	<div class="grid gap-8 md:grid-cols-3 px-4">
			<div class="text-center">
				<div class="mb-4 flex justify-center">
					<div class="bg-primary/10 rounded-lg p-4">
						<Terminal class="text-primary h-8 w-8" />
					</div>
				</div>
				<h3 class="mb-2 text-xl font-semibold">Real Environments</h3>
				<p class="text-muted-foreground">
					Practice in actual terminals with real tools, not simulations.
				</p>
			</div>

			<div class="text-center">
				<div class="mb-4 flex justify-center">
					<div class="bg-primary/10 rounded-lg p-4">
						<Code class="text-primary h-8 w-8" />
					</div>
				</div>
				<h3 class="mb-2 text-xl font-semibold">Hands-On Labs</h3>
				<p class="text-muted-foreground">
					Learn through practical exercises with instant validation.
				</p>
			</div>

			<div class="text-center">
				<div class="mb-4 flex justify-center">
					<div class="bg-primary/10 rounded-lg p-4">
						<BookOpen class="text-primary h-8 w-8" />
					</div>
				</div>
				<h3 class="mb-2 text-xl font-semibold">Guided Learning</h3>
				<p class="text-muted-foreground">
					Get hints when stuck and learn from detailed explanations.
				</p>
			</div>
	</div>
</section>
