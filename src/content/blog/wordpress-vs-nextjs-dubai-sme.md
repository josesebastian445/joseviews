---
title: 'WordPress or Next.js? An honest answer for a Dubai SME'
description: 'Most comparisons are written by people selling one of the two. Here is how I actually decide, based on who edits the site and what it has to do.'
pubDate: 2026-08-05
tags: ['WordPress', 'Next.js', 'Web Development']
draft: false
featured: true
---

Every few weeks someone asks me whether they should build on WordPress or move to
something modern like Next.js. The honest answer is that the question is usually
framed wrong. The platform is downstream of two things: **who edits the site**, and
**what the site has to do beyond displaying pages.**

Here is the decision as I actually make it.

## Start with who edits it

This matters more than any technical consideration.

If your marketing coordinator needs to publish a promotion on Thursday afternoon
without opening a support ticket, you need a real CMS with a real editor. WordPress
does this better than almost anything, and it has done for fifteen years. Fighting
that is stubbornness, not engineering.

If content changes rarely, or changes only through you, that constraint disappears
and faster options open up.

## Then ask what it has to do

Sort your site into one of three buckets:

**Bucket one — it shows information.** Company site, service pages, a blog,
contact form. Perhaps a few hundred pages.

**Bucket two — it sells things.** Product catalogue, cart, checkout, payment
gateway, stock levels, order emails.

**Bucket three — it does work.** Accounts, dashboards, quotes, bookings, anything
where a user logs in and the site behaves differently for them.

## The actual recommendation

| Bucket | Editors are non-technical | Editors are technical |
|---|---|---|
| Shows information | WordPress, hardened | **Astro** |
| Sells things | **WooCommerce** or Shopify | Next.js + a commerce backend |
| Does work | Next.js with a headless CMS | **Next.js** |

That is genuinely most of it. The interesting cases are the edges.

### When I move a brochure site off WordPress

When speed is a business requirement rather than a preference. If you are competing
on local search in a crowded category, and your competitors all load in four
seconds, being the one that loads in under one is a real advantage — and it is much
easier to hold that with Astro than to fight a WordPress theme into shape every
time a plugin updates.

Astro also removes a maintenance surface entirely. There is no PHP, no database, no
plugin ecosystem waiting to be exploited. For a site that changes twice a month,
that trade is very often worth it. You still get a proper editor if you pair it with
a Git-based CMS — this site runs exactly that way.

### When I keep WordPress despite the temptation

When there are more than about five people who touch the content, or when the
business already runs on WordPress plugins that would each need replacing. Rebuilding
a working WooCommerce store as a headless commerce project is a six-figure decision
dressed up as a technical upgrade.

Hardened WordPress on decent hosting behind Cloudflare, with a caching layer and a
disciplined plugin diet, is genuinely fast. Most slow WordPress sites are not slow
because of WordPress. They are slow because of a page builder, thirty-one plugins
and six unoptimised hero images.

### When Next.js earns its keep

When the site is an application. Customer portals, booking systems, anything with
authentication and per-user state. At that point you are writing software, and you
want a framework designed for it rather than a CMS bent into that shape.

## The question nobody asks

**Who maintains it in eighteen months?**

A Next.js site built by a contractor who then becomes unreachable is worse than a
WordPress site any local developer can pick up. Choose the platform your future
self, or your future agency, can actually operate.

This is the single most common expensive mistake I see in Dubai. A company pays for
a beautiful custom build, the developer moves on, and two years later nobody can
change the phone number in the footer without a quote.

## The short version

- Non-technical editors, ordinary content site → **WordPress**, properly hardened
- Technical editors, speed matters → **Astro**
- Selling products → **WooCommerce**, unless you have outgrown it
- Users log in and do things → **Next.js**
- Nobody to maintain it → the boring option, every time

If you are weighing this up for a specific site, [send me the URL](/contact) and I
will tell you which bucket it is in. It usually takes about ten minutes to work out.
