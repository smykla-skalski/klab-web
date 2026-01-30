<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import ShortcutHelpModal from '$lib/components/ui/shortcut-help-modal.svelte';
	import { Toaster } from 'svelte-sonner';
	import { ModeWatcher } from 'mode-watcher';
	import { mode, toggleMode } from '$lib/stores/theme';
	import { registerShortcut } from '$lib/utils/keyboard-shortcuts';

	let showShortcutsHelp = $state(false);

	onMount(() => {
		const cleanups = [
			registerShortcut('ctrl+shift+t', toggleMode),
			registerShortcut('shift+/', () => (showShortcutsHelp = true), { preventDefault: true })
		];

		return () => {
			cleanups.forEach((cleanup) => cleanup());
		};
	});
</script>

<ModeWatcher />

<a
	href="#main-content"
	class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring"
>
	Skip to main content
</a>

<div class="flex min-h-screen flex-col" data-theme={mode.current}>
	<Header />
	<main id="main-content" class="flex-1">
		<slot />
	</main>
	<Footer />
</div>

<Toaster richColors position="top-right" />
<ShortcutHelpModal bind:open={showShortcutsHelp} />
