/**
 * Generates the raster brand assets from a single SVG source.
 *
 * Run with: npm run brand
 *
 * Uses shapes only — no text — so rendering never depends on which fonts the
 * machine running the build happens to have installed.
 *
 * Outputs:
 *   public/favicon.svg          — vector favicon (also the source of truth)
 *   public/apple-touch-icon.png — 180x180, solid background
 *   public/icon-192.png / icon-512.png — PWA manifest icons
 *   src/assets/og-fonts/mark.png       — transparent mark used on OG cards
 */

import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const ACCENT = '#4ade80';
const DARK = '#0b0c0e';

/**
 * The mark: three network nodes joined by links, with the top-right node lit —
 * the same "signal travelling a network" idea as the site background.
 */
function markSvg({ size = 512, background = 'none', scale = 1 } = {}) {
  const s = size;
  const stroke = 26 * scale;
  const node = 34 * scale;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="${s}" height="${s}">
  ${background === 'none' ? '' : `<rect width="512" height="512" rx="112" fill="${background}"/>`}
  <g transform="translate(-24 18)">
  <g stroke="${ACCENT}" stroke-width="${stroke}" stroke-linecap="square" opacity="0.55" fill="none">
    <path d="M136 356 L136 168"/>
    <path d="M136 168 L376 168"/>
    <path d="M136 356 L376 168"/>
  </g>
  <g fill="${ACCENT}">
    <rect x="${136 - node / 2}" y="${168 - node / 2}" width="${node}" height="${node}"/>
    <rect x="${136 - node / 2}" y="${356 - node / 2}" width="${node}" height="${node}"/>
  </g>
  <circle cx="376" cy="168" r="${node * 0.95}" fill="${ACCENT}"/>
  <circle cx="376" cy="168" r="${node * 1.9}" fill="none" stroke="${ACCENT}" stroke-width="${stroke * 0.5}" opacity="0.35"/>
  </g>
</svg>`;
}

async function write(path, buffer) {
  const full = resolve(root, path);
  await mkdir(dirname(full), { recursive: true });
  await writeFile(full, buffer);
  console.log(`  ✓ ${path}`);
}

console.log('Generating brand assets…');

// Vector favicon — the source of truth, and the only one that scales.
await write('public/favicon.svg', markSvg({ size: 512 }));

const transparent = Buffer.from(markSvg({ size: 512 }));
const onDark = Buffer.from(markSvg({ size: 512, background: DARK }));

await write('public/apple-touch-icon.png', await sharp(onDark).resize(180, 180).png().toBuffer());
await write('public/icon-192.png', await sharp(onDark).resize(192, 192).png().toBuffer());
await write('public/icon-512.png', await sharp(onDark).resize(512, 512).png().toBuffer());
await write(
  'src/assets/og-fonts/mark.png',
  await sharp(transparent).resize(120, 120).png().toBuffer()
);

console.log('Done.');
