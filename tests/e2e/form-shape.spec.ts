// NOTE: Astro resolves `import.meta.env.PUBLIC_FORMSPREE_ENDPOINT` at BUILD time,
// not at runtime. The `beforeAll` below is a no-op for the rendered dist; it only
// guards subsequent in-process logic. The dist that `npm run preview` serves must
// have been built WITH `PUBLIC_FORMSPREE_ENDPOINT` set, e.g.:
//
//   PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/test npm run build && npx playwright test
//
// CI sets this env var on the build step (see .github/workflows/ci.yml).
import { test, expect } from '@playwright/test';

test.beforeAll(() => {
  if (!process.env.PUBLIC_FORMSPREE_ENDPOINT) {
    process.env.PUBLIC_FORMSPREE_ENDPOINT = 'https://formspree.io/f/test';
  }
});

test('contact form has all required fields and honeypot', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.locator('input[name="name"]')).toBeVisible();
  await expect(page.locator('input[name="email"]')).toBeVisible();
  await expect(page.locator('select[name="interest"]')).toBeVisible();
  await expect(page.locator('textarea[name="message"]')).toBeVisible();
  await expect(page.locator('input[name="_gotcha"]')).toBeHidden();
  await expect(page.locator('form')).toHaveAttribute('action', /formspree\.io/);
});
