/**
 * Abrid Morocco — booking card delivery
 * Vercel serverless function: POST /api/booking
 *
 * WHY THIS EXISTS
 * ---------------------------------------------------------------------------
 * FormSubmit's AJAX endpoint silently DROPS every file attachment. Confirmed
 * live against the endpoint: text files, single PDFs, multiple PDFs under one
 * field name and multiple PDFs under separate field names all arrive at the
 * inbox as plain field tables with no files attached, while still replying
 * {"success":"true"}. So the booking card cannot travel that way.
 *
 * This function does the one thing FormSubmit cannot: deliver an attachment.
 * The browser builds the PDFs (it already does, with jsPDF) and posts them
 * here as base64; this function mails them to YOU.
 *
 * THE FLOW
 *   1. book-cart.js posts the field data to FormSubmit  -> your notification
 *   2. book-cart.js posts the same data + both PDFs here -> the card email
 *
 * Step 1 is untouched and still proven, so a failure in this function can
 * never cost you a lead. The browser does not wait for this function either.
 *
 * WHY YOU FORWARD IT MANUALLY
 * ---------------------------------------------------------------------------
 * Resend will only send to the address registered on the Resend account until
 * abridmorocco.com is verified at resend.com/domains. That is not a problem:
 * the card is addressed to you, and you forward it to the guest. So this
 * works from day one with an unverified account, provided CARD_TO is the same
 * address you registered with Resend.
 *
 * To send straight to the guest instead, verify the domain, set CARD_FROM to
 * an address on it, and point CARD_TO at the guest per request.
 *
 * Optional environment variables:
 *   RESEND_API_KEY  Resend key. Without it this function falls back to
 *                   FormSubmit, which delivers the details but no files.
 *   CARD_TO         where the card lands. Defaults to the address below.
 *   CARD_FROM       sender. Verified domain, or onboarding@resend.dev.
 *   CARD_DEBUG      set to "1" to log results to the Vercel logs.
 */

const DEFAULT_TO = 'hello@abridmorocco.com';

/* Where the card lands. Change this line, or set CARD_TO. */
const CARD_TO = process.env.CARD_TO || DEFAULT_TO;

function clean(value, max) {
  return String(value == null ? '' : value)
    .replace(/[\r\n\t]/g, ' ')
    .trim()
    .slice(0, max || 300);
}

