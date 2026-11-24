import { test, expect, type Page } from '@playwright/test';

const COMPLETED_SCAN = {
  id: 'scan-123',
  file_name: 'fullstack_engineer_resume.pdf',
  target_job_title: 'Senior Full-Stack Engineer',
  status: 'DONE',
  overall_score: 86,
  category_scores: {
    experience_impact: 88,
    skills_alignment: 82,
    ats_formatting: 91,
    role_relevance: 84,
  },
  missing_keywords: ['Kubernetes', 'GraphQL', 'CI/CD'],
  section_critiques: [
    {
      section: 'Experience',
      item: 'Backend API Development',
      before_score: 58,
      after_score: 89,
      critique: 'Add measurable latency and throughput metrics.',
      before: 'Built REST APIs for order processing.',
      rewrite: 'Engineered Django REST APIs handling 1,200 req/min with p95 latency under 120ms.',
      key_terms: ['Django REST', 'Throughput', 'Latency'],
    },
  ],
};

async function setupResultsMocks(
  page: Page,
  scanPayload: unknown,
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

    if (/\/api\/v1\/scans\/[^/]+\/?$/.test(url)) {
      return route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify(scanPayload),
      });
    }

    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({}),
    });
  });
}

test.describe('Scan Results Page (Localhost, Mocked API)', () => {
  test('renders completed scan report details, scores, keywords, and critiques', async ({
    page,
  }) => {
    await setupResultsMocks(page, COMPLETED_SCAN);
    await page.goto('/results/scan-123');
    await expect(page.getByText('Verifying session...')).toBeHidden();

    await expect(
      page.getByRole('heading', { name: 'fullstack_engineer_resume.pdf' }),
    ).toBeVisible();
    await expect(page.getByText('Completed')).toBeVisible();
    await expect(
      page.getByText('Target Role: Senior Full-Stack Engineer'),
    ).toBeVisible();

    await expect(page.getByText('86')).toBeVisible();
    await expect(page.getByText('Kubernetes')).toBeVisible();
    await expect(page.getByText('GraphQL')).toBeVisible();
    await expect(page.getByText('CI/CD')).toBeVisible();
  });

  test('transitions from PROCESSING to DONE when polled scan finishes', async ({
    page,
  }) => {
    let pollCount = 0;

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

      if (/\/api\/v1\/scans\/scan-poll-1\/?$/.test(url)) {
        pollCount += 1;
        if (pollCount === 1) {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              id: 'scan-poll-1',
              file_name: 'async_resume.pdf',
              status: 'PROCESSING',
            }),
          });
        }

        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            ...COMPLETED_SCAN,
            id: 'scan-poll-1',
            file_name: 'async_resume.pdf',
            status: 'DONE',
          }),
        });
      }

      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({}),
      });
    });

    await page.goto('/results/scan-poll-1');
    await expect(page.getByText('Verifying session...')).toBeHidden();
    await expect(page.getByText('Completed')).toBeVisible({ timeout: 10_000 });
    await expect(
      page.getByRole('heading', { name: 'async_resume.pdf' }),
    ).toBeVisible();
  });

  test('shows failure state when scan status is FAILED', async ({ page }) => {
    await setupResultsMocks(page, {
        id: 'scan-err-1',
        file_name: 'unreadable_resume.pdf',
        target_job_title: 'Backend Engineer',
        status: 'FAILED',
        error_message: 'Scan analysis failed due to unreadable document.',
    });

    await page.goto('/results/scan-err-1');
    await expect(page.getByText('Verifying session...')).toBeHidden();

    await expect(page.getByText(/analysis failed/i)).toBeVisible();
    await expect(
        page.getByRole('button', { name: /try another resume/i }),
    ).toBeVisible();
    });
}); 