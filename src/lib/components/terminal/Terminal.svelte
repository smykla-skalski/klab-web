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
			terminal.options.theme = mode.current === 'dark' ? darkTheme : lightTheme;
		}
	});

	const darkTheme = {
		background: '#272822',
		foreground: '#f8f8f2',
		cursor: '#f8f8f0',
		cursorAccent: '#272822',
		selectionBackground: 'rgba(255, 255, 255, 0.1)',
		selectionForeground: '#f8f8f2',
		black: '#272822',
		red: '#f92672',
		green: '#a6e22e',
		yellow: '#f4bf75',
		blue: '#66d9ef',
		magenta: '#ae81ff',
		cyan: '#66d9ef',
		white: '#f8f8f2',
		brightBlack: '#75715e',
		brightRed: '#f92672',
		brightGreen: '#a6e22e',
		brightYellow: '#f4bf75',
		brightBlue: '#66d9ef',
		brightMagenta: '#ae81ff',
		brightCyan: '#a1efe4',
		brightWhite: '#f9f8f5'
	};

	const lightTheme = {
		background: '#fafaf8',
		foreground: '#2d2d2a',
		cursor: '#2d2d2a',
		cursorAccent: '#fafaf8',
		selectionBackground: 'rgba(0, 0, 0, 0.15)',
		selectionForeground: '#2d2d2a',
		black: '#2d2d2a',
		red: '#c82829',
		green: '#718c00',
		yellow: '#c98517',
		blue: '#4271ae',
		magenta: '#8959a8',
		cyan: '#3e999f',
		white: '#75715e',
		brightBlack: '#5e5c56',
		brightRed: '#c82829',
		brightGreen: '#718c00',
		brightYellow: '#c98517',
		brightBlue: '#4271ae',
		brightMagenta: '#8959a8',
		brightCyan: '#3e999f',
		brightWhite: '#4d4d4a'
	};

	onMount(() => {
		terminal = new Terminal({
			fontSize,
			fontFamily: "var(--font-family-mono), 'Courier New', monospace",
			theme: mode.current === 'dark' ? darkTheme : lightTheme,
			cursorBlink: true,
			allowProposedApi: true
		});

		fitAddon = new FitAddon();
		terminal.loadAddon(fitAddon);
		terminal.loadAddon(new WebLinksAddon());

		terminal.open(container);
		fitAddon.fit();
		terminal.focus();

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

		const resizeObserver = new ResizeObserver(() => {
			fitAddon.fit();
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

<div bind:this={container} class="h-full w-full"></div>
