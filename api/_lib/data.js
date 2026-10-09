/**
 * Abrid Morocco — Data Layer
 * JSON file-based storage for bookings, enquiries, and admin data.
 * 
 * Data files are stored in the data/ directory and are gitignored
 * to prevent customer data from entering version control.
 * 
 * This layer provides CRUD operations with in-memory caching for
 * performance. In production, this can be replaced with a database
 * by modifying only this file.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');

// In-memory cache
const cache = new Map();
const CACHE_TTL_MS = 30000; // 30 seconds

/**
 * Ensure the data directory exists.
 */
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

/**
 * Get the full path to a data file.
 */
function filePath(name) {
  return path.join(DATA_DIR, name + '.json');
}

/**
 * Read a JSON data file with caching.
 * Returns the parsed data or the defaultValue if the file doesn't exist.
 */
function readData(name, defaultValue) {
  ensureDataDir();
  const fp = filePath(name);

  // Check cache first
  const cached = cache.get(name);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    if (fs.existsSync(fp)) {
      const raw = fs.readFileSync(fp, 'utf8');
      const data = JSON.parse(raw);
      cache.set(name, { data, timestamp: Date.now() });
      return data;
    }
  } catch (e) {
    console.error('[data] Error reading ' + name + ':', e.message);
  }

  return defaultValue !== undefined ? defaultValue : null;
}

/**
 * Write data to a JSON file and update the cache.
 */
function writeData(name, data) {
  ensureDataDir();
  const fp = filePath(name);

  try {
    fs.writeFileSync(fp, JSON.stringify(data, null, 2), 'utf8');
    cache.set(name, { data, timestamp: Date.now() });
    return true;
  } catch (e) {
    console.error('[data] Error writing ' + name + ':', e.message);
    return false;
  }
}

/**
 * Invalidate the cache for a data file.
 */
function invalidateCache(name) {
  cache.delete(name);
}

/**
 * Generate a unique ID.
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/**
 * Generate a booking reference.
 */
function generateBookingRef() {
  const prefix = 'ABR';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return prefix + '-' + timestamp + '-' + random;
}

/**
 * Generate an enquiry reference.
 */
function generateEnquiryRef() {
  const prefix = 'ENQ';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return prefix + '-' + timestamp + '-' + random;
}

// ─── Bookings ───────────────────────────────────────────────────────

/**
 * Get all bookings.
 */
function getBookings() {
  return readData('bookings', []);
}

/**
 * Get a single booking by ID.
 */
function getBooking(id) {
  const bookings = getBookings();
  return bookings.find(function (b) { return b.id === id; }) || null;
}

/**
 * Create a new booking.
 */
