import { persisted } from 'svelte-persisted-store';

export interface Progress {
	completedLabs: string[];
	currentLab?: string;
}

export const progress = persisted<Progress>('klab-progress', {
	completedLabs: []
});
