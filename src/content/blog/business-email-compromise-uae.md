---
title: 'Business email compromise in the UAE: how invoice fraud actually works'
description: 'Business email compromise in the UAE usually ends with a changed bank account on a real invoice. How the fraud works, the warning signs, and the controls that stop it.'
pubDate: 2026-11-18
tags: ['Security', 'Email Security']
draft: false
featured: false
---

Business email compromise in the UAE rarely looks like hacking. It looks like an
ordinary email from a supplier you have worked with for years, in a thread you
recognise, saying their bank details have changed. Your accounts team updates the
payee, pays the invoice, and the money is gone.

No malware, no ransom note. Just a payment to the wrong account, discovered weeks
later when the real supplier chases the unpaid invoice.

This is the attack I would put first on any list for a small UAE business. It
targets the thing every business does — paying and getting paid — and it works
because it uses real conversations.

## How the attack works now

There are two main versions, and they often combine.

**Account takeover.** The attacker gets into a real mailbox — yours, or your
supplier's, or your customer's. Usually that is through a phishing page, and
increasingly through kits that bypass standard MFA, which I cover in
[AiTM phishing and MFA bypass](/blog/aitm-phishing-mfa-bypass).

Once inside, they do not rush. They create inbox rules that hide replies from
the real owner, read through threads, and wait for an invoice or a payment that
is worth intercepting. Then they reply from inside the real thread with "updated"
bank details.

**Lookalike domains.** The attacker registers a domain one character off —
`supp1ier.ae`, or the same name on a different extension — copies a real thread
they have seen, and continues the conversation from the fake domain. To a busy
reader on a phone, the difference is invisible.

**Spoofing.** If a domain has no DMARC enforcement, attackers can send mail that
appears to come from it directly. That is the easiest version to stop, and I
explain how in [email spoofing and DMARC setup](/blog/email-spoofing-dmarc-setup).

The fraud often moves off email too. A follow-up call or WhatsApp message "from
the finance manager" confirms the change. Increasingly that voice is synthetic —
see [deepfake voice CEO fraud](/blog/deepfake-voice-ceo-fraud).

## Signs you've been hit

On your own side:

- Inbox rules nobody remembers creating, especially ones that move mail to
  **RSS Feeds**, **Archive** or **Conversation History**, or that forward
  externally.
- Sign-ins in the Microsoft 365 or Google Workspace logs from countries or
  providers your staff do not use.
- A new MFA method registered on an account.
- Customers asking whether your bank details really changed.
- Sent items you did not write, or sent items that have been deleted.

On the supplier side:

- A bank change request arriving by email, especially near a large payment.
- New urgency or a "confidential, please don't call" tone.
- A beneficiary account in a different name or a different country from the
  supplier.

## How to protect your business

### 1. A callback rule with no exceptions

This is the control that matters most, and it costs nothing. Any change to bank
details is verified by phone, using a number you already hold on file — never a
number from the email requesting the change. Write it down, make it policy, and
make it apply to the managing director too.

Add dual approval for new payees and for payments above a threshold you set.

### 2. Lock down the mailboxes

Enforce MFA through Conditional Access, block legacy authentication, and for
finance and leadership move to phishing-resistant methods — passkeys or FIDO2
security keys — rather than codes or push approvals.

### 3. Stop external auto-forwarding

In Microsoft 365, set the outbound spam filter policy to block automatic
forwarding to external addresses. Legitimate exceptions can be allowed
individually. This removes one of the attacker's quietest tools.

### 4. Enforce DMARC on your own domain

SPF, DKIM, and a DMARC policy moving from `p=none` to `p=reject`. This does not
stop lookalike domains, but it stops anyone sending as your exact domain, which
protects your customers from fraud that uses your name.

### 5. Turn on impersonation protection

Defender for Office 365 (included in Business Premium) can flag mail from
domains that look like yours or your key suppliers', and from senders
impersonating named executives. Add your main suppliers to the protected domains
list. Also enable the external sender tag so staff can see at a glance when mail
comes from outside.

### 6. Monitor for lookalikes

Register the obvious variants of your own domain, and use a domain monitoring
service to alert you when someone registers something close to it.

## What to do if it already happened

Speed matters more than anything else here. In order:

1. **Call your bank immediately** and ask them to recall the transfer and
   contact the receiving bank. Then call again and get a reference number. The
   chance of recovery drops sharply with every hour.
2. **Report to the police** through the UAE eCrime platform or your local
   police station. Your bank may ask for the report reference.
3. **Contain the mailbox.** Reset the password, revoke all sessions, remove any
   MFA methods you did not add, and delete malicious inbox and forwarding rules.
4. **Check app consents.** Look for unfamiliar applications granted access to
   the mailbox, which survive a password reset — see
   [OAuth consent phishing](/blog/oauth-consent-phishing-microsoft-365).
5. **Search the audit log** for what was read, sent and deleted, and who else
   received mail from the compromised account.
6. **Warn your contacts.** If your mailbox was used, customers and suppliers
   in active threads need to know, by phone.

## What this doesn't cover

This is about email-driven payment fraud. It does not cover card fraud, fraud
inside your accounting software, or insider fraud, all of which need different
controls. It also does not replace your bank's own fraud processes — ask them
what verification they offer on new beneficiaries and use it.

---

If you want your Microsoft 365 tenant checked for the settings above, or help
writing a payment verification procedure your team will actually follow,
[get in touch](/contact).
