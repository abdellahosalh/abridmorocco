/**
 * Abrid Morocco — Activity Log API
 * GET /api/activity-log — Recent administrative activity
 */

const auth = require('./_lib/auth');
const data = require('./_lib/data');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json');

  if (!auth.requireAuth(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const url = new URL(req.url, 'http://localhost');
  const params = url.searchParams;
  const limit = parseInt(params.get('limit') || '50', 10);

  const log = data.getActivityLog();
  const paginated = log.slice(0, limit);

  return res.status(200).json({
    ok: true,
    activities: paginated,
    total: log.length,
  });
};
