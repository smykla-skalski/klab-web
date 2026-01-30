import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import ValidationStatus from './ValidationStatus.svelte';

describe('ValidationStatus', () => {
	afterEach(() => {
		cleanup();
	});

	it('renders nothing when status is idle', () => {
		const { container } = render(ValidationStatus, {
			props: {
				status: 'idle'
			}
		});
		const statusDiv = container.querySelector('.rounded-lg.border');
		expect(statusDiv).toBeNull();
	});

	it('renders validating state with message', () => {
		render(ValidationStatus, {
			props: {
				status: 'validating',
				message: 'Checking your solution...'
			}
		});
		expect(screen.getByText('Validating Solution...')).toBeTruthy();
		expect(screen.getByText('Checking your solution...')).toBeTruthy();
	});

	it('renders validating state without message', () => {
		render(ValidationStatus, {
			props: {
				status: 'validating'
			}
		});
		expect(screen.getByText('Validating Solution...')).toBeTruthy();
	});

	it('renders success state with message', () => {
		render(ValidationStatus, {
			props: {
				status: 'success',
				message: 'All tests passed!'
			}
		});
		expect(screen.getByText('Success!')).toBeTruthy();
		expect(screen.getByText('All tests passed!')).toBeTruthy();
	});

	it('renders success state without message', () => {
		render(ValidationStatus, {
			props: {
				status: 'success'
			}
		});
		expect(screen.getByText('Success!')).toBeTruthy();
	});

	it('renders error state with message', () => {
		render(ValidationStatus, {
			props: {
				status: 'error',
				message: 'Tests failed. Please try again.'
			}
		});
		expect(screen.getByText('Validation Failed')).toBeTruthy();
		expect(screen.getByText('Tests failed. Please try again.')).toBeTruthy();
	});

	it('renders error state without message', () => {
		render(ValidationStatus, {
			props: {
				status: 'error'
			}
		});
		expect(screen.getByText('Validation Failed')).toBeTruthy();
	});

	it('applies correct styling for validating state', () => {
		const { container } = render(ValidationStatus, {
			props: {
				status: 'validating'
			}
		});
		const wrapper = container.querySelector('.border-blue-500\\/50');
		expect(wrapper).toBeTruthy();
	});

	it('applies correct styling for success state', () => {
		const { container } = render(ValidationStatus, {
			props: {
				status: 'success'
			}
		});
		const wrapper = container.querySelector('.border-green-500\\/50');
		expect(wrapper).toBeTruthy();
	});

	it('applies correct styling for error state', () => {
		const { container } = render(ValidationStatus, {
			props: {
				status: 'error'
			}
		});
		const wrapper = container.querySelector('.border-red-500\\/50');
		expect(wrapper).toBeTruthy();
	});
});
