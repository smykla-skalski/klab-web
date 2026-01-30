import { marked } from 'marked';
import hljs from 'highlight.js';
import { markedHighlight } from 'marked-highlight';

// Configure marked with syntax highlighting
marked.use(
	markedHighlight({
		highlight(code: string, lang: string) {
			if (lang && hljs.getLanguage(lang)) {
				return hljs.highlight(code, { language: lang }).value;
			}
			return hljs.highlightAuto(code).value;
		}
	})
);

marked.setOptions({
	breaks: true,
	gfm: true
});

// Import knowledge articles
const knowledgeModules = import.meta.glob('/src/lib/content/knowledge/**/*.md', {
	query: '?raw',
	import: 'default'
});

export async function getKnowledgeArticle(
	category: string,
	labId: string
): Promise<string | null> {
	const path = `/src/lib/content/knowledge/${category}/${labId}.md`;
	const module = knowledgeModules[path];

	if (!module) {
		return null;
	}

	try {
		const markdown = (await module()) as string;
		const html = await marked.parse(markdown);
		return html;
	} catch (error) {
		console.error(`Failed to load knowledge article: ${path}`, error);
		return null;
	}
}
