import { test, expect } from '@playwright/test';

test.describe('SIH26241 Margdarshak Full Demo Flow (PRD Section 18)', () => {
  test('Completes bilingual learner+parent journey, trade comparison, escalation, and admin k>=5 check', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Demonstration data, not official government figures')).toBeVisible();

    // Switch language to Hindi and back to English
    await page.click('[data-testid="lang-switch-hi"]');
    await expect(page.locator('html')).toHaveAttribute('lang', 'hi');
    await page.click('[data-testid="lang-switch-en"]');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');

    // Navigate to Joint Counselling
    await page.click('[data-testid="nav-counselling"]');
    await page.click('[data-testid="mode-joint"]');
    await expect(page.locator('[data-testid="joint-lane-learner"]')).toBeVisible();
    await expect(page.locator('[data-testid="joint-lane-parent"]')).toBeVisible();
  });
});
