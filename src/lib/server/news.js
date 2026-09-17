// Right-rail feed: real posts from @vladtenev / the Robinhood ecosystem.
//
// Every item must link to its source — this is a parody project reporting on
// a real, named public company, so an unsourced claim in Vlad's voice is
// exactly the thing we can't ship. Three tiers, first one configured wins:
//
//   1. NEWS_SOURCE_URL   — a JSON file the team curates by hand (a gist, an
//      S3 object, a headless CMS). Update the rail without a redeploy.
//   2. SOCIAL_FETCH_API_KEY — live @RobinhoodApp posts via the Social Fetch
//      API (socialfetch.dev), a normalized X/Twitter API — no scraping
//      infra, no dead Nitter mirrors to babysit.
//   3. bundled            — the hardcoded fallback below, always available.
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

// createdAt is an ISO timestamp from the API — "3h", "1d" reads better in a
// feed row than a full date.
function relativeTime(iso) {
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return "";
  const mins = Math.round((Date.now() - then) / 60_000);
  if (mins < 60) return `${Math.max(mins, 1)}m`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.round(hours / 24)}d`;
}

async function fromSocialFetch() {
  const { socialFetchApiKey, socialFetchBaseUrl, newsTwitterHandle } = env;
  const url = `${socialFetchBaseUrl.replace(/\/$/, "")}/v1/twitter/profiles/${encodeURIComponent(newsTwitterHandle)}/tweets?limit=10`;
  const res = await fetch(url, {
    cache: "no-store",
    signal: AbortSignal.timeout(8_000),
    headers: { "x-api-key": socialFetchApiKey },
  });
  if (!res.ok) throw new Error(`social fetch ${res.status}`);
  const body = await res.json();
  const tweets = body?.data?.tweets;
  if (!Array.isArray(tweets)) throw new Error("unexpected social fetch shape");

  // Original posts only — replies/retweets read as noise in a feed this
  // short, and a retweet's "author" isn't the account we're reporting on.
  const items = tweets
    .filter((t) => !t.isReply && !t.isRetweet)
    .map((t) => ({ tag: "ROBINHOOD", text: t.text, time: relativeTime(t.createdAt), url: t.url }));

  return sanitize(items);
}

export async function getNews() {
  if (env.newsSourceUrl) {
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

  if (env.socialFetchApiKey) {
    return cached("news", env.newsCacheMs, async () => {
      try {
        const items = await fromSocialFetch();
        if (!items.length) throw new Error("no usable items");
        return { source: "socialfetch", items };
      } catch (err) {
        console.error("[news] social fetch falling back to bundled:", err.message);
        return { source: "bundled", items: BUNDLED };
      }
    });
  }

  return { source: "bundled", items: BUNDLED };
}
