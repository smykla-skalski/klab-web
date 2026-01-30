import { describe, it, expect, afterEach, beforeAll, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import { writable } from 'svelte/store';
import Layout from './+layout.svelte';
import { mode, toggleMode as mockToggleMode } from '$lib/stores/theme';
import { registerShortcut as mockRegisterShortcut } from '$lib/utils/keyboard-shortcuts';

vi.mock('$lib/stores/theme', () => ({
	mode: writable({ current: 'light' }),
	toggleMode: vi.fn()
}));

vi.mock('$lib/utils/keyboard-shortcuts', () => ({
	registerShortcut: vi.fn((_key, _handler) => {
		return () => {};
	})
}));

describe('Layout', () => {
	beforeAll(() => {
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			value: vi.fn().mockImplementation(query => ({
				matches: false,
				media: query,
				onchange: null,
				addListener: vi.fn(),
				removeListener: vi.fn(),
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
				dispatchEvent: vi.fn(),
			})),
		});
	});

	afterEach(() => {
		cleanup();
		vi.clearAllMocks();
	});

	it('renders header, main content, and footer', () => {
		render(Layout);

		expect(screen.getByRole('banner')).toBeTruthy();
		expect(screen.getByRole('main')).toBeTruthy();
		expect(screen.getByRole('contentinfo')).toBeTruthy();
	});

	it('renders skip to main content link', () => {
		render(Layout);

		const skipLink = screen.getByText(/skip to main content/i);
		expect(skipLink).toBeTruthy();
		expect(skipLink.getAttribute('href')).toBe('#main-content');
	});

	it('main content has correct id for skip link', () => {
		render(Layout);

		const main = screen.getByRole('main');
		expect(main.id).toBe('main-content');
	});

	it('registers keyboard shortcuts on mount', () => {
		render(Layout);

		expect(mockRegisterShortcut).toHaveBeenCalledWith('ctrl+shift+t', mockToggleMode);
		expect(mockRegisterShortcut).toHaveBeenCalledWith(
			'shift+/',
			expect.any(Function),
			{ preventDefault: true }
		);
	});

	it('renders with theme watcher', () => {
		render(Layout);

		expect(screen.getByRole('main')).toBeTruthy();
	});

	it('cleans up shortcuts on unmount', () => {
		const cleanup1 = vi.fn();
		const cleanup2 = vi.fn();

		mockRegisterShortcut.mockReturnValueOnce(cleanup1).mockReturnValueOnce(cleanup2);

		const { unmount } = render(Layout);

		unmount();

		expect(cleanup1).toHaveBeenCalled();
		expect(cleanup2).toHaveBeenCalled();
	});
});
