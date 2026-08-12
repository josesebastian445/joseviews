import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';
import { getPublishedPosts } from '../lib/posts';
import { SITE } from '../consts';

const parser = new MarkdownIt({ html: true, linkify: true });

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();

  return rss({
    title: `${SITE.name} — Web development, SEO & IT notes`,
    description: SITE.description,
    site: context.site ?? SITE.url,
    trailingSlash: false,
    customData: `<language>en-ae</language><copyright>© ${new Date().getFullYear()} ${SITE.name}</copyright>`,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}`,
      categories: [...post.data.tags],
      author: SITE.name,
      // Full-text feed: readers get the whole post, which is worth more than
      // the extra click for a technical audience.
      content: sanitizeHtml(parser.render(post.body ?? ''), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'figure', 'figcaption']),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          img: ['src', 'alt', 'width', 'height'],
        },
      }),
    })),
  });
}
