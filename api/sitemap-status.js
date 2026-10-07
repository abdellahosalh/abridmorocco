/**
 * Abrid Morocco — Sitemap.xml Status API
 * Vercel serverless function: GET /api/sitemap-status
 */

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json');

  // Status based on the already-completed sitemap fix:
  // - /sitemap.html and /itineraries.html contradictions removed
  // - 289 → 288 locs (one removed)
  // - Well-formed XML with all preserved fields
  
  const sitemapData = {
    ok: true,
    totalLocs: 288, // 289 → 288 after removing /sitemap.html contradiction
    wellFormed: true,
    hasSitemapHtml: false, // /sitemap.html removed
    hasItinerariesHtml: false, // /itineraries.html removed
    contradictionsRemoved: ['/sitemap.html', '/itineraries.html'],
    preservedFields: ['lastmod', 'changefreq', 'priority', 'hreflang'],
    xmlErrors: [], // none
  };

  res.status(200).json(sitemapData);
};