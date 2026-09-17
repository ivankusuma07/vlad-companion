import { ArrowRight, Flame } from "lucide-react";
import { BRAND } from "@/brand.config.js";

// Full-screen gate shown before the app. Background = Bix's generated video,
// playing edge to edge — DEV: drop it at public/media/gate.mp4 (path set in
// brand.config.js). Keep it muted + playsInline or mobile browsers refuse to
// autoplay. The copy sits in its own floating panel rather than bare over the
// footage, with a small live-radar preview beside it — a real product
// teaser (built from the same card/pill/mono pieces the app itself uses),
// not a mockup of some other product's screenshot.
export default function LoadingGate({ onEnter }) {
  const g = BRAND.gate;
  return (
    <div style={styles.wrap}>
      <video style={styles.video} src={g.videoSrc} poster={g.poster} autoPlay muted loop playsInline />
      <div style={styles.scrim} />

      <div style={styles.center}>
        <div className="gate-panel" style={styles.panel}>
          <div style={styles.copy}>
            <span className="tag" style={styles.kicker}>parody companion · {BRAND.chainName.toLowerCase()}</span>
            <h1 className="display" style={styles.headline}>{g.headline}</h1>
            <p style={styles.sub}>{g.sub}</p>
            <button className="btn btn--green" style={{ marginTop: "var(--sp-6)" }} onClick={onEnter}>
              {g.cta} <ArrowRight size={16} />
            </button>
            <p style={styles.meta}>no wallet · no signup · just the radar</p>
          </div>

          <div className="gate-preview" style={styles.preview}>
            <GatePreview />
          </div>
        </div>

        <p style={styles.legal}>{BRAND.disclaimer}</p>
      </div>

      <style>{`
        @media (max-width: 760px) {
          .gate-panel { flex-direction: column !important; align-items: stretch !important; text-align: center; }
          .gate-preview { width: 100% !important; }
        }
      `}</style>
    </div>
  );
}

// A live-radar card, same shape a real one takes on the Scout page — the
// gate promises "he watches the chain" and this is what that actually looks
// like, before you've even entered.
function GatePreview() {
  return (
    <div className="card card--status status-hot" style={{ padding: "var(--sp-4)", width: 240 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span className="display" style={{ fontWeight: 600, fontSize: 16 }}>$DEPTH</span>
        <span className="pill pill--hot"><Flame size={11} /> Heating</span>
      </div>
      <div style={{ height: 3, background: "var(--rule)", borderRadius: 999, marginTop: "var(--sp-3)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: "72%", background: "var(--amber)", borderRadius: 999 }} />
      </div>
      <div style={{ display: "flex", gap: "var(--sp-4)", marginTop: "var(--sp-3)" }}>
        <MiniStat label="vol/min" value="$2.1k" />
        <MiniStat label="holders" value="+180" />
      </div>
      <p style={{ fontSize: 12, color: "var(--text-2)", fontStyle: "italic", marginTop: "var(--sp-3)", lineHeight: 1.5 }}>
        &ldquo;the numbers are moving. i don&apos;t round up.&rdquo;
      </p>
      <p className="tag" style={{ fontSize: 10, marginTop: "var(--sp-3)", display: "flex", alignItems: "center", gap: 6 }}>
        <span className="live-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", display: "inline-block" }} />
        sample preview
      </p>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div>
      <div className="tag" style={{ fontSize: 10 }}>{label}</div>
      <div className="mono" style={{ fontSize: 13, marginTop: 2 }}>{value}</div>
    </div>
  );
}

const styles = {
  wrap: { position: "fixed", inset: 0, overflow: "hidden", background: "var(--base)" },
  video: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" },
  scrim: { position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(9,11,9,0.3) 0%, rgba(9,11,9,0.5) 55%, rgba(9,11,9,0.82) 100%)" },
  center: { position: "relative", minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px" },
  panel: {
    display: "flex", alignItems: "center", gap: "var(--sp-7)",
    background: "rgba(9,11,9,0.7)", border: "1px solid var(--rule-strong)", borderRadius: "var(--radius)",
    padding: "var(--sp-7)", maxWidth: 800, width: "100%",
    backdropFilter: "blur(16px) saturate(1.2)", WebkitBackdropFilter: "blur(16px) saturate(1.2)",
    boxShadow: "var(--shadow-lg)",
  },
  copy: { flex: "1 1 340px", minWidth: 0 },
  kicker: { display: "inline-block", marginBottom: "var(--sp-3)" },
  headline: { fontSize: "clamp(30px, 4.6vw, 48px)", fontWeight: 600, lineHeight: 1.1 },
  sub: { color: "var(--text-2)", marginTop: "var(--sp-2)", fontSize: 16 },
  meta: { color: "var(--text-3)", fontSize: 11.5, marginTop: "var(--sp-3)" },
  preview: { flex: "0 0 auto" },
  legal: { color: "var(--text-3)", fontSize: 11, lineHeight: 1.6, maxWidth: 700, textAlign: "center", marginTop: "var(--sp-6)" },
};
