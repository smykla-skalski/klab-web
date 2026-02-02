<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Terminal } from '@xterm/xterm';
	import { FitAddon } from '@xterm/addon-fit';
	import { WebLinksAddon } from '@xterm/addon-web-links';
	import '@xterm/xterm/css/xterm.css';
	import { terminalSession } from '$lib/stores/terminal';
	import { mode } from '$lib/stores/theme';
	import { toast } from 'svelte-sonner';

	interface Props {
		wsUrl?: string;
		fontSize?: number;
		onData?: (data: string) => void;
	}

	let { wsUrl, fontSize = 14, onData }: Props = $props();

	let container: HTMLDivElement = undefined!;
	let terminal: Terminal = undefined!;
	let fitAddon: FitAddon = undefined!;
	let ws: WebSocket | null = null;
	let connectionError = $state(false);

	// Update theme when mode changes
	$effect(() => {
		if (terminal) {
			terminal.options.theme = mode.current === 'light' ? lightTheme : darkTheme;
		}
	});

	const darkTheme = {
		background: '#2e3440',
		foreground: '#d8dee9',
		cursor: '#d8dee9',
		cursorAccent: '#2e3440',
		selectionBackground: 'rgba(76, 86, 106, 0.3)',
		selectionForeground: '#d8dee9',
		black: '#3b4252',
		red: '#bf616a',
		green: '#a3be8c',
		yellow: '#ebcb8b',
		blue: '#81a1c1',
		magenta: '#b48ead',
		cyan: '#88c0d0',
		white: '#e5e9f0',
		brightBlack: '#4c566a',
		brightRed: '#bf616a',
		brightGreen: '#a3be8c',
		brightYellow: '#ebcb8b',
		brightBlue: '#81a1c1',
		brightMagenta: '#b48ead',
		brightCyan: '#8fbcbb',
		brightWhite: '#eceff4'
	};

	const lightTheme = {
		background: '#eceff4',
		foreground: '#2e3440',
		cursor: '#2e3440',
		cursorAccent: '#eceff4',
		selectionBackground: 'rgba(216, 222, 233, 0.3)',
		selectionForeground: '#2e3440',
		black: '#3b4252',
		red: '#bf616a',
		green: '#a3be8c',
		yellow: '#ebcb8b',
		blue: '#5e81ac',
		magenta: '#b48ead',
		cyan: '#88c0d0',
		white: '#4c566a',
		brightBlack: '#434c5e',
		brightRed: '#bf616a',
		brightGreen: '#a3be8c',
		brightYellow: '#ebcb8b',
		brightBlue: '#81a1c1',
		brightMagenta: '#b48ead',
		brightCyan: '#8fbcbb',
		brightWhite: '#2e3440'
	};

	onMount(() => {
		terminal = new Terminal({
			fontSize,
			fontFamily: "var(--font-family-mono), 'Courier New', monospace",
			theme: mode.current === 'light' ? lightTheme : darkTheme,
			cursorBlink: true,
			allowProposedApi: true
		});

		fitAddon = new FitAddon();
		terminal.loadAddon(fitAddon);
		terminal.loadAddon(new WebLinksAddon());

		terminal.open(container);

		// Initial fit
		fitAddon.fit();

		// Fit again after layout settles
		setTimeout(() => fitAddon.fit(), 100);

		terminal.focus();

		// Prevent browser from capturing tab key
		terminal.attachCustomKeyEventHandler((event) => {
			if (event.type === 'keydown' && event.key === 'Tab') {
				event.preventDefault(); // Stop browser navigation
				return true; // Let xterm handle it
			}
			return true; // Process normally
		});

		terminal.onData((data) => {
			if (ws && ws.readyState === WebSocket.OPEN) {
				ws.send(data);
			}
			onData?.(data);
		});

		terminal.onResize(({ cols, rows }) => {
			if (ws && ws.readyState === WebSocket.OPEN) {
				ws.send(JSON.stringify({ type: 'resize', cols, rows }));
			}
		});

		let resizeTimeout: ReturnType<typeof setTimeout>;
		const resizeObserver = new ResizeObserver(() => {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(() => fitAddon.fit(), 50);
		});
		resizeObserver.observe(container);

		if (wsUrl) {
			connectWebSocket(wsUrl);
		}

		return () => {
			resizeObserver.disconnect();
			terminal.dispose();
			if (ws) {
				ws.close();
			}
		};
	});

	function connectWebSocket(url: string) {
		ws = new WebSocket(url);
		connectionError = false;

		ws.onopen = () => {
			connectionError = false;
			terminalSession.set({ id: url, connected: true, url });
			terminal.write('\r\n*** Connected to lab terminal ***\r\n\r\n');
			terminal.focus();
		};

		ws.onmessage = (event) => {
			terminal.write(event.data);
		};

		ws.onerror = (error) => {
			console.error('WebSocket error:', error);
			connectionError = true;
			terminal.write('\r\n*** Connection error ***\r\n');
			toast.error('Terminal disconnected', {
				description: 'Click reconnect to try again',
				action: {
					label: 'Reconnect',
					onClick: () => reconnect()
				}
			});
		};

		ws.onclose = () => {
			terminalSession.set({ id: url, connected: false, url });
			if (!connectionError) {
				terminal.write('\r\n*** Disconnected from lab terminal ***\r\n');
			}
		};
	}

	export function reconnect() {
		if (ws) {
			ws.close();
		}
		if (wsUrl) {
			connectWebSocket(wsUrl);
		}
	}

	export function write(data: string) {
		terminal?.write(data);
	}

	export function clear() {
		terminal?.clear();
	}

	export function focus() {
		terminal?.focus();
	}

	onDestroy(() => {
		if (ws) {
			ws.close();
		}
	});
</script>

<div bind:this={container} class="h-full w-full overflow-hidden"></div>
