import { BRAND } from "@/brand.config.js";

export default function Footer() {
  return (
    <footer className="container" style={{ padding: "40px 24px 30px" }}>
      <div className="glass" style={{ padding: "22px 26px", display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div className="display" style={{ fontWeight: 600 }}>{BRAND.product}</div>
          <div className="mono" style={{ fontSize: 12, color: "var(--text-2)", marginTop: 6 }}>
            {BRAND.ca ? `CA: ${BRAND.ca}` : "CA: revealed at launch"}
          </div>
        </div>
        <div style={{ display: "flex", gap: 18 }}>
          <a href={BRAND.links.x} target="_blank" rel="noreferrer" style={lnk}>X</a>
          <a href={BRAND.links.telegram} target="_blank" rel="noreferrer" style={lnk}>Telegram</a>
        </div>
        <p style={{ width: "100%", color: "var(--text-3)", fontSize: 11, lineHeight: 1.6 }}>{BRAND.disclaimer}</p>
      </div>
    </footer>
  );
}
const lnk = { color: "var(--text-2)", fontFamily: "var(--font-display)", fontSize: 13, letterSpacing: "0.08em" };
