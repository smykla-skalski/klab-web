import { mode, toggleMode as modeWatcherToggle, setMode } from 'mode-watcher';

export { mode, setMode };

export function toggleMode() {
	modeWatcherToggle();
}
