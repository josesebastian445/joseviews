# Deployment

Getting from this folder to a live site. Roughly 40 minutes end to end, most of
it waiting for DNS.

---

## 0. Before you start

The domain is **joseviews.com** and the contact address is **hi@joseviews.com**.
Both are already set in `src/consts.ts` and `public/admin/config.yml`.

Everything else — canonical tags, sitemap, RSS, `robots.txt`, JSON-LD, the
mailto links, the WhatsApp deep links — reads from those two constants, so if
the domain ever changes again, `src/consts.ts` is the only file to edit.

Two things still need creating before the site is fully live:

- **The `hi@joseviews.com` mailbox.** Nothing on the site sends mail on its own;
  this is where enquiries land and where people reply. Google Workspace, Zoho
  Mail (free tier) or a Cloudflare Email Routing forward to an existing inbox all
  work — Email Routing is free and takes about five minutes.
- **The GitHub repository.** `public/admin/config.yml` currently expects
  `josesebastian445/joseviews`; change it if you push somewhere else.

---

## 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/josesebastian445/joseviews.git
git push -u origin main
```

The repo can be private. Cloudflare Workers Builds and the CMS both work with
private repos.

---

## 2. Cloudflare Workers

The project deploys as a **Worker with static assets**, configured by
`wrangler.jsonc` in the repo root.

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Worker name | `joseviews` (from `wrangler.jsonc`) |

Every push to `main` deploys automatically — including the commits the CMS makes
when you publish a post.

### Why `wrangler.jsonc` must stay in the repo

Without it, `wrangler deploy` tries to auto-configure the project and runs
`astro add cloudflare`, which switches the site from `mode: "static"` to
`mode: "server"`. That breaks the build, because the OG-image generator uses
CanvasKit and `node:fs` — build-time tools that cannot be bundled into a Worker.
You will see warnings like:

```
[adapter] Cloudflare does not support sharp at runtime
[vite] Automatically externalized node built-in "node:fs/promises" from astro-og-canvas
```

If you ever see those, `wrangler.jsonc` has gone missing or been renamed.

**Do not add the Astro Cloudflare adapter.** This site is 100% static; there is
nothing to render at request time. The only server-side code is `worker/`, which
handles the contact form.

### How requests are routed

`run_worker_first: ["/api/*"]` means only API calls reach the Worker. Every page
view is served straight from Cloudflare's edge with no Worker invocation, so
page traffic costs nothing and cannot be slowed by Worker cold starts.

`html_handling: "drop-trailing-slash"` matches the canonical URLs the site emits.
The default would 307-redirect `/blog` to `/blog/`, putting a redirect hop on
every internal link and serving a URL that contradicts its own canonical tag.

---

## 3. Custom domain

Worker → **Settings → Domains & Routes** → **Add** → **Custom domain**.

If the domain's nameservers already point at Cloudflare, the DNS record is
created for you. Otherwise move the nameservers first — it's worth it, since the
same account then covers DNS, CDN, WAF and analytics.

---

## 4. Contact form

The form posts to `/api/contact`, handled by `worker/contact.ts`, which sends via
[Resend](https://resend.com) (free tier: 3,000 emails/month, ample here).

1. Create a Resend account and **verify your domain** — this is what lets mail
   come from `hi@joseviews.com` rather than landing in spam.
2. Create an API key.
3. Worker → **Settings → Variables and Secrets**, add:

   | Name | Type | Value |
   |---|---|---|
   | `RESEND_API_KEY` | Secret | `re_...` |
   | `CONTACT_TO` | Plaintext | `hi@joseviews.com` |
   | `CONTACT_FROM` | Plaintext | `Joseviews <hi@joseviews.com>` — must be on the verified domain |

   Note that `CONTACT_FROM` is the *sending* identity and `CONTACT_TO` is where
   the enquiry lands. Using the same address for both is fine and keeps the
   thread in one place.

4. Redeploy.

**Until these are set, the form returns a clear error telling the visitor to
email or WhatsApp instead.** That is deliberate: a form that says "sent" while
silently dropping messages is far worse than one that admits it isn't wired up.

### Optional: bot protection

1. Cloudflare → **Turnstile** → create a widget for your domain.
2. Add `TURNSTILE_SECRET_KEY` as a secret on the Worker.
3. Add `PUBLIC_TURNSTILE_SITE_KEY` as a **build-time** environment variable.
4. Redeploy.

The widget only renders when the site key is present, so the form works fine
without this.

### Optional: rate limiting

Create a KV namespace, then add the binding to `wrangler.jsonc`:

```jsonc
"kv_namespaces": [{ "binding": "RATE_LIMIT", "id": "<namespace-id>" }]
```

That caps each IP at 5 submissions per 15 minutes. Without the binding, the
honeypot and Turnstile still apply.

---

## 5. The CMS at `/admin`

Sveltia CMS runs in the browser and commits to GitHub on your behalf. GitHub
requires a confidential OAuth exchange, which a browser can't do — so there's a
small worker in between.

### Deploy the auth worker

1. Go to [`sveltia/sveltia-cms-auth`](https://github.com/sveltia/sveltia-cms-auth)
   and use the **Deploy to Cloudflare Workers** button.
2. Note the resulting URL: `https://sveltia-cms-auth.<subdomain>.workers.dev`.

