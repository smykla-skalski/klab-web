import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import ConfirmModal from './confirm-modal.svelte';

describe('ConfirmModal', () => {
	afterEach(() => {
		cleanup();
	});

	it('does not render when open is false', () => {
		render(ConfirmModal, {
			props: {
				open: false,
				message: 'Are you sure?',
				onConfirm: vi.fn(),
				onCancel: vi.fn()
			}
		});
		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('renders when open is true', () => {
		render(ConfirmModal, {
			props: {
				open: true,
				message: 'Are you sure?',
				onConfirm: vi.fn(),
				onCancel: vi.fn()
			}
		});
		expect(screen.getByRole('dialog')).toBeTruthy();
	});

	it('displays custom title', () => {
		render(ConfirmModal, {
			props: {
				open: true,
				title: 'Delete Item',
				message: 'Are you sure?',
				onConfirm: vi.fn(),
				onCancel: vi.fn()
			}
		});
		expect(screen.getByText('Delete Item')).toBeTruthy();
	});

	it('displays default title when not provided', () => {
		render(ConfirmModal, {
			props: {
				open: true,
				message: 'Are you sure?',
				onConfirm: vi.fn(),
				onCancel: vi.fn()
			}
		});
		expect(screen.getByText('Confirm Action')).toBeTruthy();
	});

	it('displays message', () => {
		render(ConfirmModal, {
			props: {
				open: true,
				message: 'This action cannot be undone.',
				onConfirm: vi.fn(),
				onCancel: vi.fn()
			}
		});
		expect(screen.getByText('This action cannot be undone.')).toBeTruthy();
	});

	it('displays custom button labels', () => {
		render(ConfirmModal, {
			props: {
				open: true,
				message: 'Are you sure?',
				confirmLabel: 'Delete',
				cancelLabel: 'Keep',
				onConfirm: vi.fn(),
				onCancel: vi.fn()
			}
		});
		expect(screen.getByRole('button', { name: /delete/i })).toBeTruthy();
		expect(screen.getByRole('button', { name: /keep/i })).toBeTruthy();
	});

	it('displays default button labels', () => {
		render(ConfirmModal, {
			props: {
				open: true,
				message: 'Are you sure?',
				onConfirm: vi.fn(),
				onCancel: vi.fn()
			}
		});
		expect(screen.getByRole('button', { name: /confirm/i })).toBeTruthy();
		expect(screen.getByRole('button', { name: /cancel/i })).toBeTruthy();
	});

	it('calls onConfirm when confirm button clicked', async () => {
		const user = userEvent.setup();
		const onConfirm = vi.fn();
		const onCancel = vi.fn();

		render(ConfirmModal, {
			props: {
				open: true,
				message: 'Are you sure?',
				onConfirm,
				onCancel
			}
		});

		const confirmButton = screen.getByRole('button', { name: /confirm/i });
		await user.click(confirmButton);

		expect(onConfirm).toHaveBeenCalledOnce();
		expect(onCancel).not.toHaveBeenCalled();
	});

	it('calls onCancel when cancel button clicked', async () => {
		const user = userEvent.setup();
		const onConfirm = vi.fn();
		const onCancel = vi.fn();

		render(ConfirmModal, {
			props: {
				open: true,
				message: 'Are you sure?',
				onConfirm,
				onCancel
			}
		});

		const cancelButton = screen.getByRole('button', { name: /cancel/i });
		await user.click(cancelButton);

		expect(onCancel).toHaveBeenCalledOnce();
		expect(onConfirm).not.toHaveBeenCalled();
	});

	it('calls onCancel when close icon clicked', async () => {
		const user = userEvent.setup();
		const onConfirm = vi.fn();
		const onCancel = vi.fn();

		render(ConfirmModal, {
			props: {
				open: true,
				message: 'Are you sure?',
				onConfirm,
				onCancel
			}
		});

		const closeButton = screen.getByRole('button', { name: /close modal/i });
		await user.click(closeButton);

		expect(onCancel).toHaveBeenCalledOnce();
		expect(onConfirm).not.toHaveBeenCalled();
	});

	it('calls onCancel when backdrop clicked', async () => {
		const user = userEvent.setup();
		const onConfirm = vi.fn();
		const onCancel = vi.fn();

		render(ConfirmModal, {
			props: {
				open: true,
				message: 'Are you sure?',
				onConfirm,
				onCancel
			}
		});

		const backdrop = screen.getByRole('dialog');
		await user.click(backdrop);

		expect(onCancel).toHaveBeenCalledOnce();
		expect(onConfirm).not.toHaveBeenCalled();
	});

	it('does not close when clicking modal content', async () => {
		const user = userEvent.setup();
		const onConfirm = vi.fn();
		const onCancel = vi.fn();

		render(ConfirmModal, {
			props: {
				open: true,
				message: 'Are you sure?',
				onConfirm,
				onCancel
			}
		});

		const message = screen.getByText('Are you sure?');
		await user.click(message);

		expect(onCancel).not.toHaveBeenCalled();
		expect(onConfirm).not.toHaveBeenCalled();
	});

	it('calls onCancel when Escape key pressed', async () => {
		const user = userEvent.setup();
		const onConfirm = vi.fn();
		const onCancel = vi.fn();

		render(ConfirmModal, {
			props: {
				open: true,
				message: 'Are you sure?',
				onConfirm,
				onCancel
			}
		});

		const dialog = screen.getByRole('dialog');
		await user.type(dialog, '{Escape}');

		expect(onCancel).toHaveBeenCalledOnce();
		expect(onConfirm).not.toHaveBeenCalled();
	});

	it('has correct aria attributes', () => {
		render(ConfirmModal, {
			props: {
				open: true,
				message: 'Are you sure?',
				onConfirm: vi.fn(),
				onCancel: vi.fn()
			}
		});

		const dialog = screen.getByRole('dialog');
		expect(dialog.getAttribute('aria-modal')).toBe('true');
		expect(dialog.getAttribute('aria-labelledby')).toBe('modal-title');
	});
});
