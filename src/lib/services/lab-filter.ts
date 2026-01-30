import type { Lab } from '$lib/schemas/lab.schema';

export interface LabFilters {
	search?: string;
	difficulty?: string[];
	category?: string[];
	completed?: boolean | null;
}

export type SortOption = 'title' | 'difficulty' | 'duration';

const difficultyOrder = {
	Beginner: 1,
	Intermediate: 2,
	Advanced: 3
};

export function filterLabs(
	labs: Lab[],
	filters: LabFilters,
	completedLabIds: Set<string> = new Set()
): Lab[] {
	let filtered = [...labs];

	// Search filter
	if (filters.search) {
		const searchLower = filters.search.toLowerCase();
		filtered = filtered.filter(
			(lab) =>
				lab.title.toLowerCase().includes(searchLower) ||
				lab.description.toLowerCase().includes(searchLower) ||
				lab.tags.some((tag) => tag.toLowerCase().includes(searchLower))
		);
	}

	// Difficulty filter
	if (filters.difficulty && filters.difficulty.length > 0) {
		filtered = filtered.filter((lab) => filters.difficulty!.includes(lab.difficulty));
	}

	// Category filter
	if (filters.category && filters.category.length > 0) {
		filtered = filtered.filter((lab) => filters.category!.includes(lab.category));
	}

	// Completion filter
	if (filters.completed !== null && filters.completed !== undefined) {
		filtered = filtered.filter((lab) => {
			const isCompleted = completedLabIds.has(`${lab.category}/${lab.id}`);
			return filters.completed ? isCompleted : !isCompleted;
		});
	}

	return filtered;
}

export function sortLabs(labs: Lab[], sortBy: SortOption): Lab[] {
	const sorted = [...labs];

	switch (sortBy) {
		case 'title':
			return sorted.sort((a, b) => a.title.localeCompare(b.title));

		case 'difficulty':
			return sorted.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);

		case 'duration':
			return sorted.sort((a, b) => {
				const aMatch = a.duration.match(/(\d+)/);
				const bMatch = b.duration.match(/(\d+)/);
				const aDuration = aMatch ? parseInt(aMatch[1]) : 0;
				const bDuration = bMatch ? parseInt(bMatch[1]) : 0;
				return aDuration - bDuration;
			});

		default:
			return sorted;
	}
}
