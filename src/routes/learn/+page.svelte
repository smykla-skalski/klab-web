<script lang="ts">
	import { BookOpen, Code, Terminal } from 'lucide-svelte';
</script>

<svelte:head>
	<title>Learn - klab</title>
	<meta name="description" content="Browse interactive labs and hands-on exercises" />
</svelte:head>

<div class="container mx-auto px-4 py-12">
	<div class="mb-12 text-center">
		<h1 class="mb-4 text-4xl font-bold">Interactive Labs</h1>
		<p class="text-muted-foreground text-lg">Master new skills through hands-on practice</p>
	</div>

	<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
		<a
			href="/learn/kubernetes"
			class="group border-border hover:bg-accent rounded-lg border p-6 transition-colors"
		>
			<div class="mb-4 flex items-center gap-3">
				<div class="bg-primary/10 rounded-lg p-2">
					<Code class="text-primary h-6 w-6" />
				</div>
				<h2 class="group-hover:text-primary text-xl font-semibold">Kubernetes</h2>
			</div>
			<p class="text-muted-foreground text-sm">
				Learn container orchestration with hands-on Kubernetes labs
			</p>
		</a>

		<a
			href="/learn/linux"
			class="group border-border hover:bg-accent rounded-lg border p-6 transition-colors"
		>
			<div class="mb-4 flex items-center gap-3">
				<div class="bg-primary/10 rounded-lg p-2">
					<Terminal class="text-primary h-6 w-6" />
				</div>
				<h2 class="group-hover:text-primary text-xl font-semibold">Linux</h2>
			</div>
			<p class="text-muted-foreground text-sm">
				Master Linux fundamentals through practical exercises
			</p>
		</a>

		<a
			href="/learn/networking"
			class="group border-border hover:bg-accent rounded-lg border p-6 transition-colors"
		>
			<div class="mb-4 flex items-center gap-3">
				<div class="bg-primary/10 rounded-lg p-2">
					<BookOpen class="text-primary h-6 w-6" />
				</div>
				<h2 class="group-hover:text-primary text-xl font-semibold">Networking</h2>
			</div>
			<p class="text-muted-foreground text-sm">
				Build networking skills with interactive scenarios
			</p>
		</a>
	</div>
</div>
