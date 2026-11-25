---
title: 'Malvertising and SEO poisoning: fake download ads that deliver malware'
description: 'Malvertising and SEO poisoning put fake software downloads at the top of search results. How the attack works, the warning signs, and how to stop staff installing malware.'
pubDate: 2026-08-05
tags: ['Security', 'Malware']
draft: false
featured: false
---

Malvertising and SEO poisoning are the reason "just Google it" has become risky
advice. Someone in your office needs Zoom, AnyDesk, Notepad++, a PDF editor or a
driver. They search, click the top result, download an installer that looks
right, and run it. The software installs. So does something else.

Nobody clicked a phishing email. Nobody opened a strange attachment. They did what
everyone does every week, and the search engine handed them the attacker's site.

## How the attack works now

There are two routes to the top of the results page.

**Malvertising** is paid. The attacker buys search ads against terms like
"download teams", "winrar", "putty" or the name of your accounting software. The
ad shows the real brand name and often a URL that looks right at a glance. Ad
platforms remove these when reported, but new ones appear faster than they are
taken down, and they tend to run at times when review is thinnest.

**SEO poisoning** is organic. Attackers build or compromise sites and push them up
the rankings for specific searches — software downloads, but also document
templates, contract samples and "free" versions of paid tools. Business users
looking for "UAE tenancy contract template" or "employment agreement sample" are a
target precisely because they are at work, on a work machine, with access to work
accounts.

The landing page is a convincing copy of the vendor's site. Some only serve the
malicious file to visitors who arrive from the ad, in the right country, on
Windows — everyone else, including researchers, sees a harmless page or gets
redirected to the real vendor.

The payload is usually a real installer bundled with something extra. Most
commonly that extra is an infostealer that collects saved passwords, browser
session cookies and crypto wallets within minutes, which I covered in
[infostealer malware protection](/blog/infostealer-malware-protection). Sometimes
it is a loader that gives an access broker a foothold, which is one of the quieter
routes into a [ransomware](/blog/ransomware-protection-small-business) incident.

A newer variation skips the download altogether: the page tells the user to
"verify" or "fix" something by pasting a command into Windows Run or PowerShell.
That is the [ClickFix fake CAPTCHA attack](/blog/clickfix-fake-captcha-attack), and
it is often delivered through the same poisoned search results.

## Signs you've been hit

- Someone installed software recently from a site that was not the vendor's own
  domain — check the browser history for the download URL.
- The installer was an unusually large file, an ISO or ZIP when the vendor ships an
  MSI or EXE, or it asked for admin rights more than once.
- The program worked, but a second process, scheduled task or startup entry appeared
  at the same time.
- Shortly afterwards: Microsoft 365 sign-ins from unfamiliar locations, new inbox
  rules, password reset emails nobody requested, or social media accounts taken
  over.
- Endpoint protection alerts that were dismissed because "it was just the installer".

The account takeovers often happen days later, which is why nobody connects them
to the download.

## How to protect your business

### 1. Remove the need to search for software

Most of this risk exists because staff install their own software. Remove local
admin rights from day-to-day accounts. Publish approved software through Intune,
the Company Portal, winget, or whatever deployment you use, so the answer to "I
need Zoom" is "it is in the portal", not "Google it".

Where people do need something new, the request goes to whoever manages IT. That
is a small amount of friction that removes a large category of incidents.

### 2. Allowlist software sources

Go further where you can. Windows Defender Application Control or AppLocker in
audit mode first, then enforced, so only signed software from publishers you
approve can run. Smart App Control on newer Windows builds does a version of this
for smaller setups. Even a basic rule blocking executables from the Downloads
folder and user temp paths cuts a lot of this off.

### 3. DNS filtering and ad blocking

DNS filtering — Cloudflare Gateway, NextDNS, Quad9, or the filtering built into
your firewall — blocks known malicious and newly registered domains before the
page loads. Newly registered domain blocking alone catches a large share of fake
download sites, because they rarely live long.

Ad blocking on work browsers is a legitimate security control, not just a
convenience. You can deploy uBlock Origin Lite or a similar extension through
Intune or Group Policy for Edge and Chrome. If the ad never renders, nobody clicks
it.

### 4. Teach one habit: type the vendor's address

Training that tries to cover everything gets ignored. This one fits on a sticky
note: for software, go to the vendor's site directly or use the company portal.
Never install from a search ad. Look at the full domain before downloading, not
just the name on the page.

### 5. Endpoint protection that someone watches

Microsoft Defender for Business, included in Microsoft 365 Business Premium, is
enough for most small offices — if it is onboarded properly and someone reads the
alerts. Turn on attack surface reduction rules, especially those that block
executables that do not meet a prevalence, age or trusted-list criterion and block
credential stealing from LSASS.

### 6. Limit what a stolen browser can give away

Infostealers go for browser-saved passwords and session cookies. Use a proper
password manager instead of the browser's built-in store, enforce phishing-resistant
MFA where possible, and use Conditional Access to require compliant devices for
Microsoft 365 so a stolen session is harder to replay elsewhere. The detail is in
[session cookie hijacking](/blog/session-cookie-hijacking).

## What to do if it already happened

1. **Disconnect the machine from the network.** Do not reboot or wipe it yet if you
   want to understand what ran.
2. **From a different, clean device, reset passwords** for every account that was
   saved in or signed in on that browser — email, banking, cloud, social media.
3. **Revoke sessions.** In Microsoft 365, revoke the user's sign-in sessions and
   re-register MFA. A password reset alone does not kill a stolen session cookie.
4. **Check for persistence in Microsoft 365:** inbox rules, forwarding, new MFA
   methods, OAuth app consents, and sign-ins from unfamiliar locations.
5. **Rebuild the machine** from a clean image rather than trying to clean it.
6. **Report the ad or site** to the search engine so it is taken down for the next
   person.

---

If your staff install their own software and you would like to change that without
grinding the office to a halt, [get in touch](/contact). Moving a small team onto
managed software deployment and DNS filtering is usually a few days of work, spread
over a couple of weeks.
