import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
// Astro 7 deprecated re-exporting `z` from 'astro:content'; it now comes from
// 'astro/zod', which guarantees the same zod instance Astro validates with.
import { z } from 'astro/zod';

/**
 * These schemas are the contract the CMS writes against. Every field here has
 * a matching widget in public/admin/config.yml — if you add one, add it there
 * too, or the CMS will silently write posts that fail the build.
 */

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: ['**/*.{md,mdx}', '!**/README.md'] }),
  schema: ({ image }) =>
    z.object({
      title: z.string().max(80),
      description: z.string().min(50).max(180),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: image().optional(),
      heroAlt: z.string().optional(),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
      featured: z.boolean().default(false),
    }),
});

const work = defineCollection({
  loader: glob({ base: './src/content/work', pattern: ['**/*.{md,mdx}', '!**/README.md'] }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      client: z.string(),
      summary: z.string().max(220),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      services: z.array(z.string()).default([]),
      stack: z.array(z.string()).default([]),
      /** Headline outcomes. Leave values as "TODO" until the real number is confirmed. */
      metrics: z
        .array(z.object({ label: z.string(), value: z.string() }))
        .max(4)
        .default([]),
      year: z.string(),
      // zod 4 moved format validators to the top level: z.url(), not z.string().url()
      url: z.url().optional(),
      order: z.number().default(99),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

const services = defineCollection({
  loader: glob({ base: './src/content/services', pattern: ['**/*.{md,mdx}', '!**/README.md'] }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    /** Key into the icon map in ServiceCard.astro. */
    icon: z.enum(['code', 'search', 'shield', 'server']),
    bullets: z.array(z.string()).min(2).max(6),
    deliverables: z.array(z.string()).default([]),
    startingPrice: z.string().optional(),
    timeline: z.string().optional(),
    order: z.number().default(99),
  }),
});

const testimonials = defineCollection({
  loader: glob({
    base: './src/content/testimonials',
    pattern: ['**/*.{md,mdx,json}', '!**/README.md'],
  }),
  schema: z.object({
    quote: z.string(),
    name: z.string(),
    role: z.string(),
    company: z.string().optional(),
    order: z.number().default(99),
  }),
});

export const collections = { blog, work, services, testimonials };
