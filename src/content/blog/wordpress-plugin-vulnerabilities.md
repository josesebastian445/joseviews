---
title: 'WordPress plugin vulnerabilities: how small business sites really get hacked'
description: 'Vulnerable, abandoned and nulled WordPress plugins are how most small business sites get hacked. Here is how the attack works and the update workflow that prevents it.'
pubDate: 2026-08-19
tags: ['Security', 'Web Security']
draft: false
featured: false
---

When a small business WordPress site gets hacked, the cause is rarely WordPress
itself. Core is well maintained and updates itself. The cause is almost always a
plugin or theme — one that was out of date, abandoned by its developer, or
downloaded "free" from somewhere it should not have been.

WordPress plugin vulnerabilities are the main way these sites get compromised.
The good news is that the fix is mostly process, not technology.

## How the attack works now

A vulnerability is found in a plugin. The developer releases a fix, and the
vulnerability is published in databases like Wordfence, Patchstack and WPScan. That
publication is the starting gun. Attackers compare the patched and unpatched code,
work out the exploit, and start scanning the internet for sites still running the
old version. For popular plugins, that scanning can begin within hours.

The scanning is automated. Nobody chose your site. A bot found a version number
it recognised and tried the exploit.

The usual payloads:

- **A new administrator account**, quietly added for later use.
- **A backdoor file** in the uploads folder or disguised as a plugin.
- **Injected JavaScript** that redirects visitors to scam pages, or skims payment
  forms on WooCommerce checkouts — see [Magecart web
  skimming](/blog/magecart-web-skimming).
- **Spam pages** injected for SEO, often only visible to Google, which is how many
  owners first find out — their site appears in search results for pharmacy or
  casino terms. This feeds [malvertising and SEO
  poisoning](/blog/malvertising-seo-poisoning) campaigns.

### Abandoned plugins

A plugin that stops receiving updates is a vulnerability waiting to be found. When
one is discovered, nobody fixes it. WordPress.org closes plugins with unresolved
security issues, but a closed plugin stays installed on every site that already has
it, and the dashboard does not always make it obvious.

### Nulled plugins and themes

A "nulled" plugin is a paid plugin with the licence check removed, shared on
download sites. Many of them have a backdoor added. You are installing the
attacker's code yourself, and it will never get legitimate updates. There is no
safe source for nulled software.

## Signs you've been hit

- **Admin users you did not create**, often with plausible names.
- **Visitors, especially on mobile, getting redirected** to other sites — sometimes
  only on the first visit or only from Google.
- **Strange search results** for your domain: pages in other languages or about
  products you do not sell. Check with `site:yourdomain.ae` in Google.
- **Google Search Console security warnings**, or a browser "deceptive site" page.
- **PHP files in `wp-content/uploads`**, which should only contain media.
- **Your host suspends the site** for sending spam or hosting malware.
- **Unexpected changes** to files, `.htaccess` or `wp-config.php`.

## How to protect your business

### 1. Remove what you don't use

Every plugin is code you are trusting. Go through the list and uninstall —
not deactivate — anything that is not doing a job. Deactivated plugins remain on
disk and can still be exploited. Remove unused themes too, keeping one default
theme as a fallback.

Fewer plugins means fewer updates, fewer conflicts and a smaller attack surface.

### 2. Check every plugin is still maintained

For each plugin, check when it was last updated and whether it has been closed on
WordPress.org. A plugin with no updates in a long time, or tested only on old
WordPress versions, needs replacing. Do this before adding a plugin as well as
after.

### 3. Only install from trustworthy sources

WordPress.org, or directly from the developer's own site with a paid licence. No
nulled plugins, no "free premium theme" downloads. Paying for the licence is the
cheapest security control on this list.

### 4. Update on a schedule, with a staging copy

A workable routine for a small business site:

1. Take a backup and confirm it completed.
2. Apply updates on a staging copy of the site.
3. Click through the important pages: home, contact form, checkout if you have one.
4. Apply the same updates to production.
5. Check the live site again.

Do this on a fixed day, at least monthly. For security releases, do it within a
day or two — that is the window before mass scanning starts.

For simple, low-risk plugins, enabling WordPress's automatic updates is reasonable.
For complex ones like WooCommerce or page builders, use the staging routine.

### 5. Subscribe to vulnerability alerts

A security plugin or a vulnerability alert service that tells you when a plugin
you run has a known issue turns "we update monthly" into "we update when it
matters". Several of the vulnerability databases offer this, some for free.

### 6. Put a WAF in front of the site

Cloudflare in front of the site gives you a web application firewall that can
block common exploit attempts before they reach WordPress. The free plan includes
a managed ruleset; paid plans add the broader WordPress-specific rules. Add a rate
limit on `/wp-login.php` and `/xmlrpc.php` — the login side of this is covered in
[credential stuffing protection](/blog/credential-stuffing-protection).

A WAF buys time. It is not a substitute for updating.

### 7. Harden the basics

- Add `define('DISALLOW_FILE_EDIT', true);` to `wp-config.php` so the dashboard
  cannot be used to edit plugin and theme code.
- Individual admin accounts with MFA, and as few administrators as possible.
- Block PHP execution in the uploads folder at the server or host level.
- Keep PHP itself on a supported version.

## What to do if it already happened

1. **Take a full backup of the hacked site** before changing anything. You need it
   for investigation, even though you will not restore from it.
2. **Put the site into maintenance mode** or take it offline if it is redirecting
   visitors or skimming payments.
3. **Change every credential:** WordPress admin accounts, hosting control panel,
   FTP/SFTP, database password, and the salts in `wp-config.php`.
4. **Find the entry point.** Check plugin versions against known vulnerabilities.
   If you do not find the cause, the attacker will be back.
5. **Clean or rebuild.** Restoring a clean backup from before the compromise and
   then updating is often faster than cleaning. Reinstall core, plugins and themes
   from clean sources, and remove unknown users and files.
6. **Request a review** in Google Search Console once clean, so warnings come off.
7. **If customer or payment data may have been exposed,** take advice on
   notification and inform your payment provider.

## What this doesn't cover

This is about the WordPress layer. If the hosting account itself is compromised,
or the server is shared with other hacked sites, cleaning WordPress will not be
enough. And for a business that needs a site it rarely has to maintain, it is worth
asking whether WordPress is the right platform at all.

---

If your WordPress site needs a plugin audit, an update routine someone actually
follows, or cleaning up after a hack, [get in touch](/contact). Ongoing maintenance
is part of the [services](/services) I offer.
