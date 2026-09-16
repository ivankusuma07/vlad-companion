"use client";

import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import CharacterStage from "@/components/CharacterStage.jsx";
import ChatPanel from "@/components/ChatPanel.jsx";
import NewsFeed from "@/components/NewsFeed.jsx";
import TokenCard from "@/components/TokenCard.jsx";
import TokenCardSkeleton from "@/components/TokenCardSkeleton.jsx";
import { fetchRadar, fmtUsd } from "@/lib/feed.js";
import { BRAND } from "@/brand.config.js";

const POLL_MS = 20_000;

const SKELETON_COUNT = 5;

export default function Scout() {
  const [radar, setRadar] = useState({ tokens: [], source: null, degraded: false });
  const [hideThin, setHideThin] = useState(false);
  // Only tracks the *first* fetch — the 20s poll after that updates rows
  // silently in place rather than re-showing skeletons over live data.
  const [loading, setLoading] = useState(true);

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
      } finally {
        if (alive) setLoading(false);
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
            <div className="card card--status status-hot" style={{ padding: "var(--sp-3) var(--sp-4)", marginBottom: "var(--sp-4)", display: "flex", gap: "var(--sp-3)", alignItems: "flex-start" }}>
              <Flame size={18} color="var(--amber)" style={{ flexShrink: 0 }} />
              <p style={{ fontSize: 13.5, lineHeight: 1.5, color: "var(--amber)" }}>
                hottest right now: <b>${hottest.ticker}</b> — vol {fmtUsd(hottest.volPerMin)}/min, +{hottest.holdersDelta} holders. vlad is watching.
              </p>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--sp-4)" }}>
            <div>
              <div className="eyebrow">LIVE RADAR · {BRAND.chainName.toUpperCase()}</div>
              <h1 style={{ fontSize: 24, fontWeight: 600, marginTop: "var(--sp-1)" }}>the chain, filtered.</h1>
            </div>
            <label style={{ fontSize: 12, color: "var(--text-2)", display: "flex", gap: "var(--sp-2)", alignItems: "center", cursor: "pointer" }}>
              <input type="checkbox" checked={hideThin} onChange={(e) => setHideThin(e.target.checked)} />
              hide thin LP
            </label>
          </div>

          {/* Nobody should ever mistake placeholder rows for real onchain data. */}
          {radar.source === "mock" && (
            <div className="card card--status status-warn" style={{ padding: "var(--sp-2) var(--sp-4)", marginBottom: "var(--sp-4)" }}>
              <p className="mono" style={{ fontSize: 11.5, color: "var(--red)" }}>
                sample data — no {BRAND.chainName} source configured yet. these numbers are not real.
              </p>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
            {loading
              ? Array.from({ length: SKELETON_COUNT }).map((_, i) => <TokenCardSkeleton key={i} />)
              : shown.map((t) => <TokenCard key={t.ca} t={t} />)}
          </div>

          <p style={{ fontSize: 11, color: "var(--text-3)", marginTop: "var(--sp-5)" }}>
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
