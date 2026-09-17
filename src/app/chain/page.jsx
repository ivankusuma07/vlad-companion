// THE CHAIN page — replaces the old token page. Explains Robinhood Chain, the
// network the scout watches. All figures are public, verifiable facts.
// This site is NOT affiliated with Robinhood — the banner below is mandatory.
import { ArrowRight } from "lucide-react";
import { BRAND } from "@/brand.config.js";

export const metadata = { title: "THE CHAIN — VLAD TENEV COMPANION" };

const facts = [
  { k: "Type", v: "Ethereum L2 (Arbitrum stack)" },
  { k: "Mainnet", v: "July 1, 2026" },
  { k: "Block time", v: "~100ms" },
  { k: "Gas", v: "ETH" },
];

const points = [
  {
    title: "ai-native",
    body: "robinhood calls it a permissionless, ai-native L2. agentic accounts let ai models trade, swap, lend, and transact with tokenized assets directly onchain, which is exactly the kind of world a scout belongs in.",
    icon: { cols: 11, rows: 11, fill: sparkleFill },
  },
  {
    title: "real-world assets",
    body: "the chain is built for tokenized real-world assets tokenized stocks and etfs streaming to 120+ countries, plus stablecoins, settling on ethereum.",
    icon: { cols: 13, rows: 13, fill: coinFill },
  },
  {
    title: "permissionless",
    body: "like its peer L2s, anyone can deploy onchain. that openness is why new tokens appear here and why vlad watches every one of them, volume, holders, and liquidity in real time.",
    icon: { cols: 10, rows: 13, fill: padlockFill },
  },
];

// Every icon holds this long before it starts assembling — long enough that
// it reads as a deliberate reveal once the page has settled, not something
// racing the page's own load-in.
const MOSAIC_BASE_DELAY = 1.5;

// A small dot-matrix grid — half-lit cells at the silhouette's edge give it
// a soft "dissolving" boundary instead of a hard pixel outline. Cells scale
// in from nothing on mount, staggered by distance from the icon's own
// center, so it reads as assembling itself rather than a flat sprite —
// pure transform, no opacity in the animation, so prefers-reduced-motion
// (which strips the animation globally) still leaves every cell fully
// visible at its correct final opacity instead of stuck invisible.
function MosaicIcon({ cols, rows, fill, size = 60, color = "var(--green)" }) {
  const cell = size / Math.max(cols, rows);
  const gap = cell * 0.2;
  const box = cell - gap;
  const cx = (cols - 1) / 2;
  const cy = (rows - 1) / 2;
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const o = fill(r, c);
      if (o > 0) {
        const delay = MOSAIC_BASE_DELAY + Math.hypot(r - cy, c - cx) * 0.022;
        cells.push(
          <rect
            key={`${r}-${c}`}
            className="mosaic-cell"
            x={c * cell + gap / 2}
            y={r * cell + gap / 2}
            width={box}
            height={box}
            rx={box * 0.3}
            fill={color}
            style={{ opacity: o, animationDelay: `${delay}s` }}
          />,
        );
      }
    }
  }
  return (
    <svg width={cols * cell} height={rows * cell} style={{ flexShrink: 0, overflow: "visible" }} aria-hidden="true">
      {cells}
    </svg>
  );
}

// Four-point sparkle — two tapering bars (one per axis) sharing the same
// half-width-by-distance profile, so the arms stay symmetric by
// construction rather than by hand-plotted cells.
const SPARKLE_HW = [3, 2, 2, 1, 1, 0]; // half-width at distance 0..5 from center
function sparkleFill(r, c) {
  const dr = Math.abs(r - 5);
  const dc = Math.abs(c - 5);
  const vertical = dc <= SPARKLE_HW[dr];
  const horizontal = dr <= SPARKLE_HW[dc];
  if (!vertical && !horizontal) return 0;
  const atEdge = dc === SPARKLE_HW[dr] || dr === SPARKLE_HW[dc];
  return atEdge ? 0.5 : 1;
}

// A single coin — a filled disc with a thin embossed groove through the
// middle so it reads as currency, not just a dot or a planet.
function coinFill(r, c) {
  const dist = Math.hypot(r - 6, c - 6);
  if (dist > 6) return 0;
  if (dist > 5.2) return 0.5; // dissolving rim
  if (r === 6) return 0.55; // the groove
  return 1;
}

// An open padlock — the shackle's left leg plugs into the body; its right
// end is swung up and clear of it, with a real gap between the two, so it
// reads as "unlatched" rather than a solid blob with a notch cut out.
function padlockFill(r, c) {
  if (r >= 7 && r <= 12 && c >= 1 && c <= 9) {
    const atEdge = r === 12 || c === 1 || c === 9;
    return atEdge ? 0.55 : 1;
  }
  if (r >= 2 && r <= 7 && c >= 3 && c <= 4) return 1; // shackle: left leg, plugged into the body
  if (r >= 1 && r <= 2 && c >= 3 && c <= 7) return 1; // shackle: top arch
  if (r >= 0 && r <= 3 && c >= 8 && c <= 9) return 1; // shackle: right end, swung open
  return 0;
}

