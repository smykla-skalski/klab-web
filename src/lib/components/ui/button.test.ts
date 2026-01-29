import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { createRawSnippet } from 'svelte';
import Button from './button.svelte';

describe('Button', () => {
	afterEach(() => {
		cleanup();
	});
	it('renders as button by default', () => {
		const children = createRawSnippet(() => ({
			render: () => `<span>Click me</span>`
		}));
		render(Button, {
			props: {
				children
			}
		});
		const button = screen.getByRole('button', { name: /click me/i });
		expect(button).toBeTruthy();
		expect(button.tagName).toBe('BUTTON');
	});

	it('renders as link when href provided', () => {
		const children = createRawSnippet(() => ({
			render: () => `<span>Link button</span>`
		}));
		render(Button, {
			props: {
				href: '/test',
				children
			}
		});
		const link = screen.getByRole('link', { name: /link button/i });
		expect(link).toBeTruthy();
		expect(link.getAttribute('href')).toBe('/test');
	});

	it('applies default variant classes', () => {
		const children = createRawSnippet(() => ({
			render: () => `<span>Default</span>`
		}));
		render(Button, {
			props: {
				children
			}
		});
		const button = screen.getByRole('button');
		expect(button.className).toContain('bg-primary');
	});

	it('applies destructive variant', () => {
		const children = createRawSnippet(() => ({
			render: () => `<span>Delete</span>`
		}));
		render(Button, {
			props: {
				variant: 'destructive',
				children
			}
		});
		const button = screen.getByRole('button');
		expect(button.className).toContain('bg-destructive');
	});

	it('applies outline variant', () => {
		const children = createRawSnippet(() => ({
			render: () => `<span>Outline</span>`
		}));
		render(Button, {
			props: {
				variant: 'outline',
				children
			}
		});
		const button = screen.getByRole('button');
		expect(button.className).toContain('border');
	});

	it('applies secondary variant', () => {
		const children = createRawSnippet(() => ({
			render: () => `<span>Secondary</span>`
		}));
		render(Button, {
			props: {
				variant: 'secondary',
				children
			}
		});
		const button = screen.getByRole('button');
		expect(button.className).toContain('bg-secondary');
	});

	it('applies ghost variant', () => {
		const children = createRawSnippet(() => ({
			render: () => `<span>Ghost</span>`
		}));
		render(Button, {
			props: {
				variant: 'ghost',
				children
			}
		});
		const button = screen.getByRole('button');
		expect(button.className).toContain('hover:bg-accent');
	});

	it('applies link variant', () => {
		const children = createRawSnippet(() => ({
			render: () => `<span>Link</span>`
		}));
		render(Button, {
			props: {
				variant: 'link',
				children
			}
		});
		const button = screen.getByRole('button');
		expect(button.className).toContain('underline-offset-4');
	});

	it('applies small size', () => {
		const children = createRawSnippet(() => ({
			render: () => `<span>Small</span>`
		}));
		render(Button, {
			props: {
				size: 'sm',
				children
			}
		});
		const button = screen.getByRole('button');
		expect(button.className).toContain('h-8');
	});

	it('applies large size', () => {
		const children = createRawSnippet(() => ({
			render: () => `<span>Large</span>`
		}));
		render(Button, {
			props: {
				size: 'lg',
				children
			}
		});
		const button = screen.getByRole('button');
		expect(button.className).toContain('h-10');
	});

	it('applies icon size', () => {
		const children = createRawSnippet(() => ({
			render: () => `<span>+</span>`
		}));
		render(Button, {
			props: {
				size: 'icon',
				children
			}
		});
		const button = screen.getByRole('button');
		expect(button.className).toContain('h-9');
		expect(button.className).toContain('w-9');
	});

	it('applies custom class', () => {
		const children = createRawSnippet(() => ({
			render: () => `<span>Custom</span>`
		}));
		render(Button, {
			props: {
				class: 'custom-class',
				children
			}
		});
		const button = screen.getByRole('button');
		expect(button.className).toContain('custom-class');
	});

	it('handles click events', async () => {
		const user = userEvent.setup();
		const handleClick = vi.fn();
		const children = createRawSnippet(() => ({
			render: () => `<span>Clickable</span>`
		}));
		render(Button, {
			props: {
				onclick: handleClick,
				children
			}
		});
		const button = screen.getByRole('button');
		await user.click(button);
		expect(handleClick).toHaveBeenCalledOnce();
	});

	it('sets button type', () => {
		const children = createRawSnippet(() => ({
			render: () => `<span>Submit</span>`
		}));
		render(Button, {
			props: {
				type: 'submit',
				children
			}
		});
		const button = screen.getByRole('button');
		expect(button.getAttribute('type')).toBe('submit');
	});

	it('defaults to button type', () => {
		const children = createRawSnippet(() => ({
			render: () => `<span>Default type</span>`
		}));
		render(Button, {
			props: {
				children
			}
		});
		const button = screen.getByRole('button');
		expect(button.getAttribute('type')).toBe('button');
	});
});
