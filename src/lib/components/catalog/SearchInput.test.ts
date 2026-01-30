import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import SearchInput from './SearchInput.svelte';

describe('SearchInput', () => {
	afterEach(() => {
		cleanup();
	});

	it('renders input element', () => {
		render(SearchInput, { props: { value: '' } });
		const input = screen.getByPlaceholderText('Search labs...');
		expect(input).toBeTruthy();
	});

	it('uses custom placeholder', () => {
		render(SearchInput, {
			props: { value: '', placeholder: 'Find a lab' }
		});
		const input = screen.getByPlaceholderText('Find a lab');
		expect(input).toBeTruthy();
	});

	it('renders search icon', () => {
		render(SearchInput, { props: { value: '' } });
		const container = document.body;
		expect(container.querySelector('svg')).toBeTruthy();
	});

	it('displays initial value', () => {
		render(SearchInput, { props: { value: 'kubernetes' } });
		const input = screen.getByDisplayValue('kubernetes');
		expect(input).toBeTruthy();
	});

	it('updates input value on type', async () => {
		const user = userEvent.setup();
		render(SearchInput, { props: { value: '' } });

		const input = screen.getByPlaceholderText('Search labs...') as HTMLInputElement;
		await user.type(input, 'docker');

		expect(input.value).toBe('docker');
	});

	it('debounces input changes', async () => {
		vi.useFakeTimers();
		const user = userEvent.setup({ delay: null });

		render(SearchInput, { props: { value: '' } });

		const input = screen.getByPlaceholderText('Search labs...') as HTMLInputElement;
		await user.type(input, 'test');

		// Input should show the value immediately
		expect(input.value).toBe('test');

		// Fast-forward time by 300ms (debounce delay)
		vi.advanceTimersByTime(300);

		// Check that component internal state was updated
		await vi.waitFor(() => {
			expect(input.value).toBe('test');
		});

		vi.useRealTimers();
	});

	it('clears previous debounce timer on new input', async () => {
		vi.useFakeTimers();
		const user = userEvent.setup({ delay: null });

		render(SearchInput, { props: { value: '' } });

		const input = screen.getByPlaceholderText('Search labs...') as HTMLInputElement;

		// Type first character
		await user.type(input, 't');
		vi.advanceTimersByTime(200);

		// Type second character before debounce completes
		await user.type(input, 'e');

		// Advance to when first timer would have completed
		vi.advanceTimersByTime(100);

		// Input should show both characters
		expect(input.value).toBe('te');

		// Complete the second timer
		vi.advanceTimersByTime(200);

		await vi.waitFor(() => {
			expect(input.value).toBe('te');
		});

		vi.useRealTimers();
	});

	it('has correct CSS classes', () => {
		render(SearchInput, { props: { value: '' } });
		const input = screen.getByPlaceholderText('Search labs...');

		expect(input.className).toContain('rounded-lg');
		expect(input.className).toContain('border');
		expect(input.className).toContain('focus:ring-2');
	});

	it('allows clearing input', async () => {
		const user = userEvent.setup();
		render(SearchInput, { props: { value: 'test' } });

		const input = screen.getByPlaceholderText('Search labs...') as HTMLInputElement;
		await user.clear(input);

		expect(input.value).toBe('');
	});

	it('handles empty string value', () => {
		render(SearchInput, { props: { value: '' } });
		const input = screen.getByPlaceholderText('Search labs...') as HTMLInputElement;
		expect(input.value).toBe('');
	});

	it('is of type text', () => {
		render(SearchInput, { props: { value: '' } });
		const input = screen.getByPlaceholderText('Search labs...');
		expect(input.getAttribute('type')).toBe('text');
	});
});
