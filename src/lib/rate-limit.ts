type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Simple fixed-window daily rate limiter, keyed by an arbitrary string
 * (e.g. `${ip}:${route}`). In-memory only — resets on redeploy/restart
 * and is per-instance, not shared across multiple servers/functions.
 */
export function checkDailyLimit(key: string, limit: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + DAY_MS });
    return true;
  }

  if (bucket.count >= limit) {
    return false;
  }

  bucket.count += 1;
  return true;
}

export function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}
