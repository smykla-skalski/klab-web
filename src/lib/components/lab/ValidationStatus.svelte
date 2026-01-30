<script lang="ts">
	import { CheckCircle2, XCircle, Loader2 } from 'lucide-svelte';

	interface Props {
		status: 'idle' | 'validating' | 'success' | 'error';
		message?: string;
	}

	let { status, message }: Props = $props();
</script>

{#if status !== 'idle'}
	<div
		class="rounded-lg border p-4 {status === 'validating'
			? 'border-blue-500/50 bg-blue-950/20'
			: status === 'success'
				? 'border-green-500/50 bg-green-950/20'
				: 'border-red-500/50 bg-red-950/20'}"
		role="status"
		aria-live="polite"
		aria-atomic="true"
	>
		<div class="flex items-start gap-3">
			{#if status === 'validating'}
				<Loader2 class="mt-0.5 h-5 w-5 animate-spin text-blue-400" aria-hidden="true" />
			{:else if status === 'success'}
				<CheckCircle2 class="mt-0.5 h-5 w-5 text-green-400" aria-hidden="true" />
			{:else}
				<XCircle class="mt-0.5 h-5 w-5 text-red-400" aria-hidden="true" />
			{/if}
			<div class="flex-1">
				<h4
					class="mb-1 text-sm font-semibold {status === 'validating'
						? 'text-blue-300'
						: status === 'success'
							? 'text-green-300'
							: 'text-red-300'}"
				>
					{status === 'validating'
						? 'Validating Solution...'
						: status === 'success'
							? 'Success!'
							: 'Validation Failed'}
				</h4>
				{#if message}
					<p class="text-muted-foreground text-sm">{message}</p>
				{/if}
			</div>
		</div>
	</div>
{/if}
