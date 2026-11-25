---
title: 'Credential stuffing protection for small business logins and websites'
description: 'How credential stuffing turns old leaked passwords into working logins, the signs to look for, and the controls that stop it on Microsoft 365 and your website.'
pubDate: 2026-09-16
tags: ['Security', 'Web Security']
draft: false
featured: false
---

Credential stuffing is the least clever attack on this blog, and one of the most
effective. Nobody guesses your password. They already have it — from a breach of
some unrelated site where a member of your staff used the same email and password
years ago — and they try it against every login you have.

Credential stuffing protection is not one product. It is a handful of boring
controls that together make a leaked password worthless. Most small businesses
have one or two of them. You want all of them.

## How the attack works now

Breached username and password lists circulate in enormous volumes. Some come from
old database breaches. More and more come from infostealer malware, which lifts
saved passwords straight out of browsers — I covered that in
[infostealer malware protection](/blog/infostealer-malware-protection).

Attackers load those lists into automated tools and point them at login pages:
Microsoft 365, Google Workspace, VPN portals, accounting software, your WordPress
admin, your customer account area. The tools rotate through residential proxy
networks, so the traffic comes from thousands of ordinary-looking home IP addresses
instead of one obvious server. Each address makes only a few attempts.

That is why a simple "block after five failed logins from one IP" rule no longer
catches it. The attack is wide and shallow, not narrow and deep.

When a pair works, the attacker either uses the account directly or sells verified
access on. A working Microsoft 365 login is the usual starting point for
[business email compromise](/blog/business-email-compromise-uae).

## Signs you've been hit

- **Spikes in failed logins** across many accounts at once, especially for
  usernames that do not exist. That is a list being worked through.
- **Successful sign-ins from unfamiliar countries or hosting providers** in the
  Microsoft Entra or Google Workspace sign-in logs.
- **MFA prompts nobody asked for.** If a user gets an MFA request they did not
  start, the password is already known.
- **Customer complaints** about orders, address changes or loyalty points they did
  not make, if your website has customer accounts.
- **New mailbox rules** that forward or delete mail — the classic sign that a
  stuffed login has already been used.
- **Sudden load on the login page** in your hosting or Cloudflare analytics, out
  of proportion to real traffic.

## How to protect your business

### 1. Enforce MFA everywhere it exists

A correct password with no second factor gets the attacker nothing. Enforce it on
Microsoft 365 through Conditional Access, not per-user toggles, and block legacy
authentication, which ignores MFA entirely.

Then go through every other system with a login: the VPN, the accounting package,
the domain registrar, the hosting control panel. The forgotten ones are where
stuffing succeeds. Where you can, use an authenticator app or passkeys rather than
SMS — see [SIM swap attack protection](/blog/sim-swap-attack-protection) for why.

### 2. Give everyone a password manager

Credential stuffing only works because people reuse passwords. You will not fix
that with a policy memo. You fix it by making unique passwords effortless: a
business password manager, shared vaults for genuinely shared credentials, and a
rule that work passwords are generated, never invented.

### 3. Check passwords against breach lists

Current NIST guidance says to stop forcing periodic password changes and start
blocking passwords that are known to be compromised. In Microsoft 365, Entra
Password Protection blocks common and banned passwords. For your own applications,
the Have I Been Pwned Pwned Passwords API lets you check a password at signup or
reset without sending the password itself — it uses a partial hash.

Also add your company domain to a breach notification service so you hear when
staff addresses appear in a new dump.

### 4. Rate-limit and challenge the login path

If your website sits behind Cloudflare, put a rate-limiting rule on the login
endpoint — `/wp-login.php` and `/xmlrpc.php` for WordPress, or whatever path your
customer login posts to. The free plan includes a rate-limiting rule; use it there.

Because modern stuffing is spread across many IPs, pair it with:

- **Cloudflare Turnstile** on the login form, which challenges bots without making
  real users solve puzzles.
- **Bot Fight Mode** or, on paid plans, bot management rules that score traffic
  and challenge the likely automated requests.
- **Leaked credentials detection**, which flags login requests using username and
  password pairs Cloudflare has seen in breaches, so you can challenge or block
  them before they reach your application.

### 5. Don't confirm which usernames exist

Your login and password-reset pages should give the same response whether or not
the account exists. "No account found for that email" tells an attacker which
half of their list to keep.

### 6. Watch the sign-in logs

Set up alerts for risky sign-ins in Entra or Google Workspace, and for repeated
failed logins on your website. Someone should actually receive these. An alert to
an unread mailbox is not monitoring.

## What to do if it already happened

1. **Reset the password of every affected account** and revoke active sessions.
   In Microsoft 365, revoke sign-in sessions as well as changing the password, or
   existing tokens keep working.
2. **Check for persistence:** mailbox forwarding rules, new MFA methods registered
   by the attacker, OAuth app consents, and newly created accounts.
3. **Find out where else that password was used.** If a member of staff reused it,
   assume every account sharing it is exposed and change them all.
4. **Enforce MFA on the account before re-enabling it**, if it was not already.
5. **For customer accounts on your website,** force a password reset for affected
   users, notify them plainly, and reverse any fraudulent orders or changes.
6. **Review what the attacker could see or send.** If business email was accessed,
   warn clients and suppliers that payment-change requests should be confirmed by
   phone. Report fraud to the UAE police through their eCrime channels.

## What this doesn't cover

This stops attackers using old passwords. It does not stop phishing that steals a
password and the MFA code in real time — that is
[adversary-in-the-middle phishing](/blog/aitm-phishing-mfa-bypass), and it needs
phishing-resistant MFA to beat properly.

---

If you want your logins checked — Microsoft 365, website and everything in
between — [get in touch](/contact). Closing the gaps is usually a short piece of
work, and finding the forgotten login with no MFA is often the most valuable part.
