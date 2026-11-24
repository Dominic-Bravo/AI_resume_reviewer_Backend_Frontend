import { test, expect, type Page } from '@playwright/test';

const MOCK_RESUMES = [
  {
    id: 1,
    file_name: 'backend_engineer_resume.pdf',
    created_at: '2026-11-20T10:30:00Z',
    scan_reports: [
      {
        id: 'report-101',
        status: 'DONE',
        target_job_title: 'Backend Engineer',
        ats_score: 88,
        created_at: '2026-11-20T10:31:00Z',
      },
    ],
  },
  {
    id: 2,
    file_name: 'frontend_react_cv.docx',
    created_at: '2026-11-22T15:00:00Z',
    scan_reports: [
      {
        id: 'report-102',
        status: 'PROCESSING',
        target_job_title: 'Frontend Developer',
        created_at: '2026-11-22T15:01:00Z',
      },
    ],
  },
];

async function setupHistoryMocks(
  page: Page,
  historyPayload: unknown,
  status = 200,
) {
  await page.route('**/api/v1/**', async (route) => {
    const url = route.request().url();

    if (url.includes('/api/v1/token/refresh/')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ access: 'mock-access-token' }),
      });
    }

    if (url.includes('/api/v1/credits/')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ credits: 10 }),
      });
    }

    if (url.includes('/api/v1/scans/history/')) {
      return route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify(historyPayload),
      });
    }

    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({}),
    });
  });
}

test.describe('Scan History Page (Localhost, Mocked API)', () => {
  test('shows empty state when user has no scans', async ({ page }) => {
    await setupHistoryMocks(page, []);
    await page.goto('/history');
    await expect(page.getByText('Verifying session...')).toBeHidden();

    await expect(page.getByRole('heading', { name: 'Scan History' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'No scans yet' })).toBeVisible();
    await expect(page.getByRole('button', { name: /upload your first resume/i })).toBeVisible();
  });

  test('filters by search query and resets when no scans match', async ({ page }) => {
    await setupHistoryMocks(page, MOCK_RESUMES);
    await page.goto('/history');
    await expect(page.getByText('Verifying session...')).toBeHidden();

    await expect(page.getByText('2 resumes')).toBeVisible();

    const searchInput = page.getByLabel('Search scan history');
    await searchInput.fill('Backend');

    await expect(page.getByText('backend_engineer_resume.pdf')).toBeVisible();
    await expect(page.getByText('frontend_react_cv.docx')).toBeHidden();
    await expect(page.getByText('1 resume')).toBeVisible();

    // Non-matching search shows empty-filter card with Reset Filters button
    await searchInput.fill('nonexistent-role-xyz');
    await expect(page.getByText('No matching scans found')).toBeVisible();

    await page.getByRole('button', { name: /^reset filters$/i }).click();
    await expect(page.getByText('2 resumes')).toBeVisible();
  });

  test('filters by status tabs (Completed vs In Progress / Failed)', async ({ page }) => {
    await setupHistoryMocks(page, MOCK_RESUMES);
    await page.goto('/history');
    await expect(page.getByText('Verifying session...')).toBeHidden();

    await page.getByRole('button', { name: /^completed$/i }).click();
    await expect(page.getByText('backend_engineer_resume.pdf')).toBeVisible();
    await expect(page.getByText('frontend_react_cv.docx')).toBeHidden();

    await page.getByRole('button', { name: /in progress \/ failed/i }).click();
    await expect(page.getByText('frontend_react_cv.docx')).toBeVisible();
    await expect(page.getByText('backend_engineer_resume.pdf')).toBeHidden();

    await page.getByRole('button', { name: /^all$/i }).click();
    await expect(page.getByText('2 resumes')).toBeVisible();
  });

  test('navigates to /dashboard with resume query params on New Role Scan', async ({ page }) => {
    await setupHistoryMocks(page, MOCK_RESUMES);
    await page.goto('/history');
    await expect(page.getByText('Verifying session...')).toBeHidden();

    await page.getByRole('button', { name: /new role scan/i }).first().click();
    await expect(page).toHaveURL(/\/dashboard\?resumeId=1&fileName=backend_engineer_resume\.pdf/);
  });

  test('shows error card when history API fails', async ({ page }) => {
    await setupHistoryMocks(page, { detail: 'Server error' }, 500);
    await page.goto('/history');
    await expect(page.getByText('Verifying session...')).toBeHidden();

    await expect(page.getByText('Failed to Load Scan History')).toBeVisible({
        timeout: 15_000,
    });
    await expect(page.getByRole('button', { name: /^retry$/i })).toBeVisible();
});
});