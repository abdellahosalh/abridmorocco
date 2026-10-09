/**
 * Abrid Morocco — Single Booking API
 * GET    /api/bookings/:id — Get a booking
 * PUT    /api/bookings/:id — Update a booking
 * DELETE /api/bookings/:id — Delete a booking
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
    const booking = data.getBooking(id);
    if (!booking) return res.status(404).json({ ok: false, error: 'Booking not found' });
    return res.status(200).json({ ok: true, booking });
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

    // Prevent changing the ID
    delete body.id;
    delete body.ref;

    const updated = data.updateBooking(id, body);
    if (!updated) return res.status(404).json({ ok: false, error: 'Booking not found' });

    data.logActivity('booking_updated', 'Updated booking ' + updated.ref);
    return res.status(200).json({ ok: true, booking: updated });
  }

  if (req.method === 'DELETE') {
    const deleted = data.deleteBooking(id);
    if (!deleted) return res.status(404).json({ ok: false, error: 'Booking not found' });

    data.logActivity('booking_deleted', 'Deleted booking ' + id);
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
