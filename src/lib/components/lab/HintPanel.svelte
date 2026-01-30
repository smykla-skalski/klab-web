<script lang="ts">
	import Button from '$lib/components/ui/button.svelte';
	import { ChevronDown, ChevronRight, Lightbulb } from 'lucide-svelte';

	interface Props {
		hints: string[];
	}

	let { hints }: Props = $props();

	let revealedCount = $state(0);
	let expandedHints = $state<Set<number>>(new Set());

	function revealNextHint() {
		if (revealedCount < hints.length) {
			revealedCount++;
			expandedHints = new Set(expandedHints).add(revealedCount - 1);
		}
	}

	function toggleHint(index: number) {
		const newSet = new Set(expandedHints);
		if (newSet.has(index)) {
			newSet.delete(index);
		} else {
			newSet.add(index);
		}
		expandedHints = newSet;
	}
</script>

<div class="border-border bg-secondary rounded-lg border p-4">
	<div class="mb-3 flex items-center justify-between">
		<h3
			class="text-muted-foreground flex items-center gap-2 text-sm font-semibold tracking-wide uppercase"
		>
			<Lightbulb class="h-4 w-4" />
			Hints ({revealedCount}/{hints.length})
		</h3>
		{#if revealedCount < hints.length}
			<Button variant="ghost" size="sm" onclick={revealNextHint}>Reveal Hint</Button>
		{/if}
	</div>

	{#if revealedCount === 0}
		<p class="text-muted-foreground text-sm">Click "Reveal Hint" to get help with this lab.</p>
	{:else}
		<div class="space-y-2">
			{#each hints.slice(0, revealedCount) as hint, index}
				<div class="border-border bg-background rounded border">
					<button
						class="hover:bg-accent flex w-full items-center gap-2 p-3 text-left transition-colors"
						onclick={() => toggleHint(index)}
						aria-expanded={expandedHints.has(index)}
						aria-controls="hint-content-{index}"
						id="hint-button-{index}"
					>
						{#if expandedHints.has(index)}
							<ChevronDown class="text-muted-foreground h-4 w-4" />
						{:else}
							<ChevronRight class="text-muted-foreground h-4 w-4" />
						{/if}
						<span class="text-sm font-medium">Hint {index + 1}</span>
					</button>
					{#if expandedHints.has(index)}
						<div
							class="border-border border-t p-3"
							id="hint-content-{index}"
							role="region"
							aria-labelledby="hint-button-{index}"
						>
							<p class="text-sm leading-relaxed">{hint}</p>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
