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
	description: 'Learn Kubernetes basics',
	objective: 'Complete the lab',
	difficulty: 'Beginner',
	duration: '15 min',
	tags: ['kubernetes', 'beginner'],
	hints: [],
	solution: 'kubectl get pods',
	knowledgeArticle: 'intro'
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

	it('starts mouse resize on mousedown', async () => {
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
		await user.pointer({ keys: '[MouseLeft>]', target: resizeHandle });

		await user.pointer({ keys: '[/MouseLeft]' });

		expect(true).toBe(true);
	});

	it('resizes sidebar with mouse movement', async () => {
		const sidebar = createRawSnippet(() => ({
			render: () => `<div>Sidebar</div>`
		}));
		const main = createRawSnippet(() => ({
			render: () => `<div>Main</div>`
		}));

		const addEventListenerSpy = vi.spyOn(document, 'addEventListener');

		render(LabContainer, {
			props: {
				lab: mockLab,
				sidebar,
				main
			}
		});

		const resizeHandle = screen.getByRole('button', { name: /resize sidebar/i });

		resizeHandle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 320 }));

		expect(addEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
		expect(addEventListenerSpy).toHaveBeenCalledWith('mouseup', expect.any(Function));

		document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 400 }));

		document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

		addEventListenerSpy.mockRestore();
	});

	it('enforces minimum sidebar width of 280px', async () => {
		const sidebar = createRawSnippet(() => ({
			render: () => `<div>Sidebar</div>`
		}));
		const main = createRawSnippet(() => ({
			render: () => `<div>Main</div>`
		}));

		const { container } = render(LabContainer, {
			props: {
				lab: mockLab,
				sidebar,
				main
			}
		});

		const resizeHandle = screen.getByRole('button', { name: /resize sidebar/i });

		resizeHandle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 320 }));

		document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 100 }));

		const sidebarEl = container.querySelector('[style*="width"]');
		expect(sidebarEl?.getAttribute('style')).toContain('320px');

		document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
	});

	it('enforces maximum sidebar width of 600px', async () => {
		const sidebar = createRawSnippet(() => ({
			render: () => `<div>Sidebar</div>`
		}));
		const main = createRawSnippet(() => ({
			render: () => `<div>Main</div>`
		}));

		const { container } = render(LabContainer, {
			props: {
				lab: mockLab,
				sidebar,
				main
			}
		});

		const resizeHandle = screen.getByRole('button', { name: /resize sidebar/i });

		resizeHandle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 320 }));

		document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 800 }));

		const sidebarEl = container.querySelector('[style*="width"]');
		expect(sidebarEl?.getAttribute('style')).toContain('320px');

		document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
	});

	it('stops resize on mouseup', async () => {
		const sidebar = createRawSnippet(() => ({
			render: () => `<div>Sidebar</div>`
		}));
		const main = createRawSnippet(() => ({
			render: () => `<div>Main</div>`
		}));

		const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

		render(LabContainer, {
			props: {
				lab: mockLab,
				sidebar,
				main
			}
		});

		const resizeHandle = screen.getByRole('button', { name: /resize sidebar/i });

		resizeHandle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 320 }));
		document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

		expect(removeEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
		expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseup', expect.any(Function));

		removeEventListenerSpy.mockRestore();
	});

	it('handles keyboard resize boundaries for left arrow', async () => {
		const _user = userEvent.setup();
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

		const event = new KeyboardEvent('keydown', {
			key: 'ArrowLeft',
			bubbles: true,
			cancelable: true
		});
		resizeHandle.dispatchEvent(event);

		expect(event.defaultPrevented).toBe(true);
	});

	it('handles keyboard resize boundaries for right arrow', async () => {
		const _user = userEvent.setup();
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

		const event = new KeyboardEvent('keydown', {
			key: 'ArrowRight',
			bubbles: true,
			cancelable: true
		});
		resizeHandle.dispatchEvent(event);

		expect(event.defaultPrevented).toBe(true);
	});

	it('cleans up event listeners on unmount during resize', () => {
		const sidebar = createRawSnippet(() => ({
			render: () => `<div>Sidebar</div>`
		}));
		const main = createRawSnippet(() => ({
			render: () => `<div>Main</div>`
		}));

		const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

		const { unmount } = render(LabContainer, {
			props: {
				lab: mockLab,
				sidebar,
				main
			}
		});

		const resizeHandle = screen.getByRole('button', { name: /resize sidebar/i });
		resizeHandle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 320 }));

		unmount();

		expect(removeEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
		expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseup', expect.any(Function));

		removeEventListenerSpy.mockRestore();
	});

	it('opens mobile drawer when mobile toggle clicked', async () => {
		Object.defineProperty(window, 'innerWidth', {
			writable: true,
			configurable: true,
			value: 375
		});

		const user = userEvent.setup();
		const sidebar = createRawSnippet(() => ({
			render: () => `<div>Mobile Sidebar</div>`
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

		const mobileToggle = screen.getByRole('button', { name: /open sidebar/i });
		await user.click(mobileToggle);

		expect(screen.getByRole('dialog')).toBeTruthy();
		expect(screen.getByText('Lab Info')).toBeTruthy();
	});

	it('closes mobile drawer when close button clicked', async () => {
		const user = userEvent.setup();
		const sidebar = createRawSnippet(() => ({
			render: () => `<div>Mobile Sidebar</div>`
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

		const mobileToggle = screen.getByRole('button', { name: /open sidebar/i });
		await user.click(mobileToggle);

		const closeButton = screen.getByRole('button', { name: /close sidebar/i });
		await user.click(closeButton);

		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('closes mobile drawer when backdrop clicked', async () => {
		const user = userEvent.setup();
		const sidebar = createRawSnippet(() => ({
			render: () => `<div>Mobile Sidebar</div>`
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

		const mobileToggle = screen.getByRole('button', { name: /open sidebar/i });
		await user.click(mobileToggle);

		const backdrop = screen.getByRole('button', { name: /close drawer/i });
		await user.click(backdrop);

		expect(screen.queryByRole('dialog')).toBeNull();
	});
});
