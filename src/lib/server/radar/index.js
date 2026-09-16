// Radar orchestrator. Picks a provider, caches the result, and guarantees the
// route always gets the shape the UI expects — a live source failing degrades
// to mock rather than blanking the page.
import { env } from "../env.js";
import { cached } from "../cache.js";
import { fetchRadarMock } from "./mock.js";
import { fetchRadarCoinGecko } from "./coingecko.js";
import { fetchRadarSubgraph } from "./subgraph.js";
import { fetchRadarAlchemy } from "./alchemy.js";

// coingecko first: it's turnkey (no indexer to deploy) and the only provider
// that returns real market cap + real liquidity-in-USD out of the box.
function resolveSource() {
  if (env.radarSource !== "auto") return env.radarSource;
  if (env.coingeckoApiKey) return "coingecko";
  if (env.subgraphUrl) return "subgraph";
  if (env.alchemyKey && env.alchemyBaseUrl && env.radarWatchlist.length) return "alchemy";
  return "mock";
}

async function load(source) {
  switch (source) {
    case "coingecko":
      return fetchRadarCoinGecko({
        apiKey: env.coingeckoApiKey,
        network: env.coingeckoNetwork,
        plan: env.coingeckoPlan,
      });
    case "subgraph":
      return fetchRadarSubgraph({ url: env.subgraphUrl });
    case "alchemy":
      return fetchRadarAlchemy({
        baseUrl: env.alchemyBaseUrl,
        key: env.alchemyKey,
        contracts: env.radarWatchlist,
      });
    default:
      return fetchRadarMock();
  }
}

export async function getRadar() {
  const source = resolveSource();

  return cached(`radar:${source}`, env.radarCacheMs, async () => {
    try {
      const tokens = await load(source);
      // An empty live result is a configuration smell, not a quiet day.
      if (!tokens.length && source !== "mock") {
        return { source, degraded: true, reason: "live source returned no rows", tokens: await fetchRadarMock() };
      }
      return { source, degraded: source === "mock", tokens };
    } catch (err) {
      console.error(`[radar] ${source} failed:`, err.message);
      return { source, degraded: true, reason: err.message, tokens: await fetchRadarMock() };
    }
  });
}
