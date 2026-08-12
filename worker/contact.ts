/**
 * Contact form handler.
 *
 * The site itself is fully static, so this is the only server-side code in the
 * project. It runs on Cloudflare Workers alongside the static assets.
 *
 * Environment (Cloudflare dashboard → Settings → Variables and Secrets):
 *   RESEND_API_KEY        — secret, from resend.com
 *   CONTACT_TO            — inbox that receives enquiries
 *   CONTACT_FROM          — verified sender on your Resend domain
 *   TURNSTILE_SECRET_KEY  — optional secret; enables bot verification
 *   RATE_LIMIT            — optional KV binding for per-IP throttling
 *
 * If the mail credentials are absent this fails loudly rather than silently
 * accepting submissions that go nowhere — a form that says "sent" while
 * dropping the message is the worst possible failure mode.
 */

export interface Env {
  ASSETS: Fetcher;
  RESEND_API_KEY?: string;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
  TURNSTILE_SECRET_KEY?: string;
  RATE_LIMIT?: KVNamespace;
}

const MAX_FIELD = 5000;
const RATE_WINDOW_SECONDS = 900; // 15 minutes
const RATE_MAX = 5;

/**
 * C0/C1 control characters, minus tab, newline and carriage return so that
 * multi-line messages survive intact. Built from a string so this source file
 * never contains literal control bytes.
 */
const CONTROL_CHARS = new RegExp(
  '[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F\\u007F-\\u009F]',
  'g'
);

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

/**
 * Strips control characters and caps length so nothing odd reaches the email.
 * Takes `unknown` because a FormData entry may be a File, and the workers-types
 * lib does not ship the DOM's FormDataEntryValue alias.
 */
function clean(value: unknown, max = MAX_FIELD): string {
  if (typeof value !== 'string') return '';
  return value.replace(CONTROL_CHARS, '').trim().slice(0, max);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Header injection guard for anything interpolated into a mail header. */
function safeHeader(value: string): string {
  return value.replace(/[\r\n]/g, ' ').slice(0, 200);
}

async function verifyTurnstile(token: string, secret: string, ip: string): Promise<boolean> {
  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });
  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}

export async function handleContact(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed.' }, 405);
  }

  const ip = request.headers.get('CF-Connecting-IP') ?? '';

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ error: 'Expected form data.' }, 400);
  }

  // --- honeypot: accept silently so bots learn nothing from the response ---
  if (clean(form.get('company_website'))) {
    return json({ ok: true });
  }

  // --- rate limit, if a KV namespace is bound ---
  if (env.RATE_LIMIT && ip) {
    const key = `contact:${ip}`;
    const current = Number((await env.RATE_LIMIT.get(key)) ?? '0');
    if (current >= RATE_MAX) {
      return json({ error: 'Too many messages. Please try again later or use WhatsApp.' }, 429);
    }
    await env.RATE_LIMIT.put(key, String(current + 1), { expirationTtl: RATE_WINDOW_SECONDS });
  }

  // --- Turnstile, if configured ---
  if (env.TURNSTILE_SECRET_KEY) {
    const token = clean(form.get('cf-turnstile-response'), 2048);
    if (!token || !(await verifyTurnstile(token, env.TURNSTILE_SECRET_KEY, ip))) {
      return json({ error: 'Verification failed. Please reload and try again.' }, 400);
    }
  }

  const name = clean(form.get('name'), 200);
  const email = clean(form.get('email'), 320);
  const company = clean(form.get('company'), 200);
  const budget = clean(form.get('budget'), 100);
  const message = clean(form.get('message'));
  const needs = form
    .getAll('needs')
    .map((n) => clean(n, 100))
    .filter(Boolean);

  if (!name || !email || message.length < 20) {
    return json({ error: 'Please fill in your name, email and a message.' }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return json({ error: 'That email address does not look right.' }, 400);
  }

  if (!env.RESEND_API_KEY || !env.CONTACT_TO || !env.CONTACT_FROM) {
    console.error(
      'Contact form is not configured: missing RESEND_API_KEY, CONTACT_TO or CONTACT_FROM.'
    );
    return json(
      { error: 'The contact form is not configured yet. Please email or WhatsApp me.' },
      500
    );
  }

  const rows: [string, string][] = [
    ['Name', name],
    ['Email', email],
    ['Company', company || '—'],
    ['Budget', budget || 'Not specified'],
    ['Needs', needs.join(', ') || '—'],
    ['IP', ip || '—'],
  ];

  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:640px">
      <h2 style="margin:0 0 16px">New enquiry from joseviews.com</h2>
      <table style="border-collapse:collapse;width:100%;font-size:14px">
        ${rows
          .map(
            ([label, value]) =>
              `<tr><td style="padding:6px 12px 6px 0;color:#666;white-space:nowrap">${label}</td><td style="padding:6px 0"><strong>${escapeHtml(value)}</strong></td></tr>`
          )
          .join('')}
      </table>
      <h3 style="margin:24px 0 8px">Message</h3>
      <p style="white-space:pre-wrap;line-height:1.6;font-size:15px">${escapeHtml(message)}</p>
    </div>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM,
      to: [env.CONTACT_TO],
      reply_to: safeHeader(email),
      subject: `Enquiry from ${safeHeader(name)}${company ? ` (${safeHeader(company)})` : ''}`,
      html,
    }),
  });

  if (!res.ok) {
    console.error('Resend rejected the message', res.status, await res.text());
    return json({ error: 'Could not send the message. Please email or WhatsApp me instead.' }, 502);
  }

  return json({ ok: true });
}
