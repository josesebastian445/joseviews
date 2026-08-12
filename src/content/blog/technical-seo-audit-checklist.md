---
title: 'The 12-point technical SEO audit I run before touching a site'
description: 'Before any keyword research, I check twelve things. Most sites fail at least four of them, and fixing those usually moves rankings more than new content does.'
pubDate: 2026-08-10
tags: ['SEO', 'Technical SEO', 'Audit']
draft: false
featured: true
---

When someone asks me to "do their SEO", the first thing I do is not keyword
research. It is a technical pass, because there is no point writing content for a
site Google struggles to crawl, render or trust.

This is the list I work through, roughly in order. It takes about two hours with
Screaming Frog, Search Console and PageSpeed Insights open.

## 1. Is it actually indexable?

Sounds obvious. It is not. I check for a stray `noindex` in the page head, a
`Disallow: /` left in `robots.txt` from the staging site, and whether the canonical
tag on each page points at itself rather than the homepage.

I have found a `noindex` sitewide on a live site more than once. It is usually a
staging setting that shipped. It costs everything and takes ninety seconds to fix.

## 2. One canonical version of every URL

`https://example.com`, `http://example.com`, `https://www.example.com` and
`https://example.com/index.php` should all resolve to exactly one address with a
301. Trailing slash handling should be consistent.

Every duplicate splits your signals.

## 3. XML sitemap that matches reality

The sitemap should contain the URLs you want indexed and nothing else — no
redirects, no 404s, no `noindex` pages, no tag archives you do not care about.
Then confirm it is referenced in `robots.txt` and submitted in Search Console.

## 4. Core Web Vitals on mobile, on real data

Lab scores are a diagnostic tool. The number that counts is the **field data** in
Search Console's Core Web Vitals report, because that is real visitors on real
phones on real networks.

I look at Largest Contentful Paint first. It is usually a hero image that has not
been compressed, or a font loading strategy that blocks rendering.

## 5. Render check, not just source check

Fetch the page with JavaScript disabled. If your content only appears after JS
runs, Google will probably still index it — eventually, and less reliably. For a
content site there is rarely a good reason to accept that risk.

## 6. Internal linking depth

Every important page should be reachable within three clicks of the homepage.
Screaming Frog gives you crawl depth in one column. Anything sitting at depth five
or more is effectively invisible, no matter how good it is.

Orphan pages — in the sitemap but linked from nowhere — are the same problem in a
worse form.

## 7. Heading structure that means something

One `<h1>` per page, describing that page. Then `<h2>` and `<h3>` in a logical
order without skipping levels. This is as much an accessibility fix as an SEO one,
and it is a reliable indicator of general build quality: sites that get this wrong
usually get other things wrong too.

## 8. Title tags and meta descriptions, written for humans

Every page needs a unique title under about 60 characters that leads with the thing
people search for. Descriptions do not directly affect ranking, but they affect
click-through rate, which is the metric that actually matters.

Duplicates across pages are a symptom of a template writing them automatically.
Fix the template.

## 9. Structured data that validates

At minimum: `Organization` or `Person`, `BreadcrumbList`, and `Article` on blog
posts. `LocalBusiness` if you have a physical location — important in the UAE
market. Run it through Google's Rich Results Test and fix every error before
worrying about warnings.

## 10. Image weight and alt text

Images are almost always the largest thing on the page. Modern format, sized for
the container rather than the original camera resolution, lazy-loaded below the
fold, and given `width` and `height` attributes so nothing shifts as they load.

Alt text describes the image. It is not a place to put keywords.

## 11. HTTPS everywhere, with no mixed content

Valid certificate, HTTP redirecting to HTTPS, and no assets loading over plain HTTP
inside an HTTPS page. Add HSTS once you are confident. Check the certificate expiry
and whether renewal is automated — an expired certificate takes a site down
completely, and it happens on a schedule you can predict.

## 12. Local signals, if you serve a city

For UAE businesses this is often the highest-leverage item on the whole list.
Google Business Profile complete and verified, name/address/phone consistent
everywhere they appear, and location pages that say something specific rather than
being one template with the city name swapped.

## What I do with the results

Everything goes in a sheet with three columns: **effort**, **impact**, and
**owner**. High impact and low effort gets done this week. Low impact and high
effort probably never gets done, and saying so out loud is more useful than leaving
it on a list to feel comprehensive.

A 90-page audit PDF that nobody reads is not a deliverable. A prioritised list of
twelve things with names against them is.

---

If you want a second opinion on a site, [send me the URL](/contact). I will run this
pass and tell you what I find — including if the answer is that it is already in
good shape.
