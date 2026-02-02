<script lang="ts">
	import type { Lab } from '$lib/stores/lab';

	interface Props {
		lab: Lab;
	}

	let { lab }: Props = $props();
</script>

<div class="border-muted bg-secondary rounded-lg border p-4">
	<h3 class="text-muted-foreground mb-2 text-sm font-semibold tracking-wide uppercase">
		Objective
	</h3>
	<p class="text-foreground text-sm leading-relaxed">{lab.objective}</p>
</div>
