/**
 * Abrid Morocco — Bookings API
 * GET  /api/bookings — List bookings (with search, filter, sort, pagination)
 * POST /api/bookings — Create a new booking
 */

const auth = require('../_lib/auth');
const data = require('../_lib/data');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json');

  // Require authentication
  if (!auth.requireAuth(req, res)) return;

  if (req.method === 'GET') {
    return listBookings(req, res);
  }

  if (req.method === 'POST') {
    return createBooking(req, res);
  }

  return res.status(405).json({ ok: false, error: 'Method not allowed' });
};

function listBookings(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const params = url.searchParams;

  let bookings = data.getBookings();

  // Search
  const search = (params.get('search') || '').toLowerCase();
  if (search) {
    bookings = bookings.filter(function (b) {
      return (b.name || '').toLowerCase().includes(search) ||
        (b.ref || '').toLowerCase().includes(search) ||
        (b.email || '').toLowerCase().includes(search) ||
        (b.trip || '').toLowerCase().includes(search) ||
        (b.phone || '').toLowerCase().includes(search);
    });
  }

  // Filter by status
  const status = params.get('status');
  if (status && status !== 'all') {
    bookings = bookings.filter(function (b) { return b.status === status; });
  }

  // Filter by trip
  const trip = params.get('trip');
  if (trip && trip !== 'all') {
    bookings = bookings.filter(function (b) { return b.trip === trip; });
  }

  // Filter by date range
  const dateFrom = params.get('date_from');
  const dateTo = params.get('date_to');
  if (dateFrom) {
    bookings = bookings.filter(function (b) { return b.travelDate >= dateFrom; });
  }
  if (dateTo) {
    bookings = bookings.filter(function (b) { return b.travelDate <= dateTo; });
  }

  // Sort
  const sortBy = params.get('sort') || 'createdAt';
  const sortOrder = params.get('order') || 'desc';
  bookings.sort(function (a, b) {
    let aVal = a[sortBy] || '';
    let bVal = b[sortBy] || '';
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();
    if (sortOrder === 'asc') return aVal > bVal ? 1 : -1;
    return aVal < bVal ? 1 : -1;
  });

  // Pagination
  const page = parseInt(params.get('page') || '1', 10);
  const limit = parseInt(params.get('limit') || '25', 10);
  const total = bookings.length;
  const startIndex = (page - 1) * limit;
  const paginated = bookings.slice(startIndex, startIndex + limit);

  return res.status(200).json({
    ok: true,
    bookings: paginated,
    total: total,
    page: page,
    limit: limit,
    totalPages: Math.ceil(total / limit),
  });
}

async function createBooking(req, res) {
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

  // Validate required fields
  if (!body.name || !body.email || !body.trip) {
    return res.status(400).json({
      ok: false,
      error: 'Missing required fields: name, email, trip'
    });
  }

  // Sanitize
  const booking = {
    name: String(body.name).slice(0, 100),
    email: String(body.email).slice(0, 120),
    phone: String(body.phone || '').slice(0, 30),
    trip: String(body.trip).slice(0, 200),
    travelers: parseInt(body.travelers, 10) || 1,
    travelDate: body.travelDate || '',
    bookingDate: body.bookingDate || new Date().toISOString(),
    status: body.status || 'new',
    paymentStatus: body.paymentStatus || '',
    assignedTo: body.assignedTo || '',
    notes: String(body.notes || '').slice(0, 2000),
  };

  const created = data.createBooking(booking);
  data.logActivity('booking_created', 'Created booking ' + created.ref + ' for ' + created.name);

  return res.status(201).json({ ok: true, booking: created });
}

function readBody(req) {
  return new Promise(function (resolve) {
    let raw = '';
    req.on('data', function (c) { raw += c; });
    req.on('end', function () { resolve(raw); });
    req.on('error', function () { resolve(''); });
  });
}
