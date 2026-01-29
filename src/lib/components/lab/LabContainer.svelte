<script lang="ts">
	import type { Lab } from '$lib/stores/lab';
	import type { Snippet } from 'svelte';
	import { PanelLeftClose, PanelLeft } from 'lucide-svelte';
	import Button from '$lib/components/ui/button.svelte';

	interface Props {
		lab: Lab;
		sidebar: Snippet;
		main: Snippet;
		actions?: Snippet;
	}

	let { lab, sidebar, main, actions }: Props = $props();

	let sidebarOpen = $state(true);
	let sidebarWidth = $state(320);
	let resizing = $state(false);

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}

	function startResize(e: MouseEvent) {
		resizing = true;
		document.addEventListener('mousemove', handleResize);
		document.addEventListener('mouseup', stopResize);
		e.preventDefault();
	}

	function handleResize(e: MouseEvent) {
		if (resizing) {
			const newWidth = e.clientX;
			if (newWidth >= 280 && newWidth <= 600) {
				sidebarWidth = newWidth;
			}
		}
	}

	function stopResize() {
		resizing = false;
		document.removeEventListener('mousemove', handleResize);
		document.removeEventListener('mouseup', stopResize);
	}
</script>

<div class="flex h-screen flex-col">
	<!-- Header -->
	<div class="border-border bg-background flex items-center justify-between border-b px-4 py-3">
		<div class="flex items-center gap-4">
			<Button variant="ghost" size="sm" onclick={toggleSidebar}>
				{#if sidebarOpen}
					<PanelLeftClose class="h-4 w-4" />
				{:else}
					<PanelLeft class="h-4 w-4" />
				{/if}
			</Button>
			<div>
				<h1 class="text-lg font-semibold">{lab.title}</h1>
				<p class="text-muted-foreground text-sm">{lab.category}</p>
			</div>
		</div>
		{#if actions}
			<div class="flex items-center gap-2">
				{@render actions()}
			</div>
		{/if}
	</div>

	<!-- Main content area -->
	<div class="flex flex-1 overflow-hidden">
		<!-- Sidebar -->
		{#if sidebarOpen}
			<div
				class="border-border bg-secondary border-r"
				style="width: {sidebarWidth}px; min-width: {sidebarWidth}px;"
			>
				{@render sidebar()}
			</div>

			<!-- Resize handle -->
			<button
				class="group bg-border hover:bg-primary relative w-1 cursor-col-resize border-0 p-0 transition-colors"
				onmousedown={startResize}
				aria-label="Resize sidebar"
				type="button"
			>
				<div class="absolute inset-y-0 -right-1 -left-1"></div>
			</button>
		{/if}

		<!-- Main content -->
		<div class="bg-background flex-1 overflow-hidden">
			{@render main()}
		</div>
	</div>
</div>

<style>
	:global(body) {
		overflow: hidden;
	}
</style>
