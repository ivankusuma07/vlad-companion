// GET /api/radar — the live radar rows, plus the explorer/dex links for each.
// Shape per token is exactly what fetchRadar() always returned, so the UI needs
// no changes when the data source is swapped.
import { getRadar } from "@/lib/server/radar/index.js";
import { explorerUrl, dexUrl } from "@/lib/server/chain.js";
import { env } from "@/lib/server/env.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const { source, degraded, reason, tokens } = await getRadar();

  return Response.json(
    {
      chain: env.chainName,
      source, // mock | subgraph | alchemy — surfaced so the UI can badge mock data
      degraded,
      reason: reason || null,
      updatedAt: new Date().toISOString(),
      tokens: tokens.map((t) => ({
        ...t,
        links: { explorer: explorerUrl(t.ca), dex: dexUrl(t.ca) },
      })),
    },
    { headers: { "cache-control": "no-store" } },
  );
}
