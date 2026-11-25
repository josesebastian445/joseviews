---
title: 'ClickFix fake CAPTCHA attacks: why "press Win+R and paste" is malware'
description: 'The ClickFix fake CAPTCHA attack tricks staff into pasting a malicious command into Windows Run. How it works, the signs, and the controls that block it.'
pubDate: 2026-10-07
tags: ['Security', 'Malware']
draft: false
featured: false
---

The ClickFix fake CAPTCHA attack is the most effective malware delivery trick I
have seen in years, and it requires no exploit at all. The user installs the
malware themselves, by following instructions on a page that looks like a routine
"verify you are human" check.

It works because it borrows two things people already trust: CAPTCHA pages, which
everyone clicks through without thinking, and the idea that a website can ask you
to do something slightly technical to fix a problem.

## How the attack works now

The user lands on a compromised website, a malicious advert, or a link in an email.
The page shows something that looks like a Cloudflare or Google CAPTCHA. When they
click the checkbox, it says verification failed and asks them to complete a few
"verification steps":

1. Press **Windows + R**.
2. Press **Ctrl + V**.
3. Press **Enter**.

What the user does not see is that clicking the checkbox silently copied a command
to their clipboard. Pasting it into the Run dialog executes it. Usually that is a
short PowerShell or `mshta` command that downloads and runs the real payload. The
visible part of the pasted text is often padded with a harmless-looking line such
as "I am not a robot - verification ID 4821", so the dangerous part scrolls out of
view in the small Run box.

Variants keep appearing. Some ask the user to press **Windows + X** and open
Terminal instead of Run. Some pose as a fix for a broken Word document, a missing
font or a failed Teams meeting join. There are macOS versions that ask the user to
paste a command into Terminal.

The payload is most often an infostealer, which takes saved passwords and browser
cookies within seconds. See [infostealer malware protection](/blog/infostealer-malware-protection)
for what happens next. Remote access trojans and ransomware loaders also turn up.
The lure pages themselves usually arrive through
[malvertising and poisoned search results](/blog/malvertising-seo-poisoning).

## Signs you've been hit

- A user mentions a CAPTCHA that asked them to press keys or paste something.
  That is the clearest sign there is; take it seriously even if they say "nothing
  happened".
- The Run history on the machine contains a command the user did not type. It is
  stored in the registry under
  `HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\RunMRU`.
- Defender or your EDR alerting on PowerShell launched from `explorer.exe` with a
  hidden window, encoded commands, or a download from an unfamiliar domain.
- `mshta.exe` making outbound connections. Very little legitimate business software
  does that.
- Shortly afterwards: unexpected sign-ins to Microsoft 365 or other accounts using
  credentials the user had saved in their browser.

## How to protect your business

### 1. Remove the Run dialog for users who don't need it

Most office staff never use Win+R. The Group Policy setting **User Configuration >
Administrative Templates > Start Menu and Taskbar > Remove Run menu from Start
Menu** also disables the Win+R shortcut. In Intune, the equivalent can be applied
through a settings catalog or administrative template profile. Keep it off for IT
staff who genuinely need it.

This does not stop the Terminal variant on its own, but it breaks the most common
version of the attack completely.

### 2. Restrict PowerShell and script hosts

Ordinary users rarely need PowerShell, `mshta.exe`, `wscript.exe` or `cscript.exe`.
Use AppLocker or Windows Defender Application Control (App Control for Business) to
block them for standard users, or at minimum put PowerShell into Constrained
Language Mode for non-admin accounts. Blocking `mshta.exe` outright is low-risk in
most offices and removes a favourite tool of these campaigns.

### 3. Enable attack surface reduction rules

If you use Microsoft Defender for Endpoint or Defender Antivirus on Windows
Pro/Enterprise, enable the relevant ASR rules in block mode after a short audit
period. The useful ones here include **Block execution of potentially obfuscated
scripts** and **Block JavaScript or VBScript from launching downloaded executable
content**. Turn on **Block credential stealing from the Windows local security
authority subsystem** while you are there.

### 4. Remove local admin rights

A standard user account limits what the payload can do and how deeply it can
persist. It will not stop an infostealer from reading that user's own browser data,
which is why the earlier controls matter more, but it reduces the damage.

### 5. Train for this exact pattern

The rule is short enough to remember:

> No legitimate website will ever ask you to press Windows + R, open Terminal, or
> paste anything to prove you are human. If one does, close the tab and tell IT.

Show staff a screenshot of a real ClickFix page. Recognition works far better than
a general warning about "suspicious websites".

### 6. Filter the web traffic

DNS filtering (Cloudflare Gateway, Microsoft Defender's network protection, or your
firewall's web filter) blocks many of the domains these campaigns use for payload
download. It is not complete, but it often stops the second stage even after the
user has pasted the command.

## What to do if it already happened

1. **Disconnect the machine from the network.** Do not shut it down if you may want
   forensic data; just pull it off Wi-Fi and Ethernet.
2. **From a different, clean device, change the user's passwords**, starting with
   Microsoft 365, email, banking and anything saved in the browser on that machine.
   Assume all of them are known to the attacker.
3. **Revoke all Microsoft 365 sessions** for the user in Entra ID. A stolen session
   cookie survives a password reset; see
   [session cookie hijacking](/blog/session-cookie-hijacking).
4. **Run a full EDR scan** and check what the pasted command actually did. The
   RunMRU key and PowerShell logs will usually show it.
5. **Rebuild the machine** if a stealer or remote access tool ran. Cleaning is
   rarely worth the uncertainty.
6. **Review sign-in logs** for every account the user had saved credentials for,
   and check mailbox rules and MFA methods for changes.

## What this doesn't cover

This post focuses on Windows. The macOS variant relies on the user pasting into
Terminal, and the defences are different: managed devices, restricting Terminal
for non-technical staff, and the same training message.

---

If you want the Run dialog, PowerShell and ASR rules locked down across your
office without breaking the tools people actually use, [get in touch](/contact).
It is usually a short piece of work with a pilot group first.
