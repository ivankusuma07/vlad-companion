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

export default function Chain() {
  return (
    <main className="container page" style={{ maxWidth: 860 }}>
      <div className="eyebrow">THE CHAIN — ROBINHOOD CHAIN</div>
      <h1 style={{ fontSize: "clamp(30px,4.5vw,44px)", margin: "10px 0 14px" }}>
        the network vlad watches.
      </h1>

      <div className="glass" style={{ padding: "14px 20px", margin: "18px 0 30px", borderColor: "rgba(224,177,92,0.35)" }}>
        <p style={{ fontSize: 13, color: "var(--amber)", lineHeight: 1.6 }}>
          heads up: Robinhood Chain is built and operated by Robinhood Markets. VLAD TENEV
          COMPANION and {BRAND.ticker} are a separate parody project with no affiliation to
          Robinhood or Vlad Tenev. we cover the chain because it&apos;s the network our scout
          lives on. always use{" "}
          <a href={BRAND.refs.chainDocs} target="_blank" rel="noreferrer" style={{ textDecoration: "underline" }}>
            official Robinhood channels
          </a>{" "}
          for anything about the chain itself.
        </p>
      </div>

      <div className="glass" style={{ padding: "22px 26px", marginBottom: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 18 }}>
          {facts.map((f, i) => (
            <div key={i}>
              <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 4 }}>{f.k}</div>
              <div className="mono" style={{ fontSize: 14 }}>{f.v}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {points.map((u, i) => (
          <div key={i} className="glass" style={{ padding: "20px 24px" }}>
            <h3 style={{ fontSize: 17, marginBottom: 8 }}>{u.title}</h3>
            <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.65 }}>{u.body}</p>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 11, color: "var(--text-3)", marginTop: 24, lineHeight: 1.6 }}>
        figures are public information as of mid-2026 and can change. verify everything on
        official sources. nothing on this page is financial advice. DYOR.
      </p>
    </main>
  );
}