function createBooking(bookingData) {
  const bookings = getBookings();
  const booking = Object.assign({}, bookingData, {
    id: generateId(),
    ref: bookingData.ref || generateBookingRef(),
    status: bookingData.status || 'new',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  bookings.push(booking);
  writeData('bookings', bookings);
  return booking;
}

/**
 * Update a booking.
 */
function updateBooking(id, updates) {
  const bookings = getBookings();
  const index = bookings.findIndex(function (b) { return b.id === id; });
  if (index === -1) return null;

  bookings[index] = Object.assign({}, bookings[index], updates, {
    updatedAt: new Date().toISOString(),
  });
  writeData('bookings', bookings);
  return bookings[index];
}

/**
 * Delete a booking.
 */
function deleteBooking(id) {
  const bookings = getBookings();
  const filtered = bookings.filter(function (b) { return b.id !== id; });
  if (filtered.length === bookings.length) return false;
  writeData('bookings', filtered);
  return true;
}

// ─── Enquiries ──────────────────────────────────────────────────────

/**
 * Get all enquiries.
 */
function getEnquiries() {
  return readData('enquiries', []);
}

/**
 * Get a single enquiry by ID.
 */
function getEnquiry(id) {
  const enquiries = getEnquiries();
  return enquiries.find(function (e) { return e.id === id; }) || null;
}

/**
 * Create a new enquiry.
 */
function createEnquiry(enquiryData) {
  const enquiries = getEnquiries();
  const enquiry = Object.assign({}, enquiryData, {
    id: generateId(),
    ref: enquiryData.ref || generateEnquiryRef(),
    status: enquiryData.status || 'new',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  enquiries.push(enquiry);
  writeData('enquiries', enquiries);
  return enquiry;
}

/**
 * Update an enquiry.
 */
function updateEnquiry(id, updates) {
  const enquiries = getEnquiries();
  const index = enquiries.findIndex(function (e) { return e.id === id; });
  if (index === -1) return null;

  enquiries[index] = Object.assign({}, enquiries[index], updates, {
    updatedAt: new Date().toISOString(),
  });
  writeData('enquiries', enquiries);
  return enquiries[index];
}

/**
 * Delete an enquiry.
 */
function deleteEnquiry(id) {
  const enquiries = getEnquiries();
  const filtered = enquiries.filter(function (e) { return e.id !== id; });
  if (filtered.length === enquiries.length) return false;
  writeData('enquiries', filtered);
  return true;
}

// ─── Activity Log ───────────────────────────────────────────────────

/**
 * Get the admin activity log.
 */
function getActivityLog() {
  return readData('activity_log', []);
}

/**
 * Add an entry to the activity log.
 */
function logActivity(action, details, adminName) {
  const log = getActivityLog();
  log.unshift({
    id: generateId(),
    action: action,
    details: details || '',
    admin: adminName || 'Admin',
    timestamp: new Date().toISOString(),
  });
  // Keep only the last 500 entries
  if (log.length > 500) log.length = 500;
  writeData('activity_log', log);
}

// ─── Settings ───────────────────────────────────────────────────────

/**
 * Get admin settings.
 */
function getSettings() {
  const defaults = {
    businessName: 'Abrid Morocco',
    contactEmail: 'hello@abridmorocco.com',
    defaultCurrency: 'EUR',
    supportedLanguages: ['en', 'fr', 'es'],
    bookingStatuses: ['new', 'contacted', 'awaiting_confirmation', 'confirmed', 'completed', 'cancelled'],
    enquiryStatuses: ['new', 'in_progress', 'waiting_for_customer', 'quotation_sent', 'converted', 'closed'],
  };
  const stored = readData('settings', {});
  return Object.assign({}, defaults, stored);
}

/**
 * Update admin settings.
 */
function updateSettings(updates) {
  const current = getSettings();
  const updated = Object.assign({}, current, updates);
  writeData('settings', updated);
  return updated;
}

// ─── Customers (derived from bookings + enquiries) ──────────────────

/**
 * Get customer directory derived from bookings and enquiries.
 */
function getCustomers() {
  const bookings = getBookings();
  const enquiries = getEnquiries();
  const customerMap = new Map();

  bookings.forEach(function (b) {
    const key = (b.email || b.phone || b.name || '').toLowerCase();
    if (!key) return;
    if (!customerMap.has(key)) {
      customerMap.set(key, {
        id: generateId(),
        name: b.name || '',
        email: b.email || '',
        phone: b.phone || '',
        bookingCount: 0,
        enquiryCount: 0,
        upcomingTrips: [],
        lastInteraction: null,
        createdAt: b.createdAt,
      });
    }
    const c = customerMap.get(key);
    c.bookingCount++;
    if (b.travelDate && new Date(b.travelDate) > new Date()) {
      c.upcomingTrips.push({ type: 'booking', ref: b.ref, trip: b.trip, date: b.travelDate });
    }
    if (!c.lastInteraction || new Date(b.createdAt) > new Date(c.lastInteraction)) {
      c.lastInteraction = b.createdAt;
    }
  });

  enquiries.forEach(function (e) {
    const key = (e.email || e.phone || e.name || '').toLowerCase();
    if (!key) return;
    if (!customerMap.has(key)) {
      customerMap.set(key, {
        id: generateId(),
        name: e.name || '',
        email: e.email || '',
        phone: e.phone || '',
        bookingCount: 0,
        enquiryCount: 0,
        upcomingTrips: [],
        lastEnquiry: null,
        lastInteraction: null,
        createdAt: e.createdAt,
      });
    }
    const c = customerMap.get(key);
    c.enquiryCount++;
    if (!c.lastEnquiry || new Date(e.createdAt) > new Date(c.lastEnquiry)) {
      c.lastEnquiry = e.createdAt;
    }
    if (!c.lastInteraction || new Date(e.createdAt) > new Date(c.lastInteraction)) {
      c.lastInteraction = e.createdAt;
    }
  });

  return Array.from(customerMap.values());
}

module.exports = {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
  getEnquiries,
  getEnquiry,
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getActivityLog,
  logActivity,
  getSettings,
  updateSettings,
  getCustomers,
  generateId,
  generateBookingRef,
  generateEnquiryRef,
};
