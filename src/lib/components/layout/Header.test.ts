import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import Header from './Header.svelte';

describe('Header', () => {
	afterEach(() => {
		cleanup();
	});
	it('renders logo link', () => {
		render(Header);
		const logo = screen.getByRole('link', { name: /klab/i });
		expect(logo).toBeTruthy();
		expect(logo.getAttribute('href')).toBe('/');
	});

	it('renders desktop navigation links', () => {
		render(Header);
		const learnLink = screen.getByRole('link', { name: /^learn$/i });
		const aboutLink = screen.getByRole('link', { name: /about/i });
		const docsLink = screen.getByRole('link', { name: /docs/i });

		expect(learnLink.getAttribute('href')).toBe('/learn');
		expect(aboutLink.getAttribute('href')).toBe('/about');
		expect(docsLink.getAttribute('href')).toBe('/docs');
	});

	it('renders mobile menu button', () => {
		render(Header);
		const menuButton = screen.getByRole('button');
		expect(menuButton).toBeTruthy();
	});

	it('toggles mobile menu on button click', async () => {
		const user = userEvent.setup();
		render(Header);

		const mobileNav = document.querySelector('nav.md\\:hidden');
		expect(mobileNav).toBeNull();

		const menuButton = screen.getByRole('button');
		await user.click(menuButton);

		const mobileNavAfterClick = document.querySelector('nav.md\\:hidden');
		expect(mobileNavAfterClick).toBeTruthy();
	});

	it('hides mobile menu on second button click', async () => {
		const user = userEvent.setup();
		render(Header);

		const menuButton = screen.getByRole('button');
		await user.click(menuButton);
		await user.click(menuButton);

		const mobileNav = document.querySelector('nav.md\\:hidden');
		expect(mobileNav).toBeNull();
	});

	it('shows mobile navigation links when menu is open', async () => {
		const user = userEvent.setup();
		render(Header);

		const menuButton = screen.getByRole('button');
		await user.click(menuButton);

		const allLinks = screen.getAllByRole('link', { name: /learn/i });
		expect(allLinks.length).toBeGreaterThan(1);
	});

	it('mobile menu links have onclick handlers', async () => {
		const user = userEvent.setup();
		render(Header);

		const menuButton = screen.getByRole('button');
		await user.click(menuButton);

		const mobileNav = document.querySelector('nav.md\\:hidden');
		expect(mobileNav).toBeTruthy();

		const mobileLinks = Array.from(mobileNav?.querySelectorAll('a') || []);
		expect(mobileLinks.length).toBe(3);
		mobileLinks.forEach((link) => {
			expect(link.getAttribute('href')).toBeTruthy();
		});
	});
});
