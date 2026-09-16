# REBRAND — ALON COMPANION → VLAD TENEV COMPANION
**Chain: pump.fun / Solana → Robinhood Chain (Ethereum L2 on Arbitrum).**

## IMPORTANT: two codebases
This zip is the **rebranded scaffold** (name, colors, chain, lore already done — use it as the reference).
But the **live site has moved past the scaffold** (ALON BOT page, callers feature, extra cards).
So don't just deploy this zip over the live one — **apply the changes below to the live codebase.**

## 1. Global find-replace (whole repo, case-sensitive)
- `ALON COMPANION` → `VLAD TENEV COMPANION`
- `ALON` → `VLAD` (logo, headings) — check each hit; keep it sensible
- `alon` → `vlad` (persona text, ids, event names like `alon:state` → `vlad:state`)
- `pump.fun` / `Pump.fun` → `Robinhood Chain`
- `the trenches` → `the chain` (or keep where it reads naturally; RH isn't "trenches" culture)
- `solscan.io` → RH Chain block explorer (see §3)
- `$A1LON` / `$NEVER ALON` / old ticker → new ticker (default `$VLAD`, confirm with Bix)

## 2. Colors
Single source: `src/brand.config.js` (COLORS) + `src/styles/global.css` (:root).
- Accent green pump.fun `#5FC98F` → Robinhood-family `#3FB86E` (desaturated, NOT neon per Bix).
- `--green-soft` → `rgba(63,184,110,0.14)`, `--green-deep` → `#2C8E58`.
- Update the two body radial-gradients to the new rgba. All rgba(95,201,143,…) → rgba(63,184,110,…).

## 3. Chain mechanics (this is the real work, not just cosmetic)
Robinhood Chain is EVM (Arbitrum Orbit). This changes data + links:
- **Addresses**: base58 (Solana) → `0x…` 42-char hex. Update any CA validation.
- **Explorer**: set `BRAND.links.explorerBase` to the RH Chain block explorer token URL base.
- **DEX / trade link**: set `BRAND.links.dexBase` (Uniswap is integrated on RH Chain).
- **Radar data source**: replace the pump.fun feed (PumpPortal/Bitquery) with an RH Chain / EVM
  source — **Alchemy** is an official RH Chain infra partner; a subgraph/indexer also works.
  Keep `fetchRadar()`'s return shape; UI needs no changes.
- **Callers feature**: contract validation there must switch to EVM `0x…` too.
- Remove/replace any pump.fun-specific concept (e.g. bonding-curve "graduation %") — RH Chain
  has no bonding curve unless a specific launchpad implements one.

## 4. Pages / navbar
- `WHO IS ALON?` → `WHO IS VLAD?` (route `/who-is-vlad`) — lore rewritten in this zip (verified Vlad facts).
- The old `$PUMP` token page → **`THE CHAIN`** page (route `/chain`) — explains Robinhood Chain. (In this zip as `Chain.jsx`.)
- `ALON BOT` page (live only): keep, but rebrand copy to VLAD + Robinhood Chain, same as everything else.
- Navbar order suggestion: SCOUT · WHO IS VLAD? · ROADMAP · THE CHAIN · (ALON→VLAD BOT) · (CALLERS).

## 5. Disclaimers — STRONGER than before (do not skip)
Vlad is a real, sitting CEO of a public company and "Robinhood" is a trademark. Every disclaimer
must now read: **"Parody / community project. Not affiliated with, endorsed by, or connected to
Robinhood Markets, Robinhood Chain, or Vlad Tenev."** Present on: loading gate, footer, /chain banner,
callers pages. Already set in `brand.config.js → disclaimer`.

## 6. Persona note (for the chat backend prompt)
Persona shifts from "deadpan degen" to **precise mathematician** (Vlad is a Stanford/UCLA
mathematician, founder of an AI reasoning company). Voice: measures, doesn't predict; "the numbers,
not the vibes"; still **no buy/sell calls, ever**. Reads updated in `src/lib/feed.js`.

## Done when
- [ ] No "alon" / "pump.fun" / "trenches" strings left in the live build (except historical lore if intended)
- [ ] Green is #3FB86E everywhere; no neon
- [ ] Explorer + DEX + radar data all pointing at Robinhood Chain, 0x addresses validated
- [ ] All disclaimers updated to the stronger Robinhood/Vlad wording
- [ ] Character CustomEvent renamed alon:state → vlad:state and Live2D still reacts
- [ ] Deployed; Bix gets URL for screenshots
