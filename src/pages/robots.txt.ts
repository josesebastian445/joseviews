import type { APIContext } from 'astro';

/**
 * Generated rather than static so the sitemap URL always matches the deployed
 * domain — a robots.txt pointing at the wrong host is a silent SEO failure.
 */
export async function GET({ site }: APIContext) {
  const base = site?.href.replace(/\/$/, '') ?? '';

  const body = `# ${base}
User-agent: *
Allow: /

# The CMS is behind GitHub auth, but there is no reason to crawl it.
Disallow: /admin
Disallow: /api/

# Social card images are build artefacts, not pages.
Disallow: /og/

Sitemap: ${base}/sitemap-index.xml
`;

  return new Response(body, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
