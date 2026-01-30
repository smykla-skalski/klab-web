import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import FilterChipGroup from './FilterChipGroup.svelte';

describe('FilterChipGroup', () => {
	afterEach(() => {
		cleanup();
	});

	it('renders label', () => {
		render(FilterChipGroup, {
			props: {
				label: 'Difficulty',
				options: ['Beginner', 'Intermediate', 'Advanced'],
				selected: []
			}
		});

		expect(screen.getByText('Difficulty')).toBeTruthy();
	});

	it('renders all options as buttons', () => {
		render(FilterChipGroup, {
			props: {
				label: 'Difficulty',
				options: ['Beginner', 'Intermediate', 'Advanced'],
				selected: []
			}
		});

		expect(screen.getByRole('button', { name: 'Beginner' })).toBeTruthy();
		expect(screen.getByRole('button', { name: 'Intermediate' })).toBeTruthy();
		expect(screen.getByRole('button', { name: 'Advanced' })).toBeTruthy();
	});

	it('highlights selected options', () => {
		render(FilterChipGroup, {
			props: {
				label: 'Difficulty',
				options: ['Beginner', 'Intermediate', 'Advanced'],
				selected: ['Beginner']
			}
		});

		const beginnerButton = screen.getByRole('button', { name: 'Beginner' });
		const intermediateButton = screen.getByRole('button', { name: 'Intermediate' });

		expect(beginnerButton.className).toContain('bg-primary');
		expect(beginnerButton.className).toContain('text-primary-foreground');
		expect(intermediateButton.className).toContain('bg-secondary');
		expect(intermediateButton.className).toContain('text-secondary-foreground');
	});

	it('toggles option on click', async () => {
		const user = userEvent.setup();

		render(FilterChipGroup, {
			props: {
				label: 'Difficulty',
				options: ['Beginner', 'Intermediate'],
				selected: []
			}
		});

		const beginnerButton = screen.getByRole('button', { name: 'Beginner' });

		// Initially should not be highlighted
		expect(beginnerButton.className).toContain('bg-secondary');

		await user.click(beginnerButton);

		// After click should be highlighted
		expect(beginnerButton.className).toContain('bg-primary');
	});

	it('can toggle option off', async () => {
		const user = userEvent.setup();

		render(FilterChipGroup, {
			props: {
				label: 'Difficulty',
				options: ['Beginner', 'Intermediate'],
				selected: ['Beginner']
			}
		});

		const beginnerButton = screen.getByRole('button', { name: 'Beginner' });
		expect(beginnerButton.className).toContain('bg-primary');

		await user.click(beginnerButton);

		// Check if the button is now unhighlighted
		expect(beginnerButton.className).toContain('bg-secondary');
	});

	it('shows clear button when options are selected', () => {
		render(FilterChipGroup, {
			props: {
				label: 'Difficulty',
				options: ['Beginner', 'Intermediate', 'Advanced'],
				selected: ['Beginner']
			}
		});

		const clearButton = screen.getByRole('button', { name: /clear/i });
		expect(clearButton).toBeTruthy();
	});

	it('hides clear button when no options are selected', () => {
		render(FilterChipGroup, {
			props: {
				label: 'Difficulty',
				options: ['Beginner', 'Intermediate', 'Advanced'],
				selected: []
			}
		});

		const clearButton = screen.queryByRole('button', { name: /clear/i });
		expect(clearButton).toBeFalsy();
	});

	it('clears all selections on clear button click', async () => {
		const user = userEvent.setup();

		render(FilterChipGroup, {
			props: {
				label: 'Difficulty',
				options: ['Beginner', 'Intermediate', 'Advanced'],
				selected: ['Beginner', 'Advanced']
			}
		});

		const clearButton = screen.getByRole('button', { name: /clear/i });

		// Check buttons are highlighted initially
		const beginnerButton = screen.getByRole('button', { name: 'Beginner' });
		const advancedButton = screen.getByRole('button', { name: 'Advanced' });
		expect(beginnerButton.className).toContain('bg-primary');
		expect(advancedButton.className).toContain('bg-primary');

		await user.click(clearButton);

		// Clear button should now be hidden
		expect(screen.queryByRole('button', { name: /clear/i })).toBeFalsy();

		// All option buttons should be unhighlighted
		expect(beginnerButton.className).toContain('bg-secondary');
		expect(advancedButton.className).toContain('bg-secondary');
	});

	it('handles multiple selections', async () => {
		const user = userEvent.setup();

		render(FilterChipGroup, {
			props: {
				label: 'Difficulty',
				options: ['Beginner', 'Intermediate', 'Advanced'],
				selected: []
			}
		});

		const beginnerButton = screen.getByRole('button', { name: 'Beginner' });
		const advancedButton = screen.getByRole('button', { name: 'Advanced' });

		await user.click(beginnerButton);
		expect(beginnerButton.className).toContain('bg-primary');

		await user.click(advancedButton);
		expect(beginnerButton.className).toContain('bg-primary');
		expect(advancedButton.className).toContain('bg-primary');
	});

	it('renders with empty options array', () => {
		render(FilterChipGroup, {
			props: {
				label: 'Empty',
				options: [],
				selected: []
			}
		});

		expect(screen.getByText('Empty')).toBeTruthy();
		// Should have no option buttons, only the label
		const buttons = screen.queryAllByRole('button');
		expect(buttons.length).toBe(0);
	});

	it('handles options with special characters', () => {
		render(FilterChipGroup, {
			props: {
				label: 'Categories',
				options: ['C++', 'C#', 'F#'],
				selected: []
			}
		});

		expect(screen.getByRole('button', { name: 'C++' })).toBeTruthy();
		expect(screen.getByRole('button', { name: 'C#' })).toBeTruthy();
		expect(screen.getByRole('button', { name: 'F#' })).toBeTruthy();
	});
});
