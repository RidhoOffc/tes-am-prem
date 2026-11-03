/**
 * In-memory fixed-window rate limiter.
 *
 * Good enough for a single-instance Node/Nitro deployment. If you deploy
 * multiple instances behind a load balancer, replace the Map below with a
 * shared store (e.g. Redis) — the interface (checkRateLimit) stays the same.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export interface RateLimitOptions {
  /** Unique key, typically `${routeName}:${clientIp}`. */
  key: string;
  /** Max requests allowed within the window. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
}

export function checkRateLimit({ key, limit, windowMs }: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return { allowed: true, remaining: limit - existing.count, resetAt: existing.resetAt };
}

/** Periodic cleanup so the map doesn't grow unbounded on a long-running server. */
export function pruneExpiredBuckets(): void {
  const now = Date.now();
  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

if (typeof setInterval !== "undefined") {
  const interval = setInterval(pruneExpiredBuckets, 5 * 60 * 1000);
  // Don't keep the process alive just for cleanup in serverless/edge contexts.
  if (typeof interval === "object" && "unref" in interval) {
    (interval as unknown as { unref: () => void }).unref();
  }
}

/** Test-only reset so suites don't leak state between runs. */
export function __resetRateLimitState(): void {
  buckets.clear();
}
