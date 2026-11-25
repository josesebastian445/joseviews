---
title: 'Email spoofing and DMARC setup: SPF, DKIM and DMARC for a small business'
description: 'How to stop email spoofing of your domain: a practical SPF, DKIM and DMARC setup with example DNS records, and how to move safely from p=none to reject.'
pubDate: 2026-08-26
tags: ['Security', 'Email Security']
draft: false
featured: false
---

If someone can send an email that says it is from `accounts@yourcompany.ae`, and
your clients' mail servers accept it, you have an email spoofing problem. It is the
foundation of a lot of invoice fraud, and it is fixable with three DNS records.

This is the DMARC setup I use for small businesses: SPF, DKIM and DMARC, in that
order, with DMARC tightened in stages so nothing legitimate breaks. It also covers
lookalike domains, which DMARC does not stop.

## How the attack works now

There are two versions.

**Exact-domain spoofing.** The attacker sends mail with your real domain in the
From address. Without DMARC, many receiving servers have no clear instruction about
what to do with mail that fails authentication, and some of it gets delivered.

**Lookalike domains.** The attacker registers something close — `yourcornpany.ae`,
`yourcompany-ae.com`, `yourcompany.co` — sets up proper SPF, DKIM and DMARC on it,
and sends perfectly authenticated mail. It passes every technical check because it
is their domain. It works because people read quickly.

Both are used in [business email compromise](/blog/business-email-compromise-uae):
an email "from you" to a client asking them to pay a new bank account, or "from a
supplier" to your accounts team.

The major mailbox providers now require SPF, DKIM and DMARC from bulk senders, and
mail without them is increasingly filtered. So this is also about deliverability,
not only security.

## Signs you've been hit

- **Clients mention emails from you that you did not send**, often about
  payments or invoices.
- **Bounce messages** arriving for mail you never sent — the backscatter from
  spoofed messages being rejected.
- **DMARC aggregate reports** (once you have them) showing your domain used from
  servers you do not recognise.
- **Your legitimate mail landing in spam**, which can be a sign your
  authentication is missing or broken.

## How to protect your business

### 1. List everything that sends as your domain

Before touching DNS, write down every service that sends email with your domain in
the From address: Microsoft 365 or Google Workspace, the website contact form, the
newsletter platform, the accounting or invoicing software, the CRM, the ticketing
system. Missing one is how DMARC breaks legitimate mail.

### 2. Publish SPF

SPF lists the servers allowed to send for your domain. You can have only one SPF
record per domain. For a Microsoft 365 business that also uses a newsletter tool:

```
yourcompany.ae.  TXT  "v=spf1 include:spf.protection.outlook.com include:servers.mcsv.net -all"
```

For Google Workspace, the include is `include:_spf.google.com`. Use whatever
include your other providers document.

SPF has a limit of ten DNS lookups. Every `include` counts, and so do the includes
inside it. Exceed it and SPF fails for everyone. If you are close, remove services
you no longer use before reaching for flattening tools.

### 3. Turn on DKIM

DKIM signs each message so the receiver can check it was not altered and came from
an authorised sender. Each sending service gives you its own records to publish.

In Microsoft 365, you enable DKIM for your domain in the Defender portal, which
gives you two CNAME records:

```
selector1._domainkey.yourcompany.ae.  CNAME  <value shown in the Defender portal>
selector2._domainkey.yourcompany.ae.  CNAME  <value shown in the Defender portal>
```

Copy the targets exactly as shown — the format has changed over time, so do not
copy them from an old guide. Google Workspace gives you a TXT record under
`google._domainkey`. Newsletter and CRM platforms each have their own.

### 4. Publish DMARC in monitoring mode

DMARC tells receivers what to do when mail fails both SPF and DKIM alignment, and
where to send reports. Start with monitoring only:

```
_dmarc.yourcompany.ae.  TXT  "v=DMARC1; p=none; rua=mailto:dmarc-reports@yourcompany.ae; fo=1"
```

`p=none` changes nothing about delivery. It just starts the daily reports. The raw
reports are XML and unreadable in volume, so send them to a DMARC reporting service
that turns them into a list of who is sending as you.

### 5. Fix what the reports show, then tighten

Leave `p=none` for a few weeks and work through the reports. Every legitimate
source should pass with SPF or DKIM aligned to your domain. Fix the ones that do
not — usually a forgotten tool sending from its own servers.

Then move to quarantine, optionally in stages using `pct`:

```
_dmarc.yourcompany.ae.  TXT  "v=DMARC1; p=quarantine; pct=25; rua=mailto:dmarc-reports@yourcompany.ae"
```

Raise `pct` to 100, watch the reports again, and finally:

```
_dmarc.yourcompany.ae.  TXT  "v=DMARC1; p=reject; rua=mailto:dmarc-reports@yourcompany.ae"
```

At `p=reject`, receivers that honour DMARC drop spoofed mail outright. Keep
reading the reports afterwards; a new marketing tool added next year will fail
until someone sets it up properly.

### 6. Lock down domains that never send email

Parked domains and old brand domains are easy to spoof because nobody watches
them. If a domain does not send mail, say so:

```
parkeddomain.ae.         TXT  "v=spf1 -all"
_dmarc.parkeddomain.ae.  TXT  "v=DMARC1; p=reject"
```

### 7. Deal with lookalike domains separately

DMARC only protects the exact domain you own. For lookalikes:

- Register the obvious variants of your main domain if they are cheap.
- Use a domain monitoring service to alert you when similar domains are
  registered.
- Turn on external sender tagging in Microsoft 365 or Google Workspace so mail
  from outside is visibly marked.
- Most important: a rule that any change to bank details is confirmed by phone
  on a known number. That beats every lookalike.

## What to do if it already happened

1. **Warn the clients and suppliers who received the spoofed mail**, by phone,
   and tell them how to verify genuine payment requests.
2. **Check it really was spoofing,** not a compromised mailbox. Look at the sign-in
   logs and Sent Items. If the mail came from your real account, it is an account
   compromise, and you need to reset credentials and revoke sessions.
3. **Publish SPF, DKIM and DMARC** as above, starting with `p=none`, and move to
   enforcement as quickly as the reports allow.
4. **For lookalike domains,** report the domain to its registrar and hosting
   provider as fraud, and keep copies of the emails with full headers.
5. **Report any financial loss** to your bank immediately and to the UAE police
   through their eCrime channels.

## What this doesn't cover

DMARC stops other people sending as your domain. It does nothing about mail sent
from your real mailbox by someone who has stolen the login — that is account
compromise, and the defence is strong MFA. See [adversary-in-the-middle
phishing](/blog/aitm-phishing-mfa-bypass).

---

If you want your SPF, DKIM and DMARC set up and taken all the way to `p=reject`
without breaking your invoicing tool, [get in touch](/contact). Most of the work
is finding the senders nobody remembered.
