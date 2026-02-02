import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import ShortcutHelpModal from './shortcut-help-modal.svelte';

describe('ShortcutHelpModal', () => {
	afterEach(() => {
		cleanup();
	});

	it('does not render when open is false', () => {
		render(ShortcutHelpModal, {
			props: {
				open: false
			}
		});

		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('renders when open is true', () => {
		render(ShortcutHelpModal, {
			props: {
				open: true
			}
		});

		const dialog = screen.getByRole('dialog');
		expect(dialog).toBeTruthy();
		expect(screen.getByText('Keyboard Shortcuts')).toBeTruthy();
	});

	it('displays global shortcuts', () => {
		render(ShortcutHelpModal, {
			props: {
				open: true
			}
		});

		expect(screen.getByText('Global')).toBeTruthy();
		expect(screen.getByText('Toggle theme')).toBeTruthy();
		expect(screen.getByText('Show keyboard shortcuts')).toBeTruthy();
		expect(screen.getByText('Ctrl+Shift+T')).toBeTruthy();
		expect(screen.getByText('? or Shift+/')).toBeTruthy();
	});

	it('displays lab shortcuts', () => {
		render(ShortcutHelpModal, {
			props: {
				open: true
			}
		});

		expect(screen.getByText('Lab')).toBeTruthy();
		expect(screen.getByText('Check solution')).toBeTruthy();
		expect(screen.getByText('Toggle hints')).toBeTruthy();
		expect(screen.getByText('Toggle sidebar')).toBeTruthy();
		expect(screen.getByText('Focus terminal')).toBeTruthy();
		expect(screen.getByText('Ctrl+Enter')).toBeTruthy();
		expect(screen.getByText('Ctrl+H')).toBeTruthy();
		expect(screen.getByText('Ctrl+B')).toBeTruthy();
		expect(screen.getByText('Ctrl+\\')).toBeTruthy();
	});

	it('closes modal when close button is clicked', async () => {
		const user = userEvent.setup();
		const component = render(ShortcutHelpModal, {
			props: {
				open: true
			}
		});

		const closeButton = screen.getByRole('button', { name: 'Close shortcuts help' });
		await user.click(closeButton);

		// Check that the open state changed by verifying dialog is not visible
		// Since we're testing the component in isolation, we need to check the component state
		expect(component.container.querySelector('[role="dialog"]')).toBeNull();
	});

	it('closes modal when backdrop is clicked', async () => {
		const user = userEvent.setup();
		const component = render(ShortcutHelpModal, {
			props: {
				open: true
			}
		});

		const backdrop = screen.getByRole('dialog');
		await user.click(backdrop);

		await waitFor(() => {
			expect(component.container.querySelector('[role="dialog"]')).toBeNull();
		});
	});

	it('has proper accessibility attributes', () => {
		render(ShortcutHelpModal, {
			props: {
				open: true
			}
		});

		const backdrop = screen.getByRole('dialog');
		expect(backdrop.getAttribute('aria-modal')).toBe('true');
		expect(backdrop.getAttribute('aria-labelledby')).toBe('shortcut-title');
		expect(backdrop.getAttribute('tabindex')).toBe('-1');
	});

	it('renders keyboard shortcuts as kbd elements', () => {
		const { container } = render(ShortcutHelpModal, {
			props: {
				open: true
			}
		});

		const kbdElements = container.querySelectorAll('kbd');
		expect(kbdElements.length).toBeGreaterThan(0);
	});
});
