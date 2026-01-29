<script lang="ts">
	interface Props {
		wsUrl?: string;
		fontSize?: number;
		theme?: 'dark' | 'light';
		onData?: (data: string) => void;
	}

	let { wsUrl, fontSize = 14, theme = 'dark', onData }: Props = $props();

	export function write(data: string) {}
	export function clear() {}
	export function focus() {}
</script>

<div data-testid="terminal-mock" class="h-full w-full bg-black text-green-400">Mock Terminal</div>
