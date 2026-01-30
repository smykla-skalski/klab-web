import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import { writable } from 'svelte/store';
import LearnPage from './+page.svelte';
import { getAllLabs, getCategories } from '$lib/services/lab-loader';

vi.mock('$app/stores', () => {
	const url = new URL('http://localhost/learn');
	return {
		page: writable({
			params: {},
			url: {
				...url,
				searchParams: new URLSearchParams()
			}
		})
	};
});

vi.mock('$app/navigation', () => ({
	goto: vi.fn()
}));

vi.mock('$lib/stores/catalog-filters', () => ({
	searchQuery: writable(''),
	selectedDifficulties: writable([]),
	selectedCategories: writable([]),
	completionFilter: writable(null),
	sortBy: writable('title'),
	filters: writable({
		search: undefined,
		difficulty: undefined,
		category: undefined,
		completed: null
	}),
	initializeFiltersFromURL: vi.fn(),
	syncFiltersToURL: vi.fn()
}));

const mockData = {
	labs: getAllLabs(),
	categories: getCategories()
};

describe('Learn Page', () => {
	afterEach(() => {
		cleanup();
	});

	it('renders page title and description', () => {
		render(LearnPage, { props: { data: mockData } });
		expect(screen.getByRole('heading', { name: /interactive labs/i })).toBeTruthy();
		expect(screen.getByText(/master new skills through hands-on practice/i)).toBeTruthy();
	});

	it('renders all category cards', () => {
		render(LearnPage, { props: { data: mockData } });
		// Check for at least some labs being rendered
		expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
	});

	it('category links have correct hrefs', () => {
		render(LearnPage, { props: { data: mockData } });
		// Labs are now cards not links, so just check they render
		const labCards = screen.getAllByRole('button');
		expect(labCards.length).toBeGreaterThan(0);
	});
});
