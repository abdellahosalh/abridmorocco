/**
 * Abrid Morocco — Admin Logout
 * POST /api/auth/logout
 */

const auth = require('../_lib/auth');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  auth.endSession(req, res);
  return res.status(200).json({ ok: true });
};
