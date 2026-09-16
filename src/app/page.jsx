"use client";

import { useEffect, useState } from "react";
import CharacterStage from "@/components/CharacterStage.jsx";
import ChatPanel from "@/components/ChatPanel.jsx";
import NewsFeed from "@/components/NewsFeed.jsx";
import TokenCard from "@/components/TokenCard.jsx";
import { fetchRadar, fmtUsd } from "@/lib/feed.js";
import { BRAND } from "@/brand.config.js";

const POLL_MS = 20_000;

export default function Scout() {
  const [radar, setRadar] = useState({ tokens: [], source: null, degraded: false });
  const [hideThin, setHideThin] = useState(false);

  useEffect(() => {
    let alive = true;
    let lastHot = null;

    const load = async () => {
      try {
        const data = await fetchRadar();
        if (!alive) return;
        setRadar(data);

        // Drive the Live2D model off the radar: a newly hot token makes him
        // react, anything else keeps him scanning.
        const hot = data.tokens.find((t) => t.status === "HEATING");
        const state = hot ? (hot.ticker === lastHot ? "SCANNING" : "REACT_HOT") : "SCANNING";
        lastHot = hot?.ticker ?? null;
        window.dispatchEvent(new CustomEvent("vlad:state", { detail: { state } }));
      } catch {
        // A failed poll isn't worth blanking the board — keep the last rows.
      }
    };

    load();
    const id = setInterval(load, POLL_MS);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  const { tokens } = radar;
  const hottest = tokens.find((t) => t.status === "HEATING");
  const shown = hideThin ? tokens.filter((t) => t.status !== "THIN_LP") : tokens;

  return (
    <main className="container page">
      <div style={{ display: "grid", gridTemplateColumns: "320px minmax(0,1fr) 300px", gap: 20, alignItems: "start" }} className="scout-grid">
        <div style={{ position: "sticky", top: 100 }}>
          <CharacterStage statusLine={radar.source === "mock" ? "watching · sample data" : "watching · live"} />
          <ChatPanel />
        </div>

        <div>
          {hottest && (
            <div className="glass" style={{ padding: "14px 18px", marginBottom: 16, display: "flex", gap: 10, alignItems: "flex-start", borderColor: "rgba(224,177,92,0.35)" }}>
              <span style={{ fontSize: 16 }}>🔥</span>
              <p style={{ fontSize: 13.5, lineHeight: 1.5, color: "var(--amber)" }}>
                hottest right now: <b>${hottest.ticker}</b> — vol {fmtUsd(hottest.volPerMin)}/min, +{hottest.holdersDelta} holders. vlad is watching.
              </p>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <div className="eyebrow">LIVE RADAR · {BRAND.chainName.toUpperCase()}</div>
              <h1 style={{ fontSize: 22, marginTop: 4 }}>the chain, filtered.</h1>
            </div>
            <label style={{ fontSize: 12, color: "var(--text-2)", display: "flex", gap: 8, alignItems: "center", cursor: "pointer" }}>
              <input type="checkbox" checked={hideThin} onChange={(e) => setHideThin(e.target.checked)} />
              hide thin LP
            </label>
          </div>

          {/* Nobody should ever mistake placeholder rows for real onchain data. */}
          {radar.source === "mock" && (
            <div className="glass" style={{ padding: "10px 16px", marginBottom: 14, borderColor: "rgba(224,122,107,0.3)" }}>
              <p className="mono" style={{ fontSize: 11.5, color: "var(--red)" }}>
                sample data — no {BRAND.chainName} source configured yet. these numbers are not real.
              </p>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {shown.map((t) => <TokenCard key={t.ca} t={t} />)}
          </div>

          <p style={{ fontSize: 11, color: "var(--text-3)", marginTop: 18 }}>
            observations only. vlad does not make calls. info only · DYOR.
          </p>
        </div>

        <div style={{ position: "sticky", top: 100 }}>
          <NewsFeed />
        </div>
      </div>
      <style>{`
        @media (max-width: 1080px) {
          .scout-grid { grid-template-columns: 1fr !important; }
          .scout-grid > div { position: static !important; }
        }
      `}</style>
    </main>
  );
}
