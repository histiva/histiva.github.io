import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://histiva.github.io',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [mdx(), sitemap(), icon({ iconDir: 'src/icons' })],
  vite: { plugins: [tailwindcss()] },
});
