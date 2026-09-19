"use client";

import { useEffect, useState } from "react";
import { X, ExternalLink, Radar } from "lucide-react";
import CharacterStage from "@/components/CharacterStage.jsx";
import ChatPanel from "@/components/ChatPanel.jsx";
import NewsFeed from "@/components/NewsFeed.jsx";
import TokenCard, { TokenLogo } from "@/components/TokenCard.jsx";
import TokenCardSkeleton from "@/components/TokenCardSkeleton.jsx";
import { fetchRadar, fmtUsd, readFor } from "@/lib/feed.js";
import { BRAND } from "@/brand.config.js";

const POLL_MS = 20_000;
const SKELETON_COUNT = 4;

const FILTERS = [
  { key: "ALL", label: "all" },
  { key: "HEATING", label: "heating" },
  { key: "WATCHING", label: "watching" },
  { key: "THIN_LP", label: "thin lp" },
  { key: "COOLING", label: "cooling" },
];

export default function Scout() {
  const [radar, setRadar] = useState({ tokens: [], source: null, degraded: false });
  const [filter, setFilter] = useState("ALL");
  const [hideThin, setHideThin] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  // Only tracks the *first* fetch — the 20s poll after that updates rows
  // silently in place rather than re-showing skeletons over live data.
  const [loading, setLoading] = useState(true);
  // A brief pulse on every poll *after* the first — cards already on screen
  // don't replay their mount animation (React reuses those DOM nodes), so
  // without this a refresh is invisible unless a row's numbers happen to
  // change by eye. This is the "the board just moved" cue instead.
  const [justRefreshed, setJustRefreshed] = useState(false);

  useEffect(() => {
    let alive = true;
    let lastHot = null;
    let firstLoad = true;

    const load = async () => {
      try {
        const data = await fetchRadar();
        if (!alive) return;
        setRadar(data);

        if (!firstLoad) {
          setJustRefreshed(true);
          setTimeout(() => alive && setJustRefreshed(false), 700);
        }
        firstLoad = false;

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
  const byFilter = filter === "ALL" ? tokens : tokens.filter((t) => t.status === filter);
  // "hide thin lp" only makes sense as a cross-cutting trim on top of some
  // other view — applying it while the status filter itself is "thin lp"
  // fights the filter you just picked and silently empties the board, which
  // reads like filtering is broken rather than like two controls disagreeing.
  const filtered = hideThin && filter !== "THIN_LP" ? byFilter.filter((t) => t.status !== "THIN_LP") : byFilter;
  // Heating rows surface first regardless of filter/poll order — that's the
  // one status worth seeing without scrolling. Stable sort keeps everything
  // else in the order the radar returned it.
  const shown = [...filtered].sort((a, b) => (b.status === "HEATING") - (a.status === "HEATING"));
  const maxVol = Math.max(1, ...shown.map((t) => t.volPerMin || 0));

  const counts = {
    ALL: tokens.length,
    HEATING: tokens.filter((t) => t.status === "HEATING").length,
    WATCHING: tokens.filter((t) => t.status === "WATCHING").length,
    THIN_LP: tokens.filter((t) => t.status === "THIN_LP").length,
    COOLING: tokens.filter((t) => t.status === "COOLING").length,
  };

  return (
    <main className="container page">
      {/* Instrument row: companion, the one token worth a glance right now,
          and the counts behind the filters below — read left to right once,
          not re-derived by scrolling a list. */}
      <div className="scout-top" style={{ display: "grid", gridTemplateColumns: "280px minmax(0,1fr) 240px", gap: 16, alignItems: "stretch", marginBottom: "var(--sp-6)" }}>
        <CharacterStage statusLine={radar.source === "mock" ? "sample data" : "live"} />
        <HeroToken t={hottest} loading={loading} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 12, height: "100%" }}>
          <StatTile label="tracked" value={tokens.length} />
          <StatTile label="heating" value={counts.HEATING} color={counts.HEATING ? "var(--amber)" : undefined} />
          <StatTile label="thin lp" value={counts.THIN_LP} color={counts.THIN_LP ? "var(--red)" : undefined} />
          <StatTile label="feed" value={radar.source === "mock" ? "sample" : "live"} live />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 300px", gap: 20, alignItems: "start" }} className="scout-grid">
        <div>
          <div style={{ marginBottom: "var(--sp-4)" }}>
            <h1 style={{ fontSize: "clamp(24px,3vw,30px)" }}>the chain, filtered.</h1>
            <p className="tag" style={{ marginTop: "var(--sp-1)" }}>live radar over {BRAND.chainName.toLowerCase()}</p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--sp-2)", marginBottom: "var(--sp-5)" }}>
            {FILTERS.map((f) => (
              <button key={f.key} className={"chip" + (filter === f.key ? " is-active" : "")} onClick={() => setFilter(f.key)}>
                {f.label} <span className="chip-count">{counts[f.key]}</span>
              </button>
            ))}
            <button
              className={"chip" + (hideThin && filter !== "THIN_LP" ? " is-active" : "")}
              disabled={filter === "THIN_LP"}
              title={filter === "THIN_LP" ? "doesn't apply — you're already looking at thin lp" : undefined}
              onClick={() => setHideThin((v) => !v)}
            >
              hide thin lp
            </button>
          </div>

          {/* Nobody should ever mistake placeholder rows for real onchain data. */}
          {radar.source === "mock" && (
            <div className="card card--status status-warn" style={{ padding: "var(--sp-2) var(--sp-4)", marginBottom: "var(--sp-4)" }}>
              <p className="mono" style={{ fontSize: 11.5, color: "var(--red)" }}>
                sample data — no {BRAND.chainName} source configured yet. these numbers are not real.
              </p>
            </div>
          )}

          <div
            className={justRefreshed ? "radar-pulse" : undefined}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: "var(--sp-3)" }}
          >
            {loading
              ? Array.from({ length: SKELETON_COUNT }).map((_, i) => <TokenCardSkeleton key={i} />)
              : shown.map((t) => <TokenCard key={t.id} t={t} heatPct={Math.round(((t.volPerMin || 0) / maxVol) * 100)} />)}
          </div>

          {!loading && shown.length === 0 && (
            <p style={{ fontSize: 13, color: "var(--text-3)", marginTop: "var(--sp-5)" }}>nothing matches this filter right now.</p>
          )}

          <p style={{ fontSize: 11, color: "var(--text-3)", marginTop: "var(--sp-5)" }}>
            observations only. vlad does not make calls. info only · DYOR.
          </p>
        </div>

        <div style={{ position: "sticky", top: 88 }}>
          <NewsFeed />
        </div>
      </div>

      {/* Chat is a surface you summon, not permanent chrome fighting the
          radar for space — a dock anchored off the corner, not another
          column. */}
      {chatOpen && (
        <div className="glass chat-dock" style={s.chatDock}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--sp-3) var(--sp-3) 0" }}>
            <span className="tag">ask vlad</span>
            <button aria-label="Close chat" onClick={() => setChatOpen(false)} style={s.dockClose}><X size={16} /></button>
          </div>
          <ChatPanel />
        </div>
      )}
      <button
        aria-label={chatOpen ? "Close chat" : "Chat with Vlad"}
        title={chatOpen ? "Close chat" : "Chat with Vlad"}
        style={s.launcher}
        onClick={() => setChatOpen((v) => !v)}
      >
        {/* The circular clip lives on this inner wrapper, not the button
            itself — clipping the button would also clip the online badge
            below, since it needs to sit half outside the circle to read as
            a badge rather than a watermark on the avatar. */}
        <span style={s.launcherAvatar}>
          {chatOpen ? (
            <X size={20} color="var(--text-1)" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- an animated
            // avatar loop; next/image would strip the gif's animation.
            <img src="/media/vlad_chat.gif" alt="" style={s.launcherGif} />
          )}
        </span>
        {!chatOpen && <span className="live-dot" style={s.launcherDot} />}
      </button>

      <style>{`
        @media (max-width: 1080px) {
          .scout-top { grid-template-columns: 1fr !important; }
          .scout-grid { grid-template-columns: 1fr !important; }
          .scout-grid > div:last-child { position: static !important; }
        }
        @media (max-width: 520px) {
          .chat-dock { width: calc(100vw - 32px) !important; right: 16px !important; }
        }
      `}</style>
    </main>
  );
}

