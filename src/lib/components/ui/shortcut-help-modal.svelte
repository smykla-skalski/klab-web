<script lang="ts">
	import { X } from 'lucide-svelte';
	import { createFocusTrap } from 'focus-trap';
	import Button from './button.svelte';

	let { open = $bindable(false) }: { open?: boolean } = $props();

	let modalElement = $state<HTMLElement>(undefined!);
	let focusTrap: ReturnType<typeof createFocusTrap> | null = null;
	let previousActiveElement: HTMLElement | null = null;

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

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			open = false;
		}
	}

	function handleEscape(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			open = false;
		}
	}

	$effect(() => {
		// Skip focus trap in test environment to avoid unhandled promise rejections
		const isTest = typeof process !== 'undefined' && process.env.NODE_ENV === 'test';

		if (open && modalElement && !isTest) {
			previousActiveElement = document.activeElement as HTMLElement;
			focusTrap = createFocusTrap(modalElement, {
				escapeDeactivates: false,
				allowOutsideClick: true,
				checkCanFocusTrap: (trapContainers) => {
					return new Promise((resolve) => {
						const check = () => {
							const tabbable = trapContainers.some((container) => {
								const elements = container.querySelectorAll(
									'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
								);
								return elements.length > 0;
							});
							if (tabbable) {
								resolve();
							} else {
								requestAnimationFrame(check);
							}
						};
						check();
					});
				}
			});
			focusTrap.activate();
		} else if (!open && focusTrap) {
			focusTrap.deactivate();
			focusTrap = null;
			if (previousActiveElement) {
				previousActiveElement.focus();
				previousActiveElement = null;
			}
		}

		return () => {
			if (focusTrap) {
				focusTrap.deactivate();
			}
		};
	});
</script>

{#if open}
	<!-- Backdrop container -->
	<div
		bind:this={modalElement}
		class="fixed inset-0 z-40 flex items-center justify-center bg-black/50"
		onclick={handleBackdropClick}
		onkeydown={handleEscape}
		role="dialog"
		aria-modal="true"
		aria-labelledby="shortcut-title"
		tabindex="-1"
	>
		<!-- Modal content -->
		<div class="border-border bg-background w-full max-w-lg rounded-lg p-6 shadow-lg">
			<div class="mb-4 flex items-center justify-between">
				<h2 id="shortcut-title" class="text-xl font-semibold">Keyboard Shortcuts</h2>
				<Button
					variant="ghost"
					size="sm"
					onclick={() => (open = false)}
					aria-label="Close shortcuts help"
				>
					<X class="h-4 w-4" />
				</Button>
			</div>

			<div class="space-y-6">
				{#each shortcuts as section}
					<div>
						<h3 class="text-muted-foreground mb-3 text-sm font-semibold">{section.category}</h3>
						<div class="space-y-2">
							{#each section.items as item}
								<div class="flex items-center justify-between">
									<span class="text-sm">{item.description}</span>
									<kbd
										class="border-border bg-muted text-muted-foreground rounded border px-2 py-1 font-mono text-xs"
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
	</div>
{/if}
