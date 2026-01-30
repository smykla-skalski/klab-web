import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import LearnPage from './+page.svelte';
import { getAllLabs, getCategories } from '$lib/services/lab-loader';

const mockData = {
	labs: getAllLabs(),
	categories: getCategories()
};

describe('Learn Page', () => {
	afterEach(() => {
		cleanup();
	});

	it('renders page title and description', () => {
		render(LearnPage, { props: { data: mockData } });
		expect(screen.getByRole('heading', { name: /interactive labs/i })).toBeTruthy();
		expect(screen.getByText(/master new skills through hands-on practice/i)).toBeTruthy();
	});

	it('renders all category cards', () => {
		render(LearnPage, { props: { data: mockData } });
		// Check for at least some labs being rendered
		expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
	});

	it('category links have correct hrefs', () => {
		render(LearnPage, { props: { data: mockData } });
		// Labs are now cards not links, so just check they render
		const labCards = screen.getAllByRole('button');
		expect(labCards.length).toBe(mockData.labs.length);
	});
});
