<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import * as monaco from 'monaco-editor';
	import { mode } from '$lib/stores/theme';

	interface Props {
		value?: string;
		language?: 'bash' | 'yaml' | 'json' | 'typescript' | 'javascript' | 'markdown';
		readonly?: boolean;
		height?: string;
		onChange?: (value: string) => void;
		diffMode?: boolean;
		originalValue?: string;
	}

	let {
		value = '',
		language = 'bash',
		readonly = false,
		height = '400px',
		onChange,
		diffMode = false,
		originalValue = ''
	}: Props = $props();

	let container: HTMLDivElement = undefined!;
	let editor: monaco.editor.IStandaloneCodeEditor | monaco.editor.IStandaloneDiffEditor =
		undefined!;

	$effect(() => {
		if (!editor) return;
		if (!diffMode) {
			const standaloneEditor = editor as monaco.editor.IStandaloneCodeEditor;
			const currentValue = standaloneEditor.getValue();
			if (currentValue !== value) {
				standaloneEditor.setValue(value);
			}
		}
	});

	$effect(() => {
		if (!editor) return;
		if (!diffMode) {
			const standaloneEditor = editor as monaco.editor.IStandaloneCodeEditor;
			const model = standaloneEditor.getModel();
			if (model) {
				monaco.editor.setModelLanguage(model, language);
			}
		}
	});

	$effect(() => {
		if (!editor) return;
		monaco.editor.setTheme(mode.current === 'dark' ? 'klab-dark' : 'klab-light');
	});

	$effect(() => {
		if (!editor) return;
		if (!diffMode) {
			const standaloneEditor = editor as monaco.editor.IStandaloneCodeEditor;
			standaloneEditor.updateOptions({ readOnly: readonly });
		} else {
			const diffEditor = editor as monaco.editor.IStandaloneDiffEditor;
			diffEditor.updateOptions({ readOnly: readonly });
		}
	});

	$effect(() => {
		if (!editor || !diffMode) return;
		const diffEditor = editor as monaco.editor.IStandaloneDiffEditor;
		const originalModel = diffEditor.getModel()?.original;
		if (originalModel && originalModel.getValue() !== originalValue) {
			originalModel.setValue(originalValue);
		}
	});

	onMount(() => {
		monaco.editor.defineTheme('klab-dark', {
			base: 'vs-dark',
			inherit: true,
			rules: [],
			colors: {
				'editor.background': '#2e3440',
				'editor.foreground': '#d8dee9',
				'editorLineNumber.foreground': '#4c566a',
				'editor.selectionBackground': '#434c5e',
				'editor.inactiveSelectionBackground': '#3b4252'
			}
		});

		monaco.editor.defineTheme('klab-light', {
			base: 'vs',
			inherit: true,
			rules: [],
			colors: {
				'editor.background': '#eceff4',
				'editor.foreground': '#2e3440',
				'editorLineNumber.foreground': '#4c566a',
				'editor.selectionBackground': '#d8dee9',
				'editor.inactiveSelectionBackground': '#e5e9f0'
			}
		});

		monaco.editor.setTheme(mode.current === 'dark' ? 'klab-dark' : 'klab-light');

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
		if (!editor) return '';
		if (diffMode) {
			const diffEditor = editor as monaco.editor.IStandaloneDiffEditor;
			return diffEditor.getModifiedEditor()?.getValue() ?? '';
		}
		return (editor as monaco.editor.IStandaloneCodeEditor).getValue();
	}

	export function setValue(newValue: string) {
		if (!editor) return;
		if (diffMode) {
			const diffEditor = editor as monaco.editor.IStandaloneDiffEditor;
			diffEditor.getModifiedEditor()?.setValue(newValue);
		} else {
			(editor as monaco.editor.IStandaloneCodeEditor).setValue(newValue);
		}
	}

	onDestroy(() => {
		editor?.dispose();
	});
</script>

<div bind:this={container} style="height: {height}; width: 100%;"></div>
