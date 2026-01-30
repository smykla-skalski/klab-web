import { persisted } from 'svelte-persisted-store';
import { get } from 'svelte/store';

type ProgressData = Record<string, boolean>;

function createProgressStore() {
	const store = persisted<ProgressData>('klab-progress', {});

	return {
		subscribe: store.subscribe,
		set: store.set,
		update: store.update,
		markLabComplete: (category: string, labId: string) => {
			store.update((data) => ({
				...data,
				[`${category}/${labId}`]: true
			}));
		},
		isLabComplete: (category: string, labId: string) => {
			const data = get(store);
			return data[`${category}/${labId}`] === true;
		},
		getCategoryProgress: (category: string, totalLabs: number) => {
			const data = get(store);
			const completed = Object.keys(data).filter(
				(key) => key.startsWith(`${category}/`) && data[key]
			).length;
			return totalLabs > 0 ? Math.round((completed / totalLabs) * 100) : 0;
		}
	};
}

export const progress = createProgressStore();
