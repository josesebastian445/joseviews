/**
 * Worker entry point.
 *
 * The site is static: `wrangler.jsonc` serves everything in dist/ straight
 * from Cloudflare's edge, and `run_worker_first: ["/api/*"]` means this code
 * only executes for API routes. Every page view costs zero Worker invocations.
 *
 * The ASSETS fallback below exists for safety — if the routing config is ever
 * loosened, an unmatched request still gets the correct static response rather
 * than an error from this Worker.
 */

import { handleContact, type Env } from './contact';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/contact') {
      return handleContact(request, env);
    }

    if (url.pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({ error: 'Not found.' }), {
        status: 404,
        headers: { 'content-type': 'application/json; charset=utf-8' },
      });
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
