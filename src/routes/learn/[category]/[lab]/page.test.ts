import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { writable } from 'svelte/store';
import LabPage from './+page.svelte';
import { goto } from '$app/navigation';

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
		render(LabPage);
		expect(screen.getByText(/intro lab/i)).toBeTruthy();
	});

	it('renders category', () => {
		render(LabPage);
		expect(screen.getByText('kubernetes')).toBeTruthy();
	});

	it('renders check solution button', () => {
		render(LabPage);
		expect(screen.getByRole('button', { name: /check solution/i })).toBeTruthy();
	});

	it('renders knowledge button', () => {
		render(LabPage);
		expect(screen.getByRole('button', { name: /knowledge/i })).toBeTruthy();
	});

	it('renders give up button', () => {
		render(LabPage);
		expect(screen.getByRole('button', { name: /give up/i })).toBeTruthy();
	});

	it('renders terminal component', () => {
		render(LabPage);
		expect(screen.getByTestId('terminal-mock')).toBeTruthy();
	});

	it('validates solution and shows success', async () => {
		const user = userEvent.setup({ delay: null });
		vi.spyOn(Math, 'random').mockReturnValue(0.9);

		render(LabPage);

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

		render(LabPage);

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

		render(LabPage);

		const giveUpButton = screen.getByRole('button', { name: /give up/i });
		await user.click(giveUpButton);

		await waitFor(() => {
			expect(screen.getByRole('dialog')).toBeTruthy();
			expect(screen.getByText(/reveal solution/i)).toBeTruthy();
		});
	});

	it('closes modal when cancel is clicked', async () => {
		const user = userEvent.setup({ delay: null });

		render(LabPage);

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

		const { component } = render(LabPage);

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

		render(LabPage);

		const knowledgeButton = screen.getByRole('button', { name: /knowledge/i });
		await user.click(knowledgeButton);

		expect(goto).toHaveBeenCalledWith('/learn/kubernetes/intro/knowledge');
	});

	it('clears validation timeout on unmount', async () => {
		const user = userEvent.setup({ delay: null });
		const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

		const { unmount } = render(LabPage);

		const checkButton = screen.getByRole('button', { name: /check solution/i });
		await user.click(checkButton);

		unmount();

		expect(clearTimeoutSpy).toHaveBeenCalled();

		clearTimeoutSpy.mockRestore();
	});

	it('does not clear timeout on unmount if no validation in progress', () => {
		const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

		const { unmount } = render(LabPage);
		const callCountBefore = clearTimeoutSpy.mock.calls.length;

		unmount();

		const callCountAfter = clearTimeoutSpy.mock.calls.length;
		expect(callCountAfter).toBe(callCountBefore);

		clearTimeoutSpy.mockRestore();
	});
});
