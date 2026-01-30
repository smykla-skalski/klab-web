<script lang="ts">
	let { className = '', width = '', height = '' }: { className?: string; width?: string; height?: string } = $props();
</script>

<div
	class="animate-pulse rounded-md bg-muted {className}"
	style:width
	style:height
></div>
