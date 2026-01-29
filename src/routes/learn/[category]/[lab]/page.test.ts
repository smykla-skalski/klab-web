import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import { writable } from 'svelte/store';
import LabPage from './+page.svelte';

vi.mock('$app/stores', () => ({
	page: writable({
		params: { category: 'kubernetes', lab: 'intro' },
		url: new URL('http://localhost/learn/kubernetes/intro')
	})
}));

vi.mock('$app/navigation', () => ({
	goto: vi.fn()
}));

vi.mock('$lib/components/terminal/Terminal.svelte');

Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn()
	}))
});

describe('Lab Page', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		cleanup();
	});

	it('renders lab title', () => {
		render(LabPage);
		expect(screen.getByText(/intro lab/i)).toBeTruthy();
	});

	it('renders category', () => {
		render(LabPage);
		expect(screen.getByText('kubernetes')).toBeTruthy();
	});

	it('renders check solution button', () => {
		render(LabPage);
		expect(screen.getByRole('button', { name: /check solution/i })).toBeTruthy();
	});

	it('renders knowledge button', () => {
		render(LabPage);
		expect(screen.getByRole('button', { name: /knowledge/i })).toBeTruthy();
	});
});
