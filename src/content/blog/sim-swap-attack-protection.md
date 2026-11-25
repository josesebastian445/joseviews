---
title: 'SIM swap attack protection: stop attackers stealing your SMS codes'
description: 'A SIM swap moves your phone number to an attacker''s SIM so they receive your SMS codes. How it works, the warning signs, and how to protect your business accounts.'
pubDate: 2026-09-02
tags: ['Security', 'Scams']
draft: false
featured: false
---

A SIM swap is an attack on your phone number rather than your phone. The attacker
convinces a carrier, or someone working for one, to move your number onto a SIM or
eSIM they control. From that moment, every call and SMS meant for you goes to them —
including the one-time codes your bank, email and accounting software send.

SIM swap attack protection matters for small businesses because so much still
hangs off one mobile number: the owner's bank approvals, the Microsoft 365 admin
account, the domain registrar, the WhatsApp account clients use. Lose the number,
and the attacker can reset most of it.

## How the attack works now

The attacker usually starts with information about you. Name, number, date of
birth, maybe an Emirates ID number or a copy of a document leaked in a breach or
collected by a phishing page. Infostealer logs and old data breaches supply plenty
of this.

Then they get a replacement SIM issued. Depending on the carrier and country, that
might be through social engineering at a store or call centre, a forged document, a
compromised carrier account online, or an insider who has been paid. eSIM has made
this faster in some places — a transfer that needs no physical card can be done
remotely if the account controls are weak.

Once the number is moved, the attacker triggers "forgot password" on your email,
receives the SMS code, and takes the account. From email they reset everything
else. If your bank still sends SMS codes, they can approve transfers.

Related attacks reach the same result without a full SIM swap: port-out fraud,
where the number is moved to a different carrier, and call or SMS forwarding set
up through a compromised carrier account.

## Signs you've been hit

- **Your phone suddenly shows no service** or "SIM not provisioned" in an area
  where it normally works. This is the most important sign. Treat it as urgent,
  not as a network fault.
- **Notifications from your carrier** about a SIM change, eSIM activation or
  account change you did not make.
- **Password reset emails or "new sign-in" alerts** arriving around the same time.
- **You can't log in to accounts** whose recovery depends on your number.
- **Bank alerts** for transfers or new beneficiaries you did not add.

## How to protect your business

### 1. Move important accounts off SMS codes

This is the real fix. If an account does not trust SMS, a stolen number cannot get
into it.

- **Microsoft 365 and Google Workspace:** use the Microsoft Authenticator or
  Google prompt, an authenticator app, or better, passkeys or hardware security
  keys. Remove SMS and voice as allowed methods for admins at minimum, and ideally
  for everyone.
- **Banking:** use the bank's app-based approval where offered. UAE banks have been
  phasing SMS one-time codes out in favour of in-app authentication; take the
  option as soon as your bank offers it.
- **Domain registrar, hosting, DNS and Cloudflare:** authenticator app or security
  key. These accounts control your website and email, so they matter as much as
  the bank.

Be careful with push approval as a replacement — it brings its own problem,
covered in [MFA fatigue and push bombing](/blog/mfa-fatigue-push-bombing). Number
matching should be on.

### 2. Remove the phone number as a recovery method

Many services let a phone number reset a password on its own, even when you use an
authenticator app for sign-in. Check the security settings of your critical
accounts and remove SMS recovery, or replace it with recovery codes stored in your
password manager.

### 3. Lock down your carrier account

Ask your carrier — e& or du in the UAE, or whoever you use — what protections are
available on your account: an account PIN or password, restrictions on SIM
replacement or eSIM transfer, and notifications for any SIM change. Business
accounts often have an authorised-contacts list; make sure it is current and short.

Do not assume the defaults are enough. Ask, and record the answer.

### 4. Keep your number out of public view

The number you use for account recovery does not need to be the one printed on
your business card or website. A separate number used only for recovery, never
shared, is a harder target.

### 5. Reduce what attackers know about you

Be careful about where copies of Emirates ID and passport are emailed and stored.
Those scans sitting in shared mailboxes are exactly what an attacker needs to
impersonate you. Share them through a link that expires, not as attachments.

### 6. Turn on WhatsApp two-step verification

A swapped number also lets an attacker register your WhatsApp. A two-step
verification PIN blocks that. More detail in [WhatsApp and SMS scams in the
UAE](/blog/whatsapp-sms-scams-uae).

## What to do if it already happened

1. **Contact your carrier immediately** from another phone or in person. Tell them
   you suspect your number has been moved without your authorisation, and ask them
   to restore it and lock the account.
2. **Call your bank** using a number from the bank's official website or the back
   of your card. Ask them to freeze transfers and review recent activity.
3. **Secure your email first,** from a clean device. Change the password, sign out
   all sessions, and check for new forwarding rules, recovery details and MFA
   methods the attacker added.
4. **Work outwards:** domain registrar, Microsoft 365 or Google admin, accounting
   software, social media, WhatsApp. Change passwords and replace SMS-based MFA as
   you go.
5. **Warn clients and suppliers** if business email or WhatsApp was accessed, and
   tell them to verify any payment request by phone.
6. **Report it** to the police through the UAE eCrime channels, and keep a record
   of times, carrier reference numbers and what was accessed.

## What this doesn't cover

Moving off SMS removes the payoff of a SIM swap, but authenticator apps can still be
defeated by real-time phishing pages. For the accounts that matter most, read
[adversary-in-the-middle phishing](/blog/aitm-phishing-mfa-bypass) and consider
passkeys or hardware keys.

---

If you want help moving your business accounts off SMS codes and finding the ones
that still recover by text message, [get in touch](/contact). It is usually an
afternoon, and it removes a whole class of attack.
