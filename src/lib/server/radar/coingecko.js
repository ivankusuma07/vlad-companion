// CoinGecko / GeckoTerminal onchain provider.
//
// CoinGecko added explicit Robinhood Chain support (network id "robinhood")
// on GeckoTerminal — it indexes RH Chain pools directly, so this needs no
// subgraph deployment and no per-contract watchlist. It's also the only
// provider here that returns real market cap and real liquidity in USD
// out of the box; subgraph.js and alchemy.js both leave those at 0 pending
// a price feed / locker contract.
//
// Free "Demo" plan: sign up at coingecko.com -> Developer Dashboard -> create
// a Demo key. 10,000 calls/month, 100 calls/min — plenty at RADAR_CACHE_MS
// polling. Docs: https://docs.coingecko.com/reference/new-pools-by-network
import { toRadarToken } from "./classify.js";

const DEMO_BASE = "https://api.coingecko.com/api/v3/onchain";
const PRO_BASE = "https://pro-api.coingecko.com/api/v3/onchain";

// Quote-side symbols — whichever token in the pair ISN'T one of these is the
// "new" token the radar reports on. Same heuristic as subgraph.js.
const QUOTE_SYMBOLS = new Set(["WETH", "ETH", "USDC", "USDT", "DAI", "USDG"]);

function tokenLookup(included) {
  const map = new Map();
  for (const item of included || []) {
    if (item.type === "token") map.set(item.id, item.attributes);
  }
  return map;
}

function mapPool(pool, tokens) {
  const a = pool.attributes || {};
  const baseId = pool.relationships?.base_token?.data?.id;
  const quoteId = pool.relationships?.quote_token?.data?.id;
  const base = tokens.get(baseId);
  const quote = tokens.get(quoteId);
  if (!base?.address) return null;

  const isBaseQuoteAsset = QUOTE_SYMBOLS.has((base.symbol || "").toUpperCase());
  const token = isBaseQuoteAsset ? quote : base;
  if (!token?.address) return null;

  const ageMin = a.pool_created_at
    ? Math.max(0, Math.round((Date.now() - Date.parse(a.pool_created_at)) / 60_000))
    : 0;

  const volPerMin = Number(a.volume_usd?.h1 ?? 0) / 60;

  // No historical bucket to diff against (unlike subgraph.js's poolHourData),
  // so holder growth is approximated from transaction velocity: does the last
  // 5 minutes' pace exceed the hour's average pace. This is a proxy for
  // activity acceleration, not a real holder count — same honesty rule as the
  // other providers: report what's measurable, don't invent what isn't.
  const h1Tx = Number(a.transactions?.h1?.buys ?? 0) + Number(a.transactions?.h1?.sells ?? 0);
  const m5Tx = Number(a.transactions?.m5?.buys ?? 0) + Number(a.transactions?.m5?.sells ?? 0);
  const holdersDelta = Math.round(m5Tx * 12 - h1Tx);

  return toRadarToken({
    ticker: token.symbol || "?",
    ca: token.address,
    ageMin,
    // market_cap_usd is circulating; fdv falls back for tokens whose
    // circulating supply CoinGecko hasn't resolved yet — better than 0.
    mcap: Number(a.market_cap_usd ?? a.fdv_usd ?? 0),
    volPerMin,
    holders: h1Tx,
    holdersDelta,
    lpUsd: Number(a.reserve_in_usd ?? 0),
    lpLocked: null, // DEV: unknown — not exposed by this API. null (not false) so classify() doesn't treat "unread" as "confirmed unlocked"
  });
}

export async function fetchRadarCoinGecko({ apiKey, network = "robinhood", plan = "demo", limit = 25 }) {
  const base = plan === "pro" ? PRO_BASE : DEMO_BASE;
  const headerName = plan === "pro" ? "x-cg-pro-api-key" : "x-cg-demo-api-key";
  const pages = Math.ceil(Math.min(limit, 40) / 20); // 20 pools per page, max

  const results = [];
  for (let page = 1; page <= pages; page++) {
    const url = `${base}/networks/${network}/new_pools?page=${page}&include=base_token,quote_token`;
    const res = await fetch(url, {
      headers: { accept: "application/json", [headerName]: apiKey },
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) throw new Error(`coingecko ${res.status}`);
    const json = await res.json();
    const tokens = tokenLookup(json.included);
    for (const pool of json.data || []) {
      const mapped = mapPool(pool, tokens);
      if (mapped) results.push(mapped);
    }
    if ((json.data || []).length < 20) break; // last page
  }

  return results.slice(0, limit);
}
