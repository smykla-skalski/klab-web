<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Lab } from '$lib/stores/lab';
	import type { Snippet } from 'svelte';
	import { PanelLeftClose, PanelLeft, X } from 'lucide-svelte';
	import Button from '$lib/components/ui/button.svelte';

	interface Props {
		lab: Lab;
		sidebar: Snippet;
		main: Snippet;
		actions?: Snippet;
		sidebarOpen?: boolean;
	}

	let { lab, sidebar, main, actions, sidebarOpen = $bindable(true) }: Props = $props();
	let mobileDrawerOpen = $state(false);
	let sidebarWidth = $state(320);
	let resizing = $state(false);
	let originalBodyOverflow = '';

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}

	function toggleMobileDrawer() {
		mobileDrawerOpen = !mobileDrawerOpen;
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

	function handleResizeKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			const newWidth = sidebarWidth - 10;
			if (newWidth >= 280) {
				sidebarWidth = newWidth;
			}
		} else if (e.key === 'ArrowRight') {
			e.preventDefault();
			const newWidth = sidebarWidth + 10;
			if (newWidth <= 600) {
				sidebarWidth = newWidth;
			}
		}
	}

	onMount(() => {
		originalBodyOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
	});

	onDestroy(() => {
		document.body.style.overflow = originalBodyOverflow;
		document.removeEventListener('mousemove', handleResize);
		document.removeEventListener('mouseup', stopResize);
	});
</script>

<div class="flex h-screen flex-col">
	<!-- Header -->
	<div class="border-border bg-background flex items-center justify-between border-b px-4 py-3">
		<div class="flex items-center gap-4">
			<!-- Desktop sidebar toggle -->
			<Button variant="ghost" size="sm" onclick={toggleSidebar} class="hidden md:flex">
				{#if sidebarOpen}
					<PanelLeftClose class="h-4 w-4" />
				{:else}
					<PanelLeft class="h-4 w-4" />
				{/if}
			</Button>
			<!-- Mobile drawer toggle -->
			<Button variant="ghost" size="sm" onclick={toggleMobileDrawer} class="md:hidden">
				<PanelLeft class="h-4 w-4" />
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
		<!-- Desktop Sidebar -->
		{#if sidebarOpen}
			<div
				class="border-border bg-secondary hidden border-r md:block"
				style="width: {sidebarWidth}px; min-width: {sidebarWidth}px;"
			>
				{@render sidebar()}
			</div>

			<!-- Resize handle -->
			<button
				class="group bg-border hover:bg-primary relative hidden w-1 cursor-col-resize border-0 p-0 transition-colors md:block"
				onmousedown={startResize}
				onkeydown={handleResizeKeydown}
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

	<!-- Mobile Drawer -->
	{#if mobileDrawerOpen}
		<!-- Backdrop -->
		<button
			class="fixed inset-0 z-40 bg-black/50 md:hidden"
			onclick={toggleMobileDrawer}
			aria-label="Close drawer"
		></button>

		<!-- Drawer -->
		<div class="border-border bg-secondary fixed inset-y-0 left-0 z-50 w-80 border-r md:hidden">
			<div class="flex items-center justify-between border-b border-border p-4">
				<h2 class="font-semibold">Lab Info</h2>
				<Button variant="ghost" size="sm" onclick={toggleMobileDrawer}>
					<X class="h-4 w-4" />
				</Button>
			</div>
			{@render sidebar()}
		</div>
	{/if}
</div>
