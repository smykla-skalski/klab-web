import { writable } from 'svelte/store';

export interface Lab {
	id: string;
	title: string;
	category: string;
	objective: string;
	hints: string[];
	solution?: string;
}

export const currentLab = writable<Lab | null>(null);