function safeName(value) {
  return clean(value, 80).replace(/[^\p{L}\p{M} .'’-]/gu, '').trim();
}

function safePhone(value) {
  return clean(value, 25).replace(/[^\d+()\-.\s]/g, '').trim();
}

/* Only ever accept a genuine inline PDF. Anything else is discarded, so a
   crafted request cannot smuggle in an HTML file or an oversized blob. */
function safePdf(value) {
  var s = String(value == null ? '' : value);
  var marker = s.indexOf('base64,');
  if (marker === -1) return '';
  var b64 = s.slice(marker + 7).replace(/[^A-Za-z0-9+/=]/g, '');
  if (!b64 || b64.length > 3 * 1024 * 1024) return '';   // ~2.25 MB decoded
  return b64;
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function bytesFromBase64(b64) {
  return Math.floor((b64.length * 3) / 4);
}

/* Compact, inline-styled summary. Email clients are hostile to anything
   fancier, so this stays as plain tables. */
function buildHtml(d) {
  function row(k, v, highlight) {
    return '<tr>' +
      '<td style="padding:6px 14px 6px 0;color:#6B6B70;font:600 11px Arial,' +
        'Helvetica,sans-serif;text-transform:uppercase;letter-spacing:.08em;white-space:nowrap">' +
        esc(k) + '</td>' +
      '<td style="padding:6px 0;font:' + (highlight ? '700' : '600') + '14px Arial,Helvetica,sans-serif;' +
        'color:' + (highlight ? '#E4002B' : '#141414') + '">' + esc(v) + '</td>' +
    '</tr>';
  }

  return '<div style="background:#F4F2EF;padding:24px 0;font-family:Arial,Helvetica,sans-serif">' +
  '<div style="max-width:620px;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;border:1px solid #E7E4E0">' +

  '<div style="background:#141414;padding:22px 28px">' +
    '<div style="color:#fff;font-size:16px;font-weight:700;letter-spacing:.14em;text-transform:uppercase">Abrid Morocco Trip</div>' +
    '<div style="color:rgba(255,255,255,.55);font-size:11px;letter-spacing:.12em;text-transform:uppercase;margin-top:5px">Booking card ready to send</div>' +
  '</div>' +

  '<div style="padding:24px 28px">' +
    '<div style="font-size:11px;color:#6B6B70;font-weight:700;letter-spacing:.16em;text-transform:uppercase">Tour</div>' +
    '<div style="font-size:22px;color:#141414;font-weight:700;margin:6px 0 4px">' + esc(d.tour) + '</div>' +
    '<div style="font-size:13px;color:#6B6B70">' + esc(d.dur) + ' &middot; ' + esc(d.price) + '</div>' +

    '<table style="margin-top:20px;border-collapse:collapse">' +
      row('Reference', d.ref, true) +
      row('Name', d.name) +
      row('Email', d.email) +
      row('Phone', d.phone) +
      row('Preferred date', d.dateText) +
      row('Travellers', d.paxText) +
      row('Requests', d.requests) +
    '</table>' +
  '</div>' +

  '<div style="background:#FAFAF9;border-top:1px solid #E7E4E0;padding:16px 28px;font-size:11.5px;color:#6B6B70;line-height:1.6">' +
    'The booking card is attached. Forward this email to the guest, or reply directly — this address is set as Reply-To.' +
  '</div>' +

  '</div></div>';
}

function buildText(d) {
  return [
    'BOOKING CARD READY TO SEND',
    '',
    'Tour:           ' + d.tour,
    'Duration:       ' + d.dur,
    'Price:          ' + d.price,
    'Reference:      ' + d.ref,
    'Name:           ' + d.name,
    'Email:          ' + d.email,
    'Phone:          ' + d.phone,
    'Preferred date: ' + d.dateText,
    'Travellers:     ' + d.paxText,
    'Requests:       ' + d.requests,
    '',
    'The booking card is attached. Forward this email to the guest.',
  ].join('\n');
}

/* ------------------------------------------------------------------ Resend */
function viaResend(apiKey, subject, d, attachments) {
  var payload = {
    from: process.env.CARD_FROM || 'Abrid Morocco <onboarding@resend.dev>',
    to: [CARD_TO],
    subject: subject,
    html: buildHtml(d),
    text: buildText(d),
  };

  /* Resend will only deliver to your own address until the domain is
     verified, so replying straight to the guest cannot be promised yet. */
  if (attachments.length) payload.attachments = attachments;

  return fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  }).then(function (r) {
    return r.text().then(function (t) {
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

/* -------------------------------------------------------------- FormSubmit
   No attachments — that is the whole reason this function exists. Still worth
   having: if the Resend key is missing the guest's details reach you anyway. */
function viaFormSubmit(subject, d) {
  var body = new URLSearchParams();
  body.set('_subject', subject);
  body.set('_template', 'table');
  body.set('_honey', '');
  body.set('Tour', d.tour);
  body.set('Duration', d.dur);
  body.set('Price', d.price);
  body.set('Reference', d.ref);
  body.set('Name', d.name);
  body.set('Email', d.email);
  body.set('Phone', d.phone);
  body.set('Preferred date', d.dateText);
  body.set('Travellers', d.paxText);
  body.set('Requests', d.requests);

  return fetch('https://formsubmit.co/ajax/' + CARD_TO, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Referer': 'https://www.abridmorocco.com/',
      'Origin': 'https://www.abridmorocco.com',
      'Accept': 'application/json, text/plain, */*',
    },
    body: body.toString(),
  }).then(function (r) {
    return r.text().then(function (t) {
      var ok = r.ok && /"success"\s*:\s*"?(true|1)"?/.test(t);
      return { ok: ok, provider: 'formsubmit', status: r.status, detail: t.slice(0, 300) };
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

  /* GET reports which provider is live. Returns no secrets. */
  if (req.method === 'GET') {
    return res.status(200).json({
      ok: true,
      service: 'abrid-booking-card',
      provider: provider,
      sendTo: CARD_TO,
      resendConfigured: hasKey,
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false });
  }

  function readBody(cb) {
    if (typeof req.body === 'object' && req.body !== null) return cb(req.body);
    let raw = '';
    req.on('data', function (c) {
      raw += c;
      if (raw.length > 6 * 1024 * 1024) req.destroy();   // base64 inflates ~33%
    });
    req.on('end', function () {
      try { cb(JSON.parse(raw || '{}')); } catch (e) { cb({}); }
    });
    req.on('error', function () { cb({}); });
  }

  readBody(function (body) {
    const d = {
      tour: clean(body && body.tour, 120),
      dur: clean(body && body.dur, 40),
      price: clean(body && body.price, 60),
      ref: clean(body && body.ref, 30),
      name: safeName(body && body.name),
      email: clean(body && body.email, 120),
      phone: safePhone(body && body.phone),
      dateText: clean(body && body.dateText, 60),
      paxText: clean(body && body.paxText, 30),
      requests: clean(body && body.requests, 600),
    };

    const cardB64 = safePdf(body && body.cardPdf);
    const resvB64 = safePdf(body && body.reservationPdf);

    if (!d.ref) {
      return res.status(200).json({ ok: true, sent: false, provider: provider,
        reason: 'no reference' });
    }

    const attachments = [];
    if (cardB64) {
      attachments.push({ filename: 'booking-card-' + d.ref + '.pdf', content: cardB64 });
    }
    if (resvB64) {
      attachments.push({ filename: 'reservation-' + d.ref + '.pdf', content: resvB64 });
    }

    const subject = 'Booking card ' + d.ref + ' — ' + d.tour +
      (d.name ? ' — ' + d.name : '');

    /* Log booking to data layer for admin dashboard */
    try {
      data.createBooking({
        name: d.name,
        email: d.email,
        phone: d.phone,
        trip: d.tour,
        travelers: parseInt((d.paxText || '1').replace(/\D/g, ''), 10) || 1,
        travelDate: d.dateText || '',
        status: 'new',
        notes: d.requests || '',
        ref: d.ref,
      });
    } catch (e) {
      console.error('[booking-card] Failed to log booking:', e.message);
    }

    /* No key, or no files: FormSubmit can still carry the details. */
    const job = (hasKey && attachments.length)
      ? viaResend(process.env.RESEND_API_KEY, subject, d, attachments)
      : viaFormSubmit(subject, d);

    job.then(function (result) {
      if (process.env.CARD_DEBUG) {
        console.log('[booking-card]', result.provider, 'ref=' + d.ref,
          'files=' + attachments.length,
          'bytes=' + attachments.reduce(function (n, a) { return n + bytesFromBase64(a.content); }, 0),
          'ok=' + result.ok, result.detail);
      }
      return res.status(200).json({
        ok: true,
        sent: !!result.ok,
        provider: result.provider,
        attachments: attachments.length,
        /* Tells the browser to tell the owner the card did NOT arrive. */
        deliverable: result.provider === 'resend' && attachments.length > 0,
      });
    }).catch(function (err) {
      if (process.env.CARD_DEBUG) {
        console.error('[booking-card] failed', err && err.message);
      }
      return res.status(200).json({ ok: true, sent: false, provider: provider, deliverable: false });
    });
  });
};