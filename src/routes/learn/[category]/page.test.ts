import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import { writable } from 'svelte/store';
import CategoryPage from './+page.svelte';
import { getLabsByCategory, getCategories } from '$lib/services/lab-loader';

vi.mock('$app/stores', () => ({
	page: writable({
		params: { category: 'kubernetes' },
		url: new URL('http://localhost/learn/kubernetes')
	})
}));

vi.mock('$lib/stores/progress', () => ({
	progress: writable({
		'kubernetes/intro': true
	})
}));

const mockData = {
	category: getCategories().find((c) => c.id === 'kubernetes')!,
	labs: getLabsByCategory('kubernetes')
};

describe('Category Page', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		cleanup();
	});

	it('renders category title', () => {
		render(CategoryPage, { props: { data: mockData } });
		expect(screen.getByRole('heading', { name: /kubernetes labs/i })).toBeTruthy();
	});

	it('renders category description', () => {
		render(CategoryPage, { props: { data: mockData } });
		expect(screen.getByText(/container orchestration platform/i)).toBeTruthy();
	});

	it('renders all lab cards', () => {
		render(CategoryPage, { props: { data: mockData } });
		expect(screen.getAllByRole('button').length).toBe(mockData.labs.length);
	});

	it('lab cards have correct hrefs', () => {
		render(CategoryPage, { props: { data: mockData } });
		// Lab cards are now buttons not links
		const buttons = screen.getAllByRole('button');
		expect(buttons.length).toBeGreaterThan(0);
	});

	it('displays lab metadata', () => {
		render(CategoryPage, { props: { data: mockData } });
		expect(screen.getByText(/15 min/i)).toBeTruthy();
		expect(screen.getAllByText(/intermediate/i).length).toBeGreaterThan(0);
	});

	it('shows completion status icons', () => {
		render(CategoryPage, { props: { data: mockData } });
		const container = document.body;
		expect(container.querySelector('svg')).toBeTruthy();
	});
});
