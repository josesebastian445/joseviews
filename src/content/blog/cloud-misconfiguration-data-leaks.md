---
title: 'Cloud misconfiguration data leaks: shared links, open buckets, old access'
description: 'Most cloud misconfiguration data leaks come from open sharing links, public storage and ex-staff access. How to find them in Microsoft 365, Google Drive and AWS.'
pubDate: 2026-07-15
tags: ['Security', 'Microsoft 365']
draft: false
featured: false
---

Cloud misconfiguration data leaks are rarely the result of anyone being hacked.
Nobody broke in. Somebody shared a folder with "anyone with the link" three years
ago, the link ended up in an email thread that got forwarded, and now a stranger
can open your salary spreadsheet.

That is the uncomfortable thing about this category. The data was not stolen. It
was left out, by people doing their jobs, using settings that made sharing easy.

## How the attack works now

There is often no attacker in the traditional sense — just exposure, and then
someone who finds it. The common sources I see in small and mid-sized businesses:

**"Anyone with the link" shares.** SharePoint, OneDrive and Google Drive all allow
links that work for anyone, no sign-in required. They are convenient for sending a
file to a client. They never expire unless you set them to, and they can be
forwarded endlessly. A folder link is worse than a file link, because every file
added to the folder later is exposed too.

**Public cloud storage.** An Amazon S3 bucket, Azure storage container or Google
Cloud bucket set to public, usually by a developer during testing. Automated
scanners look for these constantly. Backups and database exports are the usual
contents.

**Exposed databases and admin panels.** A database server, Elasticsearch instance
or admin dashboard reachable from the internet with weak or no authentication. Again,
usually set up "temporarily".

**Former staff and contractors who still have access.** Their Microsoft 365 account
was disabled, but they were also a guest in the client's tenant, or had their own
Google account added to a shared drive, or had files shared to their personal
email. Disabling the company account does not touch any of that.

**Guest accounts nobody reviews.** External users invited for one project, still
present in Teams and SharePoint years later.

**Search makes it worse.** Microsoft Copilot and similar AI tools surface anything
a user has access to. Oversharing that went unnoticed for years becomes visible the
moment someone asks the assistant a question and it helpfully quotes the HR folder.

## Signs you've been hit

- A file or folder of yours turns up somewhere it should not — in a search result,
  in a competitor's hands, or in an email from a security researcher.
- Access logs show file views from anonymous users or unfamiliar accounts.
- A former employee references information they should no longer be able to see.
- Your cloud provider sends an alert about a publicly accessible resource.
- Copilot or an internal search returns documents to people who should not see
  them.

Most of the time there is no sign at all, which is why the controls below are about
finding exposure before someone else does.

## How to protect your business

### 1. Tighten SharePoint and OneDrive sharing settings

In the SharePoint admin centre, set the organisation-wide external sharing level to
"New and existing guests" rather than "Anyone". If you genuinely need anonymous
links, keep them but:

- Set the default link type to "Specific people" or "People in your organisation".
- Set anonymous links to expire automatically, for example after 30 days.
- Allow view-only for anonymous links on folders.

You can set stricter rules per site, so HR and finance sites can block external
sharing entirely while the projects site stays more open.

### 2. Do the same in Google Workspace

In the Admin console, restrict Drive sharing outside the organisation, warn users
when they share externally, and disable "anyone with the link" for sensitive
organisational units. Shared drive settings can prevent members from adding
external users.

### 3. Run a sharing report and clean up

Both platforms can report on files shared externally or via anonymous link.
Microsoft provides data access governance reports in SharePoint advanced
management, and simpler sharing reports per site; Google has Drive audit logs and
the security investigation tool depending on your edition. Export the list, sort
by sensitivity, and remove links that are no longer needed. Expect this first pass
to be long.

### 4. Do access reviews on a schedule

Every quarter, review guest users and remove the ones no longer needed. Microsoft
Entra ID has access reviews built in for higher licence tiers; otherwise a simple
export and a person going through it works. Set guest accounts to expire
automatically if your licensing allows.

Add one line to your offboarding checklist: check what the leaver shared
externally and what they were a guest in.

### 5. Block public access on cloud storage by default

In AWS, turn on S3 Block Public Access at the account level. In Azure, disable
anonymous blob access on storage accounts. In Google Cloud, enforce public access
prevention. These are account-wide guardrails that stop a single misclick from
exposing a bucket. If something genuinely needs to be public — website assets —
put it in a separate, clearly named location.

### 6. Keep databases and admin panels off the internet

Databases should listen only on private networks or behind a VPN or ZTNA. If a
developer needs access, give it to them through a bastion host or an identity-aware
proxy, not by opening a port. Run an external scan of your own IP ranges and
domains occasionally, to see what the internet sees.

### 7. Label sensitive data

Microsoft Purview sensitivity labels, or Google's data classification labels, let
you mark HR, finance and client files so they cannot be shared externally even by
mistake. Start with one or two labels — "Confidential" and "Internal" — rather than
a complicated scheme nobody uses.

## What to do if it already happened

1. **Remove the exposure first.** Delete the link, make the bucket private, close
   the port. Do this before anything else.
2. **Check the logs** to see who accessed it and when. SharePoint and Google Drive
   audit logs, and cloud storage access logs if they were turned on.
3. **Work out what was exposed** and whether it includes personal data, credentials
   or financial information. Rotate any passwords, keys or tokens in the files.
4. **Review everything else the same person or process created** — one open link
   rarely exists alone.
5. **Take advice on notification.** The UAE personal data protection law, and the
   separate regimes in DIFC and ADGM, may require you to notify a regulator and
   affected individuals depending on what leaked.

## What this doesn't cover

This post covers accidental exposure. It does not cover accounts taken over through
phishing — for that, see [AiTM phishing and MFA bypass](/blog/aitm-phishing-mfa-bypass)
and [OAuth consent phishing](/blog/oauth-consent-phishing-microsoft-365). It also
does not cover data loss prevention for regulated industries, which needs more
than sharing settings.

---

If you would like a sharing and guest access review across your Microsoft 365 or
Google Workspace tenant, [get in touch](/contact). The first report is usually
surprising, and the clean-up is far easier before a leak than after one.
