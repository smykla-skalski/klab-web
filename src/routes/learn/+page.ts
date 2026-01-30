import { getAllLabs, getCategories } from '$lib/services/lab-loader';

export const load = () => {
	return {
		labs: getAllLabs(),
		categories: getCategories()
	};
};
