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
    body: "he studies mathematics at stanford, then a master's at UCLA, and starts a phd — before leaving to build. the math never leaves him. it becomes the whole personality.",
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
    body: "vlad co-founds harmonic, an AI company chasing 'mathematical superintelligence' — a reasoning engine with guaranteed accuracy. he describes the dream as solving the riemann hypothesis on a phone.",
  },
  {
    date: "FEB 2026",
    title: "the chain appears",
    body: "at consensus hong kong, robinhood launches the public testnet for robinhood chain — an ethereum L2 on arbitrum. it does 4 million transactions in the first week.",
  },
  {
    date: "JUL 1, 2026",
    title: "the world is flat",
    body: "at a london keynote, robinhood chain mainnet goes live: an ai-native, permissionless L2 for tokenized real-world assets, tokenized stocks streaming to 120+ countries.",
  },
  {
    date: "NOW",
    title: "onchain, always",
    body: "the chain runs 24/7 at 100ms blocks. ai agents trade, swap, and transact onchain. the next chapter of finance is live — and someone has to watch it.",
  },
];

export default function WhoIsVlad() {
  return (
    <main className="container page" style={{ maxWidth: 860 }}>
      <div className="eyebrow">WHO IS VLAD?</div>
      <h1 style={{ fontSize: "clamp(30px,4.5vw,44px)", margin: "10px 0 14px" }}>
        the mathematician who put finance onchain.
      </h1>
      <p style={{ color: "var(--text-2)", lineHeight: 1.7, maxWidth: 640 }}>
        VLAD TENEV COMPANION is a parody tribute to vlad tenev — mathematician, co-founder
        and CEO of robinhood, and the man behind robinhood chain. this page is his story.
        every event below actually happened. we are fans, not affiliates.
      </p>

      <div style={{ marginTop: 44, display: "flex", flexDirection: "column", gap: 16 }}>
        {timeline.map((t, i) => (
          <div key={i} className="glass" style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: "120px 1fr", gap: 18 }}>
            <div className="mono" style={{ fontSize: 12, color: "var(--green)", letterSpacing: "0.1em", paddingTop: 3 }}>{t.date}</div>
            <div>
              <h3 style={{ fontSize: 17, marginBottom: 6 }}>{t.title}</h3>
              <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.65 }}>{t.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="glass" style={{ marginTop: 30, padding: "20px 24px" }}>
        <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.7 }}>
          that's why vlad exists here — a scout built on his one rule: trust the math,
          measure everything, predict nothing. the numbers don't lie.
        </p>
      </div>
    </main>
  );
}
