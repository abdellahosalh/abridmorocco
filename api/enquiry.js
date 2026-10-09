/**
 * Abrid Morocco — WhatsApp enquiry notification
 * Vercel serverless function: POST /api/enquiry
 *
 * Called in the background by the WhatsApp chooser the moment a visitor picks
 * Abdellah or Karim. Sends YOU an email. It never touches the visitor's
 * WhatsApp flow, so a failure here can never cost you a lead.
 *
 * TWO DELIVERY PROVIDERS, CHOSEN AUTOMATICALLY:
 *
 *   1. Resend      - used when the RESEND_API_KEY environment variable is set.
 *                    Proper, deliverable, sends from your own domain.
 *   2. FormSubmit  - used when that variable is missing. No account needed.
 *                    Works immediately, but sends from FormSubmit's address.
 *
 * Either way the visitor reaches WhatsApp regardless of whether this function
 * succeeds, exists, or is deployed at all.
 *
 * The API key is NEVER written into this file. It lives only in the Vercel
 * environment variable, so it can never reach git history or this source.
 *
 * Optional environment variables:
 *   RESEND_API_KEY   Resend key. Set this to switch provider.
 *   ENQUIRY_TO       destination address. Defaults to the address below.
 *   ENQUIRY_FROM     sender for Resend. Verified domain or onboarding@resend.dev.
 *   ENQUIRY_DEBUG    set to "1" to log delivery results to the Vercel logs.
 *
 * Optional environment variables for submission logging:
 *   NEXT_PUBLIC_SUPABASE_URL  Supabase project URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY  Supabase anon key
 *
 * ——— SUBMISSION LOGGING ———
 * If NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set,
 * each enquiry will also be stored in a Supabase table called
 * form_submissions for later review in the admin dashboard.
 *
 * ---------------------------------------------------------------------------
 * IMPORTANT - READ BEFORE CHOOSING A DESTINATION
 * ---------------------------------------------------------------------------
 * Resend will only send to hello@abridmorocco.com once the abridmorocco.com
 * domain is verified. Until then the account can send to ONE address only:
 * the address registered on the Resend account.
 *
 * Verified against the live API:
 *   to hello@abridmorocco.com -> 403 "You can only send testing emails to
 *                                your own email address"
 *   to the account owner     -> 200 {"id":"..."}   delivered
 *
 * So, with Resend and no verified domain:
 *   ENQUIRY_TO must be the address registered on your Resend account.
 *   Anything else silently fails.
 *
 * To send to hello@abridmorocco.com, verify the domain at resend.com/domains
 * (add their 3 DNS records), then set ENQUIRY_FROM to an address on that
 * domain. Until then, either use FormSubmit (no account, delivers to any
 * address) or point ENQUIRY_TO at your Resend account email.
 * ---------------------------------------------------------------------------
 */

const ABDELLAH = '212762934488';
const KARIM = '212609282538';

/* Where the notification lands. Change this one line to redirect it. */
const NOTIFY_EMAIL = process.env.ENQUIRY_TO || 'hello@abridmorocco.com';

/* Vercel's edge network already resolves the visitor's country and sends it
   on every request, so no paid geo-IP lookup and no third party is needed. */
function countryFrom(req) {
  const h = req.headers || {};
  const candidates = [
    h['x-vercel-ip-country'],
    h['cf-ipcountry'],              // in case Cloudflare is ever placed in front
    h['x-country-code'],
  ];
  for (const c of candidates) {
    if (c && c !== 'XX' && c !== 'T1') return String(c).toUpperCase();
  }
  return 'UNKNOWN';
}

function clean(value, max) {
  return String(value == null ? '' : value)
    .replace(/[\r\n\t]/g, ' ')
    .trim()
    .slice(0, max || 200);
}

/* Client-supplied details. Kept deliberately permissive on letters so French
   and Spanish names and accents survive, but hard-limited in length and
   stripped of anything that could corrupt the email body. */
function safeName(value) {
  return clean(value, 80).replace(/[^\p{L}\p{M} .'’-]/gu, '').trim();
}

function safePhone(value) {
  /* keep digits and the few symbols a phone number legitimately uses */
  return clean(value, 25).replace(/[^\d+()\-.\s]/g, '').trim();
}

function rowsFor(who, number, country, page, ref, when, name, phone) {
  return {
    name: name || 'not given',
    phone: phone || 'not given',
    country: country,
    who: who,
    chosen_whatsapp: '+' + number,
    page: page,
    referrer: ref || '-',
    time: when,
    note: 'They are now in WhatsApp with you. Reply directly - the chat is already open.',
  };
}

/* ------------------------------------------------------------------ Resend */
function viaResend(apiKey, subject, rows) {
  const lines = Object.keys(rows).map(function (k) {
    return '<tr><td style="padding:4px 12px 4px 0;color:#666;font:14px Arial">' +
      k + '</td><td style="padding:4px 0;font:14px Arial">' +
      String(rows[k]).replace(/[<>&]/g, '') + '</td></tr>';
  }).join('');

  const html = '<table cellpadding="0" cellspacing="0" style="font-family:Arial">' +
    lines + '</table>';

  const text = Object.keys(rows).map(function (k) {
    return k + ': ' + rows[k];
  }).join('\n');

  return fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.ENQUIRY_FROM || 'Abrid Morocco <onboarding@resend.dev>',
      to: [NOTIFY_EMAIL],
      subject: subject,
      html: html,
      text: text,
    }),
  }).then(function (r) {
    return r.text().then(function (t) {
      /* Resend uses real HTTP status codes, but 200 with an "error" key has
         been seen, so check the body as well as the status. */
      var ok = r.ok;
      var detail = t.slice(0, 400);
      try {
        var j = JSON.parse(t);
        if (j && (j.error || j.errors)) ok = false;
        if (j && j.id) detail = 'id=' + j.id;
      } catch (e) { /* keep raw text */ }
      return { ok: ok, provider: 'resend', status: r.status, detail: detail };
    });
  });
}

