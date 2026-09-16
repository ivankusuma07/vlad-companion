// Anthropic provider — the production path.
//
// claude-opus-5 at effort "low": short in-character conversation, not a
// reasoning workload. Thinking stays on (Opus 5 defaults to adaptive; disabling
// it can leak tags into the visible reply) but low effort keeps latency and
// spend down.
//
// Server-side refusal fallbacks are enabled, so a turn declined by a safety
// classifier is re-run on a fallback model inside the same call rather than
// leaving the panel dead.
import Anthropic from "@anthropic-ai/sdk";
import { env } from "../env.js";
import { SYSTEM_PROMPT, radarContext } from "../persona.js";

let client = null;
const getClient = () => (client ??= new Anthropic({ apiKey: env.anthropicApiKey }));

export async function* streamAnthropic({ messages, radar }) {
  // Live numbers go in as a mid-conversation system message rather than into
  // `system`, so the cached prefix survives and the operator channel stays
  // separate from user text.
  const context = radarContext(radar);
  const outbound = context ? [...messages, { role: "system", content: context }] : messages;

  const stream = getClient().beta.messages.stream({
    model: env.chatModel,
    max_tokens: 4096,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "low" },
    system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
    messages: outbound,
  });

  for await (const event of stream) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
      yield event.delta.text;
    }
  }

  const final = await stream.finalMessage();

  // A refusal is an HTTP 200 with no usable text — say something in character
  // rather than rendering an empty bubble.
  if (final.stop_reason === "refusal") {
    yield "not something i'll answer. ask me about the numbers.";
  }
}
