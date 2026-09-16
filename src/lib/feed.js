// Client-side data layer. The mocks that used to live here moved server-side
// (src/lib/server/radar/) — this file now just talks to the API and holds the
// presentation bits the components share.

export const STATUS = {
  HEATING: { key: "HEATING", label: "Heating", cls: "pill--hot" },
  WATCHING: { key: "WATCHING", label: "Watching", cls: "pill--watch" },
  THIN_LP: { key: "THIN_LP", label: "Thin LP", cls: "pill--warn" },
  COOLING: { key: "COOLING", label: "Cooling", cls: "pill--cool" },
};

// Vlad's one-line reads per status — precise, mathematical, deadpan. No calls,
// no hype. These are canned on purpose: they render instantly per card, where
// an API round-trip per row would not.
export const READS = {
  HEATING: ["volume curve steepening. holders compounding. flagged.", "the numbers are moving. i don't round up."],
  WATCHING: ["early. variance high. observing.", "insufficient data to conclude. watching."],
  THIN_LP: ["liquidity is thin. the exit math doesn't work.", "shallow pool. one sell from a rounding error."],
  COOLING: ["momentum decaying. reverting to mean.", "the curve flattened. moving on."],
};

export function readFor(statusKey) {
  const arr = READS[statusKey] || READS.WATCHING;
  return arr[Math.floor(Math.random() * arr.length)];
}

// Returns { tokens, source, degraded, ... }. `source` is "mock" until a live
// Robinhood Chain source is configured — the UI badges it so nobody mistakes
// placeholder rows for real ones.
export async function fetchRadar() {
  const res = await fetch("/api/radar", { cache: "no-store" });
  if (!res.ok) throw new Error(`radar ${res.status}`);
  return res.json();
}

export async function fetchNews() {
  const res = await fetch("/api/news");
  if (!res.ok) throw new Error(`news ${res.status}`);
  const { items } = await res.json();
  return items;
}

export async function scanContract(address) {
  const res = await fetch(`/api/scan?address=${encodeURIComponent(address)}`);
  return res.json();
}

export const fmtUsd = (n) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}m` : n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`;