function StatTile({ label, value, color, live }) {
  return (
    <div className="card" style={{ padding: "var(--sp-3) var(--sp-4)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <span className="tag" style={{ fontSize: 11 }}>{label}</span>
      <span className="mono" style={{ fontSize: 20, marginTop: 4, color: color || "var(--text-1)", display: "flex", alignItems: "center", gap: 6 }}>
        {live && <span className="live-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", display: "inline-block" }} />}
        {value}
      </span>
    </div>
  );
}

function HeroToken({ t, loading }) {
  if (loading) return <div className="card" />;

  if (!t) {
    return (
      <div className="card" style={{ padding: "var(--sp-5)", height: "100%", display: "flex", flexDirection: "column" }}>
        <span className="tag">hottest right now</span>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "var(--sp-4)" }}>
          <span className="scan-ring">
            <Radar size={18} color="var(--text-2)" />
          </span>
          <div>
            <p style={{ fontSize: 14 }}>nothing&apos;s heating yet.</p>
            <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 3 }}>vlad keeps scanning — next pass in ~{POLL_MS / 1000}s.</p>
          </div>
        </div>
      </div>
    );
  }

  const { dex, explorer } = t.links || {};
  return (
    <div className="card card--status status-hot" style={{ padding: "var(--sp-5)" }}>
      <span className="tag">hottest right now</span>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)", margin: "var(--sp-2) 0 var(--sp-4)" }}>
        <TokenLogo src={t.logo} ticker={t.ticker} size={40} />
        <div style={{ display: "flex", alignItems: "baseline", gap: "var(--sp-2)" }}>
          <span className="display" style={{ fontSize: 30, fontWeight: 600 }}>${t.ticker}</span>
          <span style={{ fontSize: 12, color: "var(--text-3)" }}>{t.ageMin}m old</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "var(--sp-3)" }}>
        <Stat label="vol/min" value={fmtUsd(t.volPerMin)} />
        <Stat label="mcap" value={fmtUsd(t.mcap)} />
        <Stat label="holders" value={t.holders} />
        <Stat label="lp" value={fmtUsd(t.lpUsd)} />
      </div>
      <p style={{ fontSize: 13, color: "var(--text-2)", fontStyle: "italic", margin: "var(--sp-4) 0" }}>&ldquo;{readFor(t.status)}&rdquo; — vlad</p>
      <div style={{ display: "flex", gap: "var(--sp-4)" }}>
        {dex && (
          <a className="mono row-link" style={s.heroLink} href={dex} target="_blank" rel="noreferrer">
            trade <ExternalLink size={11} />
          </a>
        )}
        {explorer && (
          <a className="mono row-link" style={s.heroLink} href={explorer} target="_blank" rel="noreferrer">
            explorer <ExternalLink size={11} />
          </a>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div className="tag" style={{ fontSize: 10.5 }}>{label}</div>
      <div className="mono" style={{ fontSize: 14, marginTop: 2 }}>{value}</div>
    </div>
  );
}

const s = {
  launcher: {
    position: "fixed", right: 24, bottom: 24, zIndex: 60,
    width: 58, height: 58, padding: 0, border: "none", background: "none", cursor: "pointer",
  },
  launcherAvatar: {
    width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden",
    display: "flex", alignItems: "center", justifyContent: "center",
    background: "var(--base-raised)", border: "1px solid var(--rule-strong)", boxShadow: "var(--shadow-lg)",
  },
  launcherGif: { width: "100%", height: "100%", objectFit: "cover" },
  // Sits astride the avatar's edge rather than inside it — a badge should
  // read at a glance, not get lost against the gif underneath it.
  launcherDot: { position: "absolute", top: -2, right: -2, width: 13, height: 13, borderRadius: "50%", background: "var(--green)", border: "3px solid var(--base)" },
  dockClose: { background: "none", border: "none", color: "var(--text-2)", cursor: "pointer", display: "flex" },
  chatDock: { position: "fixed", right: 24, bottom: 94, zIndex: 60, width: 320, padding: 0 },
  heroLink: { fontSize: 11, color: "var(--text-3)", display: "inline-flex", alignItems: "center", gap: 4 },
};
