/**
 * Abrid Morocco — CSV Export API
 * GET /api/export?type=bookings|enquiries — Export data as CSV
 */

const auth = require('./_lib/auth');
const data = require('./_lib/data');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (!auth.requireAuth(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const url = new URL(req.url, 'http://localhost');
  const type = url.searchParams.get('type') || 'bookings';

  let rows = [];
  let filename = '';

  if (type === 'bookings') {
    rows = data.getBookings();
    filename = 'abrid-bookings.csv';
  } else if (type === 'enquiries') {
    rows = data.getEnquiries();
    filename = 'abrid-enquiries.csv';
  } else {
    return res.status(400).json({ ok: false, error: 'Invalid export type' });
  }

  if (rows.length === 0) {
    return res.status(404).json({ ok: false, error: 'No data to export' });
  }

  // Build CSV
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(','),
    ...rows.map(function (row) {
      return headers.map(function (h) {
        const val = String(row[h] || '').replace(/"/g, '""');
        return '"' + val + '"';
      }).join(',');
    })
  ].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="' + filename + '"');
  return res.status(200).send(csv);
};
