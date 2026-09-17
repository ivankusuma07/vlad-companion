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
          <a href={BRAND.links.x} target="_blank" rel="noreferrer" className="row-link" aria-label="X (formerly Twitter)" style={{ color: "var(--text-2)", display: "flex" }}>
            <XLogo size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
}

// x.com's mark — not in lucide (it only ships the generic close/"X" glyph,
// which isn't drawn to the brand's proportions), so it's hand-drawn here.
function XLogo({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}
