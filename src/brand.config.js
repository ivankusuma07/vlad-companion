// VLAD TENEV COMPANION — single source of truth.
// Rebrand of ALON COMPANION: pump.fun/Solana -> Robinhood Chain, Alon -> Vlad Tenev.
// Edit here, everything updates. Do not hardcode these values in components.

export const BRAND = {
  name: "VLAD",
  product: "VLAD TENEV COMPANION",
  tagline: "he watches the chain so you don't have to.",
  ticker: "$VLAD", // placeholder — change if you lock a different ticker
  ca: null, // set at launch -> shows "Revealed at launch" until then

  chainName: "Robinhood Chain",

  // Social only. The explorer and DEX bases moved to server env
  // (RH_CHAIN_EXPLORER_BASE / RH_CHAIN_DEX_BASE) so there's one source of truth
  // for chain config — the API returns a ready-built `links` object per token.
  links: {
    x: "https://x.com/REPLACE_ME",
    telegram: "https://t.me/REPLACE_ME",
  },

  // Real Vlad / Robinhood references (feed + lore). DEV: verify handles.
  refs: {
    vladX: "https://x.com/vladtenev",
    robinhoodX: "https://x.com/RobinhoodApp",
    chainDocs: "https://docs.robinhood.com/chain",
  },

  // Loading gate
  gate: {
    videoSrc: "/media/gate.mp4", // <- DEV: drop Bix's generated video here
    poster: "/media/gate-poster.jpg", // optional first-frame image
    headline: "the chain never sleeps.",
    sub: "neither does he.",
    cta: "ENTER THE CHAIN",
  },

  // Live2D character states (dev wires model to these)
  characterStates: ["IDLE", "SCANNING", "REACT_HOT", "REACT_WARN", "REPORT"],

  // Per-state clips for the character stage. Only IDLE and SCANNING have
  // dedicated footage so far — the three reactive states fall back to
  // SCANNING (closer to "something is happening") rather than freezing on
  // idle. Swap these paths for a real Live2D Cubism runtime later; the
  // component reads this map, not literal paths, so that's a drop-in change.
  characterMedia: {
    IDLE: "/media/idle.mp4",
    SCANNING: "/media/scanning.mp4",
    REACT_HOT: "/media/scanning.mp4", // DEV: no dedicated clip yet
    REACT_WARN: "/media/scanning.mp4", // DEV: no dedicated clip yet
    REPORT: "/media/scanning.mp4", // DEV: no dedicated clip yet
  },

  disclaimer:
    "VLAD TENEV COMPANION is a parody / community project. Not affiliated with, endorsed by, or connected to Robinhood Markets, Robinhood Chain, or Vlad Tenev. Nothing here is financial advice. DYOR.",
};

// Robinhood-family green, deliberately desaturated so it works with dark glass (NOT neon).
export const COLORS = {
  base: "#0B0F0D",
  baseRaised: "#101613",
  glass: "rgba(255,255,255,0.05)",
  glassEdge: "rgba(255,255,255,0.14)",
  textPrimary: "#EFF5F0",
  textSecondary: "#9AAAA0",
  green: "#3FB86E",
  greenDeep: "#2C8E58",
  amber: "#E0B15C",
  red: "#E07A6B",
};
