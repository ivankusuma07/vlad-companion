# VLAD TENEV COMPANION

Next.js app + backend for the Robinhood Chain scout. Parody / community project —
not affiliated with, endorsed by, or connected to Robinhood Markets, Robinhood
Chain, or Vlad Tenev.

## Run it

```bash
npm install
cp .env.example .env.local   # optional — see below
npm run dev                  # http://localhost:3000
```

**It boots with an empty `.env.local`.** Nothing is required. Unconfigured
subsystems fall back to something safe and say so on screen:

| Not configured | What happens |
|---|---|
| no chat key (`ANTHROPIC_API_KEY` / `OPENROUTER_API_KEY`) | chat returns canned in-character lines |
| `RH_CHAIN_RPC_URL` | `/api/scan` validates the address but reads nothing |
| radar source | mock rows, and the page shows a red "sample data" banner |
| explorer / DEX bases | trade + explorer links are omitted, not broken |

`GET /api/health` reports exactly which of those are live.

## Architecture

```
src/app/            App Router pages + API routes
src/components/     UI (client components)
src/lib/            shared — feed.js (API client), evm.js (address validation)
src/lib/server/     backend only; never bundled to the browser
  persona.js          Vlad's system prompt + the hard rules
  chat.js             Messages API streaming + input validation
  radar/              classify.js, mock.js, subgraph.js, alchemy.js, index.js
  chain.js            viem client, explorer/DEX URL builders
  news.js, cache.js, rate-limit.js, env.js
```

### API

| Route | Purpose |
|---|---|
| `POST /api/chat` | SSE stream of Vlad's reply. Body `{ messages: [{role, content}] }` |
| `GET /api/radar` | radar rows + per-token links. Same token shape as before |
| `GET /api/news` | curated right-rail items |
| `GET /api/scan?address=0x…` | EVM address validation + ERC20 read |
| `GET /api/health` | which subsystems are live |

## Chain: Robinhood Chain (EVM)

RH Chain is an Ethereum L2 on the Arbitrum Orbit stack. The Solana-era
assumptions are gone: addresses are `0x…` 42-char hex with an EIP-55 checksum
check ([src/lib/evm.js](src/lib/evm.js)), and there is **no bonding curve**, so
no "graduation %". Heat is derived instead from volume velocity, holder growth,
and liquidity depth in [classify.js](src/lib/server/radar/classify.js), where
liquidity risk outranks momentum — a token can be ripping and still be
untradeable.

### Wiring a live radar

Three providers ship, and `RADAR_SOURCE=auto` picks the first configured:
`coingecko` > `subgraph` > `alchemy` > `mock`.

- **CoinGecko / GeckoTerminal** (`COINGECKO_API_KEY`) — **recommended, easiest
  to set up.** CoinGecko has added explicit Robinhood Chain support (network id
  `robinhood`), so this needs no indexer and no watchlist — just a free Demo
  key from coingecko.com → Developer Dashboard (10k calls/month, 100/min). It's
  also the only provider that returns **real** market cap and **real**
  liquidity-in-USD out of the box, since GeckoTerminal already prices pools.
  Holder growth is still a tx-velocity proxy, not a true holder count — see the
  comment in [coingecko.js](src/lib/server/radar/coingecko.js).
- **Subgraph** (`RADAR_SUBGRAPH_URL`) — best for discovery if you're already
  running your own indexer. The bundled query matches the Uniswap v3 schema;
  change `mapPool()` if yours differs.
- **Alchemy** (`ALCHEMY_API_KEY` + `ALCHEMY_BASE_URL` + `RADAR_WATCHLIST`) —
  best for real holder counts, derived from ERC20 Transfer logs. It reads per
  contract, so it needs a watchlist.

All three normalize through `toRadarToken()`, which is the contract the UI
depends on. Fields a provider can't supply are marked `DEV:` and return `0`
rather than a guess — for subgraph/Alchemy that's market cap and LP-lock state;
CoinGecko only has the LP-lock gap.

