import { getCollection, type CollectionEntry } from 'astro:content';
import { SITE } from '../consts';

/**
 * Shared post queries. Drafts stay visible in `astro dev` so they can be
 * previewed locally, and are excluded from every production build.
 */

export async function getPublishedPosts(): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft || import.meta.env.DEV);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** URL-safe tag slug. Must match the links rendered in PostCard and post pages. */
export function tagSlug(tag: string): string {
  return tag.toLowerCase().trim().replace(/\s+/g, '-');
}

export async function getTagCounts(): Promise<[string, number][]> {
  const posts = await getPublishedPosts();
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

export function paginateSlice<T>(items: T[], pageNumber: number): T[] {
  const start = (pageNumber - 1) * SITE.postsPerPage;
  return items.slice(start, start + SITE.postsPerPage);
}

export function totalPages(count: number): number {
  return Math.max(1, Math.ceil(count / SITE.postsPerPage));
}
