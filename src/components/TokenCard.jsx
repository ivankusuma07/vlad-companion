import { STATUS, fmtUsd, readFor } from "@/lib/feed.js";
import { useMemo } from "react";

export default function TokenCard({ t }) {
  const st = STATUS[t.status] || STATUS.WATCHING;
  const read = useMemo(() => readFor(t.status), [t.status]);

  // Links are built server-side from the configured RH Chain explorer / DEX
  // bases, so an unconfigured deploy renders no link rather than a broken one.
  const { dex, explorer } = t.links || {};

  return (
    <div className="glass" style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <span className="display" style={{ fontWeight: 600, fontSize: 17 }}>${t.ticker}</span>
          <span style={{ fontSize: 12, color: "var(--text-3)", marginLeft: 8 }}>{t.ageMin}m old</span>
        </div>
        <span className={`pill ${st.cls}`}>{st.label}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, margin: "14px 0 10px" }}>
        <Stat label="MCap" value={fmtUsd(t.mcap)} />
        <Stat label="Vol/min" value={fmtUsd(t.volPerMin)} />
        <Stat label="Holders" value={`${t.holders}${t.holdersDelta > 0 ? " ▲" : t.holdersDelta < 0 ? " ▼" : ""}`} color={t.holdersDelta > 0 ? "var(--green)" : t.holdersDelta < 0 ? "var(--red)" : undefined} />
        <Stat label="LP" value={`${fmtUsd(t.lpUsd)} ${lockIcon(t.lpLocked)}`} color={t.lpLocked === false ? "var(--red)" : undefined} />
      </div>
      <div style={{ fontSize: 12.5, color: "var(--text-2)", fontStyle: "italic" }}>“{read}”</div>
      <div style={{ display: "flex", gap: 14, marginTop: 12 }}>
        {dex && <a className="mono" style={ext} href={dex} target="_blank" rel="noreferrer">trade ↗</a>}
        {explorer && <a className="mono" style={ext} href={explorer} target="_blank" rel="noreferrer">explorer ↗</a>}
      </div>
    </div>
  );
}
const ext = { fontSize: 11, color: "var(--text-3)" };
// lpLocked is tri-state: true = confirmed locked, false = confirmed unlocked
// (the real warning), null/undefined = not verified yet. Unverified isn't
// evidence of risk, so it gets a neutral mark, not the red warning icon.
const lockIcon = (locked) => (locked === true ? "🔒" : locked === false ? "⚠" : "?");
function Stat({ label, value, color }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "var(--text-3)" }}>{label}</div>
      <div className="mono" style={{ fontSize: 13, color: color || "var(--text-1)" }}>{value}</div>
    </div>
  );
}
