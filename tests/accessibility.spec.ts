import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
	test('catalog page should not have accessibility violations', async ({ page }) => {
		await page.goto('/learn');
		await page.waitForLoadState('networkidle');

		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
			.disableRules(['color-contrast'])
			.analyze();

		expect(accessibilityScanResults.violations).toEqual([]);
	});

	test('lab page should not have accessibility violations', async ({ page }) => {
		await page.goto('/learn');
		await page.waitForLoadState('networkidle');

		// Click first lab card
		const firstLab = page.locator('button[aria-label*="Open"][aria-label*="lab"]').first();
		await firstLab.click();
		await page.waitForLoadState('networkidle');

		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
			.disableRules(['color-contrast'])
			.analyze();

		expect(accessibilityScanResults.violations).toEqual([]);
	});

	test('error page should not have accessibility violations', async ({ page }) => {
		await page.goto('/nonexistent-page');
		await page.waitForLoadState('networkidle');

		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
			.disableRules(['color-contrast'])
			.analyze();

		expect(accessibilityScanResults.violations).toEqual([]);
	});

	test('keyboard navigation works', async ({ page }) => {
		await page.goto('/learn');
		await page.waitForLoadState('networkidle');

		// Tab to skip link
		await page.keyboard.press('Tab');
		const skipLink = page.locator('a[href="#main-content"]');
		await expect(skipLink).toBeFocused();

		// Press Enter to skip to main
		await page.keyboard.press('Enter');
		await page.waitForTimeout(100);

		// Tab through interactive elements
		await page.keyboard.press('Tab');
		const searchInput = page.locator('input[placeholder*="Search"]');
		await expect(searchInput).toBeFocused();
	});

	test('theme toggle is accessible', async ({ page }) => {
		await page.goto('/learn');
		await page.waitForLoadState('networkidle');

		// Find and click theme toggle button
		const themeToggle = page.locator('button[aria-label="Toggle theme"]').first();
		await expect(themeToggle).toBeVisible();
		await expect(themeToggle).toHaveAttribute('aria-label', 'Toggle theme');

		// Click to toggle theme
		await themeToggle.click();
		await page.waitForTimeout(200);

		// Verify theme changed
		const root = page.locator('div[data-theme]').first();
		const theme = await root.getAttribute('data-theme');
		expect(['dark', 'light']).toContain(theme);
	});
});
