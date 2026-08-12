---
title: Rebuilding a multi-site web estate on a modern stack
client: Best Solution Services
year: 2022–present
order: 1
featured: true
summary: >-
  Took over a sprawling set of corporate and client sites, consolidated the
  hosting, and rebuilt the front ends on WordPress, Next.js and Astro with
  security and SEO handled as part of the build rather than afterwards.
services:
  - Web development
  - SEO
  - IT security
  - CRM automation
stack:
  - WordPress
  - Next.js
  - Astro
  - React
  - Cloudflare
  - FortiGate
metrics:
  - label: Sites under management
    value: 'TODO'
  - label: Average load time
    value: 'TODO'
  - label: Organic traffic change
    value: 'TODO'
  - label: Security incidents
    value: 'TODO'
---

## The situation

Corporate and client sites had accumulated across several hosting accounts over
a number of years, each set up by whoever happened to be available at the time.
There was no shared deployment process, no consistent backup policy, and no
single place to see what was running where.

Nothing was on fire. That is usually the problem — an estate like this degrades
quietly until an SSL certificate expires on a Friday evening.

## What I did

**Inventory first.** Before changing anything I documented every domain, host,
DNS zone, certificate and admin account. A surprising amount of the value here
was simply knowing what existed.

**Consolidated hosting and put Cloudflare in front of everything.** DNS,
certificates, WAF rules and caching moved to one control plane. FortiGate handles
the office network side.

**Rebuilt front ends per use case.** Marketing sites that the team edits weekly
stayed on WordPress with a hardened configuration. Sites where speed was the
whole point moved to Astro. Anything with real application logic went to Next.js.

**Version control and CI/CD.** Everything now lives in GitHub with automated
deployment, so a change is a reviewable commit rather than an FTP upload someone
made at 11pm.

**CRM and automation.** Enquiries flow into a CRM with the marketing workflows
automated, so leads stop dying in a shared inbox.

## The result

The durable outcome here is process rather than a single number. Every site is
documented, backed up, monitored and deployable by someone other than me. Updates
happen on a schedule instead of in response to a complaint, and when something
does break there is a known place to look.

That is the part that survives staff turnover, and it is the reason this has been
a multi-year engagement rather than a project with an end date.
