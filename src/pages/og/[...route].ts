import { OGImageRoute } from 'astro-og-canvas';
import { getCollection } from 'astro:content';
import { SITE } from '../../consts';

/**
 * Branded 1200x630 social cards, generated at build time from frontmatter.
 *
 * This matters at a weekly publishing cadence: without it, every post needs a
 * hand-made share image or it goes out with the generic site card. Here it is
 * free and automatic.
 *
 * Routes produced:
 *   /og/blog/<post-id>.png
 *   /og/work/<case-study-id>.png
 *   /og/page/<slug>.png   (static pages)
 */

const [posts, work] = await Promise.all([
  getCollection('blog', ({ data }) => !data.draft),
  getCollection('work', ({ data }) => !data.draft),
]);

const pages: Record<string, { title: string; description: string; kind: string }> = {};

for (const post of posts) {
  pages[`blog/${post.id}`] = {
    title: post.data.title,
    description: post.data.description,
    kind: post.data.tags[0] ?? 'Article',
  };
}

for (const entry of work) {
  pages[`work/${entry.id}`] = {
    title: entry.data.title,
    description: entry.data.summary,
    kind: `Case study · ${entry.data.client}`,
  };
}

const STATIC_PAGES: Record<string, { title: string; description: string; kind: string }> = {
  'page/home': { title: SITE.title, description: SITE.description, kind: SITE.tagline },
  'page/work': {
    title: 'Selected work',
    description: 'Case studies from seven years of building and maintaining business websites.',
    kind: 'Portfolio',
  },
  'page/services': {
    title: 'Services',
    description: 'Web development, SEO, IT support and security — scoped, priced and delivered.',
    kind: 'What I do',
  },
  'page/about': {
    title: 'About Jose Sebastian',
    description:
      'IT Manager and web developer in Dubai. Seven years across web development, SEO and IT infrastructure.',
    kind: 'About',
  },
  'page/blog': {
    title: 'Notes from the work',
    description:
      'Practical writing on web development, SEO and IT infrastructure — a new post most weeks.',
    kind: 'Blog',
  },
  'page/contact': {
    title: "Let's talk about your project",
    description: 'Tell me what you are trying to achieve and I will give you an honest read.',
    kind: 'Contact',
  },
};

Object.assign(pages, STATIC_PAGES);

export const { getStaticPaths, GET } = OGImageRoute({
  param: 'route',
  pages,
  getImageOptions: (_path, page: (typeof pages)[string]) => ({
    title: page.title,
    description: page.description,
    logo: { path: './src/assets/og-fonts/mark.png', size: [64] },
    bgGradient: [
      [11, 12, 14],
      [17, 21, 25],
    ],
    border: { color: [74, 222, 128], width: 8, side: 'inline-start' },
    padding: 70,
    font: {
      title: {
        families: ['Instrument Serif'],
        weight: 'Normal',
        color: [233, 233, 230],
        size: 62,
        lineHeight: 1.1,
      },
      description: {
        families: ['Inter'],
        weight: 'Normal',
        color: [154, 160, 168],
        size: 27,
        lineHeight: 1.4,
      },
    },
    fonts: [
      './src/assets/og-fonts/InstrumentSerif-Regular.ttf',
      './src/assets/og-fonts/Inter-Regular.ttf',
    ],
  }),
});
