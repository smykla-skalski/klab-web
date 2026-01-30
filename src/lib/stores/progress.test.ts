import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';
import { progress } from './progress';

// Mock svelte-persisted-store
vi.mock('svelte-persisted-store', () => ({
	persisted: vi.fn((key: string, initial: any) => {
		const { writable } = require('svelte/store');
		return writable(initial);
	})
}));

describe('progress store', () => {
	beforeEach(() => {
		// Reset store to empty state
		progress.set({});
	});

	describe('markLabComplete', () => {
		it('marks a lab as complete', () => {
			progress.markLabComplete('kubernetes', 'intro');
			const data = get(progress);
			expect(data['kubernetes/intro']).toBe(true);
		});

		it('marks multiple labs as complete', () => {
			progress.markLabComplete('kubernetes', 'intro');
			progress.markLabComplete('linux', 'basic-commands');

			const data = get(progress);
			expect(data['kubernetes/intro']).toBe(true);
			expect(data['linux/basic-commands']).toBe(true);
		});

		it('preserves existing progress', () => {
			progress.markLabComplete('kubernetes', 'intro');
			progress.markLabComplete('kubernetes', 'advanced');

			const data = get(progress);
			expect(data['kubernetes/intro']).toBe(true);
			expect(data['kubernetes/advanced']).toBe(true);
		});

		it('handles special characters in category/labId', () => {
			progress.markLabComplete('category-name', 'lab-id-123');
			const data = get(progress);
			expect(data['category-name/lab-id-123']).toBe(true);
		});
	});

	describe('isLabComplete', () => {
		it('returns true for completed lab', () => {
			progress.markLabComplete('kubernetes', 'intro');
			expect(progress.isLabComplete('kubernetes', 'intro')).toBe(true);
		});

		it('returns false for incomplete lab', () => {
			expect(progress.isLabComplete('kubernetes', 'intro')).toBe(false);
		});

		it('returns false for non-existent lab', () => {
			progress.markLabComplete('kubernetes', 'intro');
			expect(progress.isLabComplete('kubernetes', 'nonexistent')).toBe(false);
		});

		it('distinguishes between different categories', () => {
			progress.markLabComplete('kubernetes', 'intro');
			expect(progress.isLabComplete('kubernetes', 'intro')).toBe(true);
			expect(progress.isLabComplete('linux', 'intro')).toBe(false);
		});

		it('distinguishes between different labs in same category', () => {
			progress.markLabComplete('kubernetes', 'intro');
			expect(progress.isLabComplete('kubernetes', 'intro')).toBe(true);
			expect(progress.isLabComplete('kubernetes', 'advanced')).toBe(false);
		});
	});

	describe('getCategoryProgress', () => {
		it('returns 0 for category with no completed labs', () => {
			const percentage = progress.getCategoryProgress('kubernetes', 5);
			expect(percentage).toBe(0);
		});

		it('returns 50% for half completed labs', () => {
			progress.markLabComplete('kubernetes', 'intro');
			progress.markLabComplete('kubernetes', 'advanced');

			const percentage = progress.getCategoryProgress('kubernetes', 4);
			expect(percentage).toBe(50);
		});

		it('returns 100% for all completed labs', () => {
			progress.markLabComplete('kubernetes', 'intro');
			progress.markLabComplete('kubernetes', 'advanced');

			const percentage = progress.getCategoryProgress('kubernetes', 2);
			expect(percentage).toBe(100);
		});

		it('rounds percentage correctly', () => {
			progress.markLabComplete('kubernetes', 'intro');

			// 1/3 = 33.33... should round to 33
			const percentage = progress.getCategoryProgress('kubernetes', 3);
			expect(percentage).toBe(33);
		});

		it('handles 0 total labs', () => {
			progress.markLabComplete('kubernetes', 'intro');
			const percentage = progress.getCategoryProgress('kubernetes', 0);
			expect(percentage).toBe(0);
		});

		it('only counts labs from specified category', () => {
			progress.markLabComplete('kubernetes', 'intro');
			progress.markLabComplete('linux', 'basic-commands');

			const percentage = progress.getCategoryProgress('kubernetes', 2);
			expect(percentage).toBe(50);
		});

		it('handles category with no slashes in lab IDs', () => {
			// Edge case: if somehow data has invalid keys
			progress.set({
				'kubernetes/intro': true,
				'invalid-key': true
			});

			const percentage = progress.getCategoryProgress('kubernetes', 1);
			expect(percentage).toBe(100);
		});

		it('calculates progress correctly for larger numbers', () => {
			// Mark 7 out of 10 labs complete
			for (let i = 0; i < 7; i++) {
				progress.markLabComplete('kubernetes', `lab${i}`);
			}

			const percentage = progress.getCategoryProgress('kubernetes', 10);
			expect(percentage).toBe(70);
		});

		it('ignores false values in progress data', () => {
			progress.set({
				'kubernetes/intro': true,
				'kubernetes/advanced': false,
				'kubernetes/intermediate': true
			});

			const percentage = progress.getCategoryProgress('kubernetes', 3);
			expect(percentage).toBe(67); // 2/3 = 66.67 rounds to 67
		});
	});

	describe('store operations', () => {
		it('supports subscribe', () => {
			let called = false;
			const unsubscribe = progress.subscribe(() => {
				called = true;
			});

			expect(called).toBe(true);
			unsubscribe();
		});

		it('supports set', () => {
			progress.set({
				'kubernetes/intro': true,
				'linux/basic': true
			});

			const data = get(progress);
			expect(data['kubernetes/intro']).toBe(true);
			expect(data['linux/basic']).toBe(true);
		});

		it('supports update', () => {
			progress.set({ 'kubernetes/intro': true });

			progress.update((data) => ({
				...data,
				'linux/basic': true
			}));

			const data = get(progress);
			expect(data['kubernetes/intro']).toBe(true);
			expect(data['linux/basic']).toBe(true);
		});
	});
});
