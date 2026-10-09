/**
 * Abrid Morocco — Single Enquiry API
 * GET    /api/enquiries/:id
 * PUT    /api/enquiries/:id
 * DELETE /api/enquiries/:id
 */

const auth = require('../_lib/auth');
const data = require('../_lib/data');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json');

  if (!auth.requireAuth(req, res)) return;

  const url = new URL(req.url, 'http://localhost');
  const id = url.pathname.split('/').pop();

  if (req.method === 'GET') {
    const enquiry = data.getEnquiry(id);
    if (!enquiry) return res.status(404).json({ ok: false, error: 'Enquiry not found' });
    return res.status(200).json({ ok: true, enquiry });
  }

  if (req.method === 'PUT') {
    let body = {};
    try {
      if (typeof req.body === 'object' && req.body !== null) {
        body = req.body;
      } else {
        const raw = await readBody(req);
        body = JSON.parse(raw || '{}');
      }
    } catch (e) {
      return res.status(400).json({ ok: false, error: 'Invalid request body' });
    }

    delete body.id;
    delete body.ref;

    const updated = data.updateEnquiry(id, body);
    if (!updated) return res.status(404).json({ ok: false, error: 'Enquiry not found' });

    data.logActivity('enquiry_updated', 'Updated enquiry ' + updated.ref);
    return res.status(200).json({ ok: true, enquiry: updated });
  }

  if (req.method === 'DELETE') {
    const deleted = data.deleteEnquiry(id);
    if (!deleted) return res.status(404).json({ ok: false, error: 'Enquiry not found' });

    data.logActivity('enquiry_deleted', 'Deleted enquiry ' + id);
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ ok: false, error: 'Method not allowed' });
};

function readBody(req) {
  return new Promise(function (resolve) {
    let raw = '';
    req.on('data', function (c) { raw += c; });
    req.on('end', function () { resolve(raw); });
    req.on('error', function () { resolve(''); });
  });
}
