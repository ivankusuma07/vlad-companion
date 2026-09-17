import Skeleton from "./Skeleton.jsx";

// Mirrors TokenCard's exact structure (ticker row, 4-stat grid, quote line,
// links row) so the loading state holds the same shape real cards will
// occupy — swapping skeleton for real content doesn't reflow the page.
// Plain .card (no --interactive/--status) since there's nothing to hover or
// accent yet; it still gets the same card-in mount animation as everything
// else, so skeletons appear instantly rather than the page looking inert
// while the radar fetch is in flight.
export default function TokenCardSkeleton() {
  return (
    <div className="card" style={{ padding: "var(--sp-4)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)" }}>
          <Skeleton width={64} height={17} />
          <Skeleton width={48} height={11} />
        </div>
        <Skeleton width={62} height={20} radius={999} />
      </div>
      <Skeleton width="100%" height={3} radius={999} style={{ marginTop: "var(--sp-3)" }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--sp-2)", margin: "var(--sp-4) 0 var(--sp-2)" }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <Skeleton width={38} height={10} style={{ marginBottom: 6 }} />
            <Skeleton width={52} height={13} />
          </div>
        ))}
      </div>
      <Skeleton width="78%" height={12} style={{ marginTop: "var(--sp-2)" }} />
      <div style={{ display: "flex", gap: "var(--sp-4)", marginTop: "var(--sp-3)" }}>
        <Skeleton width={48} height={11} />
        <Skeleton width={58} height={11} />
      </div>
    </div>
  );
}
