import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import Footer from './Footer.svelte';

describe('Footer', () => {
	afterEach(() => {
		cleanup();
	});
	it('renders klab heading', () => {
		render(Footer);
		const heading = screen.getByRole('heading', { name: /klab/i });
		expect(heading).toBeTruthy();
	});

	it('renders description', () => {
		render(Footer);
		const description = screen.getByText(/interactive learning platform/i);
		expect(description).toBeTruthy();
	});

	it('renders Resources section', () => {
		render(Footer);
		const resourcesHeading = screen.getByRole('heading', { name: /resources/i });
		expect(resourcesHeading).toBeTruthy();
	});

	it('renders resource links', () => {
		render(Footer);
		const learnLink = screen.getByRole('link', { name: /browse labs/i });
		const docsLink = screen.getByRole('link', { name: /documentation/i });
		const aboutLink = screen.getByRole('link', { name: /about/i });

		expect(learnLink.getAttribute('href')).toBe('/learn');
		expect(docsLink.getAttribute('href')).toBe('/docs');
		expect(aboutLink.getAttribute('href')).toBe('/about');
	});

	it('renders Community section', () => {
		render(Footer);
		const communityHeading = screen.getByRole('heading', { name: /community/i });
		expect(communityHeading).toBeTruthy();
	});

	it('renders GitHub link', () => {
		render(Footer);
		const githubLink = screen.getByRole('link', { name: /github/i });
		expect(githubLink.getAttribute('href')).toBe('https://github.com/klab');
	});

	it('displays current year in copyright', () => {
		render(Footer);
		const currentYear = new Date().getFullYear();
		const copyright = screen.getByText(new RegExp(`©\\s*${currentYear}.*klab`, 'i'));
		expect(copyright).toBeTruthy();
	});
});
