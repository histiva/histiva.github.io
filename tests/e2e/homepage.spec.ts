import { test, expect } from '@playwright/test';

test('homepage renders hero + pillars + module grid + dual CTA', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Hospital records');
  await expect(page.getByRole('link', { name: /Schedule a demo/i }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: /For donors/i }).first()).toBeVisible();
  const pillars = page.locator('article').filter({ hasText: /AI-Powered|Mobile-first|Standards-compliant|Secure/ });
  await expect(pillars).toHaveCount(4);
});

test('arabic homepage sets dir=rtl and shows translation banner', async ({ page }) => {
  await page.goto('/ar/');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  await expect(page.getByText(/Translation in progress/i)).toBeVisible();
});

test('cookie banner appears on first visit and dismisses', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('dialog', { name: /cookies/i })).toBeVisible();
  await page.getByRole('button', { name: /Decline/i }).click();
  await expect(page.getByRole('dialog', { name: /cookies/i })).toBeHidden();
  await page.reload();
  await expect(page.getByRole('dialog', { name: /cookies/i })).toBeHidden();
});
