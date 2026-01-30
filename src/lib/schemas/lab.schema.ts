import { z } from 'zod';

export const labSchema = z.object({
	id: z.string(),
	title: z.string(),
	category: z.string(),
	description: z.string(),
	objective: z.string(),
	difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
	duration: z.string(),
	tags: z.array(z.string()),
	hints: z.array(z.string()),
	solution: z.string(),
	knowledgeArticle: z.string()
});

export type Lab = z.infer<typeof labSchema>;
