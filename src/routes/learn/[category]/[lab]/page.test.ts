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

describe('Lab Page', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		cleanup();
	});

	it('renders lab title with category and lab id', () => {
		render(LabPage);
		expect(screen.getByRole('heading', { name: /intro lab/i })).toBeTruthy();
	});

	it('renders back link to category', () => {
		render(LabPage);
		const backLink = screen.getByRole('link', { name: /back to kubernetes labs/i });
		expect(backLink).toBeTruthy();
		expect(backLink.getAttribute('href')).toBe('/learn/kubernetes');
	});

	it('displays placeholder message', () => {
		render(LabPage);
		expect(screen.getByText(/lab interface will be implemented in phase 3/i)).toBeTruthy();
	});

	it('renders knowledge article button', () => {
		render(LabPage);
		expect(screen.getByRole('button', { name: /view knowledge article/i })).toBeTruthy();
	});
});
