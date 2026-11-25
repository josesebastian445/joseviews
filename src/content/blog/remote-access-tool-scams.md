---
title: 'Remote access tool scams: fake IT helpdesk calls via Teams and AnyDesk'
description: 'Remote access tool scams use fake IT helpdesk calls on Teams, AnyDesk and Quick Assist to take over staff computers. How the scam works and how to block it.'
pubDate: 2026-07-22
tags: ['Security', 'Scams']
draft: false
featured: false
---

Remote access tool scams used to target elderly people at home: a caller claiming
to be from Microsoft, a virus that did not exist, and a request to install
TeamViewer. The same scam now targets offices, and it is better rehearsed.

The new version starts with your inbox suddenly filling with hundreds of
newsletter sign-ups. A few minutes later, someone messages you on Microsoft Teams.
Their name says "IT Helpdesk" or "Support". They have noticed the spam problem and
can fix it — they just need you to open Quick Assist or AnyDesk and read them a
code.

## How the attack works now

**Step one: create a problem.** The attacker signs the target's email address up
to hundreds or thousands of mailing lists and contact forms at once. This email
bombing is cheap, and it creates real stress: the inbox is unusable and the person
genuinely wants help.

**Step two: arrive as the solution.** Microsoft Teams allows chat with external
organisations by default in many tenants. The attacker sets up their own Microsoft
365 tenant, names the account something like "Help Desk", and messages or calls
the target. In some cases they phone instead, from a spoofed number, sounding
just like the internal IT person.

**Step three: get remote access.** The target is asked to open Quick Assist, which
is built into Windows, or to install AnyDesk, TeamViewer, ScreenConnect or a
similar tool. All of these are legitimate products, signed and trusted, so
antivirus does not flag them.

**Step four: use it.** Once connected, the attacker runs scripts, installs a second
remote tool for persistence, steals credentials and session tokens, and in several
documented campaigns has gone on to deploy ransomware. The "fix" for the spam takes
about ten minutes. The damage takes much less.

It works because every step looks like normal IT support. Staff are used to IT
taking over their screen. They have no reason to know that internal support would
never arrive through an external Teams account.

## Signs you've been hit

- A user reports an email flood followed by contact from "IT" that IT did not make.
- Quick Assist, AnyDesk, TeamViewer or ScreenConnect running on a machine that does
  not normally use them, or newly installed.
- Teams chats from external tenants with names like "Help Desk", "IT Support" or
  "Security Team".
- New scheduled tasks, new local accounts, or command windows opening on their own.
- After the session: sign-ins from new locations, MFA methods added, or the user
  reporting that "IT" asked them to approve a sign-in prompt. That last one overlaps
  with [MFA fatigue and push bombing](/blog/mfa-fatigue-push-bombing).

## How to protect your business

### 1. Tell staff exactly how real IT support contacts them

This is the most important control and it costs nothing. Write it down in one
sentence: "IT will only ever contact you from [these names / this internal
account / this phone number], and will never ask you to install remote access
software you did not request." Then say it again in the next team meeting.

If you use an outside IT provider, the same applies. Staff should know the
provider's name and which remote tool they use, so that anything else stands out.

### 2. Restrict external access in Microsoft Teams

In the Teams admin centre, change external access from "allow all external
domains" to an allowlist of the organisations you actually work with. If that is
too restrictive, at minimum block chats from unmanaged Teams accounts and turn on
the external sender warnings so messages from outside the company are clearly
labelled.

This single setting removes the most common delivery route for this scam.

### 3. Block unapproved remote access tools

Pick one remote support tool for your business and block the rest. Use
application control (WDAC, AppLocker or Intune policies) to prevent AnyDesk,
TeamViewer, ScreenConnect and similar from running unless they are your approved
tool. DNS filtering can also block their connection services.

If nobody in your office uses Quick Assist, remove it. It can be uninstalled
through Intune or PowerShell, and Microsoft provides guidance for blocking it.

### 4. Remove local admin rights

Several of these tools need admin rights to install fully or to run the follow-up
payloads. A standard user account turns many of these attacks into a failed
installation and a confused attacker.

### 5. Reduce the email bombing impact

You cannot fully prevent someone signing an address up to mailing lists, but you
can make it less disruptive. Microsoft 365 and Google Workspace have improved
their handling of sign-up floods; make sure preset security policies are on. Tell
staff that a sudden flood of subscription emails is itself a warning sign that
someone is about to call.

### 6. Verify before you trust a voice

When the contact is by phone, the same rule applies as for payment requests: hang
up and call back on a number you already have. Voices can be cloned convincingly
now, as I covered in [deepfake voice CEO fraud](/blog/deepfake-voice-ceo-fraud).

## What to do if it already happened

1. **End the session and disconnect the machine** from the network — unplug it or
   turn off Wi-Fi. Do not just close the remote tool window.
2. **From a different device, reset the user's password,** revoke their Microsoft
   365 sessions, and review their MFA methods for anything added.
3. **Uninstall the remote tool** and check for a second one. Attackers almost
   always install a backup.
4. **Check for persistence:** new local accounts, scheduled tasks, services and
   startup items. If in doubt, rebuild the machine from a clean image.
5. **Look at what else the account could reach** — shared drives, finance systems,
   email. Check for inbox rules and forwarding, which can lead into
   [business email compromise](/blog/business-email-compromise-uae).
6. **Tell the rest of the company,** briefly and without blame. These campaigns
   usually target several people in the same organisation at once.
7. **Report it** to the UAE Cyber Security Council or the police's online
   reporting service if money or data was taken.

---

If you want Teams external access locked down and a single approved remote support
tool in place, [get in touch](/contact). It is a short configuration job, and it
closes the door this scam relies on.
