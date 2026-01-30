import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import { writable } from 'svelte/store';
import userEvent from '@testing-library/user-event';
import ErrorPage from './+error.svelte';
import { page as mockPage } from '$app/stores';

vi.mock('$app/stores', () => ({
	page: writable({
		status: 500,
		error: { message: 'Test error' }
	})
}));

describe('Error Page', () => {
	beforeEach(() => {
		mockPage.set({
			status: 500,
			error: { message: 'Test error' }
		});
	});

	afterEach(() => {
		cleanup();
	});

	it('renders 404 error page', () => {
		mockPage.set({
			status: 404,
			error: null
		});

		render(ErrorPage);

		expect(screen.getByText('404')).toBeTruthy();
		expect(screen.getByText('Page Not Found')).toBeTruthy();
		expect(screen.getByText("The page you're looking for doesn't exist.")).toBeTruthy();
	});

	it('renders generic error page', () => {
		mockPage.set({
			status: 500,
			error: { message: 'Test error' }
		});

		render(ErrorPage);

		expect(screen.getByText('500')).toBeTruthy();
		expect(screen.getByText('Something went wrong')).toBeTruthy();
		expect(screen.getByText('Test error')).toBeTruthy();
	});

	it('shows default error message when no message provided', () => {
		mockPage.set({
			status: 500,
			error: null
		});

		render(ErrorPage);

		expect(screen.getByText('An unexpected error occurred')).toBeTruthy();
	});

	it('renders back to labs button', () => {
		render(ErrorPage);

		const backButton = screen.getByRole('link', { name: /back to labs/i });
		expect(backButton).toBeTruthy();
		expect(backButton.getAttribute('href')).toBe('/learn');
	});

	it('renders retry button', () => {
		render(ErrorPage);

		const retryButton = screen.getByRole('button', { name: /retry/i });
		expect(retryButton).toBeTruthy();
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
