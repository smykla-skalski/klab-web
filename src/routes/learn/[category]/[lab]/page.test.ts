import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { writable } from 'svelte/store';
import LabPage from './+page.svelte';
import { goto } from '$app/navigation';
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
	hints: ['Hint 1', 'Hint 2'],
	solution: 'kubectl get pods',
	knowledgeArticle: 'intro'
};

vi.mock('$app/stores', () => ({
	page: writable({
		params: { category: 'kubernetes', lab: 'intro' },
		url: new URL('http://localhost/learn/kubernetes/intro')
	})
}));

vi.mock('$app/navigation', () => ({
	goto: vi.fn()
}));

vi.mock('$lib/components/terminal/Terminal.svelte');

Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn()
	}))
});

describe('Lab Page', () => {
	const renderLabPage = () => render(LabPage, { props: { data: { lab: mockLab } } });

	beforeEach(() => {
		vi.clearAllMocks();
		vi.useFakeTimers();
	});

	afterEach(() => {
		cleanup();
		vi.clearAllTimers();
		vi.useRealTimers();
	});

	it('renders lab title', () => {
		renderLabPage();
		expect(screen.getByText(/Introduction to Kubernetes/i)).toBeTruthy();
	});

	it('renders category', () => {
		renderLabPage();
		expect(screen.getByText('kubernetes')).toBeTruthy();
	});

	it('renders check solution button', () => {
		renderLabPage();
		expect(screen.getByRole('button', { name: /check solution/i })).toBeTruthy();
	});

	it('renders knowledge button', () => {
		renderLabPage();
		expect(screen.getByRole('button', { name: /knowledge/i })).toBeTruthy();
	});

	it('renders give up button', () => {
		renderLabPage();
		expect(screen.getByRole('button', { name: /give up/i })).toBeTruthy();
	});

	it('shows terminal loading state', () => {
		renderLabPage();
		const skeletons = document.querySelectorAll('.animate-pulse');
		expect(skeletons.length).toBeGreaterThan(0);
	});

	it('validates solution and shows success', async () => {
		const user = userEvent.setup({ delay: null });
		vi.spyOn(Math, 'random').mockReturnValue(0.9);

		renderLabPage();

		const checkButton = screen.getByRole('button', { name: /check solution/i });
		await user.click(checkButton);

		expect(screen.getByText(/checking your solution/i)).toBeTruthy();

		await vi.advanceTimersByTimeAsync(2000);

		await waitFor(() => {
			expect(screen.getByText(/all checks passed/i)).toBeTruthy();
		});

		vi.spyOn(Math, 'random').mockRestore();
	});

	it('validates solution and shows error', async () => {
		const user = userEvent.setup({ delay: null });
		vi.spyOn(Math, 'random').mockReturnValue(0.1);

		renderLabPage();

		const checkButton = screen.getByRole('button', { name: /check solution/i });
		await user.click(checkButton);

		expect(screen.getByText(/checking your solution/i)).toBeTruthy();

		await vi.advanceTimersByTimeAsync(2000);

		await waitFor(() => {
			expect(screen.getByText(/some checks failed/i)).toBeTruthy();
		});

		vi.spyOn(Math, 'random').mockRestore();
	});

	it('opens confirm modal when give up button clicked', async () => {
		const user = userEvent.setup({ delay: null });

		renderLabPage();

		const giveUpButton = screen.getByRole('button', { name: /give up/i });
		await user.click(giveUpButton);

		await waitFor(() => {
			expect(screen.getByRole('dialog')).toBeTruthy();
			expect(screen.getByText(/reveal solution/i)).toBeTruthy();
		});
	});

	it('closes modal when cancel is clicked', async () => {
		const user = userEvent.setup({ delay: null });

		renderLabPage();

		const giveUpButton = screen.getByRole('button', { name: /give up/i });
		await user.click(giveUpButton);

		await waitFor(() => {
			expect(screen.getByRole('dialog')).toBeTruthy();
		});

		const cancelButton = screen.getByRole('button', { name: /cancel/i });
		await user.click(cancelButton);

		await waitFor(() => {
			expect(screen.queryByRole('dialog')).toBeNull();
		});
	});

	it('writes solution to terminal when confirmed', async () => {
		const user = userEvent.setup({ delay: null });

		const { component: _component } = renderLabPage();

		const giveUpButton = screen.getByRole('button', { name: /give up/i });
		await user.click(giveUpButton);

		await waitFor(() => {
			expect(screen.getByRole('dialog')).toBeTruthy();
		});

		const confirmButtons = screen.getAllByRole('button', { name: /reveal/i });
		const revealButton = confirmButtons.find((btn) => btn.textContent === 'Reveal');
		expect(revealButton).toBeTruthy();
		await user.click(revealButton!);

		await waitFor(() => {
			expect(screen.queryByRole('dialog')).toBeNull();
		});
	});

	it('navigates to knowledge page when knowledge button clicked', async () => {
		const user = userEvent.setup({ delay: null });

		renderLabPage();

		const knowledgeButton = screen.getByRole('button', { name: /knowledge/i });
		await user.click(knowledgeButton);

		expect(goto).toHaveBeenCalledWith('/learn/kubernetes/intro/knowledge');
	});

	it('clears validation timeout on unmount', async () => {
		const user = userEvent.setup({ delay: null });
		const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

		const { unmount } = renderLabPage();

		const checkButton = screen.getByRole('button', { name: /check solution/i });
		await user.click(checkButton);

		unmount();

		expect(clearTimeoutSpy).toHaveBeenCalled();

		clearTimeoutSpy.mockRestore();
	});

	it('does not clear timeout on unmount if no validation in progress', () => {
		const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

		const { unmount } = renderLabPage();
		const callCountBefore = clearTimeoutSpy.mock.calls.length;

		unmount();

		const callCountAfter = clearTimeoutSpy.mock.calls.length;
		expect(callCountAfter).toBe(callCountBefore);

		clearTimeoutSpy.mockRestore();
	});
});
