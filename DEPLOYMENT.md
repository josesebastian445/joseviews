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

The repo can be private. Cloudflare Pages and the CMS both work with private
repos.

---

## 2. Connect Cloudflare Pages

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git**.
2. Pick the repository.
3. Build settings:

   | Setting | Value |
   |---|---|
   | Framework preset | Astro |
   | Build command | `npm run build` |
   | Output directory | `dist` |
   | Node version | `22` (set env var `NODE_VERSION=22`) |

4. **Save and Deploy.**

Every push to `main` now deploys automatically — including the commits the CMS
makes when you publish a post.

---

## 3. Custom domain

Pages project → **Custom domains** → **Set up a domain**.

If the domain's nameservers already point at Cloudflare, the DNS record is
created for you. Otherwise move the nameservers first — it's worth it, since the
same account then covers DNS, CDN, WAF and analytics.

---

## 4. Contact form

The form posts to a Pages Function at `/api/contact`, which sends via
[Resend](https://resend.com) (free tier: 3,000 emails/month, ample here).

1. Create a Resend account and **verify your domain** — this is what lets mail
   come from `hi@joseviews.com` rather than landing in spam.
2. Create an API key.
3. Pages project → **Settings → Variables and Secrets**, add:

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
2. Add `TURNSTILE_SECRET_KEY` as a secret in Pages.
3. Add `PUBLIC_TURNSTILE_SITE_KEY` as a **build-time** environment variable.
4. Redeploy.

The widget only renders when the site key is present, so the form works fine
without this.

### Optional: rate limiting

Create a KV namespace and bind it to the Pages project as `RATE_LIMIT`. That caps
each IP at 5 submissions per 15 minutes. Without the binding, the honeypot and
Turnstile still apply.

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

Cloudflare Pages project → **Analytics → Web Analytics → Enable**.

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

To test the contact form locally you need the Pages runtime, since Astro's dev
server doesn't run Functions:

```bash
npm run build
npx wrangler pages dev dist
```

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
