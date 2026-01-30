<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import Button from '$lib/components/ui/button.svelte';
	import ConfirmModal from '$lib/components/ui/confirm-modal.svelte';
	import { LabContainer, LabSidebar, ValidationStatus } from '$lib/components/lab';
	import { BookOpen, CheckCircle } from 'lucide-svelte';
	import { currentLab } from '$lib/stores/lab';
	import { progress } from '$lib/stores/progress';
	import { toast } from 'svelte-sonner';
	import type { PageData } from './$types';
	import type TerminalType from '$lib/components/terminal/Terminal.svelte';

	let { data }: { data: PageData } = $props();

	let Terminal: any = $state(null);

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

<LabContainer lab={data.lab}>
	{#snippet sidebar()}
		<LabSidebar lab={data.lab} />
	{/snippet}

	{#snippet main()}
		<div class="flex h-full flex-col">
			<div class="flex-1 p-4">
				{#if Terminal}
					<Terminal bind:this={terminal} theme="dark" fontSize={14} />
				{:else}
					<div class="text-muted-foreground flex h-full items-center justify-center">
						Loading terminal...
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
		<Button onclick={validateSolution}>
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
