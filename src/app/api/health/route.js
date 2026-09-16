// GET /api/health — what's actually wired. Use this after setting .env.local
// to see which subsystems are live and which are still on fallbacks.
// Reports booleans only; no key material ever leaves the server.
import { env, hasRpc } from "@/lib/server/env.js";
import { getRadar } from "@/lib/server/radar/index.js";
import { resolveProvider, providerModel } from "@/lib/server/chat/index.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const radar = await getRadar().catch(() => null);
  const provider = resolveProvider();

  return Response.json({
    ok: true,
    chain: { name: env.chainName, configured: hasRpc(), chainId: env.chainId || null },
    chat: { live: provider !== "canned", provider, model: providerModel(provider) },
    radar: { source: radar?.source ?? "unknown", degraded: radar?.degraded ?? true, tokens: radar?.tokens.length ?? 0 },
    links: { explorer: Boolean(env.explorerBase), dex: Boolean(env.dexBase) },
    news: { remote: Boolean(env.newsSourceUrl) },
  });
}
