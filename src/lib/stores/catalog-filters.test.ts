import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';
import {
	searchQuery,
	selectedDifficulties,
	selectedCategories,
	completionFilter,
	sortBy,
	filters,
	initializeFiltersFromURL,
	syncFiltersToURL
} from './catalog-filters';

vi.mock('$app/navigation', () => ({
	goto: vi.fn()
}));

vi.mock('$app/environment', () => ({
	browser: true
}));

describe('catalog-filters', () => {
	beforeEach(() => {
		searchQuery.set('');
		selectedDifficulties.set([]);
		selectedCategories.set([]);
		completionFilter.set(null);
		sortBy.set('title');
		vi.clearAllMocks();
	});

	describe('stores', () => {
		it('initializes with default values', () => {
			expect(get(searchQuery)).toBe('');
			expect(get(selectedDifficulties)).toEqual([]);
			expect(get(selectedCategories)).toEqual([]);
			expect(get(completionFilter)).toBe(null);
			expect(get(sortBy)).toBe('title');
		});

		it('updates searchQuery', () => {
			searchQuery.set('kubernetes');
			expect(get(searchQuery)).toBe('kubernetes');
		});

		it('updates selectedDifficulties', () => {
			selectedDifficulties.set(['Beginner', 'Intermediate']);
			expect(get(selectedDifficulties)).toEqual(['Beginner', 'Intermediate']);
		});

		it('updates selectedCategories', () => {
			selectedCategories.set(['kubernetes', 'linux']);
			expect(get(selectedCategories)).toEqual(['kubernetes', 'linux']);
		});

		it('updates completionFilter', () => {
			completionFilter.set(true);
			expect(get(completionFilter)).toBe(true);
		});

		it('updates sortBy', () => {
			sortBy.set('difficulty');
			expect(get(sortBy)).toBe('difficulty');
		});
	});

	describe('filters derived store', () => {
		it('returns undefined for empty search', () => {
			searchQuery.set('');
			const filterState = get(filters);
			expect(filterState.search).toBeUndefined();
		});

		it('includes search when set', () => {
			searchQuery.set('docker');
			const filterState = get(filters);
			expect(filterState.search).toBe('docker');
		});

		it('returns undefined for empty difficulties', () => {
			selectedDifficulties.set([]);
			const filterState = get(filters);
			expect(filterState.difficulty).toBeUndefined();
		});

		it('includes difficulties when set', () => {
			selectedDifficulties.set(['Advanced']);
			const filterState = get(filters);
			expect(filterState.difficulty).toEqual(['Advanced']);
		});

		it('returns undefined for empty categories', () => {
			selectedCategories.set([]);
			const filterState = get(filters);
			expect(filterState.category).toBeUndefined();
		});

		it('includes categories when set', () => {
			selectedCategories.set(['networking']);
			const filterState = get(filters);
			expect(filterState.category).toEqual(['networking']);
		});

		it('includes completed filter when null', () => {
			completionFilter.set(null);
			const filterState = get(filters);
			expect(filterState.completed).toBe(null);
		});

		it('includes completed filter when true', () => {
			completionFilter.set(true);
			const filterState = get(filters);
			expect(filterState.completed).toBe(true);
		});

		it('includes completed filter when false', () => {
			completionFilter.set(false);
			const filterState = get(filters);
			expect(filterState.completed).toBe(false);
		});
	});

	describe('initializeFiltersFromURL', () => {
		it('handles empty search params', () => {
			const params = new URLSearchParams();
			initializeFiltersFromURL(params);

			expect(get(searchQuery)).toBe('');
			expect(get(selectedDifficulties)).toEqual([]);
			expect(get(selectedCategories)).toEqual([]);
			expect(get(completionFilter)).toBe(null);
			expect(get(sortBy)).toBe('title');
		});

		it('parses search param', () => {
			const params = new URLSearchParams('search=kubernetes');
			initializeFiltersFromURL(params);
			expect(get(searchQuery)).toBe('kubernetes');
		});

		it('parses difficulty param', () => {
			const params = new URLSearchParams('difficulty=Beginner,Intermediate');
			initializeFiltersFromURL(params);
			expect(get(selectedDifficulties)).toEqual(['Beginner', 'Intermediate']);
		});

		it('parses category param', () => {
			const params = new URLSearchParams('category=kubernetes,linux');
			initializeFiltersFromURL(params);
			expect(get(selectedCategories)).toEqual(['kubernetes', 'linux']);
		});

		it('parses completed=true param', () => {
			const params = new URLSearchParams('completed=true');
			initializeFiltersFromURL(params);
			expect(get(completionFilter)).toBe(true);
		});

		it('parses completed=false param', () => {
			const params = new URLSearchParams('completed=false');
			initializeFiltersFromURL(params);
			expect(get(completionFilter)).toBe(false);
		});

		it('parses sort param', () => {
			const params = new URLSearchParams('sort=difficulty');
			initializeFiltersFromURL(params);
			expect(get(sortBy)).toBe('difficulty');
		});

		it('parses multiple params', () => {
			const params = new URLSearchParams(
				'search=docker&difficulty=Advanced&category=kubernetes&completed=true&sort=duration'
			);
			initializeFiltersFromURL(params);

			expect(get(searchQuery)).toBe('docker');
			expect(get(selectedDifficulties)).toEqual(['Advanced']);
			expect(get(selectedCategories)).toEqual(['kubernetes']);
			expect(get(completionFilter)).toBe(true);
			expect(get(sortBy)).toBe('duration');
		});

		it('filters out empty values in comma-separated lists', () => {
			const params = new URLSearchParams('difficulty=Beginner,,Advanced&category=,kubernetes,');
			initializeFiltersFromURL(params);
			expect(get(selectedDifficulties)).toEqual(['Beginner', 'Advanced']);
			expect(get(selectedCategories)).toEqual(['kubernetes']);
		});
	});

	describe('syncFiltersToURL', () => {
		it('navigates to /learn with no filters', async () => {
			const { goto } = await import('$app/navigation');
			syncFiltersToURL({}, 'title');
			expect(goto).toHaveBeenCalledWith('/learn', {
				replaceState: true,
				noScroll: true,
				keepFocus: true
			});
		});

		it('includes search param', async () => {
			const { goto } = await import('$app/navigation');
			syncFiltersToURL({ search: 'test' }, 'title');
			expect(goto).toHaveBeenCalledWith('?search=test', {
				replaceState: true,
				noScroll: true,
				keepFocus: true
			});
		});

		it('includes difficulty param', async () => {
			const { goto } = await import('$app/navigation');
			syncFiltersToURL({ difficulty: ['Beginner', 'Advanced'] }, 'title');
			expect(goto).toHaveBeenCalledWith('?difficulty=Beginner%2CAdvanced', {
				replaceState: true,
				noScroll: true,
				keepFocus: true
			});
		});

		it('includes category param', async () => {
			const { goto } = await import('$app/navigation');
			syncFiltersToURL({ category: ['kubernetes'] }, 'title');
			expect(goto).toHaveBeenCalledWith('?category=kubernetes', {
				replaceState: true,
				noScroll: true,
				keepFocus: true
			});
		});

		it('includes completed param when true', async () => {
			const { goto } = await import('$app/navigation');
			syncFiltersToURL({ completed: true }, 'title');
			expect(goto).toHaveBeenCalledWith('?completed=true', {
				replaceState: true,
				noScroll: true,
				keepFocus: true
			});
		});

		it('includes completed param when false', async () => {
			const { goto } = await import('$app/navigation');
			syncFiltersToURL({ completed: false }, 'title');
			expect(goto).toHaveBeenCalledWith('?completed=false', {
				replaceState: true,
				noScroll: true,
				keepFocus: true
			});
		});

		it('excludes completed param when null', async () => {
			const { goto } = await import('$app/navigation');
			syncFiltersToURL({ completed: null }, 'title');
			expect(goto).toHaveBeenCalledWith('/learn', {
				replaceState: true,
				noScroll: true,
				keepFocus: true
			});
		});

		it('excludes sort param when title', async () => {
			const { goto } = await import('$app/navigation');
			syncFiltersToURL({}, 'title');
			expect(goto).toHaveBeenCalledWith('/learn', {
				replaceState: true,
				noScroll: true,
				keepFocus: true
			});
		});

		it('includes sort param when not title', async () => {
			const { goto } = await import('$app/navigation');
			syncFiltersToURL({}, 'difficulty');
			expect(goto).toHaveBeenCalledWith('?sort=difficulty', {
				replaceState: true,
				noScroll: true,
				keepFocus: true
			});
		});

		it('combines all params', async () => {
			const { goto } = await import('$app/navigation');
			syncFiltersToURL(
				{
					search: 'test',
					difficulty: ['Beginner'],
					category: ['kubernetes'],
					completed: true
				},
				'duration'
			);

			const call = (goto as any).mock.calls[0][0];
			expect(call).toContain('search=test');
			expect(call).toContain('difficulty=Beginner');
			expect(call).toContain('category=kubernetes');
			expect(call).toContain('completed=true');
			expect(call).toContain('sort=duration');
		});
	});
});
