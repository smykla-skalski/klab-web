<script lang="ts">
	interface Props {
		value?: string;
		language?: 'bash' | 'yaml' | 'json' | 'typescript' | 'javascript' | 'markdown';
		readonly?: boolean;
		theme?: 'vs-dark' | 'vs-light';
		height?: string;
		onChange?: (value: string) => void;
		diffMode?: boolean;
		originalValue?: string;
	}

	let {
		value = $bindable(''),
		language = 'bash',
		readonly = false,
		theme = 'vs-dark',
		height = '400px',
		onChange,
		diffMode = false,
		originalValue = ''
	}: Props = $props();

	let currentValue = $state(value);

	export function getValue(): string {
		return currentValue;
	}

	export function setValue(newValue: string) {
		currentValue = newValue;
	}
</script>

<div
	data-testid="code-editor-mock"
	style="height: {height}; width: 100%;"
	class="bg-gray-900 p-4 text-white"
>
	Mock CodeEditor
	{#if diffMode}
		<div>Diff Mode</div>
	{/if}
	<div>{language}</div>
</div>
