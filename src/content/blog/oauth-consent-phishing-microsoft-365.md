---
title: 'OAuth consent phishing in Microsoft 365: malicious apps and device codes'
description: 'OAuth consent phishing gives attackers access to Microsoft 365 mail and files through an app, with no password stolen. How it works, and how to lock it down.'
pubDate: 2026-09-23
tags: ['Security', 'Microsoft 365']
draft: false
featured: false
---

OAuth consent phishing in Microsoft 365 is the attack where nobody steals your
password. The user signs in to the genuine Microsoft login page, passes MFA
correctly, and then clicks **Accept** on a permissions screen. That click gives an
attacker-controlled app ongoing access to their mailbox, files or contacts.

Resetting the password afterwards does not remove that access. That is what makes
it so persistent, and why it keeps turning up in small tenants that have otherwise
done the right things.

A close relative is device code phishing, which abuses a legitimate Microsoft
sign-in flow in a similar way. I cover both here because the defences overlap.

## How the attack works now

### Malicious app consent

Microsoft 365 lets users grant third-party apps access to their data. That is how
scheduling tools, e-signature apps and CRM plugins work. The app requests
permissions such as "read your mail" or "access your files", and the user approves.

The attacker registers an app with a plausible name and logo: "Secure Document
Viewer", "Microsoft Teams Update", "Invoice Portal". They send a link that starts a
genuine Microsoft sign-in. Everything the user sees is on a real Microsoft domain,
which is why URL checks do not help. At the end, a consent screen asks for
permissions like **Read your mail**, **Read and write your files** and **Maintain
access to data you have given it access to**. The user clicks Accept.

The app now holds a token that lets it read mail and files through the Microsoft
Graph API, from the attacker's own servers, without ever signing in as the user
again. Mailbox access like this is a common route into
[business email compromise](/blog/business-email-compromise-uae).

### Device code phishing

Device code sign-in exists for devices without a keyboard, such as conference room
systems and smart TVs. The device shows a short code, and you enter it at
Microsoft's device login page on your phone or laptop.

The attacker starts a device code sign-in themselves, then sends the code to the
victim with a pretext: "Enter this code to join the Teams meeting" or "to verify
your account". The victim goes to the real Microsoft page, enters the code, signs
in with MFA, and in doing so authorises the attacker's session. The attacker
receives tokens for the user's account. Again, everything the victim touched was
genuine Microsoft.

## Signs you've been hit

- Unfamiliar entries under **Enterprise applications** in Entra ID, particularly
  ones with user consent, a recent creation date, and permissions like `Mail.Read`,
  `Mail.ReadWrite`, `Files.ReadWrite.All` or `offline_access`.
- Audit log events for **Consent to application** that you cannot match to a known
  business tool.
- Sign-in logs showing **Device code** as the authentication protocol for a user who
  has no reason to use it.
- Mailbox activity, such as messages read or sent, that does not match the user's
  own sign-ins, because the app is accessing mail directly through Graph.
- Users mentioning they "accepted some permissions" or "entered a code to join a
  meeting".

## How to protect your business

### 1. Restrict user consent

In Entra ID, go to **Enterprise applications > Consent and permissions** and check
the **User consent settings**. For most small businesses, the right choice is
either **Do not allow user consent**, or allowing it only for apps from verified
publishers requesting low-risk permissions. Microsoft has been tightening the
defaults, but older tenants often still allow users to consent to anything.

### 2. Turn on the admin consent workflow

If you block user consent, enable the **admin consent request** workflow. Users can
then ask for an app, with a reason, and a nominated admin approves or rejects it.
This keeps legitimate tools working while making sure a human checks what is being
granted.

### 3. Block device code flow

Create a Conditional Access policy that targets all users, uses the
**Authentication flows** condition, selects **Device code flow**, and blocks it.
Exclude only the specific accounts or devices that genuinely need it, such as
meeting room systems, and document why. Most small offices need no exceptions at
all.

### 4. Review existing app permissions now

Go through **Enterprise applications** and filter for apps with user-granted
permissions. Remove anything nobody recognises or uses. Microsoft Defender for
Cloud Apps, if you have it, offers app governance policies that alert on new
high-privilege or rarely used apps.

### 5. Train for the consent screen and the code

Two specific points for staff:

> Never accept an app permissions request you did not expect, even if it appears on
> a genuine Microsoft page. And never enter a code someone sent you into a Microsoft
> sign-in page.

Most people have been told to check the URL. This is the case where the URL is
correct and the request is still malicious, so it needs saying explicitly.

### 6. Keep the basics strong

Conditional Access requiring compliant devices, phishing-resistant MFA for admins,
and alerting on new inbox rules all limit what an attacker can do with any foothold.
The [small office security baseline](/blog/small-office-security-baseline) covers
the rest.

## What to do if it already happened

1. **Identify the app.** In Entra ID, find the enterprise application, note its
   application ID, publisher, permissions and which users consented.
2. **Disable sign-in for the app**, then revoke its permission grants and delete the
   service principal. Removing the app is what cuts off its access; a password
   reset will not.
3. **Revoke the affected users' sessions** in Entra ID. For device code phishing,
   this is the main step, because the attacker holds refresh tokens for the user.
4. **Reset passwords and review MFA methods** for the affected users, in case the
   attacker used their access to register additional methods.
5. **Review the unified audit log and mailbox audit data** to establish what the
   app or session read, sent or downloaded, and for how long.
6. **Check mailboxes for inbox rules and forwarding** set during the period of
   access, and remove them.
7. **Tighten consent and block device code flow** as above before closing the
   incident, so the same technique does not work twice.

## What this doesn't cover

Google Workspace has an equivalent risk with third-party OAuth apps, controlled
through the API controls in the admin console. The principle is the same: decide
which apps can be granted access, and review what already has it.

---

If you want your tenant's app consent settings, existing app permissions and
device code policy reviewed, [get in touch](/contact). It is a short review, and in
practice it often turns up an app nobody can explain.
