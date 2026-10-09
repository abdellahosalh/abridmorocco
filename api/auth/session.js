/**
 * Abrid Morocco — Check Session
 * GET /api/auth/session
 * Returns { ok: true, authenticated: boolean }
 */

const auth = require('../_lib/auth');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const authenticated = auth.isAuthenticated(req);
  return res.status(200).json({ ok: true, authenticated });
};
