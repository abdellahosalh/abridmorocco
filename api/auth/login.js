/**
 * Abrid Morocco — Admin Login
 * POST /api/auth/login
 * 
 * Expects: { password: string }
 * Returns: { ok: true } on success, { ok: false, error: string } on failure
 * 
 * Rate-limited to prevent brute force attacks.
 */

const auth = require('../_lib/auth');
const crypto = require('crypto');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  // Check rate limiting
  if (auth.isRateLimited(req)) {
    return res.status(429).json({
      ok: false,
      error: 'Too many login attempts. Please try again later.'
    });
  }

  // Parse body
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

  const password = body.password || '';
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error('[auth] ADMIN_PASSWORD environment variable is not set');
    return res.status(500).json({
      ok: false,
      error: 'Server configuration error. Please contact the administrator.'
    });
  }

  // Constant-time comparison to prevent timing attacks
  const passwordBuffer = Buffer.from(password, 'utf8');
  const adminBuffer = Buffer.from(adminPassword, 'utf8');
  const match = passwordBuffer.length === adminBuffer.length &&
    crypto.timingSafeEqual(passwordBuffer, adminBuffer);

  if (!match) {
    auth.recordLoginAttempt(req);
    return res.status(401).json({ ok: false, error: 'Invalid password' });
  }

  // Success — clear rate limit and create session
  auth.clearLoginAttempts(req);
  auth.startSession(res);

  return res.status(200).json({ ok: true });
};

function readBody(req) {
  return new Promise(function (resolve) {
    let raw = '';
    req.on('data', function (c) { raw += c; });
    req.on('end', function () { resolve(raw); });
    req.on('error', function () { resolve(''); });
  });
}
