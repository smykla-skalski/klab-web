<script lang="ts">
	let { html }: { html: string } = $props();
</script>

<article class="prose prose-lg max-w-none">
	{@html html}
</article>

<style>
	:global(.prose) {
		color: #1f2937;
	}

	:global(.prose h1) {
		font-size: 2.25rem;
		font-weight: 700;
		margin-bottom: 1.5rem;
	}

	:global(.prose h2) {
		font-size: 1.875rem;
		font-weight: 600;
		margin-top: 2rem;
		margin-bottom: 1rem;
	}

	:global(.prose h3) {
		font-size: 1.5rem;
		font-weight: 600;
		margin-top: 1.5rem;
		margin-bottom: 0.75rem;
	}

	:global(.prose p) {
		margin-bottom: 1rem;
		line-height: 1.75;
	}

	:global(.prose code) {
		background-color: #f3f4f6;
		padding: 0.125rem 0.375rem;
		border-radius: 0.25rem;
		font-size: 0.875rem;
		font-family: monospace;
	}

	:global(.prose pre) {
		background-color: #111827;
		padding: 1rem;
		border-radius: 0.5rem;
		overflow-x: auto;
		margin-top: 1rem;
		margin-bottom: 1rem;
	}

	:global(.prose pre code) {
		background-color: transparent;
		padding: 0;
		color: #f3f4f6;
	}

	:global(.prose ul) {
		list-style-type: disc;
		margin-left: 1.5rem;
		margin-bottom: 1rem;
	}

	:global(.prose ol) {
		list-style-type: decimal;
		margin-left: 1.5rem;
		margin-bottom: 1rem;
	}

	:global(.prose li) {
		margin-bottom: 0.5rem;
	}

	:global(.prose table) {
		width: 100%;
		border-collapse: collapse;
	}

	:global(.prose th) {
		border: 1px solid #d1d5db;
		background-color: #f9fafb;
		padding: 0.5rem 1rem;
		text-align: left;
		font-weight: 600;
	}

	:global(.prose td) {
		border: 1px solid #d1d5db;
		padding: 0.5rem 1rem;
	}

	:global(.prose blockquote) {
		border-left: 4px solid #3b82f6;
		padding-left: 1rem;
		font-style: italic;
		color: #4b5563;
	}

	:global(.prose a) {
		color: #2563eb;
		text-decoration: underline;
	}

	:global(.prose a:hover) {
		color: #1d4ed8;
	}

	:global(.prose strong) {
		font-weight: 600;
	}
</style>
