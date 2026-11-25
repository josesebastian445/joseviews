---
title: 'Session cookie hijacking: how attackers skip your password and MFA'
description: 'Session cookie hijacking lets an attacker replay a stolen login token and walk into Microsoft 365 without a password or MFA prompt. How it works and how to stop it.'
pubDate: 2026-10-21
tags: ['Security', 'Microsoft 365']
draft: false
featured: false
---

Most small businesses I talk to believe MFA is the finish line. Password plus a
code on the phone, and the account is safe. Session cookie hijacking is the attack
that makes that belief expensive.

When you sign in to Microsoft 365, the service hands your browser a session token
so it does not have to ask you for MFA on every click. Whoever holds that token is,
as far as Microsoft is concerned, you. Steal the cookie, replay it in another
browser, and the attacker is inside the mailbox without ever knowing the password
or touching your phone. This is often called "pass-the-cookie".

## How the attack works now

There are two main ways the token leaves your hands.

**Infostealer malware.** A user installs a cracked tool, a fake browser update or a
"document viewer", and a piece of malware quietly copies the browser's cookie store,
saved passwords and autofill data, then uploads it. The whole thing takes seconds.
The logs are then sold or used directly. I cover the malware side in more detail in
[infostealer malware protection](/blog/infostealer-malware-protection).

**Adversary-in-the-middle phishing.** The user clicks a link to what looks like the
Microsoft login page. It is actually a proxy sitting between them and the real
Microsoft. They type their password, approve the MFA prompt, and the proxy captures
the session cookie that Microsoft issues at the end. The user lands in their real
inbox and suspects nothing. The [AiTM phishing post](/blog/aitm-phishing-mfa-bypass)
walks through that one step by step.

Either way, the attacker imports the cookie into their own browser and opens
Outlook on the web. From there the usual pattern follows: read the mailbox, find
invoices in progress, create inbox rules to hide replies, and send payment change
requests from a genuine account. That is how most
[business email compromise](/blog/business-email-compromise-uae) starts in practice.

The important point is that nothing in this chain fails MFA. MFA did its job at
sign-in. The problem is what happens after.

## Signs you've been hit

None of these are proof on their own, but any of them deserves a look:

- Sign-ins in the Entra ID sign-in logs from an IP address or country your staff do
  not use, especially ones that show **MFA requirement satisfied by claim in the
  token** rather than a fresh MFA prompt.
- The same session used from two very different locations within a short window.
- New inbox rules that move, delete or mark-as-read messages containing words like
  "invoice", "payment" or "bank".
- Sent items the user does not recognise, or replies arriving to conversations the
  user never started.
- If you have Entra ID P2: risk detections such as **Anomalous token**, **Token
  issuer anomaly** or **Unfamiliar sign-in properties** in Identity Protection.
- On the endpoint: Defender or your antivirus flagging a stealer, or a user
  mentioning they recently installed something from outside the usual sources.

## How to protect your business

No single control fixes this. The aim is to make a stolen token short-lived,
bound to a device, and noticed quickly.

### 1. Require a compliant or registered device

A Conditional Access policy that requires a compliant (Intune-managed) or Hybrid
Entra-joined device for Microsoft 365 is one of the most effective things you can
do. A cookie replayed from an attacker's laptop arrives without a device claim the
policy will accept.

For small offices without full Intune enrolment, at least require it for admin
accounts and for finance and management, who are the people attackers target.

### 2. Turn on token protection where you can

Entra ID Conditional Access has a **token protection** session control that binds
sign-in tokens to the device they were issued to. A token copied to another machine
stops working. Coverage is still limited to specific platforms and apps, mainly
Windows devices using supported Microsoft 365 desktop clients, so test it on a
pilot group before rolling it out. Where it applies, it removes the replay problem
almost entirely.

### 3. Shorten session lifetime for sensitive roles

Use a Conditional Access **sign-in frequency** control for admins and finance so
sessions expire within hours rather than weeks. It is a trade-off against
convenience, so apply it to the accounts that matter most rather than everyone.

Leave **Continuous Access Evaluation** enabled (it is on by default). It lets
Microsoft 365 cut off a session quickly when you disable an account or reset a
password, instead of waiting for the token to expire.

### 4. Move to phishing-resistant MFA

Passkeys, FIDO2 security keys and Windows Hello for Business cannot be relayed
through an AiTM proxy, because the credential is bound to the real Microsoft
domain. That closes the phishing route to stolen cookies. Use a Conditional Access
**authentication strength** policy to require them, starting with admins.

### 5. Stop infostealers reaching the browser

Users should not be local administrators. Keep browsers and Windows on automatic
updates; current Chromium-based browsers encrypt cookies in ways that make simple
theft harder, but stealers adapt, so do not rely on it. Run Microsoft Defender (or
an equivalent EDR) with attack surface reduction rules enabled, and block personal
browser profiles syncing on work machines where practical.

### 6. Watch for the after-effects

Alert on new inbox rules and forwarding to external addresses. Microsoft Defender
for Office 365 has built-in alert policies for suspicious forwarding and rule
creation; make sure they route to someone who reads them. Most cookie theft is
discovered through these side effects, not the theft itself.

## What to do if it already happened

Order matters. Resetting a password alone does not end a hijacked session.

1. **Revoke sessions.** In the Entra admin centre, open the user and choose
   **Revoke sessions** (or run `Revoke-MgUserSignInSession`). This invalidates
   refresh tokens and forces re-authentication everywhere.
2. **Reset the password** and review the user's registered MFA methods. Remove any
   method the user did not add themselves.
3. **Isolate the device** if an infostealer is suspected. Scan it, and assume every
   password saved in that browser is compromised. That means personal accounts too.
4. **Check the mailbox.** Remove unknown inbox rules, forwarding settings and
   delegates. Review sent items and deleted items for the period of access.
5. **Review sign-in and audit logs** to establish what was accessed and from where.
   Export them early; default retention is shorter than most people expect.
6. **Remove unknown app consents** under Enterprise applications, in case the
   attacker granted themselves persistent access. See the post on
   [OAuth consent phishing](/blog/oauth-consent-phishing-microsoft-365).
7. **Warn the people who were emailed.** If invoices or payment details went out
   from the account, call those clients and suppliers on a known number.

## What this doesn't cover

This post is about Microsoft 365, but the same technique works against Google
Workspace, banking portals, social media accounts and anything else that keeps you
logged in. The defences translate: device-bound sessions, phishing-resistant
sign-in, and keeping malware off the machine in the first place.

---

If you want someone to check your Conditional Access setup against this, or to
investigate a sign-in that does not look right, [get in touch](/contact). Most of
these controls are a few hours of configuration once the licensing is clear.
