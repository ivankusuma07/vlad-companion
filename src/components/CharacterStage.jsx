"use client";

import { useEffect, useState } from "react";
import { BRAND } from "@/brand.config.js";

// Live2D mount point. DEV: replace the placeholder content with the Live2D canvas
// and drive the model from the `state` below.
//
// The radar dispatches state changes as CustomEvents (renamed from alon:state):
//   window.dispatchEvent(new CustomEvent("vlad:state", { detail: { state: "SCANNING" } }))
// States: IDLE | SCANNING | REACT_HOT | REACT_WARN | REPORT  (see brand.config.js)
export default function CharacterStage({ statusLine }) {
  const [state, setState] = useState("IDLE");

  useEffect(() => {
    const onState = (e) => {
      const next = e.detail?.state;
      if (BRAND.characterStates.includes(next)) setState(next);
    };
    window.addEventListener("vlad:state", onState);
    return () => window.removeEventListener("vlad:state", onState);
  }, []);

  return (
    <div className="glass" style={{ padding: 18, textAlign: "center" }}>
      <div id="live2d-stage" data-state={state} style={{ height: 260, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.03)", border: "1px dashed var(--glass-edge)", color: "var(--text-3)", fontSize: 13, flexDirection: "column", gap: 6 }}>
        <span>Live2D — VLAD model mounts here</span>
        <span className="mono" style={{ fontSize: 11, color: "var(--green)" }}>{state}</span>
      </div>
      <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green)" }} />
        <span className="mono" style={{ fontSize: 12, color: "var(--text-2)" }}>{statusLine}</span>
      </div>
    </div>
  );
}
