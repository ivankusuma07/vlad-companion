// Lore page. Timeline items are REAL public events (verifiable), told in the
// site's voice. Keep it factual — that's what makes it strong. Parody framing
// is stated up top so no one can claim impersonation.
export const metadata = { title: "WHO IS VLAD? — VLAD TENEV COMPANION" };

const timeline = [
  {
    date: "1987",
    title: "born in varna",
    body: "vlad tenev is born in varna, bulgaria, and moves to the US at age five. his parents work at the world bank. he grows up in the washington d.c. area.",
  },
  {
    date: "STANFORD",
    title: "the mathematician",
    body: "he studies mathematics at stanford, then a master's at UCLA, and starts a phd before leaving to build. the math never leaves him. it becomes the whole personality.",
  },
  {
    date: "2013",
    title: "democratize finance",
    body: "with baiju bhatt he co-founds robinhood: zero-commission trading through a phone. wall street charged $5–10 a trade. robinhood charged nothing. a generation started investing.",
  },
  {
    date: "2021",
    title: "the storm",
    body: "the gamestop short squeeze puts robinhood at the center of the financial world. months later, the company goes public on the nasdaq.",
  },
  {
    date: "2024",
    title: "the reasoning engine",
    body: "vlad co-founds harmonic, an AI company chasing 'mathematical superintelligence', a reasoning engine with guaranteed accuracy. he describes the dream as solving the riemann hypothesis on a phone.",
  },
  {
    date: "FEB 2026",
    title: "the chain appears",
    body: "at consensus hong kong, robinhood launches the public testnet for robinhood chain, an ethereum L2 on arbitrum. it does 4 million transactions in the first week.",
  },
  {
    date: "JUL 1, 2026",
    title: "the world is flat",
    body: "at a london keynote, robinhood chain mainnet goes live: an ai-native, permissionless L2 for tokenized real-world assets, tokenized stocks streaming to 120+ countries.",
  },
  {
    date: "NOW",
    title: "onchain, always",
    body: "the chain runs 24/7 at 100ms blocks. ai agents trade, swap, and transact onchain. the next chapter of finance is live and someone has to watch it.",
  },
];

// The story page — a real timeline (a connected spine with a node per event),
// not a stack of cards with a date printed in the corner. The last node is
// "now", so it's the one that gets the live pulse — everything before it is
// history, that one is still happening.
export default function WhoIsVlad() {
  const last = timeline.length - 1;
  return (
    <main className="container page" style={{ maxWidth: 860 }}>
      <h1 style={{ fontSize: "clamp(32px,5.5vw,50px)", lineHeight: 1.08, margin: "0 0 var(--sp-4)" }}>
        the mathematician who put finance onchain.
      </h1>
      <p style={{ color: "var(--text-2)", lineHeight: 1.7, maxWidth: 640 }}>
        VLADAR is a tribute to vlad tenev, mathematician, co-founder
        and CEO of robinhood, and the man behind robinhood chain. this page is his story.
        every event below actually happened. we are fans, not affiliates.
      </p>

      <div style={{ marginTop: "var(--sp-7)", display: "flex", flexDirection: "column", gap: "var(--sp-5)" }}>
        {timeline.map((t, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "84px 20px 1fr", gap: "var(--sp-3)" }}>
            <div className="mono" style={{ fontSize: 12, color: "var(--green)", textAlign: "right", paddingTop: 5 }}>{t.date}</div>

            {/* Node + the segment of spine leading to the next one — built from
                flow layout (no magic offsets), so it stretches to match
                whatever height that row's card ends up being. */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span
                className={i === last ? "live-dot" : undefined}
                style={{
                  width: 9, height: 9, borderRadius: "50%", flexShrink: 0, marginTop: 6,
                  background: i === last ? "var(--green)" : "var(--base-raised)",
                  border: `2px solid ${i === last ? "var(--green)" : "var(--rule-strong)"}`,
                }}
              />
              {i < last && <div style={{ flex: 1, width: 1, background: "var(--rule)", marginTop: 6 }} />}
            </div>

            <div className="card card--interactive" style={{ padding: "var(--sp-4) var(--sp-5)" }}>
              <h3 style={{ fontSize: 17, marginBottom: "var(--sp-2)" }}>{t.title}</h3>
              <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.65 }}>{t.body}</p>
              {i === last && (
                <p style={{ marginTop: "var(--sp-3)", paddingTop: "var(--sp-3)", borderTop: "1px solid var(--rule)", fontSize: 13, color: "var(--green)", lineHeight: 1.6 }}>
                  that&apos;s why vlad exists here — a scout built on his one rule: trust the math,
                  measure everything, predict nothing. the numbers don&apos;t lie.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
