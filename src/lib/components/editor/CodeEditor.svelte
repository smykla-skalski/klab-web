<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import * as monaco from 'monaco-editor';

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
		value = '',
		language = 'bash',
		readonly = false,
		theme = 'vs-dark',
		height = '400px',
		onChange,
		diffMode = false,
		originalValue = ''
	}: Props = $props();

	let container: HTMLDivElement;
	let editor: monaco.editor.IStandaloneCodeEditor | monaco.editor.IStandaloneDiffEditor;

	onMount(() => {
		monaco.editor.defineTheme('klab-dark', {
			base: 'vs-dark',
			inherit: true,
			rules: [],
			colors: {
				'editor.background': '#000000',
				'editor.foreground': '#7ade7a',
				'editorLineNumber.foreground': '#4d4d4d',
				'editor.selectionBackground': '#7ade7a4d',
				'editor.inactiveSelectionBackground': '#7ade7a26'
			}
		});

		monaco.editor.setTheme(theme === 'vs-dark' ? 'klab-dark' : theme);

		if (diffMode) {
			const diffEditor = monaco.editor.createDiffEditor(container, {
				readOnly: readonly,
				automaticLayout: true,
				scrollBeyondLastLine: false,
				minimap: { enabled: false },
				fontSize: 14,
				fontFamily: "var(--font-family-mono), 'Courier New', monospace"
			});

			const originalModel = monaco.editor.createModel(originalValue, language);
			const modifiedModel = monaco.editor.createModel(value, language);

			diffEditor.setModel({
				original: originalModel,
				modified: modifiedModel
			});

			editor = diffEditor;

			if (onChange) {
				modifiedModel.onDidChangeContent(() => {
					onChange(modifiedModel.getValue());
				});
			}
		} else {
			const standaloneEditor = monaco.editor.create(container, {
				value,
				language,
				readOnly: readonly,
				automaticLayout: true,
				scrollBeyondLastLine: false,
				minimap: { enabled: false },
				fontSize: 14,
				fontFamily: "var(--font-family-mono), 'Courier New', monospace"
			});

			editor = standaloneEditor;

			if (onChange) {
				standaloneEditor.onDidChangeModelContent(() => {
					onChange(standaloneEditor.getValue());
				});
			}
		}

		return () => {
			editor.dispose();
		};
	});

	export function getValue(): string {
		if (diffMode) {
			const diffEditor = editor as monaco.editor.IStandaloneDiffEditor;
			return diffEditor.getModifiedEditor().getValue();
		}
		return (editor as monaco.editor.IStandaloneCodeEditor).getValue();
	}

	export function setValue(newValue: string) {
		if (diffMode) {
			const diffEditor = editor as monaco.editor.IStandaloneDiffEditor;
			diffEditor.getModifiedEditor().setValue(newValue);
		} else {
			(editor as monaco.editor.IStandaloneCodeEditor).setValue(newValue);
		}
	}

	onDestroy(() => {
		editor?.dispose();
	});
</script>

<div bind:this={container} style="height: {height}; width: 100%;"></div>
