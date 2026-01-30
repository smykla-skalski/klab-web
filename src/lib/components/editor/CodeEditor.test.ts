import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup, screen } from '@testing-library/svelte';
import CodeEditor from './__mocks__/CodeEditor.svelte';

describe('CodeEditor', () => {
	afterEach(() => {
		cleanup();
	});

	it('renders mock editor', () => {
		render(CodeEditor, {
			props: {}
		});
		expect(screen.getByTestId('code-editor-mock')).toBeTruthy();
	});

	it('accepts value prop', () => {
		render(CodeEditor, {
			props: {
				value: 'console.log("hello")'
			}
		});
		expect(screen.getByTestId('code-editor-mock')).toBeTruthy();
	});

	it('accepts language prop', () => {
		render(CodeEditor, {
			props: {
				language: 'typescript'
			}
		});
		expect(screen.getByText('typescript')).toBeTruthy();
	});

	it('accepts readonly prop', () => {
		render(CodeEditor, {
			props: {
				readonly: true
			}
		});
		expect(screen.getByTestId('code-editor-mock')).toBeTruthy();
	});

	it('accepts theme prop', () => {
		render(CodeEditor, {
			props: {
				theme: 'vs-light'
			}
		});
		expect(screen.getByTestId('code-editor-mock')).toBeTruthy();
	});

	it('accepts custom height', () => {
		const { container } = render(CodeEditor, {
			props: {
				height: '600px'
			}
		});
		const editorDiv = container.querySelector('[data-testid="code-editor-mock"]');
		expect(editorDiv?.getAttribute('style')).toContain('height: 600px');
	});

	it('shows diff mode when enabled', () => {
		render(CodeEditor, {
			props: {
				diffMode: true,
				originalValue: 'original',
				value: 'modified'
			}
		});
		expect(screen.getByText('Diff Mode')).toBeTruthy();
	});

	it('exports getValue function', () => {
		const component = render(CodeEditor, {
			props: {
				value: 'test value'
			}
		});
		expect(component.component.getValue).toBeDefined();
		const value = component.component.getValue();
		expect(value).toBe('test value');
	});

	it('exports setValue function', () => {
		const component = render(CodeEditor, {
			props: {}
		});
		expect(component.component.setValue).toBeDefined();
		component.component.setValue('new value');
		const value = component.component.getValue();
		expect(value).toBe('new value');
	});

	it('accepts onChange callback', () => {
		const onChange = () => {};
		render(CodeEditor, {
			props: {
				onChange
			}
		});
		expect(screen.getByTestId('code-editor-mock')).toBeTruthy();
	});
});