## Chat backend

Two interchangeable providers under [src/lib/server/chat/](src/lib/server/chat/).
Each is an async generator yielding text chunks, so switching is an env change,
not a code change. `CHAT_PROVIDER=auto` uses whichever key is set; if both are,
Anthropic wins.

| Provider | Model | Use for |
|---|---|---|
| `anthropic` | `claude-opus-5`, `effort: "low"` | production |
| `openrouter` | any OpenAI-compatible id, incl. `…:free` | dev / demo |

**Anthropic path** — low effort because this is short in-character conversation,
not a reasoning workload. Server-side refusal fallbacks are on, so a declined
turn is re-run on a fallback model inside the same call instead of the panel
going dead. Radar numbers go in as a mid-conversation system message, keeping
the cached system prefix intact.

**OpenRouter path** — one streaming POST via raw fetch. Radar numbers are
appended to the system prompt instead, since mid-conversation system turns are
unreliable across the model zoo. Free-tier tradeoffs: weaker
instruction-following, 20 req/min (50/day on a fresh account), and prompts that
may be logged or trained on upstream.

Default model is `openrouter/free` — OpenRouter's **Free Models Router**, which
auto-selects from whatever's currently free rather than naming one model.
**Don't pin a specific `:free` model id.** This isn't a theoretical risk: the
previous default here, `deepseek/deepseek-chat-v3-0324:free`, was pulled from
the free tier partway through this project's development and started returning
404s with no warning. The router is the fix, not a suggestion.

### Guardrails

The persona's hard rules live in the **backend** system prompt
([persona.js](src/lib/server/persona.js)), not the client: no buy/sell advice,
no price predictions, never claims to be the real Vlad Tenev, never speaks for
Robinhood, never invents onchain data. Anything enforced in the browser is a
suggestion.

Because this parodies a real, named, sitting CEO of a public company, there's
also an output-side net ([guardrail.js](src/lib/server/chat/guardrail.js)): the
finished reply is pattern-checked for trade recommendations, price targets,
certainty claims, and impersonation. On a hit the server emits a `replace` event
and the UI overwrites the bubble with an in-character refusal.

It's a net, not a filter — the prompt is still the primary control, and a
determined user can get around it. It exists because free/small models break
character far more often than Opus does. If you move to a model you trust it
costs nothing to leave on.

Input is validated server-side (roles, ordering, 2000 chars, 20 messages) and
rate limited per IP.

## Before deploying

- [x] `RH_CHAIN_RPC_URL` / `RH_CHAIN_ID` / `RH_CHAIN_EXPLORER_BASE` — filled and
      verified against official docs (chain id 4663). Explorer is
      robinscan.io at `/token/{addr}` — both `/token/` and `/address/` resolve
      for a real token contract; a placeholder/non-existent address 404s on
      `/token/` specifically, which is what to expect if you test with a
      fake address rather than a real one from the live radar.
- [ ] `RH_CHAIN_DEX_BASE` — still blank. Uniswap's RH Chain deployment URL.
- [ ] `RADAR_SOURCE` — still on mock. `COINGECKO_API_KEY` is the fastest real
      one to wire (free Demo key, no indexer to run — see Wiring a live radar
      above).
- [ ] Confirm the ticker (`$VLAD` is a placeholder) and set `BRAND.ca` at launch.
- [ ] Replace `REPLACE_ME` in `BRAND.links` (X, Telegram).
- [ ] Drop the gate video at `public/media/gate.mp4`.
- [ ] Mount the Live2D model in [CharacterStage.jsx](src/components/CharacterStage.jsx).
      It already listens for `vlad:state` (`IDLE | SCANNING | REACT_HOT |
      REACT_WARN | REPORT`); the radar dispatches `REACT_HOT` when a new token
      starts heating.
- [ ] **`cache.js` and `rate-limit.js` are per-instance.** On serverless or
      multi-node, swap the `Map` for Redis/KV or the limiter is bypassable by
      spreading requests across instances.
