import { describe, it, expect } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
	it('merges class names', () => {
		expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
	});

	it('handles conditional classes', () => {
		const isActive = true;
		const isDisabled = false;
		expect(cn('base', isActive && 'truthy', isDisabled && 'falsy')).toBe('base truthy');
	});

	it('handles arrays', () => {
		expect(cn(['class1', 'class2'])).toBe('class1 class2');
	});

	it('handles objects', () => {
		expect(cn({ active: true, disabled: false })).toBe('active');
	});

	it('handles empty input', () => {
		expect(cn()).toBe('');
	});

	it('handles undefined and null', () => {
		expect(cn('base', undefined, null)).toBe('base');
	});
});