/* -------------------------------------------------------------- FormSubmit */
function viaFormSubmit(subject, rows) {
  const body = new URLSearchParams();
  body.set('_subject', subject);
  body.set('_template', 'table');
  body.set('_honey', '');           // silently dropped if a bot fills it
  Object.keys(rows).forEach(function (k) { body.set(k, rows[k]); });

  return fetch('https://formsubmit.co/ajax/' + NOTIFY_EMAIL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      /* FormSubmit rejects requests that do not look like they came from a web
         page. Verified against the live endpoint: the same POST returns
         {"success":"false","message":"Make sure you open this page through a
         web server..."} with no Referer, and is accepted once one is present. */
      'Referer': 'https://www.abridmorocco.com/',
      'Origin': 'https://www.abridmorocco.com',
      'Accept': 'application/json, text/plain, */*',
    },
    body: body.toString(),
  }).then(function (r) {
    return r.text().then(function (t) {
      /* FormSubmit reports failures as HTTP 200 with success:false, so the
         body has to be inspected rather than trusting r.ok. */
      var ok = r.ok && /"success"\s*:\s*"?(true|1)"?/.test(t);
      return {
        ok: ok,
        provider: 'formsubmit',
        status: r.status,
        detail: t.slice(0, 300),
      };
    });
  });
}

/* ------------------------------------------------------------------ handler */
const data = require('./_lib/data');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json');

  const hasKey = !!process.env.RESEND_API_KEY;
  const provider = hasKey ? 'resend' : 'formsubmit';

  /* GET reports which provider is live. Useful for confirming the environment
     variable took effect. Returns no secrets. */
  if (req.method === 'GET') {
    return res.status(200).json({
      ok: true,
      service: 'abrid-enquiry',
      provider: provider,
      notify: NOTIFY_EMAIL,
      resendConfigured: hasKey,
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false });
  }

  /* sendBeacon can only post text/plain, so the body arrives as a raw string. */
  function readBody(cb) {
    if (typeof req.body === 'object' && req.body !== null) return cb(req.body);
    let raw = '';
    req.on('data', function (c) {
      raw += c;
      if (raw.length > 20000) req.destroy();
    });
    req.on('end', function () {
      try {
        cb(JSON.parse(raw || '{}'));
      } catch (e) {
        cb({});
      }
    });
    req.on('error', function () { cb({}); });
  }

  readBody(function (body) {
    const person = body && body.person === 'karim' ? 'karim' : 'abdellah';
    const number = person === 'karim' ? KARIM : ABDELLAH;
    const who = person === 'karim' ? 'Karim' : 'Abdellah';

    const country = countryFrom(req);
    const page = clean(body && body.page, 160) || '/';
    const ref = clean(body && body.ref, 120);
    const when = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

    const name = safeName(body && body.name);
    const phone = safePhone(body && body.phone);

    const subject = 'WhatsApp enquiry - '
      + (name ? name + ' - ' : '')
      + who + ' - ' + country
      + (phone ? ' - ' + phone : '');

    const rows = rowsFor(who, number, country, page, ref, when, name, phone);

    /* Log enquiry to data layer for admin dashboard */
    try {
      data.createEnquiry({
        name: name,
        phone: phone,
        destination: page,
        source: page,
        message: 'WhatsApp enquiry via ' + who,
        status: 'new',
      });
    } catch (e) {
      console.error('[enquiry] Failed to log enquiry:', e.message);
    }

    const job = hasKey
      ? viaResend(process.env.RESEND_API_KEY, subject, rows)
      : viaFormSubmit(subject, rows);

    /* ── auto-log submission to admin panel ───────────────────────*/
    const logSubmission = async () => {
      try {
        const res = await fetch('https://api.abridmorocco.com/submissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name || '',
            phone: phone || '',
            page: page || '/',
            ref: ref || '-',
            person: who,
            country: country,
          })
        })
        const data = await res.json()
        console.log('[submission-log]', data)
      } catch (e) {
        // never block WhatsApp if logging fails
      }
    }

    logSubmission()
    job.then(function (result) {
      if (process.env.ENQUIRY_DEBUG) {
        console.log('[enquiry]', result.provider, who, country, page,
          'ok=' + result.ok, result.detail);
      }
      /* Always 200. The visitor's WhatsApp has already opened, so a mail
         problem must never turn into a failed request. */
      return res.status(200).json({
        ok: true,
        sent: !!result.ok,
        provider: result.provider,
      });
    }).catch(function (err) {
      if (process.env.ENQUIRY_DEBUG) {
        console.error('[enquiry] failed', err && err.message);
      }
      return res.status(200).json({ ok: true, sent: false, provider: provider });
    });
  });
};