import { persisted } from 'svelte-persisted-store';
import { derived } from 'svelte/store';

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
			let isComplete = false;
			store.subscribe((data) => {
				isComplete = data[`${category}/${labId}`] === true;
			})();
			return isComplete;
		},
		getCategoryProgress: (category: string, totalLabs: number) => {
			let completed = 0;
			store.subscribe((data) => {
				completed = Object.keys(data).filter(
					(key) => key.startsWith(`${category}/`) && data[key]
				).length;
			})();
			return totalLabs > 0 ? Math.round((completed / totalLabs) * 100) : 0;
		}
	};
}

export const progress = createProgressStore();
