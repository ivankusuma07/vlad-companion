// POST /api/chat — streams Vlad's reply as SSE.
// Body: { messages: [{ role: "user" | "assistant", content: string }] }
// Events: `delta` { text } · `done` { stopReason, model } · `error` { error }
import { validateMessages, streamReply } from "@/lib/server/chat/index.js";
import { rateLimit, clientKey } from "@/lib/server/rate-limit.js";
import { getRadar } from "@/lib/server/radar/index.js";
import { env } from "@/lib/server/env.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const json = (body, status) => Response.json(body, { status });

export async function POST(request) {
  const limit = rateLimit(clientKey(request), env.chatRateLimit, env.chatRateWindowMs);
  if (!limit.ok) {
    return json(
      { error: "too many messages. vlad measures, he doesn't rush." },
      429,
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid json body" }, 400);
  }

  const { messages, error } = validateMessages(body?.messages);
  if (error) return json({ error }, 400);

  // Best-effort: the radar is cached, and chat shouldn't fail because it's down.
  let radar = [];
  try {
    radar = (await getRadar()).tokens;
  } catch {
    radar = [];
  }

  const encoder = new TextEncoder();
  const send = (event, data) => encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of streamReply({ messages, radar })) {
          const { type, ...rest } = chunk;
          controller.enqueue(send(type, rest));
        }
      } catch (err) {
        console.error("[chat] stream failed:", err);
        controller.enqueue(send("error", { error: "the line dropped. try again." }));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
      "x-ratelimit-remaining": String(limit.remaining),
    },
  });
}
