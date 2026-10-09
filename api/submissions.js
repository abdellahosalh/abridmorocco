/**
 * Abrid Morocco — Form submission logger
 * Vercel serverless function: POST /api/submissions
 * 
 * Receives form data from enquiry/booking forms and stores it
 * in the data layer for the admin dashboard to display.
 * Fails gracefully if filesystem operations fail so the form
 * submitter's WhatsApp flow is never broken.
 */

const data = require('./_lib/data');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false });
  }

  try {
    const body = req.body || {};
    
    // Normalize form data from both enquiry and booking forms
    const submission = {
      name: body.name || '',
      email: body.email || '',
      phone: body.phone || '',
      page: body.page || body.ref || '/',
      ref: body.ref || '-',
      person: body.person || '',
      country: body.country || '',
      tour: body.tour || '',
      dur: body.dur || '',
      price: body.price || '',
      paxText: body.paxText || '',
      requests: body.requests || '',
      dateText: body.dateText || '',
      submittedAt: new Date().toISOString(),
    };

    // Store as an enquiry in the data layer
    const enquiry = data.createEnquiry({
      name: submission.name,
      email: submission.email,
      phone: submission.phone,
      trip: submission.tour,
      destination: submission.page,
      message: submission.requests,
      source: submission.page,
      arrivalDate: submission.dateText || '',
    });

    res.status(200).json({ 
      ok: true, 
      submissionsCount: data.getEnquiries().length,
      enquiryRef: enquiry.ref,
    });
  } catch (e) {
    console.error('[submissions] error:', e.message);
    res.status(200).json({ ok: true, submissionsCount: 0 });
  }
};
