import { BRAND } from "@/brand.config.js";

export const metadata = { title: "ROADMAP — VLAD TENEV COMPANION" };

const phases = [
  {
    phase: "PHASE 1", status: "LIVE", title: "the scout",
    items: [
      `live radar over ${BRAND.chainName} launches — volume velocity, holder growth, LP health`,
      "vlad status reads: watching / heating / thin LP / cooling",
      "live2d vlad reacting to the chain in real time",
      "chat with vlad (precise mode, no calls, ever)",
      "manual contract scan",
    ],
  },
  {
    phase: "PHASE 2", status: "NEXT", title: "the alerts",
    items: [
      "telegram alert bot — vlad pings the chat the moment something moves",
      `holder-gated fast lane: earlier alerts for ${BRAND.ticker} holders`,
      "watchlist — tell vlad what to measure",
    ],
  },
  {
    phase: "PHASE 3", status: "PLANNED", title: "the mirror",
    items: [
      "pnl companion — connect a wallet, vlad reads your trades and reacts",
      "shareable pnl cards, vlad-branded",
      "leaderboard for the most disciplined hands onchain",
    ],
  },
];

export default function Roadmap() {
  return (
    <main className="container page" style={{ maxWidth: 860 }}>
      <div className="eyebrow">ROADMAP</div>
      <h1 style={{ fontSize: "clamp(30px,4.5vw,44px)", margin: "10px 0 40px" }}>one scout. three phases.</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {phases.map((p, i) => (
          <div key={i} className="glass" style={{ padding: "24px 28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span className="mono" style={{ fontSize: 12, letterSpacing: "0.14em", color: "var(--text-2)" }}>{p.phase}</span>
              <span className={`pill ${p.status === "LIVE" ? "pill--watch" : "pill--cool"}`}>{p.status}</span>
            </div>
            <h3 style={{ fontSize: 20, marginBottom: 14 }}>{p.title}</h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {p.items.map((it, j) => (
                <li key={j} style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.6, display: "flex", gap: 10 }}>
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
