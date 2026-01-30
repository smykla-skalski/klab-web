<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { createFocusTrap } from 'focus-trap';
	import { X } from 'lucide-svelte';
	import Button from './button.svelte';

	let { open = $bindable(false) }: { open?: boolean } = $props();

	const shortcuts = [
		{
			category: 'Global',
			items: [
				{ key: 'Ctrl+Shift+T', description: 'Toggle theme' },
				{ key: 'Shift+/', description: 'Show keyboard shortcuts' }
			]
		},
		{
			category: 'Lab',
			items: [
				{ key: 'Ctrl+Enter', description: 'Check solution' },
				{ key: 'Ctrl+H', description: 'Toggle hints' },
				{ key: 'Ctrl+B', description: 'Toggle sidebar' },
				{ key: 'Ctrl+\\', description: 'Focus terminal' }
			]
		}
	];

	let modalElement = $state<HTMLElement>(undefined!);
	let focusTrap: ReturnType<typeof createFocusTrap> | null = null;

	function handleBackdropClick() {
		open = false;
	}

	function handleEscape(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			open = false;
		}
	}

	$effect(() => {
		if (open && modalElement) {
			focusTrap = createFocusTrap(modalElement, {
				initialFocus: modalElement,
				escapeDeactivates: false,
				clickOutsideDeactivates: false
			});
			focusTrap.activate();
		} else if (!open && focusTrap) {
			focusTrap.deactivate();
			focusTrap = null;
		}
	});

	onDestroy(() => {
		if (focusTrap) {
			focusTrap.deactivate();
		}
	});
</script>

{#if open}
	<!-- Backdrop -->
	<button
		class="fixed inset-0 z-40 bg-black/50"
		onclick={handleBackdropClick}
		aria-label="Close"
	></button>

	<!-- Modal -->
	<div
		bind:this={modalElement}
		class="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border-border bg-background p-6 shadow-lg"
		onkeydown={handleEscape}
		role="dialog"
		aria-modal="true"
		aria-labelledby="shortcut-title"
		tabindex="-1"
	>
		<div class="mb-4 flex items-center justify-between">
			<h2 id="shortcut-title" class="text-xl font-semibold">Keyboard Shortcuts</h2>
			<Button variant="ghost" size="sm" onclick={() => (open = false)} aria-label="Close shortcuts help">
				<X class="h-4 w-4" />
			</Button>
		</div>

		<div class="space-y-6">
			{#each shortcuts as section}
				<div>
					<h3 class="mb-3 text-sm font-semibold text-muted-foreground">{section.category}</h3>
					<div class="space-y-2">
						{#each section.items as item}
							<div class="flex items-center justify-between">
								<span class="text-sm">{item.description}</span>
								<kbd
									class="rounded border border-border bg-muted px-2 py-1 font-mono text-xs text-muted-foreground"
								>
									{item.key}
								</kbd>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}
