---
title: 'QR code phishing (quishing): emails, PDFs and fake parking stickers'
description: 'QR code phishing, or quishing, moves the malicious link onto a phone where your email filters cannot see it. How it works in the UAE and how to protect staff.'
pubDate: 2026-10-14
tags: ['Security', 'Scams']
draft: false
featured: false
---

QR code phishing, usually called quishing, is a simple idea that works far better
than it should. Instead of a link, the attacker sends a QR code. The user scans it
with their phone, and the phishing page opens on a device your company does not
manage, outside the email filtering you pay for.

QR codes became normal here during the pandemic and never went away. Restaurant
menus, parking machines, building visitor registration, payment terminals. People
in the UAE scan them without thinking, which is exactly the habit quishing relies
on.

## How the attack works now

There are three common delivery routes.

**QR codes in email.** A message claims to come from IT, HR or Microsoft: "Your
MFA needs to be re-registered", "Review the updated salary policy", "Sign this
document". The body contains a QR code rather than a link. Many email filters scan
links in text well, but a QR code is an image, and it is often embedded in a way
designed to make scanning it harder for filters.

**QR codes in attachments.** The same thing, one layer deeper. The QR code sits
inside a PDF or Word document that looks like an invoice, a shipping notice or a
contract. The attachment itself contains no malware and no link in the usual sense,
so it can pass through filtering without complaint.

**QR codes in the physical world.** A sticker placed over the genuine QR code on a
parking meter, a restaurant table or a charging station. The page it opens asks for
card details to pay a small parking fee or bill. The amount is small, so people pay
without checking.

In the email cases, the page usually imitates a Microsoft 365 login. Because the
user is on their phone, the small screen hides the URL, and many of these pages are
[adversary-in-the-middle proxies](/blog/aitm-phishing-mfa-bypass) that capture
both the password and the session after MFA. The attacker then has the mailbox, and
the usual [business email compromise](/blog/business-email-compromise-uae) follows.

## Signs you've been hit

For an email quishing attempt that succeeded:

- A user mentions they scanned a code from an email and "it asked them to log in".
- A sign-in to Microsoft 365 from a mobile browser, followed shortly by sign-ins
  from an unfamiliar IP address or country.
- New inbox rules, new MFA methods registered, or unfamiliar sent items on the
  account.

For a physical quishing scam:

- An unfamiliar charge on a card, sometimes small at first and followed by larger
  ones.
- A parking or service "payment" that never shows up in the official app or account
  history.

## How to protect your business

### 1. Turn on QR code scanning in your email filter

Microsoft Defender for Office 365 scans QR codes in email bodies and treats the
embedded URL the same way it treats a normal link. Check that Safe Links is enabled
in your policies and that it covers your users. Other email security products have
similar features; confirm yours does, and confirm it handles QR codes inside
attachments, not only in the message body.

### 2. Make phones part of your Conditional Access thinking

Quishing works because it moves the user to a device you do not control. Use
Conditional Access to require a compliant device or an approved client app for
Microsoft 365 access from mobiles. A user who logs in to a fake page on their
personal phone then has credentials that are less useful to an attacker signing in
from elsewhere.

### 3. Use phishing-resistant MFA

Passkeys and FIDO2 keys only work on the genuine Microsoft domain. A fake login
page reached through a QR code cannot complete the sign-in, no matter how
convincing it looks. This is the control that actually breaks the attack rather
than making it slightly harder.

### 4. Teach one specific rule

Generic awareness training does not stick. One concrete rule does:

> IT will never send you a QR code to log in, reset MFA, or read a document. If an
> email asks you to scan a code to sign in, it is phishing.

Add a second one for the physical world: before paying anything from a scanned
code, check the address bar. If the domain is not the organisation you expect, or
you are paying a government or parking fee, close it and use the official app or
website you already have. Parking and government payments in the UAE have official
apps and channels; there is rarely a reason to pay through a page reached from a
sticker.

### 5. Make reporting easy

Enable the **Report** button in Outlook and tell staff that reporting a suspicious
email is never a waste of time. A quishing campaign usually hits several people at
once; one early report lets you purge the message from every mailbox before the
others scan it.

### 6. Check your own QR codes

If your business puts QR codes on menus, invoices or signage, check them
periodically for stickers placed over them. Point them at your own domain, not a
generic link shortener, so customers can tell what they are visiting.

## What to do if it already happened

If a staff member scanned a code and entered their Microsoft 365 credentials:

1. **Revoke the user's sessions** in Entra ID and reset the password immediately.
   Revoking matters because the attacker may already hold a valid session cookie.
   The [session cookie hijacking](/blog/session-cookie-hijacking) post explains why.
2. **Review MFA methods** on the account and remove anything the user did not add.
3. **Check the mailbox** for new inbox rules, forwarding and delegates, and remove
   anything unexpected.
4. **Review the sign-in logs** for the period since the scan to see where the
   account was accessed from and what was touched.
5. **Search for and purge the original email** from all mailboxes using Threat
   Explorer or content search, so nobody else scans it.

If card details were entered on a fake payment page, call the bank on the number
printed on the card, block the card, and dispute the charges. Then report the
fake sticker to the venue or operator so it gets removed.

## What this doesn't cover

Some QR codes lead to malicious app downloads rather than login pages, particularly
on Android. Keeping phones updated, blocking installs from unknown sources and
using managed devices for work all help, but that is a mobile device management
topic on its own.

---

If you want your email filtering and Conditional Access checked against QR code
phishing, or need help after someone has already scanned one, [get in touch](/contact).
