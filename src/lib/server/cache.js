// Tiny in-process TTL cache with single-flight, so a burst of page loads
// produces one upstream call instead of N.
// NOTE: per-instance. On multi-instance/serverless deploys swap the Map for
// Redis/Vercel KV — the interface below is the only thing callers depend on.
const store = new Map(); // key -> { value, expires }
const inflight = new Map(); // key -> Promise

export async function cached(key, ttlMs, loader) {
  const hit = store.get(key);
  if (hit && hit.expires > Date.now()) return hit.value;

  const existing = inflight.get(key);
  if (existing) return existing;

  const p = (async () => {
    try {
      const value = await loader();
      store.set(key, { value, expires: Date.now() + ttlMs });
      return value;
    } catch (err) {
      // Serve stale rather than erroring the page if we ever had a good value.
      if (hit) return hit.value;
      throw err;
    } finally {
      inflight.delete(key);
    }
  })();

  inflight.set(key, p);
  return p;
}

export const invalidate = (key) => store.delete(key);
