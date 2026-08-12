# josesebastian-site

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
