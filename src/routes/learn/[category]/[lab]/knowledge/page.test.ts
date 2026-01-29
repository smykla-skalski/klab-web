import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import { writable } from 'svelte/store';
import KnowledgePage from './+page.svelte';

vi.mock('$app/stores', () => ({
	page: writable({
		params: { category: 'kubernetes', lab: 'intro' },
		url: new URL('http://localhost/learn/kubernetes/intro/knowledge')
	})
}));

describe('Knowledge Page', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		cleanup();
	});

	it('renders knowledge article title', () => {
		render(KnowledgePage);
		expect(screen.getByRole('heading', { name: /intro knowledge article/i })).toBeTruthy();
	});

	it('renders back link to lab', () => {
		render(KnowledgePage);
		const backLink = screen.getByRole('link', { name: /back to lab/i });
		expect(backLink).toBeTruthy();
		expect(backLink.getAttribute('href')).toBe('/learn/kubernetes/intro');
	});

	it('displays article sections', () => {
		render(KnowledgePage);
		expect(screen.getByRole('heading', { name: /overview/i })).toBeTruthy();
		expect(screen.getByRole('heading', { name: /key concepts/i })).toBeTruthy();
	});

	it('displays placeholder content', () => {
		render(KnowledgePage);
		expect(screen.getByText(/knowledge articles will be implemented in phase 3/i)).toBeTruthy();
	});

	it('renders key concepts list', () => {
		render(KnowledgePage);
		expect(screen.getByText(/concept 1/i)).toBeTruthy();
		expect(screen.getByText(/concept 2/i)).toBeTruthy();
		expect(screen.getByText(/concept 3/i)).toBeTruthy();
	});
});
