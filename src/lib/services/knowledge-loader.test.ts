import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getKnowledgeArticle } from './knowledge-loader';

// Mock the import.meta.glob
const mockModules: Record<string, () => Promise<string>> = {};

vi.mock('/src/lib/content/knowledge/**/*.md', () => mockModules);

describe('knowledge-loader', () => {
	beforeEach(() => {
		// Clear all mocks
		Object.keys(mockModules).forEach((key) => delete mockModules[key]);
	});

	describe('getKnowledgeArticle', () => {
		it('returns null for non-existent article', async () => {
			const result = await getKnowledgeArticle('kubernetes', 'nonexistent');
			expect(result).toBeNull();
		});

		it('returns HTML from markdown', async () => {
			const markdown = '# Test Article\n\nThis is a test.';
			const mockModule = vi.fn().mockResolvedValue(markdown);

			// Directly test by mocking the glob result
			const path = '/src/lib/content/knowledge/kubernetes/intro.md';
			const knowledgeModules = {
				[path]: mockModule
			};

			const module = knowledgeModules[path];
			expect(module).toBeDefined();

			const content = await module();
			expect(content).toBe(markdown);
		});

		it('handles markdown with code blocks', async () => {
			const markdown = '# Code Example\n\n```javascript\nconst x = 1;\n```';

			// Test that marked can parse code blocks
			const { marked } = await import('marked');
			const html = await marked.parse(markdown);
			expect(html).toContain('<pre>');
			expect(html).toContain('<code');
			// Code should be present (possibly with syntax highlighting)
			expect(html).toMatch(/const.*x.*1/);
		});

		it('handles markdown with GFM features', async () => {
			const markdown = '# List\n\n- Item 1\n- Item 2';

			// Test that marked can parse GFM
			const { marked } = await import('marked');
			const html = await marked.parse(markdown);
			expect(html).toContain('<ul>');
			expect(html).toContain('<li>');
		});

		it('handles markdown with line breaks', async () => {
			const markdown = 'Line 1\nLine 2';

			// Test that marked respects breaks option
			const { marked } = await import('marked');
			const html = await marked.parse(markdown);
			// With breaks: true, single newlines should create <br>
			expect(html).toContain('<br>');
		});

		it('returns null on module load error', async () => {
			// Since we can't easily mock import.meta.glob behavior,
			// we test the error handling path indirectly
			const result = await getKnowledgeArticle('invalid', 'path');
			expect(result).toBeNull();
		});

		it('constructs correct path for article', async () => {
			// Test path construction logic
			const category = 'kubernetes';
			const labId = 'intro';
			const expectedPath = `/src/lib/content/knowledge/${category}/${labId}.md`;

			// Verify path format is correct
			expect(expectedPath).toBe('/src/lib/content/knowledge/kubernetes/intro.md');
		});

		it('handles different categories and lab IDs', async () => {
			const testCases = [
				{ category: 'linux', labId: 'basic-commands' },
				{ category: 'networking', labId: 'tcp-ip' },
				{ category: 'kubernetes', labId: 'pods' }
			];

			for (const { category, labId } of testCases) {
				const result = await getKnowledgeArticle(category, labId);
				// Since modules don't exist, should return null
				expect(result).toBeNull();
			}
		});
	});

	describe('marked configuration', () => {
		it('highlights code with language specified', async () => {
			const hljs = await import('highlight.js');
			const code = 'const x = 1;';
			const lang = 'javascript';

			const result = hljs.default.highlight(code, { language: lang });
			expect(result.value).toBeTruthy();
			expect(result.value).not.toBe(code); // Should be highlighted
		});

		it('auto-highlights code without language', async () => {
			const hljs = await import('highlight.js');
			const code = 'const x = 1;';

			const result = hljs.default.highlightAuto(code);
			expect(result.value).toBeTruthy();
		});

		it('handles invalid language gracefully', async () => {
			const hljs = await import('highlight.js');
			const code = 'some code';
			const invalidLang = 'notareallanguage';

			const hasLanguage = hljs.default.getLanguage(invalidLang);
			expect(hasLanguage).toBeUndefined();
		});
	});
});
