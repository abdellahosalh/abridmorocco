/**
 * Abrid Morocco — Admin Authentication
 * Server-side session management with httpOnly cookies.
 * 
 * Environment variables:
 *   ADMIN_PASSWORD  — Admin login password (required)
 *   ADMIN_SESSION_SECRET — Secret for signing session tokens (required)
 */

const crypto = require('crypto');

const SESSION_COOKIE = 'abrid_admin_session';
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours

/**
 * Generate a cryptographically secure random token.
 */
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Hash a token with the session secret for storage comparison.
 */
function hashToken(token) {
  const secret = process.env.ADMIN_SESSION_SECRET || 'abrid-dev-secret-change-in-production';
  return crypto.createHmac('sha256', secret).update(token).digest('hex');
}

/**
 * Create a session token and its hash.
 * Returns { token, hash } — token goes to the client, hash is stored server-side.
 */
function createSession() {
  const token = generateToken();
  const hash = hashToken(token);
  return { token, hash };
}

/**
 * Verify a session token against a stored hash.
 */
function verifySession(token, hash) {
  if (!token || !hash) return false;
  const computed = hashToken(token);
  // Constant-time comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(computed, 'hex'),
    Buffer.from(hash, 'hex')
  );
}

/**
 * Parse cookies from the request header.
 */
function parseCookies(req) {
  const header = req.headers.cookie || '';
  const cookies = {};
  header.split(';').forEach(function (pair) {
    const idx = pair.indexOf('=');
    if (idx > -1) {
      const key = pair.slice(0, idx).trim();
      const val = pair.slice(idx + 1).trim();
      cookies[key] = decodeURIComponent(val);
    }
  });
  return cookies;
}

/**
 * Set the session cookie on the response.
 */
function setSessionCookie(res, token) {
  const maxAge = SESSION_DURATION_MS / 1000;
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie',
    SESSION_COOKIE + '=' + encodeURIComponent(token) +
    '; HttpOnly; Path=/; Max-Age=' + maxAge +
    '; Same=Lax' + secure
  );
}

/**
 * Clear the session cookie.
 */
function clearSessionCookie(res) {
  res.setHeader('Set-Cookie',
    SESSION_COOKIE + '=; HttpOnly; Path=/; Max-Age=0; Same=Lax'
  );
}

/**
 * In-memory session store (per serverless instance).
 * In production with multiple instances, use a shared store (Redis, Vercel KV, etc.)
 */
const sessions = new Map();

/**
 * Create a new session and store it.
 */
function startSession(res) {
  const { token, hash } = createSession();
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  sessions.set(hash, { expiresAt });
  setSessionCookie(res, token);
  return token;
}

/**
 * Validate the session from the request.
 * Returns true if valid, false otherwise.
 */
function isAuthenticated(req) {
  const cookies = parseCookies(req);
  const token = cookies[SESSION_COOKIE];
  if (!token) return false;

  // Find matching session by hashing the token
  const hash = hashToken(token);
  const session = sessions.get(hash);
  if (!session) return false;

  // Check expiration
  if (Date.now() > session.expiresAt) {
    sessions.delete(hash);
    return false;
  }

  return true;
}

/**
 * Destroy the session.
 */
function endSession(req, res) {
  const cookies = parseCookies(req);
  const token = cookies[SESSION_COOKIE];
  if (token) {
    const hash = hashToken(token);
    sessions.delete(hash);
  }
  clearSessionCookie(res);
}

/**
 * Middleware: require authentication for a handler.
 * Returns true if the request is authorized, false if already handled (401 sent).
 */
function requireAuth(req, res) {
  if (isAuthenticated(req)) return true;
  res.setHeader('Content-Type', 'application/json');
  res.status(401).json({ ok: false, error: 'Unauthorized' });
  return false;
}

/**
 * Rate limiter for login attempts.
 * Simple in-memory rate limiter (per serverless instance).
 */
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

function isRateLimited(req) {
  const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record) return false;
  if (now - record.firstAttempt > LOCKOUT_MS) {
    // Window expired, reset
    loginAttempts.delete(ip);
    return false;
  }
  return record.count >= MAX_ATTEMPTS;
}

function recordLoginAttempt(req) {
  const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record || now - record.firstAttempt > LOCKOUT_MS) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
  } else {
    record.count++;
  }
}

function clearLoginAttempts(req) {
  const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
  loginAttempts.delete(ip);
}

module.exports = {
  SESSION_COOKIE,
  SESSION_DURATION_MS,
  startSession,
  endSession,
  isAuthenticated,
  requireAuth,
  isRateLimited,
  recordLoginAttempt,
  clearLoginAttempts,
  parseCookies,
};
