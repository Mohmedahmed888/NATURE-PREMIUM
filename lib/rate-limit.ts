const store = new Map<string, { count: number; resetAt: number }>()
const WINDOW_MS = 60 * 1000 // 1 minute
const MAX_REQUESTS = 60
const AUTH_MAX = 10

function getKey(req: Request, prefix = ''): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'
  return prefix + ip
}

export function rateLimitAuth(req: Request): { ok: boolean; retryAfter?: number } {
  return rateLimitInternal(req, 'auth:', AUTH_MAX)
}

function rateLimitInternal(req: Request, prefix: string, max: number): { ok: boolean; retryAfter?: number } {
  const key = getKey(req, prefix)
  const now = Date.now()
  const record = store.get(key)

  if (!record) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return { ok: true }
  }

  if (now > record.resetAt) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return { ok: true }
  }

  record.count++
  if (record.count > max) {
    return { ok: false, retryAfter: Math.ceil((record.resetAt - now) / 1000) }
  }
  return { ok: true }
}

export function rateLimit(req: Request): { ok: boolean; retryAfter?: number } {
  return rateLimitInternal(req, '', MAX_REQUESTS)
}
