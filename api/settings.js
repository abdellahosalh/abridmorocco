/**
 * Abrid Morocco — Settings API
 * GET /api/settings — Get admin settings
 * PUT /api/settings — Update settings
 */

const auth = require('./_lib/auth');
const data = require('./_lib/data');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json');

  if (!auth.requireAuth(req, res)) return;

  if (req.method === 'GET') {
    const settings = data.getSettings();
    return res.status(200).json({ ok: true, settings });
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

    // Only allow updating specific fields
    const allowed = ['businessName', 'contactEmail', 'defaultCurrency', 'supportedLanguages'];
    const updates = {};
    allowed.forEach(function (key) {
      if (body[key] !== undefined) updates[key] = body[key];
    });

    const updated = data.updateSettings(updates);
    data.logActivity('settings_updated', 'Updated settings: ' + Object.keys(updates).join(', '));
    return res.status(200).json({ ok: true, settings: updated });
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
