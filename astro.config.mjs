import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://histiva.github.io',
  output: 'static',
  trailingSlash: 'ignore',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'tr', 'fr', 'ar'],
    routing: { prefixDefaultLocale: false, redirectToDefaultLocale: false },
    fallback: { tr: 'en', fr: 'en', ar: 'en' },
  },
  integrations: [mdx(), sitemap({
    i18n: {
      defaultLocale: 'en',
      locales: { en: 'en', tr: 'tr', fr: 'fr', ar: 'ar' },
    },
  }), icon({ iconDir: 'src/icons' })],
  vite: { plugins: [tailwindcss()] },
});
