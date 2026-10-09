/**
 * Abrid Morocco — Analytics API
 * GET /api/analytics — Business metrics from real booking/enquiry data
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

  const bookings = data.getBookings();
  const enquiries = data.getEnquiries();

  // Booking status distribution
  const statusCounts = {};
  bookings.forEach(function (b) {
    statusCounts[b.status] = (statusCounts[b.status] || 0) + 1;
  });

  // Enquiry status distribution
  const enquiryStatusCounts = {};
  enquiries.forEach(function (e) {
    enquiryStatusCounts[e.status] = (enquiryStatusCounts[e.status] || 0) + 1;
  });

  // Bookings over time (by month)
  const bookingsByMonth = {};
  bookings.forEach(function (b) {
    if (b.createdAt) {
      const month = b.createdAt.slice(0, 7); // YYYY-MM
      bookingsByMonth[month] = (bookingsByMonth[month] || 0) + 1;
    }
  });

  // Enquiries over time (by month)
  const enquiriesByMonth = {};
  enquiries.forEach(function (e) {
    if (e.createdAt) {
      const month = e.createdAt.slice(0, 7);
      enquiriesByMonth[month] = (enquiriesByMonth[month] || 0) + 1;
    }
  });

  // Popular trips
  const tripCounts = {};
  bookings.forEach(function (b) {
    if (b.trip) tripCounts[b.trip] = (tripCounts[b.trip] || 0) + 1;
  });
  const popularTrips = Object.keys(tripCounts)
    .map(function (t) { return { name: t, count: tripCounts[t] }; })
    .sort(function (a, b) { return b.count - a.count; })
    .slice(0, 10);

  // Popular destinations (from enquiries)
  const destCounts = {};
  enquiries.forEach(function (e) {
    if (e.destination) destCounts[e.destination] = (destCounts[e.destination] || 0) + 1;
  });
  const popularDestinations = Object.keys(destCounts)
    .map(function (d) { return { name: d, count: destCounts[d] }; })
    .sort(function (a, b) { return b.count - a.count; })
    .slice(0, 10);

  // Lead sources
  const sourceCounts = {};
  enquiries.forEach(function (e) {
    const src = e.source || 'direct';
    sourceCounts[src] = (sourceCounts[src] || 0) + 1;
  });
  const leadSources = Object.keys(sourceCounts)
    .map(function (s) { return { source: s, count: sourceCounts[s] }; })
    .sort(function (a, b) { return b.count - a.count; });

  // Conversion rate (enquiries -> bookings)
  const conversionRate = enquiries.length > 0
    ? Math.round((bookings.length / enquiries.length) * 100)
    : 0;

  // Upcoming departures
  const now = new Date();
  const upcomingDepartures = bookings
    .filter(function (b) {
      return b.travelDate && new Date(b.travelDate) > now &&
        (b.status === 'confirmed' || b.status === 'awaiting_confirmation');
    })
    .sort(function (a, b) { return new Date(a.travelDate) - new Date(b.travelDate); })
    .slice(0, 10);

  return res.status(200).json({
    ok: true,
    analytics: {
      totalBookings: bookings.length,
      totalEnquiries: enquiries.length,
      bookingStatusDistribution: statusCounts,
      enquiryStatusDistribution: enquiryStatusCounts,
      bookingsByMonth: bookingsByMonth,
      enquiriesByMonth: enquiriesByMonth,
      popularTrips: popularTrips,
      popularDestinations: popularDestinations,
      leadSources: leadSources,
      conversionRate: conversionRate,
      upcomingDepartures: upcomingDepartures,
    }
  });
};
