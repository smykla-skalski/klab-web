import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import LearnPage from './+page.svelte';

describe('Learn Page', () => {
	afterEach(() => {
		cleanup();
	});

	it('renders page title and description', () => {
		render(LearnPage);
		expect(screen.getByRole('heading', { name: /interactive labs/i })).toBeTruthy();
		expect(screen.getByText(/master new skills through hands-on practice/i)).toBeTruthy();
	});

	it('renders all category cards', () => {
		render(LearnPage);
		expect(screen.getByRole('link', { name: /kubernetes/i })).toBeTruthy();
		expect(screen.getByRole('link', { name: /linux/i })).toBeTruthy();
		expect(screen.getByRole('link', { name: /networking/i })).toBeTruthy();
	});

	it('category links have correct hrefs', () => {
		render(LearnPage);
		const kubernetesLink = screen
			.getAllByRole('link')
			.find((link) => link.getAttribute('href') === '/learn/kubernetes');
		const linuxLink = screen
			.getAllByRole('link')
			.find((link) => link.getAttribute('href') === '/learn/linux');
		const networkingLink = screen
			.getAllByRole('link')
			.find((link) => link.getAttribute('href') === '/learn/networking');

		expect(kubernetesLink).toBeTruthy();
		expect(linuxLink).toBeTruthy();
		expect(networkingLink).toBeTruthy();
	});
});
