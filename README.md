# joseviews

Personal brand site for Jose Sebastian — IT Manager, web developer and SEO
specialist in Dubai. Built to bring in client work and to be genuinely pleasant
to publish to every week.

**Stack:** Astro 7 (static) · Tailwind 4 · Sveltia CMS · Cloudflare Workers

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:4321
```

| Command | What it does |
|---|---|
| `npm run dev` | Dev server, drafts visible |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Build, then serve on the real Workers runtime |
| `npm run deploy` | Build and deploy to Cloudflare |
| `npm run check` | Type-check the site and the Worker |
| `npm run brand` | Regenerate favicon and app icons from `scripts/make-brand-assets.mjs` |

**Publishing a post?** See [CONTENT-GUIDE.md](CONTENT-GUIDE.md).
**Deploying or configuring?** See [DEPLOYMENT.md](DEPLOYMENT.md).

---

## Structure

```
src/
  consts.ts              Site identity, contact details, nav — change these first
  content.config.ts      Zod schemas; must stay in sync with public/admin/config.yml
  content/               Markdown: blog, work, services, testimonials
  components/
    motion/              Hero + the Signal Field background
  layouts/BaseLayout     Head, shell, theme, scroll reveal
  lib/
    signal-field.ts      The animated network background
    motion.ts            Typewriter, count-up, magnetic buttons, tilt, clock
    posts.ts             Shared post queries
  pages/                 Routes
  styles/global.css      Design tokens, background layers, print CV styles
worker/
  index.ts               Worker entry — routes /api/*, serves assets otherwise
  contact.ts             Contact form handler (the only server-side code)
wrangler.jsonc           Cloudflare deploy config — see the warning below
public/admin/            Sveltia CMS
scripts/                 Brand asset generation
```

---

## Deployment: do not add the Astro Cloudflare adapter

This site is **100% static**. `wrangler.jsonc` deploys `dist/` as Worker static
assets, with `worker/` handling only `/api/*`.

If `wrangler.jsonc` is ever deleted or renamed, `wrangler deploy` auto-runs
`astro add cloudflare`, which flips the build to `mode: "server"`. That breaks
it — the OG-image generator uses CanvasKit and `node:fs`, which are build-time
tools that cannot be bundled into a Worker.

Two settings in that file are load-bearing:

- `run_worker_first: ["/api/*"]` — page views never invoke the Worker
- `html_handling: "drop-trailing-slash"` — matches the canonical URLs the site
  emits; the default would 307 every internal link to a URL that contradicts
  its own canonical tag

Full walkthrough in [DEPLOYMENT.md](DEPLOYMENT.md).

---

## Design system

Everything is driven by CSS custom properties in `src/styles/global.css`. To
rebrand, change the values on `:root` — the canvas background reads `--accent`
at runtime, so it recolours along with everything else.

| Token | Dark | Light |
|---|---|---|
| `--bg` | `#0b0c0e` | `#fafaf8` |
| `--text` | `#e9e9e6` | `#14161a` |
| `--accent` | `#4ade80` | `#15803d` |

Type: **Instrument Serif** (display), **Inter** (body), **JetBrains Mono**
(labels). All self-hosted via Fontsource — no external font requests.

Theme has three states: an explicit choice is stored in `localStorage`;
otherwise the OS preference wins. An inline script in `<head>` applies it before
first paint, so there is never a flash of the wrong palette.

---

## The animated background

`src/lib/signal-field.ts` draws a network of nodes and links on a canvas, with
packets that periodically travel a link and pulse the node they land on. The
pointer repels nearby nodes and brightens the links around it.

It is hand-written rather than a library (~4 KB vs ~25 KB for particles.js) and
carries its own guard rails:

- Never mounts under `prefers-reduced-motion` — a static dot grid renders instead
- Fully stops the rAF loop when the tab is hidden
- Drops packets and repulsion on coarse-pointer or low-core devices
- Sheds nodes automatically if the rolling frame time degrades past ~50fps
- Mounts on `requestIdleCallback`, so it never competes with the hero for LCP

The hero `<h1>` is plain server-rendered HTML and every animation touches only
`opacity`/`transform`. That is what lets the page be this heavy visually while
still holding CLS at 0.

---

## Content model

Four collections, defined in `src/content.config.ts`:

| Collection | Purpose |
|---|---|
| `blog` | The weekly writing |
| `work` | Case studies |
| `services` | Service detail pages |
| `testimonials` | Quotes — the homepage section hides itself when empty |

Case-study metrics whose value is `TODO` are **hidden from visitors** and flagged
in dev, so an unfinished case study is safe to publish and a placeholder can't
quietly become permanent.

Every schema field has a matching widget in `public/admin/config.yml`. If you add
a field, add it in both places — drift there means the CMS writes files that fail
the build.

---

## SEO

- Canonical URLs, per-page meta and Open Graph from `BaseHead.astro`
- JSON-LD `@graph`: `Person` + `WebSite` sitewide, plus `ProfessionalService`,
  `BlogPosting`, `BreadcrumbList`, `FAQPage`, `CollectionPage` per page type
- Auto-generated 1200×630 social cards for every post, case study and main page
- Sitemap, full-text RSS, generated `robots.txt`
- Tag hubs and scored related-posts for internal linking
- Reading time computed at build via a remark plugin

---

## Privacy note

The source CV contains a passport number, date of birth and home address. **None
of it is in this repository or on the site**, and none of it should be added.
The public contact surface is name, city, work email, phone/WhatsApp and GitHub.

The downloadable CV is the `/about` page printed via the browser — see the
`@media print` block in `global.css`. That keeps the CV permanently in sync with
the site and means no document containing personal identifiers is ever hosted.
