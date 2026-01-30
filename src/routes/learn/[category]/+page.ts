import { getLabsByCategory, getCategories } from '$lib/services/lab-loader';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const { category } = params;

	// Validate category exists
	const categories = getCategories();
	const categoryExists = categories.some((c) => c.id === category);

	if (!categoryExists) {
		throw error(404, 'Category not found');
	}

	const labs = getLabsByCategory(category);
	const categoryData = categories.find((c) => c.id === category);

	return {
		category: categoryData!,
		labs
	};
};
