# Writing and publishing

Everything you need to keep the site fed, in one place. If you only read one
section, read [The weekly loop](#the-weekly-loop).

---

## The weekly loop

1. Open **`https://joseviews.com/admin`** and sign in with GitHub.
2. **Blog posts → New Blog post.**
3. Fill in the title, meta description, date and tags. Write the post.
4. Leave **Draft** on until you're happy. Toggle it off to publish.
5. Hit **Publish**. That commits to GitHub, Cloudflare rebuilds, and the post is
   live in roughly a minute.

No terminal, no git, no deployment step. If the editor won't load, the config is
at `public/admin/config.yml` and the setup steps are in `DEPLOYMENT.md`.

---

## What makes a post worth publishing

The blog exists to bring in work. That happens when a post answers a question
someone would type into Google before hiring you.

**Good post shapes, in rough order of how well they convert:**

- *"How I fixed X"* — a real problem from a real client, anonymised. These build
  trust faster than anything else because they prove you've seen the problem before.
- *"X vs Y for [specific situation]"* — comparison posts catch people mid-decision,
  which is exactly when they're about to hire someone.
- *"The checklist I use for X"* — demonstrates process. Easy to write, ages well,
  and gets bookmarked.
- *"Why your X is slow/broken/not ranking"* — diagnostic posts attract people who
  already know they have a problem.

**What to avoid:** news roundups (nobody searches for them), "10 tips" listicles
with no specifics, and anything you'd have to research from scratch. Write what
you already know.

### Target one search phrase per post

Before writing, decide the phrase someone would actually type. Then:

- Put it in the **title**, naturally.
- Put it in the **meta description**.
- Use it in the **first paragraph**.
- Use it as an **H2** somewhere if it fits.

Don't repeat it mechanically. One natural use per section is plenty — modern
Google is good at synonyms and bad at rewarding stuffing.

### Length

Whatever the topic needs. A sharp 700-word answer beats a padded 2,500-word one.
That said, posts that rank for competitive terms tend to be 1,200–2,000 words,
because that's what it takes to actually answer the question completely.

### Always end with a call to action

Every post should close with a line inviting the reader to get in touch, linked
to `/contact`. The seeded posts all do this — copy the pattern.

---

## Field reference

What the CMS asks for, and what it's for.

| Field | Rules | Where it shows |
|---|---|---|
| **Title** | Under 80 characters | Page `<h1>`, browser tab, Google result, social card |
| **Meta description** | 50–180 characters, enforced | Google result snippet, social card, post cards |
| **Publish date** | Any date | Sort order, article schema, RSS |
| **Last updated** | Only for meaningful revisions | Shown as "Updated", signals freshness to Google |
| **Hero image** | Optional, ideally 1600×900 | Top of the post, blog cards |
| **Hero alt text** | Describe the image | Screen readers, image search |
| **Tags** | 2–3, reuse existing ones | Tag pages, related posts |
| **Draft** | On by default | Draft posts never reach the live site |

**On tags:** every distinct tag creates a page at `/blog/tag/<tag>`. Three tags
used across twelve posts is a useful topic hub. Twelve tags used once each is
twelve thin pages, which is worse than none. Reuse aggressively.

---

## Images

- **Hero images:** 1600×900 or wider. Astro converts and resizes automatically —
  you never need to make multiple sizes.
- **In-post images:** upload at the size you want them read at, up to about 1400px.
- **Alt text on everything.** Describe what's in the image. It's not a keyword slot.
- Screenshots beat stock photography every time. A real dashboard with the client
  name blurred is worth more than a photo of someone pointing at a laptop.

Uploads land in `src/assets/uploads/` and get optimised at build time.

---

## Case studies

Same editor, **Case studies** collection.

**The only rule that matters: don't publish a number you can't evidence.**

Metrics left as `TODO` are automatically hidden from visitors, so an unfinished
case study is safe to publish — it just shows without the metrics band. But an
invented percentage on a site selling SEO honesty is a liability, and it's the
kind of thing a sharp prospect will ask you to back up on a call.

Get numbers from Search Console, Analytics, or the client directly. If you can't,
delete the metric and let the writing carry the case study.

**Structure that works:** the situation → what you did → the result. Keep "what
you did" specific. "Improved SEO" says nothing; "consolidated four hosting
accounts and put Cloudflare in front of all of them" says you know what you're
doing.

---

## Testimonials

The homepage section stays hidden until at least one exists — so the site never
looks like it's missing something.

Ask for them right after you deliver something that worked. The highest-response
version is offering to write the draft yourself:

> "Glad that sorted it. Would you mind if I put a couple of lines on my site
> about it? Happy to draft something for you to edit."

That turns a writing task into an approval task, which roughly triples the
response rate.

---

## Editing without the CMS

If you'd rather work locally:

```bash
npm run dev
```

Posts are plain Markdown in `src/content/blog/`. Create a file, add the
frontmatter block, write, commit, push. The frontmatter fields are exactly the
ones in the table above.

Draft posts are visible at `localhost:4321` but excluded from production builds,
so you can preview work in progress properly.

---

## A publishing rhythm that survives busy weeks

Weekly is ambitious and most people quit by week six. What actually works:

- **Keep a running list** of things you fixed this week that took more than an
  hour to figure out. That list is your content calendar.
- **Draft in one sitting, publish in another.** Editing your own writing the same
  day it's written doesn't work.
- **Bank two posts ahead.** The week you're too busy to write is the week the
  streak breaks, and streaks are most of the value.
- **Publishing something short beats publishing nothing.** A tight 600-word post
  is a real post.
