import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import { render, cleanup } from '@testing-library/svelte';
import Terminal from './Terminal.svelte';

vi.mock('mode-watcher', () => ({
	mode: { current: 'dark' },
	toggleMode: vi.fn(),
	setMode: vi.fn()
}));

vi.mock('svelte-sonner', () => ({
	toast: {
		error: vi.fn(),
		success: vi.fn()
	}
}));

vi.mock('$lib/stores/terminal', () => ({
	terminalSession: {
		set: vi.fn(),
		subscribe: vi.fn()
	}
}));

const mockTerminal = {
	write: vi.fn(),
	clear: vi.fn(),
	focus: vi.fn(),
	open: vi.fn(),
	onData: vi.fn((callback) => {
		mockTerminal._onDataCallback = callback;
		return { dispose: vi.fn() };
	}),
	onResize: vi.fn((callback) => {
		mockTerminal._onResizeCallback = callback;
		return { dispose: vi.fn() };
	}),
	dispose: vi.fn(),
	loadAddon: vi.fn(),
	options: {
		theme: null as any
	},
	_onDataCallback: null as ((data: string) => void) | null,
	_onResizeCallback: null as ((event: { cols: number; rows: number }) => void) | null,
	_options: null as any
};

const mockFitAddon = {
	fit: vi.fn()
};

vi.mock('@xterm/xterm', () => ({
	Terminal: function Terminal(options: any) {
		mockTerminal._options = options;
		return mockTerminal;
	}
}));

vi.mock('@xterm/addon-fit', () => ({
	FitAddon: function FitAddon() {
		return mockFitAddon;
	}
}));

vi.mock('@xterm/addon-web-links', () => ({
	WebLinksAddon: function WebLinksAddon() {
		return {};
	}
}));

const mockWebSocket = {
	send: vi.fn(),
	close: vi.fn(),
	readyState: 1,
	CONNECTING: 0,
	OPEN: 1,
	CLOSING: 2,
	CLOSED: 3,
	addEventListener: vi.fn(),
	removeEventListener: vi.fn(),
	dispatchEvent: vi.fn(),
	binaryType: 'blob' as BinaryType,
	bufferedAmount: 0,
	extensions: '',
	protocol: '',
	url: '',
	onopen: null as ((event: Event) => void) | null,
	onmessage: null as ((event: MessageEvent) => void) | null,
	onerror: null as ((event: Event) => void) | null,
	onclose: null as ((event: CloseEvent) => void) | null
};

global.WebSocket = function WebSocket(url: string) {
	mockWebSocket.url = url;
	mockWebSocket.readyState = 1;
	return mockWebSocket as unknown as WebSocket;
} as any;
(global.WebSocket as any).OPEN = 1;

global.ResizeObserver = function ResizeObserver(_callback: ResizeObserverCallback) {
	return {
		observe: vi.fn(),
		disconnect: vi.fn(),
		unobserve: vi.fn()
	};
} as any;

