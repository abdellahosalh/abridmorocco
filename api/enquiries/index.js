/**
 * Abrid Morocco — Enquiries API
 * GET  /api/enquiries — List enquiries
 * POST /api/enquiries — Create a new enquiry
 */

const auth = require('../_lib/auth');
const data = require('../_lib/data');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json');

  if (!auth.requireAuth(req, res)) return;

  if (req.method === 'GET') return listEnquiries(req, res);
  if (req.method === 'POST') return createEnquiry(req, res);

  return res.status(405).json({ ok: false, error: 'Method not allowed' });
};

function listEnquiries(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const params = url.searchParams;

  let enquiries = data.getEnquiries();

  const search = (params.get('search') || '').toLowerCase();
  if (search) {
    enquiries = enquiries.filter(function (e) {
      return (e.name || '').toLowerCase().includes(search) ||
        (e.ref || '').toLowerCase().includes(search) ||
        (e.email || '').toLowerCase().includes(search) ||
        (e.trip || '').toLowerCase().includes(search) ||
        (e.destination || '').toLowerCase().includes(search);
    });
  }

  const status = params.get('status');
  if (status && status !== 'all') {
    enquiries = enquiries.filter(function (e) { return e.status === status; });
  }

  const sortBy = params.get('sort') || 'createdAt';
  const sortOrder = params.get('order') || 'desc';
  enquiries.sort(function (a, b) {
    let aVal = a[sortBy] || '';
    let bVal = b[sortBy] || '';
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();
    if (sortOrder === 'asc') return aVal > bVal ? 1 : -1;
    return aVal < bVal ? 1 : -1;
  });

  const page = parseInt(params.get('page') || '1', 10);
  const limit = parseInt(params.get('limit') || '25', 10);
  const total = enquiries.length;
  const startIndex = (page - 1) * limit;
  const paginated = enquiries.slice(startIndex, startIndex + limit);

  return res.status(200).json({
    ok: true,
    enquiries: paginated,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}

async function createEnquiry(req, res) {
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

  if (!body.name || !body.email) {
    return res.status(400).json({ ok: false, error: 'Missing required fields: name, email' });
  }

  const enquiry = {
    name: String(body.name).slice(0, 100),
    email: String(body.email).slice(0, 120),
    phone: String(body.phone || '').slice(0, 30),
    trip: String(body.trip || '').slice(0, 200),
    destination: String(body.destination || '').slice(0, 200),
    arrivalDate: body.arrivalDate || '',
    departureDate: body.departureDate || '',
    adults: parseInt(body.adults, 10) || 1,
    children: parseInt(body.children, 10) || 0,
    budget: String(body.budget || '').slice(0, 50),
    message: String(body.message || '').slice(0, 3000),
    source: String(body.source || '').slice(0, 200),
    status: body.status || 'new',
    assignedTo: body.assignedTo || '',
    notes: String(body.notes || '').slice(0, 2000),
  };

  const created = data.createEnquiry(enquiry);
  data.logActivity('enquiry_created', 'Created enquiry ' + created.ref + ' for ' + created.name);

  return res.status(201).json({ ok: true, enquiry: created });
}

function readBody(req) {
  return new Promise(function (resolve) {
    let raw = '';
    req.on('data', function (c) { raw += c; });
    req.on('end', function () { resolve(raw); });
    req.on('error', function () { resolve(''); });
  });
}
