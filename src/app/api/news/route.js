// GET /api/news — curated Vlad / Robinhood ecosystem items for the right rail.
import { getNews } from "@/lib/server/news.js";

export const runtime = "nodejs";
export const revalidate = 300;

export async function GET() {
  const { source, items } = await getNews();
  return Response.json({ source, items });
}
