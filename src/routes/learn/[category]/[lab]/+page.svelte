<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { env } from '$env/dynamic/public';
	import Button from '$lib/components/ui/button.svelte';
	import ConfirmModal from '$lib/components/ui/confirm-modal.svelte';
	import Skeleton from '$lib/components/ui/skeleton.svelte';
	import { LabContainer, LabSidebar, ValidationStatus } from '$lib/components/lab';
	import { BookOpen, CheckCircle } from 'lucide-svelte';
	import { currentLab } from '$lib/stores/lab';
	import { progress } from '$lib/stores/progress';
	import { toast } from 'svelte-sonner';
	import { registerShortcut } from '$lib/utils/keyboard-shortcuts';
	import type { PageData } from './$types';
	import type TerminalType from '$lib/components/terminal/Terminal.svelte';

	let { data }: { data: PageData } = $props();

	let Terminal: any = $state(null);
	let sidebarOpen = $state(true);
	let revealHintHandler: (() => void) | undefined = $state(undefined);

	onMount(async () => {
		if (browser) {
			try {
				const module = await import('$lib/components/terminal');
				Terminal = module.Terminal;
			} catch (error) {
				console.error('Failed to load Terminal component:', error);
			}
		}
	});

	onMount(() => {
		// Register keyboard shortcuts
		const cleanups = [
			registerShortcut('ctrl+enter', validateSolution),
			registerShortcut('ctrl+\\', () => terminal?.focus()),
			registerShortcut('ctrl+b', () => (sidebarOpen = !sidebarOpen)),
			registerShortcut('ctrl+h', () => revealHintHandler?.())
		];

		return () => {
			cleanups.forEach((cleanup) => cleanup());
		};
	});

	const category = $derived(data.lab.category);
	const labId = $derived(data.lab.id);

	$effect(() => {
		currentLab.set(data.lab);
	});

	let terminal: TerminalType = $state(undefined!);
	let validationStatus: 'idle' | 'validating' | 'success' | 'error' = $state('idle');
	let validationMessage = $state('');
	let validationTimeoutId: ReturnType<typeof setTimeout> | null = null;
	let showConfirmModal = $state(false);

	function validateSolution() {
		validationStatus = 'validating';
		validationMessage = 'Checking your solution...';

		validationTimeoutId = setTimeout(() => {
			const success = Math.random() > 0.5;
			validationStatus = success ? 'success' : 'error';
			validationMessage = success
				? 'All checks passed! Your deployment is correctly configured.'
				: 'Some checks failed. Make sure your deployment has 3 replicas and the service is of type LoadBalancer.';
			validationTimeoutId = null;

			if (success) {
				progress.markLabComplete(category, labId);
				toast.success('Lab completed!', {
					description: `You've mastered ${data.lab.title}`
				});
			}
		}, 2000);
	}

	function showSolution() {
		showConfirmModal = true;
	}

	function handleConfirmSolution() {
		terminal?.write(`\r\n$ ${data.lab.solution}\r\n`);
	}

	function handleCancelSolution() {
		// Modal closes automatically
	}

	function viewKnowledge() {
		goto(`/learn/${category}/${labId}/knowledge`);
	}

	onDestroy(() => {
		if (validationTimeoutId !== null) {
			clearTimeout(validationTimeoutId);
		}
	});
</script>

<svelte:head>
	<title>{data.lab.title} - klab</title>
</svelte:head>

<LabContainer lab={data.lab} bind:sidebarOpen>
	{#snippet sidebar()}
		<LabSidebar
			lab={data.lab}
			onRevealHint={(handler) => {
				revealHintHandler = handler;
			}}
		/>
	{/snippet}

	{#snippet main()}
		<div class="flex h-full flex-col">
			<div class="flex-1 p-4">
				{#if Terminal}
					<Terminal
						bind:this={terminal}
						wsUrl={env.PUBLIC_WS_URL ?? 'ws://localhost:8080'}
						fontSize={14}
					/>
				{:else}
					<div class="flex h-full flex-col gap-2">
						<Skeleton width="100%" height="40px" />
						<Skeleton width="80%" height="20px" />
						<Skeleton width="60%" height="20px" />
						<Skeleton width="90%" height="20px" />
					</div>
				{/if}
			</div>
			{#if validationStatus !== 'idle'}
				<div class="border-border border-t p-4">
					<ValidationStatus status={validationStatus} message={validationMessage} />
				</div>
			{/if}
		</div>
	{/snippet}

	{#snippet actions()}
		<Button variant="outline" onclick={viewKnowledge}>
			<BookOpen class="mr-2 h-4 w-4" />
			Knowledge
		</Button>
		<Button onclick={validateSolution} title="Check Solution (Ctrl+Enter)">
			<CheckCircle class="mr-2 h-4 w-4" />
			Check Solution
		</Button>
		<Button variant="ghost" onclick={showSolution}>Give Up</Button>
	{/snippet}
</LabContainer>

<ConfirmModal
	bind:open={showConfirmModal}
	title="Reveal Solution"
	message="Are you sure you want to reveal the solution? This will end the lab."
	confirmLabel="Reveal"
	onConfirm={handleConfirmSolution}
	onCancel={handleCancelSolution}
/>
