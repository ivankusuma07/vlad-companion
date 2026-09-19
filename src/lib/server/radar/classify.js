// Turns raw chain metrics into the four statuses the UI renders.
// This replaces pump.fun's bonding-curve "graduation %" — Robinhood Chain has
// no bonding curve, so heat is derived from what an EVM pool actually exposes:
// volume velocity, holder growth, and liquidity depth.
//
// Order matters: liquidity risk outranks momentum. A token can be ripping and
// still be untradeable, and saying "heating" about a 3k pool would be a lie.

export const THRESHOLDS = {
  thinLpUsd: 5_000, // below this the exit math doesn't work
  thinLpRatio: 0.06, // LP worth <6% of mcap is thin regardless of absolute size
  heatingVolPerMin: 800,
  heatingHolderDelta: 25,
  coolingVolPerMin: 250,
};

export function classify(t) {
  const lpRatio = t.mcap > 0 ? t.lpUsd / t.mcap : 0;

  // t.lpLocked === false means confirmed unlocked — flag it outright.
  // t.lpLocked === null means unknown (a provider that can't read the locker
  // contract yet); that's not evidence of risk, so it falls through to the
  // numeric liquidity checks instead of being treated as an automatic red flag.
  if (t.lpUsd < THRESHOLDS.thinLpUsd || lpRatio < THRESHOLDS.thinLpRatio || t.lpLocked === false) {
    return "THIN_LP";
  }
  if (t.volPerMin >= THRESHOLDS.heatingVolPerMin && t.holdersDelta >= THRESHOLDS.heatingHolderDelta) {
    return "HEATING";
  }
  if (t.volPerMin < THRESHOLDS.coolingVolPerMin || t.holdersDelta < 0) {
    return "COOLING";
  }
  return "WATCHING";
}

// Normalizes whatever a provider returns into the exact shape the UI expects.
// fetchRadar()'s contract is this object — providers may change, this may not.
//
// lpLocked is tri-state: true/false when a provider actually read the locker
// contract, null when it can't yet (Boolean(undefined) would silently collapse
// "unknown" into "confirmed unlocked", which is a materially different claim).
//
// `id` is what the UI keys rows on — it's *not* always the same as `ca`.
// Most providers return one row per token, where `ca` is already unique.
// CoinGecko's new_pools doesn't: it's one row per *pool*, and the same
// token can have several pools, all sharing one `ca`. Rendering with
// `ca` as the React key in that case gives duplicate keys, which is
// undefined behavior — React can end up reusing one row's DOM/state for
// another, so switching filters or a poll landing can show a stale
// status that belongs to a different row entirely. Providers that are
// already one-row-per-token can pass `id` through as-is (it'll just
// equal `ca`); coingecko.js passes the pool's own id instead.
export function toRadarToken(raw) {
  const t = {
    ticker: String(raw.ticker || "?").toUpperCase().slice(0, 10),
    ca: raw.ca,
    id: raw.id || raw.ca,
    // Only the coingecko provider has this today; other providers leave it
    // unset and the UI falls back to a lettered monogram.
    logo: raw.logo || null,
    ageMin: Math.max(0, Math.round(raw.ageMin ?? 0)),
    mcap: Math.max(0, Math.round(raw.mcap ?? 0)),
    volPerMin: Math.max(0, Math.round(raw.volPerMin ?? 0)),
    holders: Math.max(0, Math.round(raw.holders ?? 0)),
    holdersDelta: Math.round(raw.holdersDelta ?? 0),
    lpUsd: Math.max(0, Math.round(raw.lpUsd ?? 0)),
    lpLocked: raw.lpLocked === null || raw.lpLocked === undefined ? null : Boolean(raw.lpLocked),
  };
  return { ...t, status: raw.status || classify(t) };
}
