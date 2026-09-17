"use client";

import { useEffect, useState } from "react";
import { fetchNews } from "@/lib/feed.js";
import Skeleton from "./Skeleton.jsx";

const SKELETON_COUNT = 4;

// Right rail: latest from real @vladtenev / Robinhood ecosystem. Every item links out.
export default function NewsFeed() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetchNews()
      .then((n) => alive && setItems(n))
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  return (
    <div className="card" style={{ padding: "var(--sp-4)" }}>
      <h2 style={{ fontSize: 16, marginBottom: "var(--sp-4)" }}>vlad feed</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
        {loading
          ? Array.from({ length: SKELETON_COUNT }).map((_, i) => <NewsItemSkeleton key={i} first={i === 0} />)
          : items.map((n, i) => (
              <a key={i} href={n.url} target="_blank" rel="noreferrer" className="row-link" style={{ borderTop: i ? "1px solid var(--card-edge)" : "none", paddingTop: i ? "var(--sp-4)" : 0, display: "block" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--sp-2)" }}>
                  <span className="mono" style={{ fontSize: 10.5, color: "var(--green)" }}>{n.tag}</span>
                  <span style={{ fontSize: 11, color: "var(--text-3)" }}>{n.time}</span>
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.55, color: "var(--text-1)", overflowWrap: "anywhere" }}>{n.text}</p>
              </a>
            ))}
      </div>
      <p style={{ fontSize: 10.5, color: "var(--text-3)", marginTop: "var(--sp-5)", lineHeight: 1.5 }}>
        curated from public posts. sources linked. not official robinhood comms.
      </p>
    </div>
  );
}

// Mirrors a real item's shape (tag/time row + two text lines) so swapping to
// live data doesn't reflow the rail.
function NewsItemSkeleton({ first }) {
  return (
    <div style={{ borderTop: first ? "none" : "1px solid var(--card-edge)", paddingTop: first ? 0 : "var(--sp-4)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--sp-2)" }}>
        <Skeleton width={64} height={10} />
        <Skeleton width={22} height={10} />
      </div>
      <Skeleton width="100%" height={12} style={{ marginBottom: 6 }} />
      <Skeleton width="70%" height={12} />
    </div>
  );
}
