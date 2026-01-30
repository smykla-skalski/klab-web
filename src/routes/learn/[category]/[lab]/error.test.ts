import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import { writable } from 'svelte/store';
import userEvent from '@testing-library/user-event';
import ErrorPage from './+error.svelte';
import { page as mockPage } from '$app/stores';

vi.mock('$app/stores', () => ({
	page: writable({
		status: 500,
		error: { message: 'Connection failed' },
		params: { category: 'kubernetes', lab: 'intro' }
	})
}));

describe('Lab Error Page', () => {
	beforeEach(() => {
		mockPage.set({
			status: 500,
			error: { message: 'Connection failed' },
			params: { category: 'kubernetes', lab: 'intro' }
		});
	});

	afterEach(() => {
		cleanup();
	});

	it('renders 404 error for missing lab', () => {
		mockPage.set({
			status: 404,
			error: null,
			params: { category: 'kubernetes', lab: 'missing' }
		});

		render(ErrorPage);

		expect(screen.getByText('Lab Not Found')).toBeTruthy();
		expect(screen.getByText("The lab you're looking for doesn't exist or has been moved.")).toBeTruthy();
	});

	it('renders connection error', () => {
		mockPage.set({
			status: 500,
			error: { message: 'Connection failed' },
			params: { category: 'kubernetes', lab: 'intro' }
		});

		render(ErrorPage);

		expect(screen.getByText('Connection Error')).toBeTruthy();
		expect(screen.getByText('Connection failed')).toBeTruthy();
	});

	it('shows default error message when no message provided', () => {
		mockPage.set({
			status: 500,
			error: null,
			params: { category: 'kubernetes', lab: 'intro' }
		});

		render(ErrorPage);

		expect(screen.getByText('Failed to connect to lab environment. Please try again.')).toBeTruthy();
	});

	it('renders back to labs button', () => {
		render(ErrorPage);

		const backButton = screen.getByRole('link', { name: /back to labs/i });
		expect(backButton).toBeTruthy();
		expect(backButton.getAttribute('href')).toBe('/learn');
	});

	it('renders retry button for non-404 errors', () => {
		mockPage.set({
			status: 500,
			error: { message: 'Connection failed' },
			params: { category: 'kubernetes', lab: 'intro' }
		});

		render(ErrorPage);

		const retryButton = screen.getByRole('button', { name: /retry/i });
		expect(retryButton).toBeTruthy();
	});

	it('does not render retry button for 404 errors', () => {
		mockPage.set({
			status: 404,
			error: null,
			params: { category: 'kubernetes', lab: 'missing' }
		});

		render(ErrorPage);

		const retryButton = screen.queryByRole('button', { name: /retry/i });
		expect(retryButton).toBeNull();
	});

	it('renders knowledge base button with correct link', () => {
		mockPage.set({
			status: 500,
			error: { message: 'Connection failed' },
			params: { category: 'kubernetes', lab: 'intro' }
		});

		render(ErrorPage);

		const knowledgeButton = screen.getByRole('link', { name: /view knowledge base/i });
		expect(knowledgeButton).toBeTruthy();
		expect(knowledgeButton.getAttribute('href')).toBe('/learn/kubernetes/intro/knowledge');
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
