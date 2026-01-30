<script lang="ts">
	import DOMPurify from 'dompurify';

	let { html }: { html: string } = $props();

	const sanitizedHtml = $derived(DOMPurify.sanitize(html));
</script>

<article class="prose prose-invert prose-lg max-w-none dark:prose-invert">
	{@html sanitizedHtml}
</article>
