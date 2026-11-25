---
title: 'Ransomware protection for a small business when attackers steal data first'
description: 'Ransomware protection for a small business in 2026 means planning for double extortion: data theft before encryption. The controls that actually matter, in order.'
pubDate: 2026-11-25
tags: ['Security', 'Malware']
draft: false
featured: false
---

Ransomware protection for a small business used to mean one thing: have a backup
you can restore from. If the files got encrypted, you wiped the machines, restored,
and lost a few days.

That is no longer enough. Modern ransomware groups steal your data first and
encrypt it second. When you restore from backup and refuse to pay, they threaten to
publish your client files, payroll and contracts instead. That is double extortion,
and it changes what "protected" means.

Backups still matter — they are how you recover. But they do nothing about the
copy of your data that is already sitting on someone else's server.

## How the attack works now

The encryption is the last step, not the first. By the time a ransom note appears,
the attacker has usually been inside for days.

**Getting in.** The common entry points for a small office are boring:

- An unpatched firewall or VPN appliance. Edge devices are a favourite target
  because they sit on the internet and are rarely updated. More on that in
  [firewall and VPN zero-day exploits](/blog/firewall-vpn-zero-day-exploits).
- Valid credentials, often harvested by
  [infostealer malware](/blog/infostealer-malware-protection) from a staff
  member's home PC and then sold.
- Remote Desktop exposed directly to the internet.
- A phishing email or a fake software download.

**Moving around.** Once inside, they look for an account with admin rights,
find the file server, the NAS and the backup system, and map what is worth
stealing.

**Stealing.** Data is copied out using ordinary tools — cloud sync utilities,
file transfer programs, sometimes just a browser upload to a file-sharing site.
Nothing about it looks like malware.

**Breaking recovery.** Before encrypting, they delete Windows shadow copies,
log in to the backup console with the admin credentials they found, and delete or
encrypt the backups. If your backup NAS is on the same network with the same
admin password, assume it goes too.

**Encrypting and extorting.** Then the encryption runs, usually overnight or at
the weekend, and the note points to a leak site with a countdown.

## Signs you've been hit

The obvious sign is files you cannot open and a ransom note on every desktop. The
useful signs come earlier:

- Antivirus or EDR alerts that were dismissed, or Defender being disabled on a
  machine nobody touched.
- New local or domain admin accounts you did not create.
- Remote access tools (AnyDesk, ScreenConnect and similar) installed on servers
  where nobody put them.
- Unusually large outbound uploads, especially at night.
- Backup jobs failing, or retention settings changed.
- VPN logins at odd hours or from countries where you have no staff.

If any of these show up, treat it as an incident now rather than waiting to see
what happens.

## How to protect your business

### 1. Close the front doors

Patch your firewall and VPN on a schedule, and subscribe to the vendor's security
advisories so you hear about critical fixes the day they ship. Enforce MFA on the
VPN. Never expose RDP to the internet — put it behind the VPN or remove it.

### 2. Make backups the attacker cannot delete

The 3-2-1 rule still applies — three copies, two media, one off-site — but add
the part that matters against ransomware: **one copy must be immutable**.

That means object-lock storage (S3-compatible buckets with Object Lock in
compliance mode, or a provider's equivalent), a hardened backup repository, or
offline media. The test is simple: if someone has your domain admin password, can
they delete the backups? If yes, they are not protected.

Use separate credentials for the backup system, not domain accounts, and put MFA
on the backup console. Then restore something, as I describe in the
[small office security baseline](/blog/small-office-security-baseline).

### 3. Turn on the endpoint protection you already have

If you are on Microsoft 365 Business Premium, you already own Defender for
Business. Make sure it is actually onboarded on every device, with:

- **Tamper protection** on, so an attacker cannot simply switch it off.
- **Attack surface reduction rules** in block mode, including the rule for
  advanced ransomware protection and the rule blocking credential theft from
  LSASS.
- **Automated investigation and response** enabled, so a detection at 2 a.m.
  isolates the machine instead of waiting for Monday.

### 4. Remove standing admin rights

Staff do not need local admin on their laptops. Use Windows LAPS so every
machine has a different local admin password. Keep domain and Microsoft 365
admin accounts separate from day-to-day accounts, and do not use them to read
email or browse.

### 5. Reduce what there is to steal

Double extortion only works if the data is worth something. Archive old client
files you no longer need to keep, restrict file shares so each team sees only
its own folders, and keep sensitive data like passports and payroll out of
general shared drives.

### 6. Watch outbound traffic

Your firewall can alert on large outbound transfers and block known file-sharing
and anonymisation services. It will not catch everything, but exfiltration is the
step where the attacker spends the most time, and it is the step most small
offices never look at.

## What to do if it already happened

In order:

1. **Isolate, do not power off.** Unplug network cables and disable Wi-Fi on
   affected machines. Leaving them on preserves evidence in memory.
2. **Disconnect the backups** you still have so they are not encrypted next.
3. **Call your cyber insurer** before anything else if you have a policy. Most
   require notification and have an approved incident response firm.
4. **Get incident response help.** Someone needs to establish how they got in,
   or you will restore straight back into a compromised network.
5. **Report it.** File a report with the police through the UAE eCrime platform
   or your local police station. If you hold personal data, check your
   notification obligations under UAE data protection law, and under any
   free zone regime you operate in.
6. **Check for a free decryptor** on the No More Ransom project before
   assuming the data is lost.
7. **Do not negotiate or pay on your own.** Paying does not guarantee the data
   is deleted, and some groups are sanctioned, which creates legal exposure.
   That decision needs legal advice.
8. **Reset every credential** — domain, Microsoft 365, VPN, backup, firewall —
   from a clean device, once the attacker's access is confirmed gone.

## What this doesn't cover

This is about the controls a 10 to 100 person business can realistically run.
It does not replace a managed detection and response service, a tested incident
response retainer, or the specific requirements of a regulated entity. If you hold
large volumes of sensitive personal or financial data, you need those too.

---

If you want someone to check whether your backups would survive an attacker with
admin access, [get in touch](/contact). That single question is the one most worth
answering before you need to.
