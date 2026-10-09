/**
 * Abrid Morocco — Customers API
 * GET /api/customers — Customer directory derived from bookings + enquiries
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
  const search = (params.get('search') || '').toLowerCase();

  let customers = data.getCustomers();

  if (search) {
    customers = customers.filter(function (c) {
      return (c.name || '').toLowerCase().includes(search) ||
        (c.email || '').toLowerCase().includes(search) ||
        (c.phone || '').toLowerCase().includes(search);
    });
  }

  // Sort by last interaction (most recent first)
  customers.sort(function (a, b) {
    return new Date(b.lastInteraction || 0) - new Date(a.lastInteraction || 0);
  });

  const page = parseInt(params.get('page') || '1', 10);
  const limit = parseInt(params.get('limit') || '25', 10);
  const total = customers.length;
  const startIndex = (page - 1) * limit;
  const paginated = customers.slice(startIndex, startIndex + limit);

  return res.status(200).json({
    ok: true,
    customers: paginated,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
};
