import { marked } from 'marked';
import hljs from 'highlight.js';
import { markedHighlight } from 'marked-highlight';

// Configure marked with syntax highlighting and line numbers
marked.use(
	markedHighlight({
		highlight(code: string, lang: string) {
			let highlighted: string;

			if (lang && hljs.getLanguage(lang)) {
				highlighted = hljs.highlight(code, { language: lang, ignoreIllegals: true }).value;
			} else {
				highlighted = hljs.highlightAuto(code).value;
			}

			const lines = highlighted.split('\n');
			const highlightedLines = lines.map((line, index) => {
				const lineNum = index + 1;
				const lineContent = line === '' ? '&nbsp;' : line;

				return `<span class="code-line"><span class="line-number">${lineNum}</span><span class="line-content">${lineContent}</span></span>`;
			});

			return highlightedLines.join('');
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

export async function getKnowledgeArticle(category: string, labId: string): Promise<string | null> {
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
