// THE CHAIN page — replaces the old token page. Explains Robinhood Chain, the
// network the scout watches. All figures are public, verifiable facts.
// This site is NOT affiliated with Robinhood — the banner below is mandatory.
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
    body: "robinhood calls it a permissionless, ai-native L2. agentic accounts let ai models trade, swap, lend, and transact with tokenized assets directly onchain — which is exactly the kind of world a scout belongs in.",
  },
  {
    title: "real-world assets",
    body: "the chain is built for tokenized real-world assets — tokenized stocks and etfs streaming to 120+ countries, plus stablecoins, settling on ethereum.",
  },
  {
    title: "permissionless",
    body: "like its peer L2s, anyone can deploy onchain. that openness is why new tokens appear here — and why vlad watches every one of them, volume, holders, and liquidity in real time.",
  },
];

// This is the reference page — restrained, spec-sheet register (smaller
// heading than the lore page, heavier reliance on the facts grid) rather than
// the same display-size treatment repeated across every page in the app.
export default function Chain() {
  return (
    <main className="container page" style={{ maxWidth: 860 }}>
      <div className="eyebrow">THE CHAIN — ROBINHOOD CHAIN</div>
      <h1 style={{ fontSize: "clamp(26px,4vw,38px)", fontWeight: 600, letterSpacing: "-0.01em", margin: "var(--sp-2) 0 var(--sp-4)" }}>
        the network vlad watches.
      </h1>

      <div className="card card--status status-hot" style={{ padding: "var(--sp-3) var(--sp-5)", margin: "var(--sp-5) 0 var(--sp-7)" }}>
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

      <div className="card" style={{ padding: "var(--sp-5) var(--sp-6)", marginBottom: "var(--sp-5)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "var(--sp-4)" }}>
          {facts.map((f, i) => (
            <div key={i}>
              <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: "var(--sp-1)" }}>{f.k}</div>
              <div className="mono" style={{ fontSize: 14 }}>{f.v}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
        {points.map((u, i) => (
          <div key={i} className="card card--interactive" style={{ padding: "var(--sp-5) var(--sp-6)" }}>
            <h3 style={{ fontSize: 17, marginBottom: "var(--sp-2)" }}>{u.title}</h3>
            <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.65 }}>{u.body}</p>
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
