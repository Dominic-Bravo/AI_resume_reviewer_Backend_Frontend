import { Page } from '@playwright/test';

export async function mockAuthenticatedSession(page: Page) {
  // Intercept token refresh so tryRestoreSession() resolves to true
  await page.route('**/auth/token/refresh**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ access: 'mock-e2e-access-token' }),
    });
  });

  // Optional: mock credits & scan history queries if they hit the backend on /dashboard
  await page.route('**/credits**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ credits: 10 }),
    });
  });

  await page.route('**/scans/history**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    });
  });
}