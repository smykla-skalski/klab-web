import { expect, test } from '@playwright/test';

test.describe('Learn routes', () => {
	test('learn page displays categories', async ({ page }) => {
		await page.goto('/learn');

		await expect(page.locator('h1')).toContainText('Interactive Labs');
		// Categories are displayed as lab cards, check for category names in the content
		await expect(page.getByText(/kubernetes/i).first()).toBeVisible();
		await expect(page.getByText(/linux/i).first()).toBeVisible();
		await expect(page.getByText(/docker/i).first()).toBeVisible();
	});

	test('category page displays labs', async ({ page }) => {
		await page.goto('/learn/kubernetes');

		await expect(page.locator('h1')).toContainText(/kubernetes labs/i);
		await expect(page.getByText(/basic kubernetes deployment/i)).toBeVisible();
	});

	test('category page shows lab cards', async ({ page }) => {
		await page.goto('/learn/kubernetes');

		// Lab cards are buttons now, not links
		const labCards = page.locator('button[aria-label*="lab"]');
		await expect(labCards.first()).toBeVisible();
	});

	test('lab page renders', async ({ page }) => {
		await page.goto('/learn/kubernetes/basic-deployment');

		await expect(page.locator('h1')).toContainText(/basic kubernetes deployment/i);
		await expect(page.getByRole('button', { name: /knowledge/i })).toBeVisible();
		await expect(page.getByRole('button', { name: /check solution/i })).toBeVisible();
		await expect(page.getByRole('button', { name: /give up/i })).toBeVisible();
	});

	test('lab page actions work', async ({ page }) => {
		await page.goto('/learn/kubernetes/basic-deployment');

		const knowledgeButton = page.getByRole('button', { name: /knowledge/i });
		await knowledgeButton.click();
		await expect(page).toHaveURL('/learn/kubernetes/basic-deployment/knowledge');
	});

	test('knowledge page renders', async ({ page }) => {
		await page.goto('/learn/kubernetes/basic-deployment/knowledge');

		await expect(page.locator('h1')).toBeVisible();
		// Knowledge article should render with markdown content
		const content = page.locator('article, main, div').first();
		await expect(content).toBeVisible();
	});

	test('knowledge page back link works', async ({ page }) => {
		await page.goto('/learn/kubernetes/basic-deployment/knowledge');

		const backLink = page.getByRole('link', { name: /back to lab/i });
		await expect(backLink).toHaveAttribute('href', '/learn/kubernetes/basic-deployment');
	});

	test('navigation between learn pages', async ({ page }) => {
		await page.goto('/learn');

		// Click on a lab card to navigate
		const firstLabCard = page.locator('button[aria-label*="lab"]').first();
		await firstLabCard.click();

		// Should navigate to a lab page
		await expect(page).toHaveURL(/\/learn\/\w+\/[\w-]+/);
	});
});