// The reference page — restrained, spec-sheet register, but not a wall of
// paragraph cards: the block-time figure gets the one hero treatment on this
// page (it's the actual headline fact — everything else on the site depends
// on the chain being this fast), next to a plain diagram of where a token
// actually sits in the stack, since "permissionless L2" is an abstract claim
// until you see what's upstream and downstream of it.
export default function Chain() {
  return (
    <main className="container page" style={{ maxWidth: 900 }}>
      <h1 style={{ fontSize: "clamp(26px,4vw,36px)", margin: "0 0 var(--sp-4)" }}>
        the network vlad watches.
      </h1>

      <div className="card card--status status-hot" style={{ padding: "var(--sp-3) var(--sp-5)", margin: "var(--sp-5) 0 var(--sp-6)" }}>
        <p style={{ fontSize: 13, color: "var(--amber)", lineHeight: 1.6 }}>
          heads up: Robinhood Chain is built and operated by Robinhood Markets. VLAD TENEV
          COMPANION and {BRAND.ticker} are a separate parody project with no affiliation to
          Robinhood or Vlad Tenev. we cover the chain because it&apos;s the network our scout
          lives on. always use{" "}
          <a href={BRAND.refs.chainDocs} target="_blank" rel="noreferrer" className="row-link" style={{ textDecoration: "underline" }}>
            official Robinhood channels
          </a>{" "}
          for anything about the chain itself.
        </p>
      </div>

      <div className="chain-hero card" style={{ padding: "var(--sp-6)", marginBottom: "var(--sp-5)", display: "flex", gap: "var(--sp-6)", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 auto" }}>
          <span className="tag">block time</span>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 4 }}>
            <span className="display mono" style={{ fontSize: 46, fontWeight: 600 }}>~100</span>
            <span className="mono" style={{ fontSize: 18, color: "var(--text-2)" }}>ms</span>
            <span className="live-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)", display: "inline-block", marginLeft: 6 }} />
          </div>
          <p style={{ fontSize: 13, color: "var(--text-2)", marginTop: "var(--sp-2)", maxWidth: 260, lineHeight: 1.6 }}>
            faster than you can read this sentence. the chain confirms while you&apos;re still parsing it.
          </p>
        </div>

        {/* Where a token actually sits: settles to ethereum, runs on the L2,
            gets used by agentic accounts. Not decoration — this is the shape
            of the stack the facts below describe in words. */}
        <div style={{ flex: "1 1 320px", display: "flex", alignItems: "center", gap: "var(--sp-2)", justifyContent: "center", flexWrap: "wrap" }}>
          <StackNode label="ethereum" sub="settlement" />
          <ArrowRight size={16} color="var(--text-3)" style={{ flexShrink: 0 }} />
          <StackNode label={BRAND.chainName.toLowerCase()} sub="ai-native L2" accent />
          <ArrowRight size={16} color="var(--text-3)" style={{ flexShrink: 0 }} />
          <StackNode label="agentic accounts" sub="trade · swap · lend" />
        </div>
      </div>

      <div className="card" style={{ padding: "var(--sp-5) var(--sp-6)", marginBottom: "var(--sp-5)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "var(--sp-4)" }}>
          {facts.map((f, i) => (
            <div key={i} style={{ paddingLeft: i ? "var(--sp-4)" : 0, borderLeft: i ? "1px solid var(--rule)" : "none" }}>
              <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: "var(--sp-1)" }}>{f.k}</div>
              <div className="mono" style={{ fontSize: 14 }}>{f.v}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
        {points.map((u, i) => (
          <div key={i} className="card card--interactive" style={{ padding: "var(--sp-5) var(--sp-6)", display: "flex", gap: "var(--sp-5)", alignItems: "center" }}>
            <MosaicIcon {...u.icon} />
            <div>
              <h3 style={{ fontSize: 17, marginBottom: "var(--sp-2)" }}>{u.title}</h3>
              <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.65 }}>{u.body}</p>
            </div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 11, color: "var(--text-3)", marginTop: "var(--sp-6)", lineHeight: 1.6 }}>
        figures are public information as of mid-2026 and can change. verify everything on
        official sources. nothing on this page is financial advice. DYOR.
      </p>
    </main>
  );
}

function StackNode({ label, sub, accent }) {
  return (
    <div className="card" style={{ padding: "var(--sp-2) var(--sp-3)", textAlign: "center", borderColor: accent ? "rgba(204,255,0,0.35)" : undefined, minWidth: 118 }}>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: accent ? "var(--green)" : "var(--text-1)" }}>{label}</div>
      <div className="tag" style={{ fontSize: 10, marginTop: 2 }}>{sub}</div>
    </div>
  );
}
