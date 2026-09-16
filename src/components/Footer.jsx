import { BRAND } from "@/brand.config.js";

export default function Footer() {
  return (
    <footer className="container" style={{ padding: "var(--sp-7) 24px var(--sp-6)" }}>
      <div className="card" style={{ padding: "var(--sp-5) var(--sp-6)", display: "flex", flexWrap: "wrap", gap: "var(--sp-4)", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div className="display" style={{ fontWeight: 600 }}>{BRAND.product}</div>
          <div className="mono" style={{ fontSize: 12, color: "var(--text-2)", marginTop: 6 }}>
            {BRAND.ca ? `CA: ${BRAND.ca}` : "CA: revealed at launch"}
          </div>
        </div>
        <div style={{ display: "flex", gap: "var(--sp-5)" }}>
          <a href={BRAND.links.x} target="_blank" rel="noreferrer" className="row-link" style={lnk}>X</a>
          <a href={BRAND.links.telegram} target="_blank" rel="noreferrer" className="row-link" style={lnk}>Telegram</a>
        </div>
        <p style={{ width: "100%", color: "var(--text-3)", fontSize: 11, lineHeight: 1.6 }}>{BRAND.disclaimer}</p>
      </div>
    </footer>
  );
}
const lnk = { color: "var(--text-2)", fontFamily: "var(--font-display)", fontSize: 13, letterSpacing: "0.08em" };
