import { writable, derived } from 'svelte/store';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';
import type { LabFilters, SortOption } from '$lib/services/lab-filter';

export const searchQuery = writable<string>('');
export const selectedDifficulties = writable<string[]>([]);
export const selectedCategories = writable<string[]>([]);
export const completionFilter = writable<boolean | null>(null);
export const sortBy = writable<SortOption>('title');

export const filters = derived(
	[searchQuery, selectedDifficulties, selectedCategories, completionFilter],
	([$search, $difficulties, $categories, $completed]) => ({
		search: $search || undefined,
		difficulty: $difficulties.length > 0 ? $difficulties : undefined,
		category: $categories.length > 0 ? $categories : undefined,
		completed: $completed
	})
);

export function initializeFiltersFromURL(searchParams: URLSearchParams) {
	const search = searchParams.get('search') || '';
	const difficulties = searchParams.get('difficulty')?.split(',').filter(Boolean) || [];
	const categories = searchParams.get('category')?.split(',').filter(Boolean) || [];
	const completed = searchParams.get('completed');
	const sort = (searchParams.get('sort') as SortOption) || 'title';

	searchQuery.set(search);
	selectedDifficulties.set(difficulties);
	selectedCategories.set(categories);
	completionFilter.set(completed === 'true' ? true : completed === 'false' ? false : null);
	sortBy.set(sort);
}

export function syncFiltersToURL(currentFilters: LabFilters, currentSort: SortOption) {
	if (!browser) return;

	const params = new URLSearchParams();

	if (currentFilters.search) params.set('search', currentFilters.search);
	if (currentFilters.difficulty?.length) params.set('difficulty', currentFilters.difficulty.join(','));
	if (currentFilters.category?.length) params.set('category', currentFilters.category.join(','));
	if (currentFilters.completed !== null && currentFilters.completed !== undefined) {
		params.set('completed', String(currentFilters.completed));
	}
	if (currentSort !== 'title') params.set('sort', currentSort);

	const url = params.toString() ? `?${params.toString()}` : '/learn';
	goto(url, { replaceState: true, noScroll: true, keepFocus: true });
}
