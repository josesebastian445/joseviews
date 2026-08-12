---
title: 'A security baseline for a small Dubai office that takes one afternoon'
description: 'Not a compliance framework. Nine practical controls covering firewall, backups, Microsoft 365 and website hardening that a 10 to 50 person office can put in place this week.'
pubDate: 2026-07-28
tags: ['Security', 'IT Infrastructure', 'Cloudflare']
draft: false
featured: false
---

Most small offices I walk into have no security baseline. Not a bad one — none.
There is a router the ISP supplied, a shared admin password, and a backup someone
set up in 2021 that nobody has restored from since.

This is not a compliance framework. It is the set of controls that would have
prevented every incident I have personally cleaned up, and a competent person can
put most of it in place in an afternoon.

## 1. Get the firewall off default settings

If you have a FortiGate or similar, change the admin password, disable WAN-side
management, and turn on the logging you are already paying for. If you are running
the ISP's router as your only perimeter, that is your first purchase.

Segment the guest Wi-Fi from the office network. It is a five-minute change and it
means a compromised visitor laptop cannot see your file server.

## 2. Enforce MFA on Microsoft 365

Not "enable". **Enforce**, through a Conditional Access policy, with no
per-user exceptions for the managing director. Business Email Compromise is the
most common attack against a small UAE business, and MFA stops nearly all of it.

While you are in there: block legacy authentication protocols. They exist to bypass
exactly the control you just turned on.

## 3. Backups you have actually restored

A backup is a hypothesis until you restore from it. Pick a file, restore it, note
the date you did so. Then do it again in six months.

Follow 3-2-1: three copies, two different media, one off-site. For Microsoft 365
specifically, note that Microsoft does **not** back up your data in the sense you
mean — retention policies are not backups, and a deleted mailbox is gone once the
retention window closes.

## 4. Put Cloudflare in front of the website

Free tier is enough for most offices. You get DDoS protection, a WAF, and TLS
without managing certificates yourself.

Turn on: **Always Use HTTPS**, **Automatic HTTPS Rewrites**, and a rate-limiting
rule on the login path. If you run WordPress, rate-limit `/wp-login.php` and
`/xmlrpc.php` specifically. That single rule eliminates the overwhelming majority
of automated attacks against a WordPress site.

## 5. Patch on a schedule, not on an incident

Operating systems and browsers on automatic updates. WordPress core, themes and
plugins updated on a staging copy first, then production, on a fixed day each
month.

Uninstall — do not just deactivate — every plugin you are not using. Deactivated
plugins still contain exploitable code sitting in your filesystem.

## 6. Stop sharing accounts

The shared `admin@company.ae` login used by four people is the reason you cannot
tell who did what. Individual accounts, roles that reflect what each person
actually needs, and a password manager so nobody has to remember them.

Offboarding then becomes one action instead of an archaeology project.

## 7. Know what you own

A simple sheet: every domain, hosting account, SaaS subscription, and who holds the
credentials. Add the renewal dates.

I have watched a business lose a domain because the renewal notice went to a
personal email address belonging to someone who left two years earlier. Recovery
took weeks and cost more than a decade of renewals.

## 8. Turn on monitoring you will actually notice

Uptime monitoring on the website with alerts to a channel someone reads. Certificate
expiry alerts. Failed-backup alerts.

An alert nobody sees is not monitoring. Route them somewhere with a human attached.

## 9. Write the incident plan on one page

Who to call, in what order, and where the credentials are kept. Whether you have
cyber insurance and what the notification requirement is. How to reach the hosting
provider outside business hours.

One page. Printed, because the scenario where you need it may be the scenario where
you cannot log in to read it.

## What this does not cover

This is a baseline, not a security programme. It does not cover endpoint detection,
formal risk assessment, penetration testing, or anything a regulated entity needs.
If you handle payment card data or operate under a specific UAE regulatory regime,
you need considerably more than this and you need it documented.

But if you have none of the above, doing these nine things this week puts you ahead
of most offices your size — and it removes the failure modes that actually cause
weekend emergencies.

---

If you want someone to work through this list with you, [get in touch](/contact).
It is usually a one-day engagement, and the documentation you get out of it is worth
more than the configuration changes.
