import { ArrowRight } from "lucide-react";
import { BRAND } from "@/brand.config.js";

// Full-screen gate shown before the app. Background = Bix's generated video,
// playing edge to edge — DEV: drop it at public/media/gate.mp4 (path set in
// brand.config.js). Keep it muted + playsInline or mobile browsers refuse to
// autoplay. The floating panel carries its own clip too (card_gate.mp4) —
// two layers of motion, blurred atmosphere outside, a sharper "screen"
// inside the panel — with the Robinhood mark as the one static anchor.
export default function LoadingGate({ onEnter }) {
  const g = BRAND.gate;
  return (
    <div style={styles.wrap}>
      <video style={styles.video} src={g.videoSrc} poster={g.poster} autoPlay muted loop playsInline />
      <div style={styles.scrim} />

      <div style={styles.center}>
        <div className="gate-panel" style={styles.panel}>
          <video
            src="/media/card_gate.mp4"
            autoPlay muted loop playsInline
            style={styles.panelVideo}
          />
          <div style={styles.panelScrim} />

          <div style={styles.copy}>
            <span className="tag" style={styles.kicker}>{BRAND.chainName.toLowerCase()}</span>
            <h1 className="display" style={styles.headline}>{g.headline}</h1>
            <p style={styles.sub}>{g.sub}</p>
            <button className="btn btn--green" style={{ marginTop: "var(--sp-6)" }} onClick={onEnter}>
              {g.cta} <ArrowRight size={16} />
            </button>
            <p style={styles.meta}>no wallet · no signup · just the radar</p>
          </div>

          <div className="gate-preview" style={styles.preview}>
            {/* eslint-disable-next-line @next/next/no-img-element -- static local SVG, no next/image benefit */}
            <img src="/media/robinhood_icon.svg" alt="Robinhood" style={styles.mark} />
          </div>
        </div>
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

const styles = {
  wrap: { position: "fixed", inset: 0, overflow: "hidden", background: "var(--base)" },
  // Blurred and slightly scaled up — the scale keeps the blur from revealing
  // a hard, unblurred edge at the viewport boundary. Softening the whole
  // frame (not just what's behind the panel) keeps the footage as
  // atmosphere rather than something competing with the copy for focus.
  video: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "blur(10px) saturate(1.1)", transform: "scale(1.06)" },
  scrim: { position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(9,11,9,0.3) 0%, rgba(9,11,9,0.5) 55%, rgba(9,11,9,0.82) 100%)" },
  center: { position: "relative", minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px" },
  panel: {
    position: "relative", overflow: "hidden",
    display: "flex", alignItems: "center", gap: "var(--sp-7)",
    border: "1px solid var(--rule-strong)", borderRadius: "var(--radius)",
    padding: "var(--sp-7)", maxWidth: 800, width: "100%",
    boxShadow: "var(--shadow-lg)",
  },
  panelVideo: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" },
  // Sharp left-to-right fade so the copy sits on solid ground while the clip
  // still reads clearly further right, toward the mark.
  panelScrim: { position: "absolute", inset: 0, background: "linear-gradient(100deg, rgba(9,11,9,0.92) 0%, rgba(9,11,9,0.7) 45%, rgba(9,11,9,0.4) 100%)" },
  copy: { position: "relative", zIndex: 1, flex: "1 1 340px", minWidth: 0 },
  kicker: { display: "inline-block", marginBottom: "var(--sp-3)" },
  headline: { fontSize: "clamp(30px, 4.6vw, 48px)", fontWeight: 600, lineHeight: 1.1 },
  sub: { color: "var(--text-2)", marginTop: "var(--sp-2)", fontSize: 16 },
  meta: { color: "var(--text-3)", fontSize: 11.5, marginTop: "var(--sp-3)" },
  preview: { position: "relative", zIndex: 1, flex: "0 0 auto", display: "flex", alignItems: "center", justifyContent: "center" },
  mark: { width: 84, height: "auto", filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.4))" },
};
