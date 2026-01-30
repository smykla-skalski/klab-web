import { getKnowledgeArticle } from '$lib/services/knowledge-loader';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const { category, lab: labId } = params;
	const html = await getKnowledgeArticle(category, labId);

	if (!html) {
		throw error(404, 'Knowledge article not found');
	}

	return {
		html,
		category,
		labId
	};
};
