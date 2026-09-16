"use client";

import { useEffect, useState } from "react";
import { BRAND } from "@/brand.config.js";

// Character stage. Currently plays a looping clip per state rather than a
// real Live2D Cubism model — no .moc3/model3.json exists in this repo yet,
// and none of the Cubism runtime deps are installed. When those land, this
// is the only file that needs to change: everything else in the app talks
// to the character through the `vlad:state` CustomEvent contract below, not
// through this component directly.
//
//   window.dispatchEvent(new CustomEvent("vlad:state", { detail: { state: "SCANNING" } }))
//
// States: IDLE | SCANNING | REACT_HOT | REACT_WARN | REPORT (brand.config.js
// characterStates). Clip-per-state mapping also lives in brand.config.js
// (characterMedia) — this component reads that map, it doesn't hardcode paths.
export default function CharacterStage({ statusLine }) {
  const [state, setState] = useState("IDLE");
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const onState = (e) => {
      const next = e.detail?.state;
      if (BRAND.characterStates.includes(next)) {
        setState(next);
        setVideoError(false); // give the new state's clip a fresh chance to load
      }
    };
    window.addEventListener("vlad:state", onState);
    return () => window.removeEventListener("vlad:state", onState);
  }, []);

  const src = BRAND.characterMedia[state] || BRAND.characterMedia.IDLE;

  return (
    <div className="glass" style={{ padding: "var(--sp-4)", textAlign: "center" }}>
      <div style={{ position: "relative", height: 260, borderRadius: "var(--radius-xs)", overflow: "hidden", background: "#000" }}>
        {videoError ? (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-3)", fontSize: 13 }}>
            character clip missing — drop it at public{src}
          </div>
        ) : (
          // key={src} forces a full remount on state change so the browser
          // reliably loads the new clip — some browsers don't reload media
          // on a bare `src` attribute swap.
          <video
            key={src}
            src={src}
            autoPlay
            muted
            loop
            playsInline
            onError={() => setVideoError(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover", animation: "char-fade-in 0.35s ease" }}
          />
        )}
        <span className="mono" style={s.stateTag}>{state}</span>
      </div>
      <div style={{ marginTop: "var(--sp-3)", display: "flex", alignItems: "center", gap: "var(--sp-2)", justifyContent: "center" }}>
        <span className="live-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green)" }} />
        <span className="mono" style={{ fontSize: 12, color: "var(--text-2)" }}>{statusLine}</span>
      </div>
    </div>
  );
}

const s = {
  stateTag: {
    position: "absolute", bottom: 8, right: 10, fontSize: 10, letterSpacing: "0.06em",
    color: "rgba(239,245,240,0.75)", background: "rgba(0,0,0,0.45)",
    padding: "2px 7px", borderRadius: 6, pointerEvents: "none",
  },
};
