import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import SortDropdown from './SortDropdown.svelte';

describe('SortDropdown', () => {
	afterEach(() => {
		cleanup();
	});

	it('renders select element', () => {
		render(SortDropdown, { props: { value: 'title' } });
		const select = screen.getByRole('combobox');
		expect(select).toBeTruthy();
	});

	it('renders arrow icon', () => {
		render(SortDropdown, { props: { value: 'title' } });
		const container = document.body;
		expect(container.querySelector('svg')).toBeTruthy();
	});

	it('renders all sort options', () => {
		render(SortDropdown, { props: { value: 'title' } });

		expect(screen.getByRole('option', { name: 'Title (A-Z)' })).toBeTruthy();
		expect(screen.getByRole('option', { name: 'Difficulty' })).toBeTruthy();
		expect(screen.getByRole('option', { name: 'Duration' })).toBeTruthy();
	});

	it('sets initial value to title', () => {
		render(SortDropdown, { props: { value: 'title' } });
		const select = screen.getByRole('combobox') as HTMLSelectElement;
		expect(select.value).toBe('title');
	});

	it('sets initial value to difficulty', () => {
		render(SortDropdown, { props: { value: 'difficulty' } });
		const select = screen.getByRole('combobox') as HTMLSelectElement;
		expect(select.value).toBe('difficulty');
	});

	it('sets initial value to duration', () => {
		render(SortDropdown, { props: { value: 'duration' } });
		const select = screen.getByRole('combobox') as HTMLSelectElement;
		expect(select.value).toBe('duration');
	});

	it('changes value on selection', async () => {
		const user = userEvent.setup();

		render(SortDropdown, { props: { value: 'title' } });

		const select = screen.getByRole('combobox');
		await user.selectOptions(select, 'difficulty');

		expect((select as HTMLSelectElement).value).toBe('difficulty');
	});

	it('has correct CSS classes', () => {
		render(SortDropdown, { props: { value: 'title' } });
		const select = screen.getByRole('combobox');

		expect(select.className).toContain('rounded-lg');
		expect(select.className).toContain('border');
		expect(select.className).toContain('focus:ring-2');
	});

	it('options have correct values', () => {
		render(SortDropdown, { props: { value: 'title' } });

		const titleOption = screen.getByRole('option', { name: 'Title (A-Z)' }) as HTMLOptionElement;
		const difficultyOption = screen.getByRole('option', {
			name: 'Difficulty'
		}) as HTMLOptionElement;
		const durationOption = screen.getByRole('option', { name: 'Duration' }) as HTMLOptionElement;

		expect(titleOption.value).toBe('title');
		expect(difficultyOption.value).toBe('difficulty');
		expect(durationOption.value).toBe('duration');
	});

	it('can switch between all options', async () => {
		const user = userEvent.setup();
		render(SortDropdown, { props: { value: 'title' } });

		const select = screen.getByRole('combobox');

		await user.selectOptions(select, 'difficulty');
		expect((select as HTMLSelectElement).value).toBe('difficulty');

		await user.selectOptions(select, 'duration');
		expect((select as HTMLSelectElement).value).toBe('duration');

		await user.selectOptions(select, 'title');
		expect((select as HTMLSelectElement).value).toBe('title');
	});

	it('renders with default value when no value provided', () => {
		render(SortDropdown, {});
		const select = screen.getByRole('combobox') as HTMLSelectElement;
		expect(select.value).toBe('title');
	});
});
