import { Fragment } from "react";
import { BRAND } from "@/brand.config.js";

export const metadata = { title: "ROADMAP — VLAD TENEV COMPANION" };

const phases = [
  {
    phase: "PHASE 1", status: "LIVE", accent: "status-watch", pill: "pill--watch", title: "the scout",
    items: [
      `live radar over ${BRAND.chainName} launches — volume velocity, holder growth, LP health`,
      "vlad status reads: watching / heating / thin LP / cooling",
      "live2d vlad reacting to the chain in real time",
      "chat with vlad (precise mode, no calls, ever)",
      "manual contract scan",
    ],
  },
  {
    phase: "PHASE 2", status: "NEXT", accent: "status-hot", pill: "pill--hot", title: "the alerts",
    items: [
      "telegram alert bot — vlad pings the chat the moment something moves",
      `holder-gated fast lane: earlier alerts for ${BRAND.ticker} holders`,
      "watchlist — tell vlad what to measure",
    ],
  },
  {
    phase: "PHASE 3", status: "PLANNED", accent: "status-cool", pill: "pill--cool", title: "the mirror",
    items: [
      "pnl companion — connect a wallet, vlad reads your trades and reacts",
      "shareable pnl cards, vlad-branded",
      "leaderboard for the most disciplined hands onchain",
    ],
  },
];

// Node/line color per phase status, reused by both the stepper up top and
// each card's own dot below — one legend, not two.
const DOT = { LIVE: "var(--green)", NEXT: "var(--amber)", PLANNED: "var(--rule-strong)" };

// The plan page — a stepper across the top makes "three phases, here's where
// we are" a single glance instead of something you infer from reading pill
// text three times. Cards sit side by side (a path, left to right) rather
// than stacked, and each carries its own number as a quiet watermark — the
// one place in the app a big background numeral is earned, since these
// really are phase 1/2/3, not decoration.
export default function Roadmap() {
  return (
    <main className="container page" style={{ maxWidth: 1080 }}>
      <h1 style={{ fontSize: "clamp(28px,4.8vw,40px)", margin: "0 0 var(--sp-6)" }}>
        one scout. three phases.
      </h1>

      <div className="roadmap-stepper" style={{ display: "flex", alignItems: "center", margin: "0 0 var(--sp-7)" }}>
        {phases.map((p, i) => (
          <Fragment key={p.phase}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <span
                className={p.status === "LIVE" ? "live-dot" : undefined}
                style={{ width: 13, height: 13, borderRadius: "50%", background: p.status === "LIVE" ? "var(--green)" : "var(--base)", border: `2px solid ${DOT[p.status]}` }}
              />
              <span className="tag" style={{ fontSize: 11, whiteSpace: "nowrap" }}>{p.title}</span>
            </div>
            {i < phases.length - 1 && (
              <div style={{ flex: 1, height: 1, margin: "0 var(--sp-2) 22px", background: p.status === "LIVE" ? "var(--green)" : "var(--rule)" }} />
            )}
          </Fragment>
        ))}
      </div>

      <div className="roadmap-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--sp-4)", alignItems: "start" }}>
        {phases.map((p, i) => (
          <div key={i} className={`card card--interactive card--status ${p.accent}`} style={{ padding: "var(--sp-6)", position: "relative", overflow: "hidden" }}>
            <span aria-hidden="true" className="display" style={{ position: "absolute", top: -14, right: 4, fontSize: 92, fontWeight: 600, color: "rgba(233,237,232,0.045)", lineHeight: 1, zIndex: 0 }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--sp-2)" }}>
                <span className="mono" style={{ fontSize: 12, color: "var(--text-2)" }}>{p.phase}</span>
                <span className={`pill ${p.pill}`}>{p.status}</span>
              </div>
              <h3 style={{ fontSize: 20, marginBottom: "var(--sp-3)" }}>{p.title}</h3>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
                {p.items.map((it, j) => (
                  <li key={j} style={{ fontSize: 13.5, color: "var(--text-2)", lineHeight: 1.6, display: "flex", gap: "var(--sp-2)" }}>
                    <span style={{ color: "var(--green)" }}>—</span> {it}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 860px) {
          .roadmap-grid { grid-template-columns: 1fr !important; }
          .roadmap-stepper { display: none !important; }
        }
      `}</style>
    </main>
  );
}
