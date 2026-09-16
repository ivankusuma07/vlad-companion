// Server-only env. Nothing here is ever bundled into the client — components
// read the public mirror in brand.config.js instead.
// Every value is optional: with an empty .env the app boots on mock data.

const str = (v, fallback = "") => (typeof v === "string" && v.trim() ? v.trim() : fallback);
const num = (v, fallback) => (v !== undefined && v !== "" && Number.isFinite(Number(v)) ? Number(v) : fallback);

export const env = {
  // --- chat backend ---
  // auto | anthropic | openrouter — "auto" uses whichever key is present.
  chatProvider: str(process.env.CHAT_PROVIDER, "auto"),

  anthropicApiKey: str(process.env.ANTHROPIC_API_KEY),
  chatModel: str(process.env.VLAD_CHAT_MODEL, "claude-opus-5"),

  // OpenRouter (OpenAI-compatible). Free models carry a ":free" suffix — the
  // free catalogue rotates, so verify the id at openrouter.ai/models.
  openrouterApiKey: str(process.env.OPENROUTER_API_KEY),
  // "openrouter/free" is OpenRouter's Free Models Router: it auto-selects
  // from whatever's currently free instead of naming one model. Pinned free
  // model ids rotate out with no notice — deepseek-chat-v3-0324:free, the
  // previous default here, was pulled from the free tier mid-development of
  // this project. The router survives that; a pinned id doesn't.
  openrouterModel: str(process.env.OPENROUTER_MODEL, "openrouter/free"),
  openrouterSiteUrl: str(process.env.OPENROUTER_SITE_URL),
  openrouterAppName: str(process.env.OPENROUTER_APP_NAME, "VLAD TENEV COMPANION"),

  chatRateLimit: num(process.env.VLAD_CHAT_RATE_LIMIT, 20), // messages per window, per IP
  chatRateWindowMs: num(process.env.VLAD_CHAT_RATE_WINDOW_MS, 60_000),

  // --- Robinhood Chain (EVM, Arbitrum Orbit stack) ---
  // DEV: fill these from the official RH Chain docs / your Alchemy dashboard.
  // No defaults are invented here — an unset value degrades to mock, it never
  // points the UI at a wrong network.
  rpcUrl: str(process.env.RH_CHAIN_RPC_URL),
  chainId: num(process.env.RH_CHAIN_ID, 0),
  chainName: str(process.env.RH_CHAIN_NAME, "Robinhood Chain"),
  nativeSymbol: str(process.env.RH_CHAIN_NATIVE_SYMBOL, "ETH"),
  explorerBase: str(process.env.RH_CHAIN_EXPLORER_BASE), // e.g. https://explorer.example/token/
  dexBase: str(process.env.RH_CHAIN_DEX_BASE), // e.g. https://app.uniswap.org/#/tokens/…/

  // --- radar data source ---
  // auto | mock | coingecko | subgraph | alchemy
  radarSource: str(process.env.RADAR_SOURCE, "auto"),
  radarCacheMs: num(process.env.RADAR_CACHE_MS, 15_000),

  // CoinGecko / GeckoTerminal onchain API — supports Robinhood Chain
  // (network id "robinhood") directly, no indexer to run. Free Demo key from
  // coingecko.com -> Developer Dashboard.
  coingeckoApiKey: str(process.env.COINGECKO_API_KEY),
  coingeckoNetwork: str(process.env.COINGECKO_NETWORK, "robinhood"),
  coingeckoPlan: str(process.env.COINGECKO_PLAN, "demo"), // demo | pro

  subgraphUrl: str(process.env.RADAR_SUBGRAPH_URL),
  alchemyKey: str(process.env.ALCHEMY_API_KEY),
  alchemyBaseUrl: str(process.env.ALCHEMY_BASE_URL), // network-scoped Alchemy host for RH Chain
  // Comma-separated 0x contracts the Alchemy provider measures (it reads per
  // contract, so it needs to be told what to look at).
  radarWatchlist: str(process.env.RADAR_WATCHLIST)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),

  // --- news feed ---
  newsSourceUrl: str(process.env.NEWS_SOURCE_URL), // JSON the team curates; falls back to bundled
  newsCacheMs: num(process.env.NEWS_CACHE_MS, 300_000),
};

export const hasRpc = () => Boolean(env.rpcUrl && env.chainId);
