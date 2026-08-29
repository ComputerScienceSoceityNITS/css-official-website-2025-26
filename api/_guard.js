/**
 * Shared request guard for the Dialogflow proxy.
 *
 * The proxy signs requests with a Google service account, so an open endpoint
 * lets anyone spend the society's Dialogflow quota (and bill). These checks
 * are cheap and stateless enough to run on a serverless function.
 */

/** Origins allowed to call the proxy. Add deploy previews via ALLOWED_ORIGINS. */
export const ALLOWED_ORIGINS = [
  'https://css-nits.in',
  'https://www.css-nits.in',
  'https://cssnits.tech',
  'https://www.cssnits.tech',
  'http://localhost:5173',
  'http://localhost:3000',
  ...(process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
]

export const MAX_MESSAGE_LEN = 1000
export const MAX_SESSION_LEN = 128
/** Dialogflow session ids we generate; keep it to safe characters only. */
const SESSION_RE = /^[A-Za-z0-9_-]{1,128}$/

export function resolveOrigin(origin) {
  return origin && ALLOWED_ORIGINS.includes(origin) ? origin : null
}

/**
 * Validates the body. Returns { ok: true, value } or { ok: false, error }.
 * Rejects non-strings so a caller cannot smuggle an object into the
 * Dialogflow payload.
 */
export function validateBody(body) {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Malformed request body' }
  }

  const { message, sessionId, isEvent } = body

  if (typeof sessionId !== 'string' || !SESSION_RE.test(sessionId)) {
    return { ok: false, error: 'Invalid session id' }
  }
  if (typeof message !== 'string' || message.length === 0) {
    return { ok: false, error: 'Message is required' }
  }
  if (message.length > MAX_MESSAGE_LEN) {
    return { ok: false, error: 'Message too long' }
  }
  if (isEvent !== undefined && typeof isEvent !== 'boolean') {
    return { ok: false, error: 'Invalid isEvent flag' }
  }

  return { ok: true, value: { message, sessionId, isEvent: Boolean(isEvent) } }
}

/**
 * Fixed-window in-memory rate limit, keyed by caller.
 *
 * Deliberately dependency-free. On serverless this only limits within a warm
 * instance, so treat it as a speed bump — put a real limiter (Vercel WAF,
 * Upstash, Cloudflare) in front for anything stronger.
 */
const hits = new Map()

export function rateLimit(key, limit = 20, windowMs = 60_000) {
  const now = Date.now()
  const entry = hits.get(key)

  if (!entry || now > entry.reset) {
    hits.set(key, { count: 1, reset: now + windowMs })
    return { allowed: true, remaining: limit - 1 }
  }
  if (entry.count >= limit) {
    return { allowed: false, retryAfter: Math.ceil((entry.reset - now) / 1000) }
  }
  entry.count += 1

  // keep the map from growing without bound on a long-lived instance
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (now > v.reset) hits.delete(k)
  }
  return { allowed: true, remaining: limit - entry.count }
}

export function clientKey(req) {
  const fwd = req.headers['x-forwarded-for']
  const ip = (Array.isArray(fwd) ? fwd[0] : fwd || '').split(',')[0].trim()
  return ip || req.socket?.remoteAddress || 'unknown'
}
