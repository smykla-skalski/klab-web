import { describe, it, expect } from 'vitest';
import { filterLabs, sortLabs } from './lab-filter';
import type { Lab } from '$lib/schemas/lab.schema';

const mockLabs: Lab[] = [
	{
		id: 'lab1',
		title: 'Kubernetes Basics',
		description: 'Learn the basics of Kubernetes',
		category: 'kubernetes',
		difficulty: 'Beginner',
		duration: '30 minutes',
		tags: ['containers', 'orchestration'],
		steps: []
	},
	{
		id: 'lab2',
		title: 'Advanced Networking',
		description: 'Deep dive into networking concepts',
		category: 'networking',
		difficulty: 'Advanced',
		duration: '60 minutes',
		tags: ['tcp', 'routing'],
		steps: []
	},
	{
		id: 'lab3',
		title: 'Linux Commands',
		description: 'Master essential Linux commands',
		category: 'linux',
		difficulty: 'Intermediate',
		duration: '45 minutes',
		tags: ['bash', 'shell'],
		steps: []
	},
	{
		id: 'lab4',
		title: 'Docker Containers',
		description: 'Introduction to Docker and containers',
		category: 'kubernetes',
		difficulty: 'Beginner',
		duration: '20 minutes',
		tags: ['docker', 'containers'],
		steps: []
	}
];

describe('lab-filter', () => {
	describe('filterLabs', () => {
		it('returns all labs with empty filters', () => {
			const result = filterLabs(mockLabs, {});
			expect(result).toHaveLength(4);
		});

		describe('search filter', () => {
			it('filters by title', () => {
				const result = filterLabs(mockLabs, { search: 'kubernetes' });
				expect(result).toHaveLength(1);
				expect(result[0].id).toBe('lab1');
			});

			it('filters by description', () => {
				const result = filterLabs(mockLabs, { search: 'deep dive' });
				expect(result).toHaveLength(1);
				expect(result[0].id).toBe('lab2');
			});

			it('filters by tags', () => {
				const result = filterLabs(mockLabs, { search: 'containers' });
				expect(result).toHaveLength(2);
				expect(result.map((l) => l.id).sort()).toEqual(['lab1', 'lab4']);
			});

			it('is case insensitive', () => {
				const result = filterLabs(mockLabs, { search: 'KUBERNETES' });
				expect(result).toHaveLength(1);
				expect(result[0].id).toBe('lab1');
			});

			it('returns empty array when no matches', () => {
				const result = filterLabs(mockLabs, { search: 'nonexistent' });
				expect(result).toHaveLength(0);
			});
		});

		describe('difficulty filter', () => {
			it('filters by single difficulty', () => {
				const result = filterLabs(mockLabs, { difficulty: ['Beginner'] });
				expect(result).toHaveLength(2);
				expect(result.map((l) => l.id).sort()).toEqual(['lab1', 'lab4']);
			});

			it('filters by multiple difficulties', () => {
				const result = filterLabs(mockLabs, {
					difficulty: ['Beginner', 'Advanced']
				});
				expect(result).toHaveLength(3);
				expect(result.map((l) => l.id).sort()).toEqual(['lab1', 'lab2', 'lab4']);
			});

			it('handles empty difficulty array', () => {
				const result = filterLabs(mockLabs, { difficulty: [] });
				expect(result).toHaveLength(4);
			});
		});

		describe('category filter', () => {
			it('filters by single category', () => {
				const result = filterLabs(mockLabs, { category: ['kubernetes'] });
				expect(result).toHaveLength(2);
				expect(result.map((l) => l.id).sort()).toEqual(['lab1', 'lab4']);
			});

			it('filters by multiple categories', () => {
				const result = filterLabs(mockLabs, {
					category: ['kubernetes', 'linux']
				});
				expect(result).toHaveLength(3);
				expect(result.map((l) => l.id).sort()).toEqual(['lab1', 'lab3', 'lab4']);
			});

			it('handles empty category array', () => {
				const result = filterLabs(mockLabs, { category: [] });
				expect(result).toHaveLength(4);
			});
		});

		describe('completion filter', () => {
			const completedSet = new Set(['kubernetes/lab1', 'linux/lab3']);

			it('filters completed labs', () => {
				const result = filterLabs(mockLabs, { completed: true }, completedSet);
				expect(result).toHaveLength(2);
				expect(result.map((l) => l.id).sort()).toEqual(['lab1', 'lab3']);
			});

			it('filters incomplete labs', () => {
				const result = filterLabs(mockLabs, { completed: false }, completedSet);
				expect(result).toHaveLength(2);
				expect(result.map((l) => l.id).sort()).toEqual(['lab2', 'lab4']);
			});

			it('ignores completion filter when null', () => {
				const result = filterLabs(mockLabs, { completed: null }, completedSet);
				expect(result).toHaveLength(4);
			});

			it('handles undefined completion filter', () => {
				const result = filterLabs(mockLabs, {}, completedSet);
				expect(result).toHaveLength(4);
			});

			it('works with empty completed set', () => {
				const result = filterLabs(mockLabs, { completed: true }, new Set());
				expect(result).toHaveLength(0);
			});
		});

		describe('combined filters', () => {
			it('applies multiple filters together', () => {
				const result = filterLabs(mockLabs, {
					search: 'containers',
					difficulty: ['Beginner'],
					category: ['kubernetes']
				});
				expect(result).toHaveLength(2);
				expect(result.map((l) => l.id).sort()).toEqual(['lab1', 'lab4']);
			});

			it('returns empty when filters have no overlap', () => {
				const result = filterLabs(mockLabs, {
					search: 'kubernetes',
					category: ['linux']
				});
				expect(result).toHaveLength(0);
			});
		});
	});

	describe('sortLabs', () => {
		describe('sort by title', () => {
			it('sorts alphabetically by title', () => {
				const result = sortLabs(mockLabs, 'title');
				expect(result.map((l) => l.title)).toEqual([
					'Advanced Networking',
					'Docker Containers',
					'Kubernetes Basics',
					'Linux Commands'
				]);
			});
		});

		describe('sort by difficulty', () => {
			it('sorts by difficulty order', () => {
				const result = sortLabs(mockLabs, 'difficulty');
				expect(result.map((l) => l.difficulty)).toEqual([
					'Beginner',
					'Beginner',
					'Intermediate',
					'Advanced'
				]);
			});
		});

		describe('sort by duration', () => {
			it('sorts by duration numerically', () => {
				const result = sortLabs(mockLabs, 'duration');
				expect(result.map((l) => l.duration)).toEqual([
					'20 minutes',
					'30 minutes',
					'45 minutes',
					'60 minutes'
				]);
			});

			it('handles duration without numbers', () => {
				const labsWithBadDuration: Lab[] = [
					{ ...mockLabs[0], duration: 'varies' },
					{ ...mockLabs[1], duration: '30 minutes' }
				];
				const result = sortLabs(labsWithBadDuration, 'duration');
				expect(result).toHaveLength(2);
				expect(result[0].duration).toBe('varies');
			});
		});

		it('does not mutate original array', () => {
			const original = [...mockLabs];
			sortLabs(mockLabs, 'title');
			expect(mockLabs).toEqual(original);
		});

		it('handles empty array', () => {
			const result = sortLabs([], 'title');
			expect(result).toEqual([]);
		});
	});
});
