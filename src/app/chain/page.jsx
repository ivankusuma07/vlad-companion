// THE CHAIN page — replaces the old token page. Explains Robinhood Chain, the
// network the scout watches. All figures are public, verifiable facts.
// This site is NOT affiliated with Robinhood — the banner below is mandatory.
import { ArrowRight, Bot, Landmark, Unlock } from "lucide-react";
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
    icon: Bot,
    title: "ai-native",
    body: "robinhood calls it a permissionless, ai-native L2. agentic accounts let ai models trade, swap, lend, and transact with tokenized assets directly onchain — which is exactly the kind of world a scout belongs in.",
  },
  {
    icon: Landmark,
    title: "real-world assets",
    body: "the chain is built for tokenized real-world assets — tokenized stocks and etfs streaming to 120+ countries, plus stablecoins, settling on ethereum.",
  },
  {
    icon: Unlock,
    title: "permissionless",
    body: "like its peer L2s, anyone can deploy onchain. that openness is why new tokens appear here — and why vlad watches every one of them, volume, holders, and liquidity in real time.",
  },
];

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
          <div key={i} className="card card--interactive" style={{ padding: "var(--sp-5) var(--sp-6)", display: "flex", gap: "var(--sp-4)", alignItems: "flex-start" }}>
            <span style={{ width: 34, height: 34, borderRadius: "var(--radius-xs)", background: "var(--green-soft)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <u.icon size={16} color="var(--green)" />
            </span>
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
    <div className="card" style={{ padding: "var(--sp-2) var(--sp-3)", textAlign: "center", borderColor: accent ? "rgba(63,184,110,0.35)" : undefined, minWidth: 118 }}>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: accent ? "var(--green)" : "var(--text-1)" }}>{label}</div>
      <div className="tag" style={{ fontSize: 10, marginTop: 2 }}>{sub}</div>
    </div>
  );
}
