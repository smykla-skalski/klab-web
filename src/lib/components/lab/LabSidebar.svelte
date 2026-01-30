<script lang="ts">
	import type { Lab } from '$lib/stores/lab';
	import LabObjective from './LabObjective.svelte';
	import HintPanel from './HintPanel.svelte';

	interface Props {
		lab: Lab;
	}

	let { lab }: Props = $props();
</script>

<div class="flex h-full flex-col gap-4 overflow-y-auto p-4">
	<div class="space-y-4">
		<LabObjective {lab} />
		<HintPanel hints={lab.hints} />
	</div>
</div>
