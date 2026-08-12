// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

import { remarkReadingTime } from './src/lib/remark-reading-time.mjs';
import { SITE } from './src/consts.ts';

// https://astro.build/config
export default defineConfig({
  site: SITE.url,
  trailingSlash: 'ignore',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/admin'),
      changefreq: 'weekly',
      lastmod: new Date(),
    }),
  ],
  markdown: {
    remarkPlugins: [remarkReadingTime],
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark-dimmed' },
      wrap: true,
    },
  },
  image: {
    // Local sharp service; keeps everything build-time and dependency-free at runtime.
    responsiveStyles: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    inlineStylesheets: 'auto',
  },
  prefetch: {
    prefetchAll: true,
    // 'viewport' prefetched every link as it scrolled into view — around 25
    // full HTML documents on the homepage alone, competing for bandwidth on
    // mobile for pages most visitors never open. 'hover' (which also covers
    // touchstart) keeps navigation feeling instant at a fraction of the cost.
    defaultStrategy: 'hover',
  },
});
