import { describe, it, expect, vi } from 'vitest';
import { load } from './+page';

vi.mock('$lib/services/lab-loader', async () => {
	const actual = await vi.importActual('$lib/services/lab-loader');
	return actual;
});

describe('Category page loader', () => {
	it('loads valid category', () => {
		const result = load({ params: { category: 'kubernetes' } } as any) as any;

		expect(result.category).toBeDefined();
		expect(result.category.id).toBe('kubernetes');
		expect(result.labs).toBeDefined();
		expect(Array.isArray(result.labs)).toBe(true);
	});

	it('returns category data', () => {
		const result = load({ params: { category: 'linux' } } as any) as any;

		expect(result.category).toBeDefined();
		expect(result.category.id).toBe('linux');
		expect(result.category.name).toBeDefined();
		expect(result.category.description).toBeDefined();
	});

	it('returns labs for category', () => {
		const result = load({ params: { category: 'kubernetes' } } as any) as any;

		expect(result.labs).toBeDefined();
		expect(result.labs.length).toBeGreaterThan(0);
		result.labs.forEach((lab: any) => {
			expect(lab.category).toBe('kubernetes');
		});
	});

	it('throws 404 for non-existent category', () => {
		try {
			load({ params: { category: 'nonexistent' } } as any);
			expect.fail('Should have thrown error');
		} catch (err: any) {
			expect(err.status).toBe(404);
			expect(err.body.message).toBe('Category not found');
		}
	});

	it('throws error with 404 status', () => {
		try {
			load({ params: { category: 'invalid' } } as any);
			expect.fail('Should have thrown error');
		} catch (err: any) {
			expect(err.status).toBe(404);
		}
	});

	it('handles all valid categories', () => {
		const validCategories = ['kubernetes', 'linux', 'docker'];

		validCategories.forEach((category) => {
			const result = load({ params: { category } } as any) as any;
			expect(result.category.id).toBe(category);
			expect(result.labs).toBeDefined();
		});
	});
});
