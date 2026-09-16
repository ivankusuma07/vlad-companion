import { BRAND } from "@/brand.config.js";

// Full-screen gate shown before the app. Background = Bix's generated video.
// DEV: drop the video at public/media/gate.mp4 (path set in brand.config.js).
// Keep it muted + playsInline or mobile browsers will refuse to autoplay.
export default function LoadingGate({ onEnter }) {
  const g = BRAND.gate;
  return (
    <div style={styles.wrap}>
      <video style={styles.video} src={g.videoSrc} poster={g.poster} autoPlay muted loop playsInline />
      <div style={styles.scrim} />
      <div style={styles.center}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>{BRAND.product}</div>
        <h1 className="display" style={styles.headline}>{g.headline}</h1>
        <p style={styles.sub}>{g.sub}</p>
        <button className="btn btn--green" style={{ marginTop: 30 }} onClick={onEnter}>{g.cta} →</button>
        <p style={styles.legal}>{BRAND.disclaimer}</p>
      </div>
    </div>
  );
}

const styles = {
  wrap: { position: "fixed", inset: 0, overflow: "hidden", background: "var(--base)" },
  video: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" },
  scrim: { position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(11,15,13,0.35) 0%, rgba(11,15,13,0.55) 55%, rgba(11,15,13,0.9) 100%)" },
  center: { position: "relative", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 24px" },
  headline: { fontSize: "clamp(34px, 6vw, 64px)", fontWeight: 600, maxWidth: 720 },
  sub: { color: "var(--text-2)", marginTop: 12, fontSize: 18 },
  legal: { position: "absolute", bottom: 22, left: 24, right: 24, color: "var(--text-3)", fontSize: 11, lineHeight: 1.5 },
};
