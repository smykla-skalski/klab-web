<script lang="ts">
	import type { Lab } from '$lib/stores/lab';
	import LabObjective from './LabObjective.svelte';
	import HintPanel from './HintPanel.svelte';

	interface Props {
		lab: Lab;
		onRevealHint?: (handler: () => void) => void;
	}

	let { lab, onRevealHint }: Props = $props();

	let hintPanelRef: HintPanel | undefined = undefined;

	$effect(() => {
		if (hintPanelRef && onRevealHint) {
			onRevealHint(() => hintPanelRef?.revealNextHint());
		}
	});
</script>

<div class="flex h-full flex-col gap-4 overflow-y-auto p-4">
	<div class="space-y-4">
		<LabObjective {lab} />
		<HintPanel bind:this={hintPanelRef} hints={lab.hints} />
	</div>
</div>
