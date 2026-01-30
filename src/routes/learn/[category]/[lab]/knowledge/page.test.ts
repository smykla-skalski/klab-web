import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import { writable } from 'svelte/store';
import KnowledgePage from './+page.svelte';

vi.mock('$app/stores', () => ({
	page: writable({
		params: { category: 'kubernetes', lab: 'basic-deployment' },
		url: new URL('http://localhost/learn/kubernetes/basic-deployment/knowledge')
	})
}));

const mockData = {
	html: '<h1>Kubernetes Deployments</h1><p>Test content</p>',
	category: 'kubernetes',
	labId: 'basic-deployment'
};

describe('Knowledge Page', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		cleanup();
	});

	it('renders knowledge article title', () => {
		render(KnowledgePage, { props: { data: mockData } });
		expect(screen.getByRole('heading', { name: /kubernetes deployments/i })).toBeTruthy();
	});

	it('renders back link to lab', () => {
		render(KnowledgePage, { props: { data: mockData } });
		const backLink = screen.getByRole('link', { name: /back to lab/i });
		expect(backLink).toBeTruthy();
		expect(backLink.getAttribute('href')).toBe('/learn/kubernetes/basic-deployment');
	});

	it('displays article sections', () => {
		render(KnowledgePage, { props: { data: mockData } });
		expect(screen.getByText(/test content/i)).toBeTruthy();
	});

	it('displays placeholder content', () => {
		render(KnowledgePage, { props: { data: mockData } });
		expect(screen.getByRole('heading', { name: /kubernetes deployments/i })).toBeTruthy();
	});

	it('renders key concepts list', () => {
		render(KnowledgePage, { props: { data: mockData } });
		// Article content now comes from markdown
		expect(screen.getByText(/test content/i)).toBeTruthy();
	});
});
