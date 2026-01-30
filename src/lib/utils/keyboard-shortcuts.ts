interface ShortcutOptions {
	preventDefault?: boolean;
}

export function registerShortcut(
	key: string,
	handler: () => void,
	options: ShortcutOptions = {}
): () => void {
	const { preventDefault = true } = options;

	function handleKeydown(e: KeyboardEvent) {
		// Ignore if user is typing in input/textarea
		const target = e.target as HTMLElement;
		if (
			target.tagName === 'INPUT' ||
			target.tagName === 'TEXTAREA' ||
			target.isContentEditable
		) {
			return;
		}

		// Parse key combination
		const parts = key.toLowerCase().split('+');
		const keyName = parts[parts.length - 1];
		const needsCtrl = parts.includes('ctrl') || parts.includes('cmd');
		const needsShift = parts.includes('shift');
		const needsAlt = parts.includes('alt');

		// Check if combination matches
		const ctrlPressed = e.ctrlKey || e.metaKey;
		const shiftPressed = e.shiftKey;
		const altPressed = e.altKey;
		const keyPressed = e.key.toLowerCase();

		if (
			(needsCtrl === ctrlPressed || !needsCtrl) &&
			(needsShift === shiftPressed || !needsShift) &&
			(needsAlt === altPressed || !needsAlt) &&
			keyPressed === keyName
		) {
			// Additional check: ensure required modifiers are present
			if (needsCtrl && !ctrlPressed) return;
			if (needsShift && !shiftPressed) return;
			if (needsAlt && !altPressed) return;

			if (preventDefault) {
				e.preventDefault();
			}
			handler();
		}
	}

	window.addEventListener('keydown', handleKeydown);

	// Return cleanup function
	return () => {
		window.removeEventListener('keydown', handleKeydown);
	};
}
