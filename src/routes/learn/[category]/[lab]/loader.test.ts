import { describe, it, expect, vi } from 'vitest';
import { load, ssr } from './+page';

vi.mock('$lib/services/lab-loader', async () => {
	const actual = await vi.importActual('$lib/services/lab-loader');
	return actual;
});

describe('Lab page loader', () => {
	it('has ssr disabled', () => {
		expect(ssr).toBe(false);
	});

	it('loads valid lab', () => {
		const result = load({
			params: { category: 'kubernetes', lab: 'basic-deployment' }
		} as any);

		expect(result.lab).toBeDefined();
		expect(result.lab.id).toBe('basic-deployment');
		expect(result.lab.category).toBe('kubernetes');
	});

	it('returns complete lab data', () => {
		const result = load({
			params: { category: 'kubernetes', lab: 'basic-deployment' }
		} as any);

		expect(result.lab.title).toBeDefined();
		expect(result.lab.description).toBeDefined();
		expect(result.lab.difficulty).toBeDefined();
		expect(result.lab.duration).toBeDefined();
		expect(result.lab.hints).toBeDefined();
		expect(Array.isArray(result.lab.hints)).toBe(true);
	});

	it('throws 404 for non-existent lab', () => {
		try {
			load({
				params: { category: 'kubernetes', lab: 'nonexistent' }
			} as any);
			expect.fail('Should have thrown error');
		} catch (err: any) {
			expect(err.status).toBe(404);
			expect(err.body.message).toBe('Lab not found');
		}
	});

	it('throws error with 404 status', () => {
		try {
			load({
				params: { category: 'kubernetes', lab: 'invalid' }
			} as any);
			expect.fail('Should have thrown error');
		} catch (err: any) {
			expect(err.status).toBe(404);
		}
	});

	it('throws 404 for lab in wrong category', () => {
		try {
			load({
				params: { category: 'linux', lab: 'basic-deployment' }
			} as any);
			expect.fail('Should have thrown error');
		} catch (err: any) {
			expect(err.status).toBe(404);
			expect(err.body.message).toBe('Lab not found');
		}
	});

	it('loads different labs in same category', () => {
		const lab1 = load({
			params: { category: 'kubernetes', lab: 'basic-deployment' }
		} as any);
		const lab2 = load({
			params: { category: 'kubernetes', lab: 'service-networking' }
		} as any);

		expect(lab1.lab.id).toBe('basic-deployment');
		expect(lab2.lab.id).toBe('service-networking');
		expect(lab1.lab.id).not.toBe(lab2.lab.id);
	});

	it('loads labs from different categories', () => {
		const k8sLab = load({
			params: { category: 'kubernetes', lab: 'basic-deployment' }
		} as any);
		const linuxLab = load({
			params: { category: 'linux', lab: 'file-permissions' }
		} as any);

		expect(k8sLab.lab.category).toBe('kubernetes');
		expect(linuxLab.lab.category).toBe('linux');
	});
});
