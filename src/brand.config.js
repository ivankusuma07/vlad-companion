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
    videoSrc: "/media/bgv.mp4",
    poster: "/media/gate-poster.jpg", // optional first-frame image
    headline: "VLAD",
    sub: "the chain never sleeps. neither does he.",
    cta: "ENTER THE CHAIN",
  },

  // Live2D character states (dev wires model to these)
  characterStates: ["IDLE", "SCANNING", "REACT_HOT", "REACT_WARN", "REPORT"],

  // Per-state clips for the character stage. IDLE, SCANNING, and REACT_HOT
  // each have dedicated footage; REACT_WARN and REPORT fall back to
  // REACT_HOT's clip (closer to "something is happening" than freezing on
  // idle). Swap these paths for a real Live2D Cubism runtime later; the
  // component reads this map, not literal paths, so that's a drop-in change.
  characterMedia: {
    IDLE: "/media/idle_vlad.mp4",
    SCANNING: "/media/scanning_vlad.mp4",
    REACT_HOT: "/media/react_hot.mp4",
    REACT_WARN: "/media/react_hot.mp4", // DEV: no dedicated clip yet
    REPORT: "/media/react_hot.mp4", // DEV: no dedicated clip yet
  },

  disclaimer:
    "VLAD TENEV COMPANION is a parody / community project. Not affiliated with, endorsed by, or connected to Robinhood Markets, Robinhood Chain, or Vlad Tenev. Nothing here is financial advice. DYOR.",
};

// Mirrors the tokens in src/app/globals.css (:root) for the rare spot that
// needs a color in JS rather than CSS (e.g. layout.jsx's viewport
// themeColor). Nothing else in the app should read from this — components
// use the CSS vars directly. Keep the two in sync by hand; there's no build
// step wiring them together.
// Robinhood-family green, deliberately desaturated so it works on dark flat
// panels (NOT neon).
export const COLORS = {
  base: "#090B09",
  baseRaised: "#10130F",
  glass: "rgba(255,255,255,0.045)",
  glassEdge: "rgba(233,237,232,0.14)",
  textPrimary: "#E9EDE8",
  textSecondary: "#8C978E",
  green: "#3FB86E",
  greenDeep: "#2C8E58",
  amber: "#E0B15C",
  red: "#E07A6B",
};
