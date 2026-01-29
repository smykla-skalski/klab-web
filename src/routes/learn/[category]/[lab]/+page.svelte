<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button.svelte';
	import { Terminal } from '$lib/components/terminal';
	import { LabContainer, LabSidebar, ValidationStatus } from '$lib/components/lab';
	import { BookOpen, CheckCircle } from 'lucide-svelte';
	import { currentLab } from '$lib/stores/lab';
	import type { Lab } from '$lib/stores/lab';

	const category = $derived($page.params.category ?? 'kubernetes');
	const labId = $derived($page.params.lab ?? 'basic-deployment');

	const mockLab = $derived.by<Lab>(() => ({
		id: labId,
		title: `${labId.charAt(0).toUpperCase() + labId.slice(1).replace(/-/g, ' ')} Lab`,
		category: category,
		objective:
			'Configure a basic Kubernetes deployment with 3 replicas and expose it via a LoadBalancer service. Verify the deployment is healthy and accessible.',
		hints: [
			'Start by creating a deployment YAML file with the kubectl create command and --dry-run=client flag.',
			'Use kubectl expose to create a service for your deployment. Remember to specify the type as LoadBalancer.',
			'Check the status of your pods with kubectl get pods. All 3 replicas should be in Running state.',
			'Get the external IP of your service with kubectl get svc. It may take a moment to provision.'
		],
		solution:
			'kubectl create deployment nginx --image=nginx --replicas=3 && kubectl expose deployment nginx --port=80 --type=LoadBalancer'
	}));

	$effect(() => {
		currentLab.set(mockLab);
	});

	let terminal: Terminal;
	let validationStatus: 'idle' | 'validating' | 'success' | 'error' = $state('idle');
	let validationMessage = $state('');

	async function validateSolution() {
		validationStatus = 'validating';
		validationMessage = 'Checking your solution...';

		setTimeout(() => {
			const success = Math.random() > 0.5;
			validationStatus = success ? 'success' : 'error';
			validationMessage = success
				? 'All checks passed! Your deployment is correctly configured.'
				: 'Some checks failed. Make sure your deployment has 3 replicas and the service is of type LoadBalancer.';
		}, 2000);
	}

	function showSolution() {
		if (confirm('Are you sure you want to reveal the solution? This will end the lab.')) {
			terminal?.write(`\r\n$ ${mockLab.solution}\r\n`);
		}
	}

	function viewKnowledge() {
		goto(`/learn/${category}/${labId}/knowledge`);
	}
</script>

<svelte:head>
	<title>{mockLab.title} - klab</title>
</svelte:head>

<LabContainer lab={mockLab}>
	{#snippet sidebar()}
		<LabSidebar lab={mockLab} />
	{/snippet}

	{#snippet main()}
		<div class="flex h-full flex-col">
			<div class="flex-1 p-4">
				<Terminal bind:this={terminal} theme="dark" fontSize={14} />
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
