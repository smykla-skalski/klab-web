import { getLab } from '$lib/services/lab-loader';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const ssr = false;

export const load: PageLoad = ({ params }) => {
	const { category, lab: labId } = params;
	const lab = getLab(category, labId);

	if (!lab) {
		throw error(404, 'Lab not found');
	}

	return { lab };
};
