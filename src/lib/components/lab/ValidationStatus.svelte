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
			? 'border-[oklch(58%_0.070_230)]/50 bg-[oklch(58%_0.070_230)]/10 dark:bg-[oklch(35%_0.06_230)]/20'
			: status === 'success'
				? 'border-[oklch(55%_0.090_135)]/50 bg-[oklch(55%_0.090_135)]/10 dark:bg-[oklch(35%_0.06_135)]/20'
				: 'border-[oklch(50%_0.125_15)]/50 bg-[oklch(50%_0.125_15)]/10 dark:bg-[oklch(30%_0.08_15)]/20'}"
		role="status"
		aria-live="polite"
		aria-atomic="true"
	>
		<div class="flex items-start gap-3">
			{#if status === 'validating'}
				<Loader2
					class="mt-0.5 h-5 w-5 animate-spin text-[oklch(58%_0.070_230)] dark:text-[oklch(66%_0.060_230)]"
					aria-hidden="true"
				/>
			{:else if status === 'success'}
				<CheckCircle2
					class="mt-0.5 h-5 w-5 text-[oklch(55%_0.090_135)] dark:text-[oklch(75%_0.080_135)]"
					aria-hidden="true"
				/>
			{:else}
				<XCircle class="mt-0.5 h-5 w-5 text-[oklch(50%_0.125_15)] dark:text-[oklch(58%_0.115_15)]" aria-hidden="true" />
			{/if}
			<div class="flex-1">
				<h4
					class="mb-1 text-sm font-semibold {status === 'validating'
						? 'text-[oklch(58%_0.070_230)] dark:text-[oklch(66%_0.060_230)]'
						: status === 'success'
							? 'text-[oklch(55%_0.090_135)] dark:text-[oklch(75%_0.080_135)]'
							: 'text-[oklch(50%_0.125_15)] dark:text-[oklch(58%_0.115_15)]'}"
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
