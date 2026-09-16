// Subgraph / indexer provider for Robinhood Chain.
//
// This is the recommended live source: a Uniswap-style subgraph on the
// Arbitrum-Orbit stack already tracks pools, volume and reserves, which is
// exactly what the radar needs. Point RADAR_SUBGRAPH_URL at it.
//
// The query below matches the standard Uniswap v3 subgraph schema. If your
// indexer differs, this file and mapPool() are the only things to change —
// the return shape is fixed by toRadarToken().
import { toRadarToken } from "./classify.js";

const QUERY = `
  query RadarPools($minCreated: Int!, $first: Int!) {
    pools(
      first: $first
      orderBy: createdAtTimestamp
      orderDirection: desc
      where: { createdAtTimestamp_gt: $minCreated }
    ) {
      id
      createdAtTimestamp
      totalValueLockedUSD
      volumeUSD
      txCount
      token0 { id symbol decimals totalSupply }
      token1 { id symbol decimals totalSupply }
      poolHourData(first: 2, orderBy: periodStartUnix, orderDirection: desc) {
        periodStartUnix
        volumeUSD
        txCount
      }
    }
  }
`;

// Which side of the pair is the "new" token: whatever isn't the quote asset.
const QUOTE_SYMBOLS = new Set(["WETH", "ETH", "USDC", "USDT", "DAI", "USDG"]);

function mapPool(pool) {
  const isToken0Quote = QUOTE_SYMBOLS.has((pool.token0?.symbol || "").toUpperCase());
  const token = isToken0Quote ? pool.token1 : pool.token0;
  if (!token?.id) return null;

  const ageMin = Math.max(0, Math.round((Date.now() / 1000 - Number(pool.createdAtTimestamp)) / 60));
  const [latest, previous] = pool.poolHourData || [];

  const volLastHour = Number(latest?.volumeUSD ?? 0);
  const volPerMin = volLastHour / 60;
  const lpUsd = Number(pool.totalValueLockedUSD ?? 0);

  // A subgraph exposes tx counts, not holder counts. Unique holders need a
  // Transfer-log index (see alchemy.js) — until one is wired we report the
  // hourly tx delta, which is the honest proxy, and never invent a number.
  const txNow = Number(latest?.txCount ?? 0);
  const txPrev = Number(previous?.txCount ?? 0);

  return toRadarToken({
    ticker: token.symbol || "?",
    ca: token.id,
    ageMin,
    mcap: 0, // DEV: needs a price feed × circulating supply; 0 renders as "$0" until wired
    volPerMin,
    holders: txNow,
    holdersDelta: txNow - txPrev,
    lpUsd,
    lpLocked: null, // DEV: unknown until you read your launchpad's locker contract — not "confirmed unlocked"
  });
}

export async function fetchRadarSubgraph({ url, maxAgeMinutes = 180, limit = 25 }) {
  const minCreated = Math.floor(Date.now() / 1000) - maxAgeMinutes * 60;

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query: QUERY, variables: { minCreated, first: limit } }),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) throw new Error(`subgraph ${res.status}`);
  const json = await res.json();
  if (json.errors?.length) throw new Error(`subgraph: ${json.errors[0].message}`);

  return (json.data?.pools || []).map(mapPool).filter(Boolean);
}
