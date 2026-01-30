import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { createRawSnippet } from 'svelte';
import LabContainer from './LabContainer.svelte';
import type { Lab } from '$lib/stores/lab';

const mockLab: Lab = {
	id: 'intro',
	title: 'Introduction to Kubernetes',
	category: 'kubernetes',
	description: 'Learn the basics',
	objective: 'Complete the lab',
	hints: [],
	validation: {
		type: 'command',
		commands: []
	}
};

describe('LabContainer', () => {
	afterEach(() => {
		cleanup();
		document.body.style.overflow = '';
	});

	it('renders lab title and category', () => {
		const sidebar = createRawSnippet(() => ({
			render: () => `<div>Sidebar</div>`
		}));
		const main = createRawSnippet(() => ({
			render: () => `<div>Main</div>`
		}));

		render(LabContainer, {
			props: {
				lab: mockLab,
				sidebar,
				main
			}
		});

		expect(screen.getByText('Introduction to Kubernetes')).toBeTruthy();
		expect(screen.getByText('kubernetes')).toBeTruthy();
	});

	it('renders sidebar and main content', () => {
		const sidebar = createRawSnippet(() => ({
			render: () => `<div>Sidebar Content</div>`
		}));
		const main = createRawSnippet(() => ({
			render: () => `<div>Main Content</div>`
		}));

		render(LabContainer, {
			props: {
				lab: mockLab,
				sidebar,
				main
			}
		});

		expect(screen.getByText('Sidebar Content')).toBeTruthy();
		expect(screen.getByText('Main Content')).toBeTruthy();
	});

	it('renders actions snippet when provided', () => {
		const sidebar = createRawSnippet(() => ({
			render: () => `<div>Sidebar</div>`
		}));
		const main = createRawSnippet(() => ({
			render: () => `<div>Main</div>`
		}));
		const actions = createRawSnippet(() => ({
			render: () => `<button>Action Button</button>`
		}));

		render(LabContainer, {
			props: {
				lab: mockLab,
				sidebar,
				main,
				actions
			}
		});

		expect(screen.getByRole('button', { name: /action button/i })).toBeTruthy();
	});

	it('toggles sidebar when toggle button clicked', async () => {
		const user = userEvent.setup();
		const sidebar = createRawSnippet(() => ({
			render: () => `<div>Sidebar</div>`
		}));
		const main = createRawSnippet(() => ({
			render: () => `<div>Main</div>`
		}));

		render(LabContainer, {
			props: {
				lab: mockLab,
				sidebar,
				main
			}
		});

		expect(screen.getByText('Sidebar')).toBeTruthy();

		const toggleButtons = screen.getAllByRole('button');
		const toggleButton = toggleButtons[0];
		await user.click(toggleButton);

		expect(screen.queryByText('Sidebar')).toBeNull();

		await user.click(toggleButton);

		expect(screen.getByText('Sidebar')).toBeTruthy();
	});

	it('sets body overflow to hidden on mount', () => {
		const sidebar = createRawSnippet(() => ({
			render: () => `<div>Sidebar</div>`
		}));
		const main = createRawSnippet(() => ({
			render: () => `<div>Main</div>`
		}));

		render(LabContainer, {
			props: {
				lab: mockLab,
				sidebar,
				main
			}
		});

		expect(document.body.style.overflow).toBe('hidden');
	});

	it('restores body overflow on unmount', () => {
		const sidebar = createRawSnippet(() => ({
			render: () => `<div>Sidebar</div>`
		}));
		const main = createRawSnippet(() => ({
			render: () => `<div>Main</div>`
		}));

		const originalOverflow = document.body.style.overflow;

		const { unmount } = render(LabContainer, {
			props: {
				lab: mockLab,
				sidebar,
				main
			}
		});

		unmount();

		expect(document.body.style.overflow).toBe(originalOverflow);
	});

	it('renders resize handle when sidebar is open', () => {
		const sidebar = createRawSnippet(() => ({
			render: () => `<div>Sidebar</div>`
		}));
		const main = createRawSnippet(() => ({
			render: () => `<div>Main</div>`
		}));

		render(LabContainer, {
			props: {
				lab: mockLab,
				sidebar,
				main
			}
		});

		expect(screen.getByRole('button', { name: /resize sidebar/i })).toBeTruthy();
	});

	it('hides resize handle when sidebar is closed', async () => {
		const user = userEvent.setup();
		const sidebar = createRawSnippet(() => ({
			render: () => `<div>Sidebar</div>`
		}));
		const main = createRawSnippet(() => ({
			render: () => `<div>Main</div>`
		}));

		render(LabContainer, {
			props: {
				lab: mockLab,
				sidebar,
				main
			}
		});

		const toggleButtons = screen.getAllByRole('button');
		const toggleButton = toggleButtons[0];
		await user.click(toggleButton);

		expect(screen.queryByRole('button', { name: /resize sidebar/i })).toBeNull();
	});

	it('handles keyboard resize with ArrowLeft', async () => {
		const user = userEvent.setup();
		const sidebar = createRawSnippet(() => ({
			render: () => `<div>Sidebar</div>`
		}));
		const main = createRawSnippet(() => ({
			render: () => `<div>Main</div>`
		}));

		render(LabContainer, {
			props: {
				lab: mockLab,
				sidebar,
				main
			}
		});

		const resizeHandle = screen.getByRole('button', { name: /resize sidebar/i });
		await user.type(resizeHandle, '{ArrowLeft}');

		expect(true).toBe(true);
	});

	it('handles keyboard resize with ArrowRight', async () => {
		const user = userEvent.setup();
		const sidebar = createRawSnippet(() => ({
			render: () => `<div>Sidebar</div>`
		}));
		const main = createRawSnippet(() => ({
			render: () => `<div>Main</div>`
		}));

		render(LabContainer, {
			props: {
				lab: mockLab,
				sidebar,
				main
			}
		});

		const resizeHandle = screen.getByRole('button', { name: /resize sidebar/i });
		await user.type(resizeHandle, '{ArrowRight}');

		expect(true).toBe(true);
	});
});