describe('Terminal', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockTerminal._onDataCallback = null;
		mockTerminal._onResizeCallback = null;
		mockWebSocket.onopen = null;
		mockWebSocket.onmessage = null;
		mockWebSocket.onerror = null;
		mockWebSocket.onclose = null;
	});

	afterEach(() => {
		cleanup();
	});

	it('renders terminal container', () => {
		const { container } = render(Terminal, {
			props: {}
		});
		expect(container.querySelector('div')).toBeTruthy();
	});

	it('initializes terminal on mount', () => {
		render(Terminal, {
			props: {}
		});
		expect(mockTerminal.open).toHaveBeenCalled();
		expect(mockTerminal.loadAddon).toHaveBeenCalledTimes(2);
	});

	it('applies custom fontSize', () => {
		render(Terminal, {
			props: {
				fontSize: 16
			}
		});
		expect(mockTerminal._options).toMatchObject({
			fontSize: 16
		});
	});

	it('applies dark theme by default', () => {
		render(Terminal, {
			props: {}
		});
		expect(mockTerminal._options.theme).toMatchObject({
			background: '#000000',
			foreground: '#7ade7a'
		});
	});

	it('fits terminal to container', () => {
		render(Terminal, {
			props: {}
		});
		expect(mockFitAddon.fit).toHaveBeenCalled();
	});

	it('connects WebSocket when wsUrl provided', () => {
		render(Terminal, {
			props: {
				wsUrl: 'ws://localhost:8080'
			}
		});
		expect(mockWebSocket.url).toBe('ws://localhost:8080');
	});

	it('writes connection message on WebSocket open', () => {
		render(Terminal, {
			props: {
				wsUrl: 'ws://localhost:8080'
			}
		});
		mockWebSocket.onopen?.(new Event('open'));
		expect(mockTerminal.write).toHaveBeenCalledWith(
			expect.stringContaining('Connected to lab terminal')
		);
	});

	it('writes data from WebSocket messages', () => {
		render(Terminal, {
			props: {
				wsUrl: 'ws://localhost:8080'
			}
		});
		const event = new MessageEvent('message', { data: 'test data' });
		mockWebSocket.onmessage?.(event);
		expect(mockTerminal.write).toHaveBeenCalledWith('test data');
	});

	it('writes error message on WebSocket error', () => {
		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		render(Terminal, {
			props: {
				wsUrl: 'ws://localhost:8080'
			}
		});
		mockWebSocket.onerror?.(new Event('error'));
		expect(consoleErrorSpy).toHaveBeenCalled();
		expect(mockTerminal.write).toHaveBeenCalledWith(expect.stringContaining('Connection error'));
		consoleErrorSpy.mockRestore();
	});

	it('writes disconnection message on WebSocket close', () => {
		render(Terminal, {
			props: {
				wsUrl: 'ws://localhost:8080'
			}
		});
		mockWebSocket.onclose?.(new CloseEvent('close'));
		expect(mockTerminal.write).toHaveBeenCalledWith(
			expect.stringContaining('Disconnected from lab terminal')
		);
	});

	it('sends data to WebSocket when terminal receives input', () => {
		render(Terminal, {
			props: {
				wsUrl: 'ws://localhost:8080'
			}
		});
		mockWebSocket.readyState = 1;
		mockTerminal._onDataCallback?.('test input');
		expect(mockWebSocket.send).toHaveBeenCalledWith('test input');
	});

	it('calls onData callback when provided', () => {
		const onData = vi.fn();
		render(Terminal, {
			props: {
				onData
			}
		});
		mockTerminal._onDataCallback?.('test input');
		expect(onData).toHaveBeenCalledWith('test input');
	});

	it('exports write function', () => {
		const component = render(Terminal, {
			props: {}
		});
		expect(component.component.write).toBeDefined();
		component.component.write('test');
		expect(mockTerminal.write).toHaveBeenCalledWith('test');
	});

	it('exports clear function', () => {
		const component = render(Terminal, {
			props: {}
		});
		expect(component.component.clear).toBeDefined();
		component.component.clear();
		expect(mockTerminal.clear).toHaveBeenCalled();
	});

	it('exports focus function', () => {
		const component = render(Terminal, {
			props: {}
		});
		expect(component.component.focus).toBeDefined();
		component.component.focus();
		expect(mockTerminal.focus).toHaveBeenCalled();
	});

	it('cleans up on destroy', () => {
		const { unmount } = render(Terminal, {
			props: {
				wsUrl: 'ws://localhost:8080'
			}
		});
		unmount();
		expect(mockTerminal.dispose).toHaveBeenCalled();
		expect(mockWebSocket.close).toHaveBeenCalled();
	});

	it('exports reconnect function', () => {
		const component = render(Terminal, {
			props: {
				wsUrl: 'ws://localhost:8080'
			}
		});
		expect(component.component.reconnect).toBeDefined();
	});

	it('reconnects to WebSocket when reconnect called', () => {
		const component = render(Terminal, {
			props: {
				wsUrl: 'ws://localhost:8080'
			}
		});

		vi.clearAllMocks();

		component.component.reconnect();

		expect(mockWebSocket.close).toHaveBeenCalled();
		expect(mockWebSocket.url).toBe('ws://localhost:8080');
	});

	it('handles reconnect without existing WebSocket', () => {
		const component = render(Terminal, {
			props: {}
		});

		expect(() => component.component.reconnect()).not.toThrow();
	});

	it('does not send data to closed WebSocket', () => {
		render(Terminal, {
			props: {
				wsUrl: 'ws://localhost:8080'
			}
		});

		mockWebSocket.readyState = 3;
		vi.clearAllMocks();

		mockTerminal._onDataCallback?.('test input');

		expect(mockWebSocket.send).not.toHaveBeenCalled();
	});

	it('shows toast on WebSocket error with reconnect action', async () => {
		const { toast } = await import('svelte-sonner');

		render(Terminal, {
			props: {
				wsUrl: 'ws://localhost:8080'
			}
		});

		mockWebSocket.onerror?.(new Event('error'));

		expect(toast.error).toHaveBeenCalledWith(
			'Terminal disconnected',
			expect.objectContaining({
				description: 'Click reconnect to try again',
				action: expect.objectContaining({
					label: 'Reconnect'
				})
			})
		);
	});

	it('does not write disconnect message on error close', () => {
		render(Terminal, {
			props: {
				wsUrl: 'ws://localhost:8080'
			}
		});

		mockWebSocket.onerror?.(new Event('error'));
		vi.clearAllMocks();

		mockWebSocket.onclose?.(new CloseEvent('close'));

		const writeCalls = mockTerminal.write.mock.calls;
		const disconnectMessages = writeCalls.filter((call) =>
			call[0].includes('Disconnected from lab terminal')
		);

		expect(disconnectMessages.length).toBe(0);
	});

	it('registers onResize callback on init', () => {
		render(Terminal, {
			props: {}
		});
		expect(mockTerminal.onResize).toHaveBeenCalled();
	});

	it('sends resize JSON to WebSocket when connected', () => {
		render(Terminal, {
			props: {
				wsUrl: 'ws://localhost:8080'
			}
		});
		mockWebSocket.readyState = 1;
		mockTerminal._onResizeCallback?.({ cols: 100, rows: 30 });
		expect(mockWebSocket.send).toHaveBeenCalledWith(
			JSON.stringify({ type: 'resize', cols: 100, rows: 30 })
		);
	});

	it('does not send resize when WebSocket disconnected', () => {
		render(Terminal, {
			props: {
				wsUrl: 'ws://localhost:8080'
			}
		});
		mockWebSocket.readyState = 3;
		vi.clearAllMocks();
		mockTerminal._onResizeCallback?.({ cols: 100, rows: 30 });
		expect(mockWebSocket.send).not.toHaveBeenCalled();
	});
});
