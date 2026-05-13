import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Unit tests only — exclude Playwright E2E specs (run via `npm run test:e2e`).
    include: ['tests/**/*.test.ts', 'src/**/*.test.ts'],
    exclude: ['tests/e2e/**', 'node_modules/**', 'dist/**', '.astro/**'],
  },
});
