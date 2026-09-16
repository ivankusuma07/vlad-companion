"use client";

import { useEffect, useState } from "react";
import { fetchNews } from "@/lib/feed.js";

// Right rail: latest from real @vladtenev / Robinhood ecosystem. Every item links out.
export default function NewsFeed() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let alive = true;
    fetchNews()
      .then((n) => alive && setItems(n))
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  return (
    <div className="glass" style={{ padding: 18 }}>
      <div className="eyebrow" style={{ marginBottom: 14 }}>VLAD FEED</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {items.map((n, i) => (
          <a key={i} href={n.url} target="_blank" rel="noreferrer" style={{ borderTop: i ? "1px solid var(--glass-edge)" : "none", paddingTop: i ? 14 : 0, display: "block" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span className="mono" style={{ fontSize: 10, letterSpacing: "0.12em", color: "var(--green)" }}>{n.tag}</span>
              <span style={{ fontSize: 11, color: "var(--text-3)" }}>{n.time}</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.55, color: "var(--text-1)" }}>{n.text}</p>
          </a>
        ))}
      </div>
      <p style={{ fontSize: 10.5, color: "var(--text-3)", marginTop: 16, lineHeight: 1.5 }}>
        curated from public posts. sources linked. not official robinhood comms.
      </p>
    </div>
  );
}
