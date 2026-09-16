// Generic shimmer placeholder block. Meant to be composed into per-component
// skeletons (see TokenCardSkeleton) that mirror the real layout, rather than
// used bare as a generic gray box — a loading state that doesn't match the
// content's actual shape just produces a layout jump once real data lands.
export default function Skeleton({ width = "100%", height = 12, radius = 6, style }) {
  return (
    <span
      className="skeleton"
      style={{ display: "inline-block", width, height, borderRadius: radius, ...style }}
      aria-hidden="true"
    />
  );
}
