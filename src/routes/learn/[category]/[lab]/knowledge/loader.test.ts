import { describe, it, expect, vi } from 'vitest';
import { load } from './+page';

// Mock getKnowledgeArticle to return different results based on params
vi.mock('$lib/services/knowledge-loader', () => ({
	getKnowledgeArticle: vi.fn((category: string, labId: string) => {
		if (category === 'kubernetes' && labId === 'basic-deployment') {
			return Promise.resolve('<h1>Basic Deployment Knowledge</h1><p>Content here</p>');
		}
		if (category === 'linux' && labId === 'file-permissions') {
			return Promise.resolve('<h1>File Permissions</h1><p>Linux content</p>');
		}
		return Promise.resolve(null);
	})
}));

describe('Knowledge page loader', () => {
	it('loads valid knowledge article', async () => {
		const result = await load({
			params: { category: 'kubernetes', lab: 'basic-deployment' }
		} as any);

		expect(result.html).toBeDefined();
		expect(result.html).toContain('<h1>');
		expect(result.category).toBe('kubernetes');
		expect(result.labId).toBe('basic-deployment');
	});

	it('returns category and labId in response', async () => {
		const result = await load({
			params: { category: 'linux', lab: 'file-permissions' }
		} as any);

		expect(result.category).toBe('linux');
		expect(result.labId).toBe('file-permissions');
	});

	it('returns HTML content', async () => {
		const result = await load({
			params: { category: 'kubernetes', lab: 'basic-deployment' }
		} as any);

		expect(typeof result.html).toBe('string');
		expect(result.html.length).toBeGreaterThan(0);
	});

	it('throws 404 for non-existent article', async () => {
		try {
			await load({
				params: { category: 'kubernetes', lab: 'nonexistent' }
			} as any);
			expect.fail('Should have thrown error');
		} catch (err: any) {
			expect(err.body.message).toBe('Knowledge article not found');
		}
	});

	it('throws error with 404 status', async () => {
		try {
			await load({
				params: { category: 'invalid', lab: 'invalid' }
			} as any);
			expect.fail('Should have thrown error');
		} catch (err: any) {
			expect(err.status).toBe(404);
		}
	});

	it('handles different categories', async () => {
		const k8sResult = await load({
			params: { category: 'kubernetes', lab: 'basic-deployment' }
		} as any);

		const linuxResult = await load({
			params: { category: 'linux', lab: 'file-permissions' }
		} as any);

		expect(k8sResult.category).toBe('kubernetes');
		expect(linuxResult.category).toBe('linux');
		expect(k8sResult.html).not.toBe(linuxResult.html);
	});

	it('is async function', () => {
		const result = load({
			params: { category: 'kubernetes', lab: 'basic-deployment' }
		} as any);

		expect(result).toBeInstanceOf(Promise);
	});
});