### Register a GitHub OAuth app

GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**.

| Field | Value |
|---|---|
| Application name | Anything, e.g. `Website CMS` |
| Homepage URL | `https://joseviews.com` |
| Authorization callback URL | `https://sveltia-cms-auth.<subdomain>.workers.dev/callback` |

Copy the **Client ID** and generate a **Client Secret**.

### Wire them together

In the worker's **Settings → Variables**, add:

| Name | Value |
|---|---|
| `GITHUB_CLIENT_ID` | from the OAuth app |
| `GITHUB_CLIENT_SECRET` | from the OAuth app (encrypt it) |
| `ALLOWED_DOMAINS` | `joseviews.com` |

Then in `public/admin/config.yml` set:

```yaml
backend:
  name: github
  repo: josesebastian445/joseviews
  branch: main
  base_url: https://sveltia-cms-auth.<subdomain>.workers.dev
```

Commit, push, and `https://joseviews.com/admin` will offer **Sign in with
GitHub**.

### Simpler alternative

If the OAuth app is more trouble than it's worth, delete the `base_url` line.
Sveltia then offers **personal access token** login: create a fine-grained GitHub
token with read/write access to just this repository and paste it in. Fewer moving
parts; you re-enter the token when it expires.

---

## 6. Analytics

Cloudflare dashboard → **Web Analytics** → add `joseviews.com`.

Free, cookieless, and requires no consent banner — which also means it doesn't
drag down Core Web Vitals the way GA4 does. If you also want GA4, add it via
Cloudflare Zaraz rather than a script tag, so it loads off the main thread.

---

## 7. Search Console

1. [Google Search Console](https://search.google.com/search-console) → add a
   **Domain** property.
2. Verify with the DNS TXT record (Cloudflare DNS makes this a 30-second job).
3. Submit `https://joseviews.com/sitemap-index.xml`.
4. Request indexing on the homepage to prompt the first crawl.

Then leave it alone for a few weeks. Checking rankings daily is a good way to
lose your mind for no benefit.

---

## Local development

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # production build into dist/
npm run preview      # serve dist/ locally
npm run brand        # regenerate favicon and app icons
```

To test the CMS against local files instead of GitHub:

```bash
npx @sveltia/cms-proxy-server   # in one terminal
npm run dev                     # in another, then open /admin
```

`local_backend: true` is already set in the config.

`astro dev` does not run the Worker, so the contact form 404s there. To exercise
the real thing — Worker routing, `_headers`, 404 handling and the contact API —
run the Workers runtime locally:

```bash
npm run preview      # astro build && wrangler dev  →  http://localhost:8787
```

This is the runtime that actually serves production, so anything that works here
works deployed.

---

## Verification checklist

After the first deploy:

- [ ] Every page loads over HTTPS and `http://` redirects to `https://`
- [ ] `/sitemap-index.xml`, `/rss.xml` and `/robots.txt` all resolve
- [ ] `robots.txt` references the correct domain
- [ ] Share a blog post link in WhatsApp — the generated OG card should appear
- [ ] Lighthouse on `/` and one post: 95+ performance, 100 SEO, 100 accessibility
- [ ] [Rich Results Test](https://search.google.com/test/rich-results) shows
      Person, ProfessionalService and BlogPosting with no errors
- [ ] Submit the contact form and confirm the email arrives
- [ ] Publish a test post via `/admin`, confirm it goes live, then delete it
- [ ] Toggle light/dark — no flash of the wrong theme on reload
- [ ] Check on a real phone, not just a narrow browser window
