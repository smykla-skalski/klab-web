import { expect, test } from '@playwright/test';

test.describe('Learn routes', () => {
	test('learn page displays categories', async ({ page }) => {
		await page.goto('/learn');

		await expect(page.locator('h1')).toContainText('Interactive Labs');
		await expect(page.getByRole('link', { name: /kubernetes/i })).toBeVisible();
		await expect(page.getByRole('link', { name: /linux/i })).toBeVisible();
		await expect(page.getByRole('link', { name: /networking/i })).toBeVisible();
	});

	test('category page displays labs', async ({ page }) => {
		await page.goto('/learn/kubernetes');

		await expect(page.locator('h1')).toContainText(/kubernetes labs/i);
		await expect(page.getByRole('link', { name: /getting started/i })).toBeVisible();
		await expect(page.getByRole('link', { name: /intermediate concepts/i })).toBeVisible();
		await expect(page.getByRole('link', { name: /advanced techniques/i })).toBeVisible();
	});

	test('category page shows completion status', async ({ page }) => {
		await page.goto('/learn/kubernetes');

		const labCards = page.locator('a[href^="/learn/kubernetes/"]');
		await expect(labCards.first()).toBeVisible();
	});

	test('lab page renders', async ({ page }) => {
		await page.goto('/learn/kubernetes/intro');

		await expect(page.locator('h1')).toContainText(/intro lab/i);
		await expect(page.getByText(/lab interface will be implemented/i)).toBeVisible();
		await expect(page.getByRole('button', { name: /view knowledge article/i })).toBeVisible();
	});

	test('lab page back link works', async ({ page }) => {
		await page.goto('/learn/kubernetes/intro');

		const backLink = page.getByRole('link', { name: /back to kubernetes labs/i });
		await expect(backLink).toHaveAttribute('href', '/learn/kubernetes');
	});

	test('knowledge page renders', async ({ page }) => {
		await page.goto('/learn/kubernetes/intro/knowledge');

		await expect(page.locator('h1')).toContainText(/intro knowledge article/i);
		await expect(page.getByRole('heading', { name: /overview/i })).toBeVisible();
		await expect(page.getByRole('heading', { name: /key concepts/i })).toBeVisible();
	});

	test('knowledge page back link works', async ({ page }) => {
		await page.goto('/learn/kubernetes/intro/knowledge');

		const backLink = page.getByRole('link', { name: /back to lab/i });
		await expect(backLink).toHaveAttribute('href', '/learn/kubernetes/intro');
	});

	test('navigation between learn pages', async ({ page }) => {
		await page.goto('/learn');

		await page.click('text=Kubernetes');
		await expect(page).toHaveURL('/learn/kubernetes');

		await page.click('text=Getting Started');
		await expect(page).toHaveURL('/learn/kubernetes/intro');
	});
});
