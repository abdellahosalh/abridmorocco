/**
 * Abrid Morocco — Form submission → Supabase logger
 * POST /api/submissions
 * 
 * Receives form data from enquiry.js or booking.js and appends it to
 * a Supabase table. Fails gracefully if Supabase is not configured
 * so the existing email flow is never broken.
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Initialise only if both vars are present; otherwise the handler falls
// back to "no-op" so the visitor still reaches WhatsApp even if the
// database is mis‑configured.
let supa
if (supabaseUrl && supabaseKey) {
  supa = createClient(supabaseUrl, supabaseKey)
} else {
  supa = null
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('Content-Type', 'application/json')

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false })
  }

  // Read body
  let raw = ''
  req.on('data', c => { raw += c; if (raw.length > 20000) req.destroy() })
  req.on('end', async () => {
    try {
      const body = JSON.parse(raw || '{}')

      // --- common fields across enquiry & booking -----------------
      const name = String(body.name || '').trim() || null
      const email = String(body.email || '').trim() || null
      const phone = String(body.phone || '').trim() || null
      const page = String(body.page || '').trim() || '/'
      const ref = String(body.ref || '-').trim()
      const person = String(body.person || '').trim() || null // 'abdellah' | 'karim'

      // Provider‑specific extra fields
      const tour = body.tour ? String(body.tour).trim() : null
      const dur = body.dur ? String(body.dur).trim() : null
      const price = body.price ? String(body.price).trim() : null
      const paxText = body.paxText ? String(body.paxText).trim() : null
      const requests = body.requests ? String(body.requests).trim() : null
      const dateText = body.dateText ? String(body.dateText).trim() : null

      const rows = {
        name,
        email,
        phone,
        page,
        ref,
        person,
        tour,
        dur,
        price,
        paxText,
        requests,
        dateText,
        submittedAt: new Date().toISOString(),
      }

      // --- write to Supabase if initialised ----------------------
      if (supa) {
        const { error } = await supa
          .from('form_submissions')
          .insert([rows])

        if (error) {
          console.error('[submissions] Supabase error:', error.message)
          // still respond success so the visitor's WhatsApp isn't blocked
        }
      }

      res.status(200).json({ ok: true, stored: !!supa })
    } catch (e) {
      console.error('[submissions] parse error:', e.message)
      res.status(200).json({ ok: true, stored: false })
    }
  })
}