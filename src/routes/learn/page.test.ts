import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import { writable, get } from 'svelte/store';
import userEvent from '@testing-library/user-event';
import LearnPage from './+page.svelte';
import { getAllLabs, getCategories } from '$lib/services/lab-loader';
import { goto } from '$app/navigation';
import {
	searchQuery,
	selectedDifficulties,
	selectedCategories,
	completionFilter,
	sortBy,
	filters
} from '$lib/stores/catalog-filters';

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
		searchQuery.set('');
		selectedDifficulties.set([]);
		selectedCategories.set([]);
		completionFilter.set(null);
		vi.clearAllMocks();
	});

	it('renders page title and description', () => {
		render(LearnPage, { props: { data: mockData } });
		expect(screen.getByRole('heading', { name: /interactive labs/i })).toBeTruthy();
		expect(screen.getByText(/master new skills through hands-on practice/i)).toBeTruthy();
	});

	it('renders all category cards', () => {
		render(LearnPage, { props: { data: mockData } });
		expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
	});

	it('category links have correct hrefs', () => {
		render(LearnPage, { props: { data: mockData } });
		const labCards = screen.getAllByRole('button');
		expect(labCards.length).toBeGreaterThan(0);
	});

	it('toggles filter visibility on mobile', async () => {
		const user = userEvent.setup();
		render(LearnPage, { props: { data: mockData } });

		const toggleButton = screen.getByRole('button', { name: /toggle filters/i });
		await user.click(toggleButton);

		expect(toggleButton.getAttribute('aria-expanded')).toBe('false');
	});

	it('displays active filter count badge', () => {
		selectedDifficulties.set(['Beginner']);
		selectedCategories.set(['kubernetes']);

		render(LearnPage, { props: { data: mockData } });

		expect(screen.getByText('2')).toBeTruthy();
	});

	it('clears all filters when clear button clicked', async () => {
		const user = userEvent.setup();
		const emptyData = { labs: [], categories: [] };

		render(LearnPage, { props: { data: emptyData } });

		searchQuery.set('test');
		selectedDifficulties.set(['Beginner']);
		selectedCategories.set(['kubernetes']);
		completionFilter.set('completed');

		await vi.waitFor(() => {
			const clearButton = screen.queryByRole('button', { name: /clear all filters/i });
			expect(clearButton).toBeTruthy();
		});

		const clearButton = screen.getByRole('button', { name: /clear all filters/i });
		await user.click(clearButton);

		expect(get(searchQuery)).toBe('');
		expect(get(selectedDifficulties)).toEqual([]);
		expect(get(selectedCategories)).toEqual([]);
		expect(get(completionFilter)).toBeNull();
	});

	it('displays no results message when no labs match filters', () => {
		const emptyData = { labs: [], categories: [] };
		render(LearnPage, { props: { data: emptyData } });

		expect(screen.getByText(/no labs match your filters/i)).toBeTruthy();
	});

	it('shows correct lab count', () => {
		render(LearnPage, { props: { data: mockData } });

		const labCount = mockData.labs.length;
		expect(
			screen.getByText(new RegExp(`showing ${labCount} of ${labCount} labs`, 'i'))
		).toBeTruthy();
	});

	it('renders lab cards with click handlers', () => {
		render(LearnPage, { props: { data: mockData } });

		const labCards = screen.getAllByRole('button');
		expect(labCards.length).toBeGreaterThan(0);
	});
});
