import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import { writable, type Writable } from 'svelte/store';
import userEvent from '@testing-library/user-event';
import ErrorPage from './+error.svelte';
import { page as mockPage } from '$app/stores';

const mockPageWritable = mockPage as unknown as Writable<any>;

vi.mock('$app/stores', () => ({
	page: writable({
		status: 500,
		error: { message: 'Failed to load' }
	})
}));

describe('Learn Error Page', () => {
	beforeEach(() => {
		mockPageWritable.set({
			status: 500,
			error: { message: 'Failed to load' }
		});
	});

	afterEach(() => {
		cleanup();
	});

	it('renders error heading', () => {
		render(ErrorPage);

		expect(screen.getByText('Unable to load labs')).toBeTruthy();
	});

	it('displays error message from page store', () => {
		mockPageWritable.set({
			status: 500,
			error: { message: 'Custom error message' }
		});

		render(ErrorPage);

		expect(screen.getByText('Custom error message')).toBeTruthy();
	});

	it('shows default message when no error provided', () => {
		mockPageWritable.set({
			status: 500,
			error: null
		});

		render(ErrorPage);

		expect(screen.getByText('Failed to fetch lab catalog. Please try again.')).toBeTruthy();
	});

	it('renders retry button', () => {
		render(ErrorPage);

		const retryButton = screen.getByRole('button', { name: /retry/i });
		expect(retryButton).toBeTruthy();
	});

	it('renders home button', () => {
		render(ErrorPage);

		const homeButton = screen.getByRole('link', { name: /home/i });
		expect(homeButton).toBeTruthy();
		expect(homeButton.getAttribute('href')).toBe('/');
	});

	it('reloads page when retry clicked', async () => {
		const user = userEvent.setup();
		const reloadMock = vi.fn();
		Object.defineProperty(window, 'location', {
			writable: true,
			value: { reload: reloadMock }
		});

		render(ErrorPage);

		const retryButton = screen.getByRole('button', { name: /retry/i });
		await user.click(retryButton);

		expect(reloadMock).toHaveBeenCalled();
	});
});
