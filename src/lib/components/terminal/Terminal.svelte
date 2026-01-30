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
		background: '#000000',
		foreground: '#7ade7a',
		cursor: '#7ade7a',
		cursorAccent: '#000000',
		selectionBackground: 'rgba(122, 222, 122, 0.3)',
		selectionForeground: '#000000',
		black: '#000000',
		red: '#ff5555',
		green: '#50fa7b',
		yellow: '#f1fa8c',
		blue: '#bd93f9',
		magenta: '#ff79c6',
		cyan: '#8be9fd',
		white: '#bfbfbf',
		brightBlack: '#4d4d4d',
		brightRed: '#ff6e67',
		brightGreen: '#5af78e',
		brightYellow: '#f4f99d',
		brightBlue: '#caa9fa',
		brightMagenta: '#ff92d0',
		brightCyan: '#9aedfe',
		brightWhite: '#e6e6e6'
	};

	const lightTheme = {
		background: '#ffffff',
		foreground: '#000000',
		cursor: '#000000',
		cursorAccent: '#ffffff',
		selectionBackground: 'rgba(0, 0, 0, 0.2)',
		selectionForeground: '#ffffff',
		black: '#000000',
		red: '#cd3131',
		green: '#00bc00',
		yellow: '#949800',
		blue: '#0451a5',
		magenta: '#bc05bc',
		cyan: '#0598bc',
		white: '#555555',
		brightBlack: '#666666',
		brightRed: '#cd3131',
		brightGreen: '#14ce14',
		brightYellow: '#b5ba00',
		brightBlue: '#0451a5',
		brightMagenta: '#bc05bc',
		brightCyan: '#0598bc',
		brightWhite: '#a5a5a5'
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
