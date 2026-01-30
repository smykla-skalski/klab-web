import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import HintPanel from './HintPanel.svelte';

const mockHints = [
	'Check the kubectl documentation for pod commands',
	'Use kubectl get pods to list pods',
	'The answer is kubectl delete pod nginx'
];

describe('HintPanel', () => {
	afterEach(() => {
		cleanup();
	});

	it('renders with no hints revealed initially', () => {
		render(HintPanel, {
			props: {
				hints: mockHints
			}
		});
		expect(screen.getByText('Hints (0/3)')).toBeTruthy();
		expect(screen.getByText('Click "Reveal Hint" to get help with this lab.')).toBeTruthy();
	});

	it('shows reveal hint button when hints available', () => {
		render(HintPanel, {
			props: {
				hints: mockHints
			}
		});
		expect(screen.getByRole('button', { name: /reveal hint/i })).toBeTruthy();
	});

	it('reveals first hint when button clicked', async () => {
		const user = userEvent.setup();
		render(HintPanel, {
			props: {
				hints: mockHints
			}
		});

		const revealButton = screen.getByRole('button', { name: /reveal hint/i });
		await user.click(revealButton);

		expect(screen.getByText('Hints (1/3)')).toBeTruthy();
		expect(screen.getByText('Hint 1')).toBeTruthy();
		expect(screen.getByText(mockHints[0])).toBeTruthy();
	});

	it('reveals multiple hints sequentially', async () => {
		const user = userEvent.setup();
		render(HintPanel, {
			props: {
				hints: mockHints
			}
		});

		const revealButton = screen.getByRole('button', { name: /reveal hint/i });

		await user.click(revealButton);
		expect(screen.getByText('Hints (1/3)')).toBeTruthy();

		await user.click(revealButton);
		expect(screen.getByText('Hints (2/3)')).toBeTruthy();
		expect(screen.getByText('Hint 2')).toBeTruthy();

		await user.click(revealButton);
		expect(screen.getByText('Hints (3/3)')).toBeTruthy();
		expect(screen.getByText('Hint 3')).toBeTruthy();
	});

	it('hides reveal button when all hints revealed', async () => {
		const user = userEvent.setup();
		render(HintPanel, {
			props: {
				hints: mockHints
			}
		});

		const revealButton = screen.getByRole('button', { name: /reveal hint/i });

		await user.click(revealButton);
		await user.click(revealButton);
		await user.click(revealButton);

		expect(screen.queryByRole('button', { name: /reveal hint/i })).toBeNull();
	});

	it('expands hint when collapsed initially', async () => {
		const user = userEvent.setup();
		render(HintPanel, {
			props: {
				hints: mockHints
			}
		});

		const revealButton = screen.getByRole('button', { name: /reveal hint/i });
		await user.click(revealButton);

		const hintButton = screen.getByRole('button', { name: /hint 1/i });
		expect(hintButton.getAttribute('aria-expanded')).toBe('true');
		expect(screen.getByText(mockHints[0])).toBeTruthy();
	});

	it('toggles hint visibility when clicked', async () => {
		const user = userEvent.setup();
		render(HintPanel, {
			props: {
				hints: mockHints
			}
		});

		const revealButton = screen.getByRole('button', { name: /reveal hint/i });
		await user.click(revealButton);

		const hintButton = screen.getByRole('button', { name: /hint 1/i });

		await user.click(hintButton);
		expect(hintButton.getAttribute('aria-expanded')).toBe('false');
		expect(screen.queryByText(mockHints[0])).toBeNull();

		await user.click(hintButton);
		expect(hintButton.getAttribute('aria-expanded')).toBe('true');
		expect(screen.getByText(mockHints[0])).toBeTruthy();
	});

	it('handles empty hints array', () => {
		render(HintPanel, {
			props: {
				hints: []
			}
		});
		expect(screen.getByText('Hints (0/0)')).toBeTruthy();
		expect(screen.queryByRole('button', { name: /reveal hint/i })).toBeNull();
	});

	it('renders lightbulb icon', () => {
		const { container } = render(HintPanel, {
			props: {
				hints: mockHints
			}
		});
		const icon = container.querySelector('svg');
		expect(icon).toBeTruthy();
	});

	it('maintains correct aria attributes', async () => {
		const user = userEvent.setup();
		render(HintPanel, {
			props: {
				hints: mockHints
			}
		});

		const revealButton = screen.getByRole('button', { name: /reveal hint/i });
		await user.click(revealButton);

		const hintButton = screen.getByRole('button', { name: /hint 1/i });
		expect(hintButton.getAttribute('aria-controls')).toBe('hint-content-0');

		const hintContent = screen.getByRole('region');
		expect(hintContent.getAttribute('aria-labelledby')).toBe('hint-button-0');
	});
});
