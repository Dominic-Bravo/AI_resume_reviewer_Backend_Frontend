import { test, expect } from '@playwright/test';

test.describe('Authentication Flows (Localhost, Mocked API)', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/v1/**', async (route) => {
      const url = route.request().url();

      if (url.includes('/api/v1/login/')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ access: 'mock-access-token' }),
        });
      }

      if (url.includes('/api/v1/register/')) {
        return route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ access: 'mock-access-token' }),
        });
      }

      if (url.includes('/api/v1/token/refresh/')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ access: 'mock-access-token' }),
        });
      }

      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({}),
      });
    });
  });

  test('shows validation error when signup passwords do not match', async ({ page }) => {
    await page.goto('/signup');

    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password (min 8 characters)').fill('Password123!');
    await page.getByLabel('Confirm Password').fill('Mismatch123!');
    await page.getByRole('button', { name: /create account/i }).click();

    await expect(page.getByText('Passwords do not match')).toBeVisible();
    await expect(page).toHaveURL('/signup');
  });

  test('signs up and redirects to /dashboard', async ({ page }) => {
    await page.goto('/signup');

    await page.getByLabel('Email').fill('newuser@example.com');
    await page.getByLabel('Password (min 8 characters)').fill('StrongPass123!');
    await page.getByLabel('Confirm Password').fill('StrongPass123!');
    await page.getByRole('button', { name: /create account/i }).click();

    await expect(page).toHaveURL('/dashboard');
  });

  test('signs in and redirects to /dashboard', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('StrongPass123!');
    await page.getByRole('button', { name: /^sign in$/i }).click();

    await expect(page).toHaveURL('/dashboard');
  });
});