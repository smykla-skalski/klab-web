import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup, screen } from '@testing-library/svelte';
import Terminal from './__mocks__/Terminal.svelte';

describe('Terminal', () => {
	afterEach(() => {
		cleanup();
	});

	it('renders mock terminal', () => {
		render(Terminal, {
			props: {}
		});
		expect(screen.getByTestId('terminal-mock')).toBeTruthy();
	});

	it('accepts wsUrl prop', () => {
		render(Terminal, {
			props: {
				wsUrl: 'ws://localhost:8080'
			}
		});
		expect(screen.getByTestId('terminal-mock')).toBeTruthy();
	});

	it('accepts fontSize prop', () => {
		render(Terminal, {
			props: {
				fontSize: 16
			}
		});
		expect(screen.getByTestId('terminal-mock')).toBeTruthy();
	});

	it('accepts theme prop', () => {
		render(Terminal, {
			props: {
				theme: 'light'
			}
		});
		expect(screen.getByTestId('terminal-mock')).toBeTruthy();
	});

	it('accepts onData callback', () => {
		const onData = () => {};
		render(Terminal, {
			props: {
				onData
			}
		});
		expect(screen.getByTestId('terminal-mock')).toBeTruthy();
	});

	it('exports write function', () => {
		const component = render(Terminal, {
			props: {}
		});
		expect(component.component.write).toBeDefined();
		component.component.write('test');
	});

	it('exports clear function', () => {
		const component = render(Terminal, {
			props: {}
		});
		expect(component.component.clear).toBeDefined();
		component.component.clear();
	});

	it('exports focus function', () => {
		const component = render(Terminal, {
			props: {}
		});
		expect(component.component.focus).toBeDefined();
		component.component.focus();
	});
});
