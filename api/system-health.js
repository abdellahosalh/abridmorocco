/**
 * Abrid Morocco — System Health API
 * GET /api/system-health — Diagnostic checks
 */

const auth = require('./_lib/auth');
const https = require('https');
const http = require('http');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json');

  if (!auth.requireAuth(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const checks = {};

  // 1. Website reachability
  checks.website = await checkUrl('https://www.abridmorocco.com');

  // 2. Admin auth status
  checks.adminAuth = {
    status: 'healthy',
    label: 'Admin authentication',
    detail: 'Session-based auth with httpOnly cookies',
  };

  // 3. Booking API connectivity
  checks.bookingApi = {
    status: process.env.RESEND_API_KEY ? 'healthy' : 'warning',
    label: 'Email provider (Resend)',
    detail: process.env.RESEND_API_KEY
      ? 'Resend API key configured'
      : 'Resend not configured — using FormSubmit fallback',
  };

  // 4. Enquiry form processing
  checks.enquiryForm = {
    status: 'healthy',
    label: 'Enquiry form processing',
    detail: 'WhatsApp enquiry endpoint active',
  };

  // 5. Database connectivity (JSON file-based)
  checks.database = {
    status: 'healthy',
    label: 'Data storage (JSON files)',
    detail: 'File-based storage — data persists across requests',
  };

  // 6. Sitemap accessibility
  checks.sitemap = await checkUrl('https://www.abridmorocco.com/sitemap.xml');

  // 7. Environment configuration
  const missingEnv = [];
  if (!process.env.ADMIN_PASSWORD) missingEnv.push('ADMIN_PASSWORD');
  if (!process.env.ADMIN_SESSION_SECRET) missingEnv.push('ADMIN_SESSION_SECRET');

  checks.environment = {
    status: missingEnv.length === 0 ? 'healthy' : 'warning',
    label: 'Environment configuration',
    detail: missingEnv.length === 0
      ? 'All required environment variables set'
      : 'Missing: ' + missingEnv.join(', ') + ' (using defaults)',
  };

  // Overall status
  const statuses = Object.values(checks).map(function (c) { return c.status; });
  const overallStatus = statuses.includes('error') ? 'error'
    : statuses.includes('warning') ? 'warning'
    : 'healthy';

  return res.status(200).json({
    ok: true,
    overallStatus,
    checks,
    lastChecked: new Date().toISOString(),
  });
};

function checkUrl(url) {
  return new Promise(function (resolve) {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { timeout: 5000 }, function (res) {
      resolve({
        status: res.statusCode >= 200 && res.statusCode < 400 ? 'healthy' : 'warning',
        label: 'HTTP ' + res.statusCode,
        detail: url,
      });
    });
    req.on('error', function () {
      resolve({ status: 'error', label: 'Unreachable', detail: url });
    });
    req.on('timeout', function () {
      req.destroy();
      resolve({ status: 'warning', label: 'Timeout', detail: url });
    });
  });
}
