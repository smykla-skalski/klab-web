import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import { render, cleanup } from '@testing-library/svelte';
import CodeEditor from './CodeEditor.svelte';

const mockModel = {
	getValue: vi.fn(() => ''),
	setValue: vi.fn(),
	onDidChangeContent: vi.fn((callback) => {
		mockModel._onChangeCallback = callback;
		return { dispose: vi.fn() };
	}),
	_onChangeCallback: null as (() => void) | null
};

const mockStandaloneEditor = {
	getValue: vi.fn(() => ''),
	setValue: vi.fn(),
	getModel: vi.fn(() => mockModel),
	updateOptions: vi.fn(),
	onDidChangeModelContent: vi.fn((callback) => {
		mockStandaloneEditor._onChangeCallback = callback;
		return { dispose: vi.fn() };
	}),
	dispose: vi.fn(),
	_onChangeCallback: null as (() => void) | null,
	_options: null as any
};

const mockModifiedEditor = {
	getValue: vi.fn(() => ''),
	setValue: vi.fn()
};

const mockDiffEditor = {
	getModel: vi.fn(() => ({
		original: mockModel,
		modified: mockModel
	})),
	getModifiedEditor: vi.fn(() => mockModifiedEditor),
	setModel: vi.fn(),
	updateOptions: vi.fn(),
	dispose: vi.fn(),
	_options: null as any
};

vi.mock('monaco-editor', () => ({
	editor: {
		create: vi.fn((container: any, options: any) => {
			mockStandaloneEditor._options = options;
			return mockStandaloneEditor;
		}),
		createDiffEditor: vi.fn((container: any, options: any) => {
			mockDiffEditor._options = options;
			return mockDiffEditor;
		}),
		createModel: vi.fn((value: string, _language: string) => {
			const model = { ...mockModel };
			model.getValue = vi.fn(() => value);
			return model;
		}),
		setModelLanguage: vi.fn(),
		defineTheme: vi.fn(),
		setTheme: vi.fn()
	}
}));

