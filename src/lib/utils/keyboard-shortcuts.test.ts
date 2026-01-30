import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { registerShortcut } from './keyboard-shortcuts';

describe('registerShortcut', () => {
	let cleanup: (() => void) | null = null;

	beforeEach(() => {
		// Clean up DOM
		document.body.innerHTML = '';
	});

	afterEach(() => {
		// Clean up event listener
		if (cleanup) {
			cleanup();
			cleanup = null;
		}
	});

	it('registers and triggers keyboard shortcut', () => {
		const handler = vi.fn();
		cleanup = registerShortcut('shift+/', handler);

		const event = new KeyboardEvent('keydown', { key: '/', shiftKey: true });
		window.dispatchEvent(event);

		expect(handler).toHaveBeenCalledOnce();
	});

	it('handles Ctrl+key combination', () => {
		const handler = vi.fn();
		cleanup = registerShortcut('Ctrl+s', handler);

		const event = new KeyboardEvent('keydown', { key: 's', ctrlKey: true });
		window.dispatchEvent(event);

		expect(handler).toHaveBeenCalledOnce();
	});

	it('handles Cmd+key combination (metaKey)', () => {
		const handler = vi.fn();
		cleanup = registerShortcut('Cmd+s', handler);

		const event = new KeyboardEvent('keydown', { key: 's', metaKey: true });
		window.dispatchEvent(event);

		expect(handler).toHaveBeenCalledOnce();
	});

	it('handles Shift+key combination', () => {
		const handler = vi.fn();
		cleanup = registerShortcut('Shift+t', handler);

		const event = new KeyboardEvent('keydown', { key: 't', shiftKey: true });
		window.dispatchEvent(event);

		expect(handler).toHaveBeenCalledOnce();
	});

	it('handles Alt+key combination', () => {
		const handler = vi.fn();
		cleanup = registerShortcut('Alt+a', handler);

		const event = new KeyboardEvent('keydown', { key: 'a', altKey: true });
		window.dispatchEvent(event);

		expect(handler).toHaveBeenCalledOnce();
	});

	it('handles Ctrl+Shift+key combination', () => {
		const handler = vi.fn();
		cleanup = registerShortcut('Ctrl+Shift+p', handler);

		const event = new KeyboardEvent('keydown', { key: 'p', ctrlKey: true, shiftKey: true });
		window.dispatchEvent(event);

		expect(handler).toHaveBeenCalledOnce();
	});

	it('prevents default when preventDefault is true', () => {
		const handler = vi.fn();
		cleanup = registerShortcut('Ctrl+s', handler, { preventDefault: true });

		const event = new KeyboardEvent('keydown', { key: 's', ctrlKey: true });
		const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
		window.dispatchEvent(event);

		expect(preventDefaultSpy).toHaveBeenCalled();
		expect(handler).toHaveBeenCalledOnce();
	});

	it('does not prevent default when preventDefault is false', () => {
		const handler = vi.fn();
		cleanup = registerShortcut('Ctrl+s', handler, { preventDefault: false });

		const event = new KeyboardEvent('keydown', { key: 's', ctrlKey: true });
		const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
		window.dispatchEvent(event);

		expect(preventDefaultSpy).not.toHaveBeenCalled();
		expect(handler).toHaveBeenCalledOnce();
	});

	it('ignores shortcut when typing in input field', () => {
		const handler = vi.fn();
		cleanup = registerShortcut('shift+/', handler);

		const input = document.createElement('input');
		document.body.appendChild(input);
		input.focus();

		const event = new KeyboardEvent('keydown', { key: '/', shiftKey: true, bubbles: true });
		Object.defineProperty(event, 'target', { value: input, enumerable: true });
		input.dispatchEvent(event);

		expect(handler).not.toHaveBeenCalled();
	});

	it('ignores shortcut when typing in textarea', () => {
		const handler = vi.fn();
		cleanup = registerShortcut('shift+/', handler);

		const textarea = document.createElement('textarea');
		document.body.appendChild(textarea);
		textarea.focus();

		const event = new KeyboardEvent('keydown', { key: '/', shiftKey: true, bubbles: true });
		Object.defineProperty(event, 'target', { value: textarea, enumerable: true });
		textarea.dispatchEvent(event);

		expect(handler).not.toHaveBeenCalled();
	});

	it('does not trigger when wrong modifier is pressed', () => {
		const handler = vi.fn();
		cleanup = registerShortcut('Ctrl+s', handler);

		// Press 's' without Ctrl
		const event = new KeyboardEvent('keydown', { key: 's' });
		window.dispatchEvent(event);

		expect(handler).not.toHaveBeenCalled();
	});

	it('does not trigger when wrong key is pressed', () => {
		const handler = vi.fn();
		cleanup = registerShortcut('Ctrl+s', handler);

		// Press Ctrl+d instead of Ctrl+s
		const event = new KeyboardEvent('keydown', { key: 'd', ctrlKey: true });
		window.dispatchEvent(event);

		expect(handler).not.toHaveBeenCalled();
	});

	it('cleans up event listener when cleanup function is called', () => {
		const handler = vi.fn();
		const cleanupFn = registerShortcut('shift+/', handler);

		// Trigger once
		let event = new KeyboardEvent('keydown', { key: '/', shiftKey: true });
		window.dispatchEvent(event);
		expect(handler).toHaveBeenCalledOnce();

		// Clean up
		cleanupFn();

		// Try to trigger again
		event = new KeyboardEvent('keydown', { key: '/', shiftKey: true });
		window.dispatchEvent(event);

		// Should still be called only once
		expect(handler).toHaveBeenCalledOnce();
	});

	it('handles case-insensitive key matching', () => {
		const handler = vi.fn();
		cleanup = registerShortcut('Ctrl+S', handler);

		const event = new KeyboardEvent('keydown', { key: 's', ctrlKey: true });
		window.dispatchEvent(event);

		expect(handler).toHaveBeenCalledOnce();
	});

	it('handles special keys like Enter', () => {
		const handler = vi.fn();
		cleanup = registerShortcut('Ctrl+Enter', handler);

		const event = new KeyboardEvent('keydown', { key: 'enter', ctrlKey: true });
		window.dispatchEvent(event);

		expect(handler).toHaveBeenCalledOnce();
	});
});
