// Alchemy provider — Alchemy is an official Robinhood Chain infra partner, so
// this is the path with the least glue once you have RH Chain keys.
//
// Two pieces are used:
//   1. alchemy_getTokenMetadata  — symbol/decimals per contract
//   2. alchemy_getAssetTransfers — ERC20 Transfer history, from which we derive
//      unique holders and holder growth (the number a subgraph can't give us)
//
// Set ALCHEMY_BASE_URL to the RH Chain network host from your dashboard and
// ALCHEMY_API_KEY to the key. Until both exist the orchestrator never calls in
// here — it falls through to mock.
import { toRadarToken } from "./classify.js";

async function rpc(baseUrl, key, method, params) {
  const res = await fetch(`${baseUrl.replace(/\/+$/, "")}/${key}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    cache: "no-store",
    signal: AbortSignal.timeout(12_000),
  });
  if (!res.ok) throw new Error(`alchemy ${method} ${res.status}`);
  const json = await res.json();
  if (json.error) throw new Error(`alchemy ${method}: ${json.error.message}`);
  return json.result;
}

// Unique holders + growth from the Transfer log. `sinceMinutes` splits the
// window so we can report a delta instead of a flat count.
async function holderStats({ baseUrl, key, contract, sinceMinutes = 60 }) {
  const transfers = await rpc(baseUrl, key, "alchemy_getAssetTransfers", [
    {
      fromBlock: "0x0",
      toBlock: "latest",
      contractAddresses: [contract],
      category: ["erc20"],
      withMetadata: true,
      excludeZeroValue: true,
      maxCount: "0x3e8", // 1000
      order: "desc",
    },
  ]);

  const cutoff = Date.now() - sinceMinutes * 60_000;
  const all = new Set();
  const recent = new Set();

  for (const t of transfers?.transfers || []) {
    if (!t.to) continue;
    all.add(t.to.toLowerCase());
    const ts = Date.parse(t.metadata?.blockTimestamp || "");
    if (Number.isFinite(ts) && ts >= cutoff) recent.add(t.to.toLowerCase());
  }

  return { holders: all.size, holdersDelta: recent.size };
}

// Watchlist-driven: Alchemy's transfer API reads per contract, so it answers
// "how are these tokens doing", not "what launched in the last hour". Pair it
// with a subgraph (or a launchpad webhook) for discovery, and list the
// contracts you want measured in RADAR_WATCHLIST.
export async function fetchRadarAlchemy({ baseUrl, key, contracts }) {
  const results = await Promise.allSettled(
    contracts.map(async (contract) => {
      const [meta, stats] = await Promise.all([
        rpc(baseUrl, key, "alchemy_getTokenMetadata", [contract]),
        holderStats({ baseUrl, key, contract }),
      ]);

      return toRadarToken({
        ticker: meta?.symbol || "?",
        ca: contract,
        ageMin: 0, // DEV: first Transfer block timestamp gives real age
        mcap: 0, // DEV: needs a price feed × circulating supply
        volPerMin: 0, // DEV: sum transfer value over the window, or use the subgraph
        holders: stats.holders,
        holdersDelta: stats.holdersDelta,
        lpUsd: 0, // DEV: read the pool reserves for this token's pair
        lpLocked: null, // DEV: unknown until you read the locker contract — not "confirmed unlocked"
      });
    }),
  );

  return results.filter((r) => r.status === "fulfilled").map((r) => r.value);
}
