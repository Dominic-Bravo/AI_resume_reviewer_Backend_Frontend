import { test, expect } from '@playwright/test';

test.describe('Resume Upload Form (Localhost, Mocked API)', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/v1/**', async (route) => {
      const url = route.request().url();

      if (url.includes('/api/v1/token/refresh/')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ access: 'mock-access-token' }),
        });
      }

      if (url.includes('/api/v1/upload-resume/')) {
        return route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ scan_id: 'local-scan-123' }),
        });
      }

      if (url.includes('/api/v1/credits/')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ credits: 10 }),
        });
      }

      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({}),
      });
    });

    await page.goto('/dashboard');
    await expect(page.getByText('Verifying session...')).toBeHidden();
  });

  test('keeps Analyze Resume disabled until a file is selected', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /analyze resume/i });
    await expect(submitButton).toBeDisabled();

    await page.getByLabel('Target Job Title (Optional)').fill('Backend Engineer');
    await page.getByLabel('Target Job Description (Optional)').fill('Python Django REST APIs');

    await expect(page.getByText('4 words')).toBeVisible();
    await expect(submitButton).toBeDisabled();

    await page.getByRole('button', { name: 'Clear' }).click();
    await expect(page.getByText('4 words')).toBeHidden();
  });

  test('uploads a PDF and redirects to /results/:id', async ({ page }) => {
    const fileInput = page.getByLabel('Resume File *');
    await fileInput.setInputFiles({
      name: 'sample-resume.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF'),
    });

    await expect(page.getByText('sample-resume.pdf')).toBeVisible();
    await page.getByRole('button', { name: /analyze resume/i }).click();

    await expect(page).toHaveURL('/results/local-scan-123');
  });
});