describe('CodeEditor', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockStandaloneEditor.getValue.mockReturnValue('');
		mockModel.getValue.mockReturnValue('');
		mockStandaloneEditor._onChangeCallback = null;
		mockModel._onChangeCallback = null;
	});

	afterEach(() => {
		cleanup();
	});

	it('renders editor container', () => {
		const { container } = render(CodeEditor, {
			props: {}
		});
		expect(container.querySelector('div')).toBeTruthy();
	});

	it('defines custom dark theme on mount', async () => {
		render(CodeEditor, {
			props: {}
		});
		const monaco = await import('monaco-editor');
		expect(monaco.editor.defineTheme).toHaveBeenCalledWith(
			'klab-dark',
			expect.objectContaining({
				base: 'vs-dark',
				inherit: true
			})
		);
	});

	it('creates standalone editor by default', async () => {
		render(CodeEditor, {
			props: {}
		});
		const monaco = await import('monaco-editor');
		expect(monaco.editor.create).toHaveBeenCalled();
		expect(monaco.editor.createDiffEditor).not.toHaveBeenCalled();
	});

	it('creates editor with default props', async () => {
		render(CodeEditor, {
			props: {}
		});
		const monaco = await import('monaco-editor');
		expect(monaco.editor.create).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				value: '',
				language: 'bash',
				readOnly: false,
				fontSize: 14
			})
		);
	});

	it('creates editor with custom value', async () => {
		render(CodeEditor, {
			props: {
				value: 'console.log("hello")'
			}
		});
		const monaco = await import('monaco-editor');
		expect(monaco.editor.create).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				value: 'console.log("hello")'
			})
		);
	});

	it('creates editor with custom language', async () => {
		render(CodeEditor, {
			props: {
				language: 'typescript'
			}
		});
		const monaco = await import('monaco-editor');
		expect(monaco.editor.create).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				language: 'typescript'
			})
		);
	});

	it('creates editor with readonly option', async () => {
		render(CodeEditor, {
			props: {
				readonly: true
			}
		});
		const monaco = await import('monaco-editor');
		expect(monaco.editor.create).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				readOnly: true
			})
		);
	});

	it('defines light theme on mount', async () => {
		render(CodeEditor, {
			props: {}
		});
		const monaco = await import('monaco-editor');
		expect(monaco.editor.defineTheme).toHaveBeenCalledWith(
			'klab-light',
			expect.objectContaining({
				base: 'vs',
				inherit: true
			})
		);
	});

	it('creates diff editor in diff mode', async () => {
		render(CodeEditor, {
			props: {
				diffMode: true,
				originalValue: 'original',
				value: 'modified'
			}
		});
		const monaco = await import('monaco-editor');
		expect(monaco.editor.createDiffEditor).toHaveBeenCalled();
		expect(monaco.editor.create).not.toHaveBeenCalled();
	});

	it('creates models for diff editor', async () => {
		render(CodeEditor, {
			props: {
				diffMode: true,
				originalValue: 'original',
				value: 'modified'
			}
		});
		const monaco = await import('monaco-editor');
		expect(monaco.editor.createModel).toHaveBeenCalledWith('original', 'bash');
		expect(monaco.editor.createModel).toHaveBeenCalledWith('modified', 'bash');
	});

	it('sets diff editor model', () => {
		render(CodeEditor, {
			props: {
				diffMode: true,
				originalValue: 'original',
				value: 'modified'
			}
		});
		expect(mockDiffEditor.setModel).toHaveBeenCalledWith(
			expect.objectContaining({
				original: expect.any(Object),
				modified: expect.any(Object)
			})
		);
	});

	it('calls onChange when content changes in standalone mode', () => {
		const onChange = vi.fn();
		mockStandaloneEditor.getValue.mockReturnValue('new content');
		render(CodeEditor, {
			props: {
				onChange
			}
		});
		mockStandaloneEditor._onChangeCallback?.();
		expect(onChange).toHaveBeenCalledWith('new content');
	});

	it('calls onChange when content changes in diff mode', () => {
		const onChange = vi.fn();
		render(CodeEditor, {
			props: {
				diffMode: true,
				onChange
			}
		});
		expect(mockModel.onDidChangeContent).toHaveBeenCalled();
	});

	it('exports getValue function for standalone editor', () => {
		mockStandaloneEditor.getValue.mockReturnValue('test value');
		const component = render(CodeEditor, {
			props: {
				value: 'test value'
			}
		});
		expect(component.component.getValue).toBeDefined();
		const value = component.component.getValue();
		expect(value).toBe('test value');
	});

	it('exports getValue function for diff editor', () => {
		mockModifiedEditor.getValue.mockReturnValue('modified value');
		const component = render(CodeEditor, {
			props: {
				diffMode: true,
				value: 'modified value'
			}
		});
		const value = component.component.getValue();
		expect(value).toBe('modified value');
	});

	it('exports setValue function for standalone editor', () => {
		const component = render(CodeEditor, {
			props: {}
		});
		expect(component.component.setValue).toBeDefined();
		component.component.setValue('new value');
		expect(mockStandaloneEditor.setValue).toHaveBeenCalledWith('new value');
	});

	it('exports setValue function for diff editor', () => {
		const component = render(CodeEditor, {
			props: {
				diffMode: true
			}
		});
		component.component.setValue('new value');
		expect(mockModifiedEditor.setValue).toHaveBeenCalledWith('new value');
	});

	it('cleans up editor on destroy', () => {
		const { unmount } = render(CodeEditor, {
			props: {}
		});
		unmount();
		expect(mockStandaloneEditor.dispose).toHaveBeenCalled();
	});

	it('handles custom height', () => {
		const { container } = render(CodeEditor, {
			props: {
				height: '600px'
			}
		});
		const editorDiv = container.querySelector('div');
		expect(editorDiv?.getAttribute('style')).toContain('height: 600px');
	});

	it('applies automatic layout', async () => {
		render(CodeEditor, {
			props: {}
		});
		const monaco = await import('monaco-editor');
		expect(monaco.editor.create).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				automaticLayout: true
			})
		);
	});

	it('disables minimap', async () => {
		render(CodeEditor, {
			props: {}
		});
		const monaco = await import('monaco-editor');
		expect(monaco.editor.create).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				minimap: { enabled: false }
			})
		);
	});

	it('uses monospace font', async () => {
		render(CodeEditor, {
			props: {}
		});
		const monaco = await import('monaco-editor');
		expect(monaco.editor.create).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				fontFamily: "var(--font-family-mono), 'Courier New', monospace"
			})
		);
	});

	it('accepts custom fontSize', async () => {
		render(CodeEditor, {
			props: {}
		});
		const monaco = await import('monaco-editor');
		expect(monaco.editor.create).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				fontSize: 14
			})
		);
	});
});
