---
title: 'MFA fatigue and push bombing: how to stop approve-the-prompt attacks'
description: 'MFA fatigue attacks flood a user with push prompts until they approve one. How push bombing works against Microsoft 365 now, and the controls that actually stop it.'
pubDate: 2026-09-30
tags: ['Security', 'Microsoft 365']
draft: false
featured: false
---

MFA fatigue, also called push bombing, is the least technical way to get past
multi-factor authentication. The attacker already has the password. They try to
sign in over and over, and the user's phone receives approval request after
approval request, sometimes late at night, until the user taps **Approve** to make
it stop, or by mistake.

It sounds too simple to work. It works because people are tired, busy, and used to
tapping through prompts without reading them.

## How the attack works now

The password usually comes from somewhere else first: a phishing page, an
infostealer log, or a reused password from another breach. That last route is
covered in [credential stuffing protection](/blog/credential-stuffing-protection).

The attacker then signs in, and Microsoft sends a push notification to the user's
Authenticator app. The user ignores or denies it. The attacker tries again. And
again.

Microsoft has made the naive version much harder. Microsoft Authenticator now
enforces **number matching**: the sign-in screen shows a number and the user has
to type it into the app. A user who never saw the sign-in screen does not know the
number, so blind approval no longer works.

So attackers adapted. The current version usually adds a phone call or a WhatsApp
message:

> "Hi, this is IT support. We're migrating your mailbox and you'll get a few
> verification prompts. Can you read me the number on your screen?"

Or they wait until the user is likely to be signing in anyway, first thing in the
morning, and time the prompt to coincide. The pressure part is the same; only the
delivery has changed. If voice impersonation is involved, the
[deepfake voice fraud post](/blog/deepfake-voice-ceo-fraud) covers that angle.

Accounts still using SMS or voice-call MFA are weaker still, because there is no
number matching at all, and the phone number itself can be taken over through
[SIM swapping](/blog/sim-swap-attack-protection).

## Signs you've been hit

- A user reports multiple MFA prompts they did not trigger. Treat this as a
  confirmed password compromise, even if they denied every one.
- Entra ID sign-in logs showing repeated failures with reasons like **MFA denied;
  user declined the authentication** or **user did not respond**, followed by a
  success.
- A successful sign-in from an unfamiliar location or device shortly after a burst
  of failed attempts.
- A new MFA method registered on the account, especially a new phone number or a
  second Authenticator device. Attackers do this quickly to keep access.
- Someone calling staff claiming to be IT and asking for codes or numbers.

## How to protect your business

### 1. Confirm number matching and additional context are on

Number matching is enforced for Microsoft Authenticator push notifications, but
check your **Authentication methods** policy in Entra ID anyway, and turn on
**show application name** and **show geographic location** in the Authenticator
settings. A prompt that says "Sign in to Outlook from Russia" is much easier to
deny than a bare approval request.

### 2. Retire SMS and voice calls where you can

Move users off SMS and phone-call MFA to the Authenticator app or better. Leave SMS
only as a documented exception for the few people who genuinely cannot use anything
else, and review that list regularly.

### 3. Require phishing-resistant MFA for the people who matter

Passkeys (in Microsoft Authenticator or on a security key), FIDO2 keys and Windows
Hello for Business remove push prompts from the equation entirely. There is no
notification to bomb and no number to read out over the phone. Use a Conditional
Access **authentication strength** policy to require them, starting with global
admins, finance and the managing director.

### 4. Turn on fraud reporting

In the Entra ID authentication methods settings, enable **Report suspicious
activity**. A user who receives an unexpected prompt can report it directly from
the notification, and the account is flagged as high risk. If you have Entra ID P2,
pair this with a risk-based Conditional Access policy that blocks or forces a
password change on high-risk users.

### 5. Lock down MFA registration

Use Conditional Access to require that **registering security information** only
happens from a trusted location or a compliant device. That stops an attacker who
gets in once from quietly adding their own phone as a second method.

### 6. Give staff one rule

> IT will never ask you to approve a prompt, read out a number, or share a code. If
> you get a prompt you did not start, deny it, report it, and tell us.

Also tell them that an unexpected prompt means someone already has their password.
That reframes it from "annoying glitch" to "something I need to report now".

## What to do if it already happened

If a user approved a prompt they should not have, or reported a burst of prompts:

1. **Reset the password** first. The attacker has it, whether or not they got in.
2. **Revoke all sessions** for the user in Entra ID, so any session obtained from an
   approved prompt is killed. Password resets alone do not end active sessions;
   see [session cookie hijacking](/blog/session-cookie-hijacking).
3. **Review the registered MFA methods** and remove anything the user did not add
   themselves.
4. **Check sign-in logs** for successful sign-ins around the time of the prompts,
   and note IP addresses, devices and apps accessed.
5. **Inspect the mailbox** for new inbox rules, forwarding, delegates, and sent
   messages the user does not recognise.
6. **Work out where the password came from.** If it was reused elsewhere, change it
   there too, and check whether the user's device needs scanning for malware.

## What this doesn't cover

Push bombing is one MFA bypass among several. Phishing proxies that capture the
session after MFA, and stolen session cookies, get around number matching without
needing the user to approve anything. Phishing-resistant MFA and device-based
Conditional Access address those as well, which is why they keep coming up.

---

If you want someone to review your Microsoft 365 authentication methods and move
your key people to passkeys without disrupting the office, [get in touch](/contact).
