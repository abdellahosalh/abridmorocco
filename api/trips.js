/**
 * Abrid Morocco — Trips API
 * GET /api/trips — List trips and experiences
 * 
 * Trip data is extracted from the existing HTML pages in the repository.
 * This provides real trip information without requiring a separate database.
 */

const auth = require('./_lib/auth');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..', '..');

// Known trip/destination pages in the repository
const TRIP_PAGES = [
  '6-day-christmas-morocco.html',
  'agafay.html',
  'air-balloon.html',
  'airport-transfer.html',
  'atlas.html',
  'chefchaouen.html',
  'classic-morocco.html',
  'essaouira.html',
  'fes.html',
  'high-atlas-azilal-imilchil-rich.html',
  'imilchil.html',
  'imperial.html',
  'marrakech.html',
  'merzouga.html',
  'ouzoud-camel-ride.html',
  'ouzoud-quad-tour.html',
  'ouzoud.html',
  'small-group-tour.html',
  'toubkal.html',
  'zagora.html',
];

const DESTINATION_PAGES = [
  'destination-agadir.html',
  'destination-ait-ben-haddou.html',
  'destination-asilah.html',
  'destination-atlas.html',
  'destination-azrou.html',
  'destination-bin-el-ouidane.html',
  'destination-casablanca.html',
  'destination-chefchaouen.html',
  'destination-dades-valley.html',
  'destination-draa-valley.html',
  'destination-el-jadida.html',
  'destination-errachidia.html',
  'destination-essaouira.html',
  'destination-fes.html',
  'destination-ifrane.html',
  'destination-imilchil.html',
  'destination-imlil.html',
  'destination-marrakech.html',
  'destination-meknes.html',
  'destination-merzouga.html',
  'destination-midelt.html',
  'destination-mirleft.html',
  'destination-ouarzazate.html',
  'destination-ourika.html',
  'destination-rabat-casablanca.html',
  'destination-rabat.html',
  'destination-safi.html',
  'destination-sahara.html',
  'destination-skoura.html',
  'destination-taghazout.html',
  'destination-tangier.html',
  'destination-taroudant.html',
  'destination-tetouan.html',
  'destination-tiznit.html',
  'destination-todra-dades.html',
  'destination-todra-gorge.html',
  'destination-zagora.html',
];

/**
 * Extract trip information from an HTML file.
 */
function extractTripInfo(filename) {
  const fp = path.join(ROOT_DIR, filename);
  if (!fs.existsSync(fp)) return null;

  try {
    const html = fs.readFileSync(fp, 'utf8');

    // Extract title
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : filename.replace('.html', '');

    // Extract meta description
    const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
    const description = descMatch ? descMatch[1].trim() : '';

    // Extract H1
    const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    const h1 = h1Match ? h1Match[1].trim() : '';

    // Determine type
    const isDestination = filename.startsWith('destination-');
    const type = isDestination ? 'destination' : 'trip';

    // Extract slug from filename
    const slug = filename.replace('.html', '');

    return {
      id: slug,
      name: title,
      slug: slug,
      type: type,
      description: description,
      h1: h1,
      url: '/' + filename,
      lastModified: fs.statSync(fp).mtime.toISOString(),
    };
  } catch (e) {
    return null;
  }
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json');

  if (!auth.requireAuth(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const url = new URL(req.url, 'http://localhost');
  const params = url.searchParams;
  const type = params.get('type') || 'all';
  const search = (params.get('search') || '').toLowerCase();

  let trips = [];

  // Extract from trip pages
  if (type === 'all' || type === 'trip') {
    TRIP_PAGES.forEach(function (page) {
      const info = extractTripInfo(page);
      if (info) trips.push(info);
    });
  }

  // Extract from destination pages
  if (type === 'all' || type === 'destination') {
    DESTINATION_PAGES.forEach(function (page) {
      const info = extractTripInfo(page);
      if (info) trips.push(info);
    });
  }

  // Search filter
  if (search) {
    trips = trips.filter(function (t) {
      return t.name.toLowerCase().includes(search) ||
        t.description.toLowerCase().includes(search);
    });
  }

  // Sort by name
  trips.sort(function (a, b) { return a.name.localeCompare(b.name); });

  const page = parseInt(params.get('page') || '1', 10);
  const limit = parseInt(params.get('limit') || '50', 10);
  const total = trips.length;
  const startIndex = (page - 1) * limit;
  const paginated = trips.slice(startIndex, startIndex + limit);

  return res.status(200).json({
    ok: true,
    trips: paginated,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
};
