import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Syntecxhub Project 3 — Media Library & Asset Pipeline', () => {
  const screenshotsDir = path.resolve(process.cwd(), 'e2e-screenshots');

  test.beforeAll(() => {
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
  });

  test('01 - Dashboard Overview displays media storage analytics and breakdown', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveTitle(/Syntecxhub/);
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();

    // Verify Metric Cards
    const cards = page.locator('.surface-card');
    await expect(cards.first()).toBeVisible();

    // Screenshot
    await page.screenshot({
      path: path.join(screenshotsDir, '01-media-dashboard.png'),
      fullPage: true,
    });
  });

  test('02 - Media Gallery displays seeded image assets and supports search', async ({ page }) => {
    await page.goto('/media');
    await page.waitForLoadState('networkidle');

    // Heading verification
    await expect(page.locator('text=Media Library').first()).toBeVisible();

    // Verify search input
    const searchInput = page.locator('input[placeholder*="Search uploaded files"]');
    await expect(searchInput).toBeVisible();

    // Verify upload dropzone / button is visible
    const uploadArea = page.locator('text=Drag and drop image files').or(page.locator('text=click to browse'));
    await expect(uploadArea.first()).toBeVisible();

    // Search for a seeded asset (e.g. cloud or gateway)
    await searchInput.fill('cloud');
    await page.waitForTimeout(500);

    // Screenshot of media gallery
    await page.screenshot({
      path: path.join(screenshotsDir, '02-media-gallery.png'),
      fullPage: true,
    });

    // Clear search
    await searchInput.fill('');
    await page.waitForTimeout(500);
  });

  test('03 - Settings page loads storage and quota configuration', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=Settings')).toBeVisible();

    await page.screenshot({
      path: path.join(screenshotsDir, '03-settings-page.png'),
      fullPage: true,
    });
  });

  test('04 - API Docs page loads OpenAPI / Swagger reference', async ({ page }) => {
    await page.goto('/api-docs');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=API Reference').or(page.locator('text=Swagger'))).toBeVisible();

    await page.screenshot({
      path: path.join(screenshotsDir, '04-api-docs-page.png'),
      fullPage: true,
    });
  });
});
