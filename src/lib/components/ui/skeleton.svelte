<script lang="ts">
	let {
		className = '',
		width = '',
		height = ''
	}: { className?: string; width?: string; height?: string } = $props();
</script>

<div class="bg-muted animate-pulse rounded-md {className}" style:width style:height></div>
