<script lang="ts">
	import { X } from 'lucide-svelte';
	import { createFocusTrap } from 'focus-trap';
	import Button from './button.svelte';

	interface Props {
		open?: boolean;
		title?: string;
		message: string;
		confirmLabel?: string;
		cancelLabel?: string;
		onConfirm: () => void;
		onCancel: () => void;
	}

	let {
		open = $bindable(false),
		title = 'Confirm Action',
		message,
		confirmLabel = 'Confirm',
		cancelLabel = 'Cancel',
		onConfirm,
		onCancel
	}: Props = $props();

	let modalElement = $state<HTMLElement>(undefined!);
	let focusTrap: ReturnType<typeof createFocusTrap> | null = null;
	let previousActiveElement: HTMLElement | null = null;

	function handleConfirm() {
		onConfirm();
		open = false;
	}

	function handleCancel() {
		onCancel();
		open = false;
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			handleCancel();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			handleCancel();
		}
	}

	$effect(() => {
		// Skip focus trap in test environment to avoid unhandled promise rejections
		const isTest = typeof process !== 'undefined' && process.env.NODE_ENV === 'test';

		if (open && modalElement && !isTest) {
			previousActiveElement = document.activeElement as HTMLElement;
			focusTrap = createFocusTrap(modalElement, {
				initialFocus: modalElement,
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
	<div
		bind:this={modalElement}
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
		onclick={handleBackdropClick}
		onkeydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
		tabindex="-1"
	>
		<div class="bg-background border-border w-full max-w-md rounded-lg border shadow-lg">
			<div class="border-border flex items-center justify-between border-b px-6 py-4">
				<h2 id="modal-title" class="text-lg font-semibold">{title}</h2>
				<button
					type="button"
					class="text-muted-foreground hover:text-foreground transition-colors"
					onclick={handleCancel}
					aria-label="Close modal"
				>
					<X class="h-5 w-5" />
				</button>
			</div>
			<div class="px-6 py-4">
				<p class="text-sm leading-relaxed">{message}</p>
			</div>
			<div class="border-border flex justify-end gap-2 border-t px-6 py-4">
				<Button variant="ghost" onclick={handleCancel}>{cancelLabel}</Button>
				<Button variant="destructive" onclick={handleConfirm}>{confirmLabel}</Button>
			</div>
		</div>
	</div>
{/if}
