import { writable } from 'svelte/store';

export interface TerminalSession {
	id: string;
	connected: boolean;
	url?: string;
}

export const terminalSession = writable<TerminalSession>({
	id: '',
	connected: false
});
