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

// The plan page — each phase card's left border matches its actual status
// (live/next/planned) instead of every card looking identical regardless of
// where it sits in the roadmap. Heading sits between Chain's restraint and
// WhoIsVlad's drama, matching a page that's forward-looking but still a list.
export default function Roadmap() {
  return (
    <main className="container page" style={{ maxWidth: 860 }}>
      <div className="eyebrow">ROADMAP</div>
      <h1 style={{ fontSize: "clamp(28px,4.8vw,42px)", fontWeight: 600, letterSpacing: "-0.015em", margin: "var(--sp-2) 0 var(--sp-7)" }}>
        one scout. three phases.
      </h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
        {phases.map((p, i) => (
          <div key={i} className={`card card--interactive card--status ${p.accent}`} style={{ padding: "var(--sp-6) var(--sp-6)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--sp-2)" }}>
              <span className="mono" style={{ fontSize: 12, letterSpacing: "0.14em", color: "var(--text-2)" }}>{p.phase}</span>
              <span className={`pill ${p.pill}`}>{p.status}</span>
            </div>
            <h3 style={{ fontSize: 20, marginBottom: "var(--sp-3)" }}>{p.title}</h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
              {p.items.map((it, j) => (
                <li key={j} style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.6, display: "flex", gap: "var(--sp-2)" }}>
                  <span style={{ color: "var(--green)" }}>—</span> {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}
