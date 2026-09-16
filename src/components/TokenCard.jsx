import { STATUS, fmtUsd, readFor } from "@/lib/feed.js";
import { useMemo } from "react";
import { ArrowUp, ArrowDown, Lock, TriangleAlert, CircleHelp, ExternalLink } from "lucide-react";

// Status -> the accent class that colors the card's left border. Tying color
// to the actual data (not just the corner pill) means a fast scroll through
// the list gives a real pre-attentive signal instead of requiring everyone to
// stop and read each badge individually.
const STATUS_ACCENT = {
  HEATING: "status-hot",
  WATCHING: "status-watch",
  THIN_LP: "status-warn",
  COOLING: "status-cool",
};

export default function TokenCard({ t }) {
  const st = STATUS[t.status] || STATUS.WATCHING;
  const read = useMemo(() => readFor(t.status), [t.status]);

  // Links are built server-side from the configured RH Chain explorer / DEX
  // bases, so an unconfigured deploy renders no link rather than a broken one.
  const { dex, explorer } = t.links || {};

  return (
    <div className={`card card--interactive card--status ${STATUS_ACCENT[t.status] || "status-cool"}`} style={{ padding: "var(--sp-4)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <span className="display" style={{ fontWeight: 600, fontSize: 17 }}>${t.ticker}</span>
          <span style={{ fontSize: 12, color: "var(--text-3)", marginLeft: "var(--sp-2)" }}>{t.ageMin}m old</span>
        </div>
        <span className={`pill ${st.cls}`}>{st.label}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--sp-2)", margin: "var(--sp-4) 0 var(--sp-2)" }}>
        <Stat label="MCap" value={fmtUsd(t.mcap)} />
        <Stat label="Vol/min" value={fmtUsd(t.volPerMin)} />
        <Stat
          label="Holders"
          value={
            <>
              {t.holders}
              {t.holdersDelta > 0 && <ArrowUp size={12} style={{ verticalAlign: -1, marginLeft: 2 }} />}
              {t.holdersDelta < 0 && <ArrowDown size={12} style={{ verticalAlign: -1, marginLeft: 2 }} />}
            </>
          }
          color={t.holdersDelta > 0 ? "var(--green)" : t.holdersDelta < 0 ? "var(--red)" : undefined}
        />
        <Stat
          label="LP"
          value={
            <>
              {fmtUsd(t.lpUsd)} <LockIcon locked={t.lpLocked} />
            </>
          }
          color={t.lpLocked === false ? "var(--red)" : undefined}
        />
      </div>
      <div style={{ fontSize: 12.5, color: "var(--text-2)", fontStyle: "italic" }}>“{read}”</div>
      <div style={{ display: "flex", gap: "var(--sp-4)", marginTop: "var(--sp-3)" }}>
        {dex && (
          <a className="mono row-link" style={ext} href={dex} target="_blank" rel="noreferrer">
            trade <ExternalLink size={11} style={{ verticalAlign: -1 }} />
          </a>
        )}
        {explorer && (
          <a className="mono row-link" style={ext} href={explorer} target="_blank" rel="noreferrer">
            explorer <ExternalLink size={11} style={{ verticalAlign: -1 }} />
          </a>
        )}
      </div>
    </div>
  );
}
const ext = { fontSize: 11, color: "var(--text-3)", display: "inline-flex", alignItems: "center", gap: 4 };

// lpLocked is tri-state: true = confirmed locked, false = confirmed unlocked
// (the real warning), null/undefined = not verified yet. Unverified isn't
// evidence of risk, so it gets a neutral mark, not the red warning icon.
function LockIcon({ locked }) {
  if (locked === true) return <Lock size={12} style={{ verticalAlign: -1 }} />;
  if (locked === false) return <TriangleAlert size={12} style={{ verticalAlign: -1 }} />;
  return <CircleHelp size={12} style={{ verticalAlign: -1 }} />;
}

function Stat({ label, value, color }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "var(--text-3)" }}>{label}</div>
      <div className="mono" style={{ fontSize: 13, color: color || "var(--text-1)" }}>{value}</div>
    </div>
  );
}
