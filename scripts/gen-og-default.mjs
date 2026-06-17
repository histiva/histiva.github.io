#!/usr/bin/env node
/**
 * Generate the default Open Graph image for the MediSina marketing site.
 *
 * This is a *placeholder* renderer — it produces a Trust Blue background
 * with a white "MediSina" wordmark and short subtitle, sized 1200x630 (the
 * Open Graph spec standard). It exists so the site's <meta property="og:image">
 * resolves to a real file in v1.
 *
 * A human can replace `public/og/default.png` with a designed export from
 * Figma/PowerPoint at any time without changing the build pipeline.
 *
 * Usage:
 *   node scripts/gen-og-default.mjs
 */

import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = resolve(__dirname, '..', 'public', 'og', 'default.png');

const WIDTH = 1200;
const HEIGHT = 630;

// Trust Blue palette (see CLAUDE.md / design tokens):
//   #0c2461 — primary
//   #1e40af — accent
//   #dbeafe — soft tint for subtitle
const SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#0c2461"/>
  <text x="600" y="290" text-anchor="middle"
        font-family="Inter, system-ui, -apple-system, sans-serif"
        font-size="120" font-weight="800" fill="#ffffff"
        letter-spacing="-2.4">MediSina</text>
  <text x="600" y="370" text-anchor="middle"
        font-family="Inter, system-ui, -apple-system, sans-serif"
        font-size="32" font-weight="400" fill="#dbeafe">
    A nonprofit hospital information system
  </text>
  <circle cx="600" cy="450" r="6" fill="#3b82f6"/>
</svg>`;

async function main() {
  await mkdir(dirname(OUT_PATH), { recursive: true });
  await sharp(Buffer.from(SVG)).png({ compressionLevel: 9 }).toFile(OUT_PATH);
  const meta = await sharp(OUT_PATH).metadata();
  process.stdout.write(`Wrote ${OUT_PATH} (${meta.width}x${meta.height}, ${meta.format})\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
