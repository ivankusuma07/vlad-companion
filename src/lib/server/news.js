// Right-rail feed: real posts from @vladtenev / the Robinhood ecosystem.
//
// Deliberately curated, not scraped. Every item must link to its source — this
// is a parody project reporting on a real, named public company, so an
// unsourced claim in Vlad's voice is exactly the thing we can't ship.
//
// Point NEWS_SOURCE_URL at a JSON file the team edits (a gist, an S3 object, a
// headless CMS) to update the rail without a redeploy.
import { env } from "./env.js";
import { cached } from "./cache.js";

const BUNDLED = [
  { tag: "VLAD POSTED", text: "robinhood chain mainnet is live — ai-native L2 for real-world assets.", time: "3h", url: "https://x.com/vladtenev" },
  { tag: "ROBINHOOD", text: "tokenized stocks now trading onchain across 120+ countries.", time: "8h", url: "https://x.com/RobinhoodApp" },
  { tag: "ECOSYSTEM", text: "agentic accounts let ai models trade and transact directly onchain.", time: "1d", url: "https://docs.robinhood.com/chain" },
];

// Drops anything malformed rather than rendering a half-item, and refuses
// non-https links so a compromised feed can't inject a javascript: url.
function sanitize(items) {
  if (!Array.isArray(items)) return [];
  return items
    .map((n) => ({
      tag: String(n?.tag || "").slice(0, 24).toUpperCase(),
      text: String(n?.text || "").slice(0, 280),
      time: String(n?.time || "").slice(0, 12),
      url: String(n?.url || ""),
    }))
    .filter((n) => n.tag && n.text && n.url.startsWith("https://"))
    .slice(0, 12);
}

export async function getNews() {
  if (!env.newsSourceUrl) return { source: "bundled", items: BUNDLED };

  return cached("news", env.newsCacheMs, async () => {
    try {
      const res = await fetch(env.newsSourceUrl, { cache: "no-store", signal: AbortSignal.timeout(8_000) });
      if (!res.ok) throw new Error(`news ${res.status}`);
      const items = sanitize(await res.json());
      if (!items.length) throw new Error("no usable items");
      return { source: "remote", items };
    } catch (err) {
      console.error("[news] falling back to bundled:", err.message);
      return { source: "bundled", items: BUNDLED };
    }
  });
}
