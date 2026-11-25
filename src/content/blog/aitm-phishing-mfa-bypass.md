---
title: 'AiTM phishing: how MFA bypass works on Microsoft 365, and how to stop it'
description: 'AiTM phishing kits proxy the real Microsoft 365 login and steal the session, so standard MFA bypass is routine. The Conditional Access setup that actually stops it.'
pubDate: 2026-11-04
tags: ['Security', 'Microsoft 365']
draft: false
featured: false
---

AiTM phishing is the reason "we have MFA" no longer settles the question. An
adversary-in-the-middle kit does not try to guess or steal your one-time code. It
lets you enter it yourself, on the real Microsoft login page, and takes the
session that comes out the other side.

The user sees a normal login, approves a normal MFA prompt, and ends up in their
normal mailbox. The attacker ends up signed in as them too.

These kits are sold as subscriptions — phishing-as-a-service — with hosting,
templates and a dashboard included. You do not need to be skilled to run one,
which is why MFA bypass is now routine rather than exotic.

## How the attack works now

**The lure.** An email about a shared document, a voicemail, a DocuSign request,
an invoice. Increasingly the link is hidden in a QR code or a PDF to get past
email filtering — see [QR code phishing](/blog/qr-code-phishing-quishing).

**The filter.** The link usually passes through a CAPTCHA or a Cloudflare-style
check page. This is not decoration. It stops security scanners from seeing the
phishing page, so only real humans reach it.

**The proxy.** The phishing site is a reverse proxy. When you load it, it
fetches the real Microsoft sign-in page and shows it to you, often with your own
company's logo and background pulled from your tenant. You type your password;
the proxy passes it to Microsoft. Microsoft sends the MFA challenge; the proxy
shows it to you. You approve.

**The theft.** Microsoft issues a session cookie to what it thinks is your
browser. The proxy keeps a copy. The attacker loads that cookie into their own
browser and is signed in, with no password or MFA prompt needed — the same
mechanism I describe in [session cookie hijacking](/blog/session-cookie-hijacking).

**The follow-through.** Within minutes, automated tooling often registers a new
MFA method for persistence, creates inbox rules, and starts sending the same
phishing email to everyone in your contacts. From there it usually becomes
[business email compromise](/blog/business-email-compromise-uae).

Number matching and push approvals do not help here. The user is genuinely
signing in and genuinely approving. Codes from an authenticator app and SMS codes
are relayed just as easily.

## Signs you've been hit

- A sign-in from an unfamiliar IP or hosting provider within a minute or two of
  a legitimate sign-in by the same user, often in a different country.
- A new authenticator app or phone number registered on the account that the
  user did not add.
- Inbox rules deleting or moving messages, especially ones containing words
  like "phish", "hacked" or "invoice".
- Colleagues receiving strange shared-document emails from the user.
- In Entra ID Protection (P2 licences), risk detections such as anomalous
  token, attacker in the middle, or unfamiliar sign-in properties.

The user will often say they "just logged in to open a document and it didn't
work". That is worth taking seriously every time.

## How to protect your business

### 1. Move to phishing-resistant MFA

This is the real fix. Passkeys (including passkeys stored in Microsoft
Authenticator), FIDO2 security keys and Windows Hello for Business are bound to
the real domain. On a proxy site, the browser simply will not offer the
credential, because the domain is wrong. There is nothing for the user to get
wrong.

Start with admins, finance and leadership, then extend to everyone.

### 2. Enforce it with authentication strengths

Registering passkeys is not enough if users can still fall back to a code. In
Conditional Access, create a policy requiring the **phishing-resistant MFA**
authentication strength for your admin roles first, then for the other groups as
they are enrolled. Protect the registration of security info with its own policy
so an attacker with a stolen session cannot simply add their own method.

### 3. Require a managed device

A Conditional Access policy requiring a compliant or Entra-joined device means
a stolen cookie replayed from the attacker's laptop fails, because their device
is not yours. For a small business with Intune, this is one of the most
effective controls available, and it pairs well with phishing-resistant MFA.

### 4. Turn on token protection where supported

Token protection binds sign-in sessions to the device they were issued to.
Coverage depends on platform and application, so check what Microsoft currently
supports before relying on it, but enable it for the supported apps on Windows
devices where you can.

### 5. Use risk-based policies if you have P2

With Entra ID P2, sign-in risk and user risk policies can block or force
re-authentication when Microsoft detects token anomalies. Leave Continuous Access
Evaluation on, so revoking a session takes effect quickly.

### 6. Reduce what gets through

Defender for Office 365 Safe Links and Safe Attachments, plus user reporting
through the built-in report button, catch a share of these before anyone clicks.
They will not catch everything, which is why steps 1 to 3 matter more.

## What to do if it already happened

In order:

1. **Revoke all sessions** for the user in Entra ID. A password reset alone
   does not invalidate a stolen session cookie.
2. **Reset the password** and **remove any MFA methods** the user did not add.
3. **Delete malicious inbox rules** and forwarding, in Outlook and through
   Exchange admin, since some rules are hidden from the client.
4. **Check app consents** for anything granted during the compromise — see
   [OAuth consent phishing](/blog/oauth-consent-phishing-microsoft-365).
5. **Review the audit log** for mail read, sent and deleted, and files accessed
   in OneDrive and SharePoint.
6. **Warn recipients** of any phishing sent from the account, and block the
   phishing domain in your tenant.
7. **Report it** to the police through the UAE eCrime platform if money moved
   or personal data was exposed.

---

If you want your tenant moved to phishing-resistant MFA without locking anyone
out halfway through, [get in touch](/contact). The rollout order matters more
than the settings themselves.
