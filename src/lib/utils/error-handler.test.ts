import { describe, it, expect } from 'vitest';
import { handleApiError } from './error-handler';

describe('handleApiError', () => {
	it('returns error message from Error instance', () => {
		const error = new Error('Something went wrong');
		expect(handleApiError(error)).toBe('Something went wrong');
	});

	it('returns string error directly', () => {
		const error = 'String error message';
		expect(handleApiError(error)).toBe('String error message');
	});

	it('returns default message for unknown error type', () => {
		const error = { code: 500 };
		expect(handleApiError(error)).toBe('An unexpected error occurred');
	});

	it('returns default message for null', () => {
		expect(handleApiError(null)).toBe('An unexpected error occurred');
	});

	it('returns default message for undefined', () => {
		expect(handleApiError(undefined)).toBe('An unexpected error occurred');
	});

	it('returns default message for number', () => {
		expect(handleApiError(42)).toBe('An unexpected error occurred');
	});

	it('returns default message for boolean', () => {
		expect(handleApiError(true)).toBe('An unexpected error occurred');
	});

	it('handles custom Error subclasses', () => {
		class CustomError extends Error {
			constructor(message: string) {
				super(message);
				this.name = 'CustomError';
			}
		}
		const error = new CustomError('Custom error occurred');
		expect(handleApiError(error)).toBe('Custom error occurred');
	});
});
