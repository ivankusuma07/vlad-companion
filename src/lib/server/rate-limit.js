// Fixed-window limiter for the chat route. Keeps a stray script from spending
// the whole Anthropic budget in one afternoon.
// NOTE: per-instance, same caveat as cache.js — move to Redis/KV when you run
// more than one node.
const buckets = new Map(); // key -> { count, resetAt }

export function rateLimit(key, limit, windowMs) {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  bucket.count += 1;
  const remaining = Math.max(0, limit - bucket.count);
  return { ok: bucket.count <= limit, remaining, resetAt: bucket.resetAt };
}

// Best-effort client identity. Behind a proxy the first x-forwarded-for hop is
// the real client; direct connections fall back to a shared bucket.
export function clientKey(request) {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "anonymous";
}

// Housekeeping so a long-lived process doesn't grow a bucket per IP forever.
if (typeof setInterval === "function") {
  const sweep = setInterval(() => {
    const now = Date.now();
    for (const [key, b] of buckets) if (b.resetAt <= now) buckets.delete(key);
  }, 60_000);
  sweep.unref?.();
}
