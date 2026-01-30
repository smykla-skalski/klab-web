import { writable } from 'svelte/store';

export interface Lab {
	id: string;
	title: string;
	category: string;
	description: string;
	objective: string;
	difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
	duration: string;
	tags: string[];
	hints: string[];
	solution: string;
	knowledgeArticle: string;
}

export const currentLab = writable<Lab | null>(null);
