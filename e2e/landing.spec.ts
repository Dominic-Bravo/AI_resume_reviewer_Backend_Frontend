import { test, expect } from '@playwright/test';

test.describe('RoleMatch Landing Page (Localhost)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders hero headline, trust signals, and CTAs', async ({ page }) => {
    await expect(
      page.getByRole('heading', { level: 1, name: /beat the ats and land more interviews/i })
    ).toBeVisible();

    await expect(page.getByText('Supports PDF & DOCX')).toBeVisible();
    await expect(page.getByText('Results in under 15 seconds')).toBeVisible();
    await expect(page.getByText('Private & encrypted')).toBeVisible();
  });

  test('navigates from navbar Sign in to /login', async ({ page }) => {
  await Promise.all([
    page.waitForURL('**/login', { timeout: 15_000 }),
    page.getByRole('banner').getByRole('link', { name: /^sign in$/i }).click(),
  ]);
});

  test('navigates from hero CTA to /signup', async ({ page }) => {
    await page.getByRole('link', { name: /scan your resume free/i }).click();
    await expect(page).toHaveURL('/signup');
  });
});