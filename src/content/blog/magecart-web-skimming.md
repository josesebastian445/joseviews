---
title: 'Magecart web skimming: how checkout pages get skimmed and how to stop it'
description: 'Magecart web skimming steals card details straight from your checkout page. How it works on WooCommerce, Magento and Shopify, the signs, and the controls that stop it.'
pubDate: 2026-08-12
tags: ['Security', 'Web Security']
draft: false
featured: false
---

Magecart web skimming is the attack where someone adds a few lines of JavaScript to
your checkout page and quietly copies every card number your customers type. The
order goes through. The payment clears. Nothing looks wrong — until the bank calls,
or a customer does.

It is named after early attacks on Magento stores, but it is not a Magento problem.
I see the same pattern on WooCommerce, on custom PHP shops, and on sites where the
payment page itself is fine but a third-party script loaded on it is not.

## How the attack works now

The goal is simple: get attacker-controlled JavaScript to run in the customer's
browser on any page where payment or personal details are entered. There are three
common routes in.

**Compromise the site itself.** A vulnerable plugin, an outdated Magento extension,
or a stolen admin password gives the attacker write access. They inject the skimmer
into a theme file, a database setting that outputs footer scripts, or a fake
plugin. On WordPress this often rides on the same weaknesses I covered in
[WordPress plugin vulnerabilities](/blog/wordpress-plugin-vulnerabilities).

**Compromise something the site loads.** Chat widgets, analytics, A/B testing
tools, review badges, tag managers. If one of those vendors is breached, or a
domain they used expires and is re-registered, the script your checkout loads
changes underneath you. You did nothing wrong and you are still the one leaking
cards.

**Abuse the tag manager.** If someone gets into your Google Tag Manager or similar
container, they can publish a skimmer without touching your server at all. Your
file integrity checks see nothing.

Modern skimmers are careful. They only activate on checkout URLs, skip visitors who
look like admins or scanners, and send data to domains named to look like
analytics or CDN endpoints. Some replace the real payment form with a fake one, collect the card,
show an error, and then let the customer retry on the genuine form. The customer
assumes they mistyped.

## Signs you've been hit

Skimming rarely announces itself. The signs usually arrive from outside:

- Your payment provider or acquiring bank contacts you about a "common point of
  purchase" — several stolen cards that all shopped with you.
- Customers report fraud on cards they only used on your site.
- Customers mention the payment form failing once and working on the second try.
- Unfamiliar domains in your page source or browser network tab on the checkout
  page, especially ones that only appear there.
- Theme, plugin or core files modified on dates when nobody deployed anything.
- New admin users, new tags in your tag manager, or a "custom JavaScript" setting
  you did not add.

If you only check the page from your own logged-in browser, you may never see it.
Test from a clean browser, logged out, on the actual checkout flow.

## How to protect your business

### 1. Take card entry off your page entirely

The single most effective control is to make sure card numbers are never typed into
a page you control. Use your payment provider's hosted payment page, or hosted
payment fields where each card input is an iframe served from the provider's
domain. Scripts on your page cannot read inside those iframes.

This does not make you immune — a skimmer can still overlay a fake form — but it
removes the easy path and shrinks what you have to defend. If your developer built
a custom card form that posts card data to your own server, change that first.

### 2. Content-Security-Policy and Subresource Integrity

A Content-Security-Policy header tells the browser which domains are allowed to
serve scripts and receive data from your pages. A tight policy on checkout pages —
`script-src` and `connect-src` limited to your own domain and your payment
provider — means an injected script either will not load or cannot send what it
steals anywhere.

Start in report-only mode, watch what breaks, then enforce. Use Subresource
Integrity (`integrity="sha384-..."`) on third-party scripts loaded from a fixed URL
so the browser refuses them if the content changes. SRI does not work for scripts
the vendor updates constantly, which is a reason to question whether those belong
on a checkout page at all.

### 3. Strip the checkout page down

Every third-party script on the payment page is a vendor you are trusting with card
data. Chat widgets, heatmaps and marketing pixels rarely need to be there. Remove
them from checkout and order-confirmation templates, and keep the script list short
enough that someone can actually review it.

### 4. File integrity monitoring and script monitoring

Monitor the files that matter — theme, core, extension code — and alert on any
change outside a deployment. Pair that with something that watches what the
browser actually loads on checkout, because a tag manager or third-party
compromise never touches your files. Several services do client-side script
monitoring; for a small shop, even a scheduled job that loads the checkout page
headless and diffs the list of script sources is better than nothing.

### 5. Lock down admin access

MFA on the store admin, hosting panel, tag manager and payment provider dashboard.
Individual accounts, not shared logins. Restrict admin paths by IP or put them
behind Cloudflare Access. Many skimming incidents start with a reused password, so
the guidance in [credential stuffing protection](/blog/credential-stuffing-protection)
applies directly.

### 6. Patch the platform on a schedule

Magento/Adobe Commerce, WooCommerce and their extensions get security releases
regularly, and skimming groups move on them quickly. Patch on a fixed cadence,
staging first, and remove extensions you no longer use. On Shopify the platform is
patched for you, but apps and custom scripts in the theme are still your
responsibility.

### 7. Know your PCI DSS obligations

If you take card payments, your acquirer will expect some level of PCI DSS
compliance. Current versions of the standard explicitly require an inventory of
scripts on payment pages and a mechanism to detect unauthorised changes. Even if
your self-assessment is the short form, those two controls are worth doing for
their own sake.

## What to do if it already happened

1. **Do not wipe anything yet.** Take a full copy of the site files, database and
   web server logs. You will need them to work out when it started.
2. **Remove the skimmer and close the entry point.** Restore known-good code,
   rotate every admin, hosting, database and tag manager credential, and patch
   whatever was exploited. Removing the script without fixing the hole means it
   comes back.
3. **Switch to hosted payment fields** if you were not already using them.
4. **Contact your payment provider and acquiring bank.** They will tell you what
   forensic investigation and reporting they require. Do this early; it goes
   worse if they find out from card network fraud reports first.
5. **Work out the exposure window** from logs and file timestamps, so you know
   which customers to notify.
6. **Take legal advice on notification.** Under the UAE's personal data protection
   framework, and depending on whether you sit in a free zone such as DIFC or ADGM
   with its own data protection law, you may have obligations to notify a regulator
   and affected customers.

---

If you run an online store and are not sure what is loading on your checkout page,
[get in touch](/contact). A checkout script review and CSP rollout is usually a
short piece of work, and it is far cheaper than a forensic investigation.
