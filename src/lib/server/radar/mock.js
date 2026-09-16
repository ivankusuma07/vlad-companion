// Mock provider — what the radar serves before a real RH Chain source is wired.
// It jitters between calls so the UI, the polling, and the Live2D reactions can
// all be developed against something that actually moves.
//
// Addresses are EVM 0x (Robinhood Chain), never base58.
import { toRadarToken } from "./classify.js";

const SEED = [
  { ticker: "NOVA", ageMin: 6, mcap: 84_000, volPerMin: 2_100, holders: 412, holdersDelta: 180, lpUsd: 18_000, lpLocked: true, ca: "0x1111111111111111111111111111111111111111" },
  { ticker: "GLINT", ageMin: 2, mcap: 31_000, volPerMin: 600, holders: 96, holdersDelta: 34, lpUsd: 9_000, lpLocked: true, ca: "0x2222222222222222222222222222222222222222" },
  { ticker: "ZAP", ageMin: 11, mcap: 52_000, volPerMin: 900, holders: 210, holdersDelta: 4, lpUsd: 3_000, lpLocked: false, ca: "0x3333333333333333333333333333333333333333" },
  { ticker: "DRIFT", ageMin: 24, mcap: 41_000, volPerMin: 150, holders: 305, holdersDelta: -12, lpUsd: 12_000, lpLocked: true, ca: "0x4444444444444444444444444444444444444444" },
];

const jitter = (n, pct) => Math.round(n * (1 + (Math.random() * 2 - 1) * pct));

export async function fetchRadarMock() {
  // Status is intentionally left off so classify() runs — the mock exercises
  // the same code path the live provider will.
  return SEED.map((t) =>
    toRadarToken({
      ...t,
      ageMin: t.ageMin + Math.floor((Date.now() / 60_000) % 7),
      mcap: jitter(t.mcap, 0.12),
      volPerMin: jitter(t.volPerMin, 0.35),
      holders: jitter(t.holders, 0.04),
      holdersDelta: jitter(t.holdersDelta, 0.5),
      lpUsd: jitter(t.lpUsd, 0.08),
    }),
  );
}
