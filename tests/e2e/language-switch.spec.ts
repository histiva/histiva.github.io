import { test, expect } from '@playwright/test';

test('language switcher navigates EN → TR → AR with correct URL prefix', async ({ page }) => {
  await page.goto('/about');
  await page.locator('details').first().click();
  await page.getByRole('link', { name: 'Türkçe' }).first().click();
  await expect(page).toHaveURL(/\/tr\/about/);
  await page.locator('details').first().click();
  await page.getByRole('link', { name: 'العربية' }).first().click();
  await expect(page).toHaveURL(/\/ar\/about/);
});
