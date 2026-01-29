import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import { writable } from 'svelte/store';
import CategoryPage from './+page.svelte';

vi.mock('$app/stores', () => ({
	page: writable({
		params: { category: 'kubernetes' },
		url: new URL('http://localhost/learn/kubernetes')
	})
}));

vi.mock('$lib/stores/progress', () => ({
	progress: writable({
		completedLabs: ['kubernetes/intro']
	})
}));

describe('Category Page', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		cleanup();
	});

	it('renders category title', () => {
		render(CategoryPage);
		expect(screen.getByRole('heading', { name: /kubernetes labs/i })).toBeTruthy();
	});

	it('renders category description', () => {
		render(CategoryPage);
		expect(screen.getByText(/complete these labs to master kubernetes/i)).toBeTruthy();
	});

	it('renders all lab cards', () => {
		render(CategoryPage);
		expect(screen.getByRole('link', { name: /getting started/i })).toBeTruthy();
		expect(screen.getByRole('link', { name: /intermediate concepts/i })).toBeTruthy();
		expect(screen.getByRole('link', { name: /advanced techniques/i })).toBeTruthy();
	});

	it('lab cards have correct hrefs', () => {
		render(CategoryPage);
		const links = screen.getAllByRole('link');
		const introLink = links.find((link) =>
			link.getAttribute('href')?.includes('/learn/kubernetes/intro')
		);
		const intermediateLink = links.find((link) =>
			link.getAttribute('href')?.includes('/learn/kubernetes/intermediate')
		);
		const advancedLink = links.find((link) =>
			link.getAttribute('href')?.includes('/learn/kubernetes/advanced')
		);

		expect(introLink).toBeTruthy();
		expect(intermediateLink).toBeTruthy();
		expect(advancedLink).toBeTruthy();
	});

	it('displays lab metadata', () => {
		render(CategoryPage);
		expect(screen.getByText(/15 min/i)).toBeTruthy();
		expect(screen.getByText(/30 min/i)).toBeTruthy();
		expect(screen.getByText(/45 min/i)).toBeTruthy();
		expect(screen.getByText(/beginner/i)).toBeTruthy();
		expect(screen.getAllByText(/intermediate/i).length).toBeGreaterThan(0);
		expect(screen.getAllByText(/advanced/i).length).toBeGreaterThan(0);
	});

	it('shows completion status icons', () => {
		render(CategoryPage);
		const container = document.body;
		expect(container.querySelector('svg')).toBeTruthy();
	});
});
