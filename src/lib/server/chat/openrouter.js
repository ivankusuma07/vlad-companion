// OpenRouter provider — OpenAI-compatible chat completions.
//
// Raw fetch rather than a client library: this is one streaming POST, and
// pulling in an SDK to build one request body isn't worth the dependency.
//
// Free models ("…:free" suffix) work here and cost nothing, with three
// tradeoffs worth knowing:
//   - weaker instruction-following, which is why guardrail.js exists
//   - low shared rate limits (fine for dev/demo, thin for launch traffic)
//   - free-tier prompts may be logged/trained on by the upstream provider
// Flip CHAT_PROVIDER back to "anthropic" for production and none of that applies.
import { env } from "../env.js";
import { SYSTEM_PROMPT, radarContext } from "../persona.js";

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

export async function* streamOpenRouter({ messages, radar }) {
  // OpenAI-shaped requests keep a single leading system message. Mid-conversation
  // system turns are unreliable across the model zoo, so the live radar numbers
  // are appended to the system prompt instead.
  const context = radarContext(radar);
  const system = context ? `${SYSTEM_PROMPT}\n\n${context}` : SYSTEM_PROMPT;

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.openrouterApiKey}`,
      "content-type": "application/json",
      // Optional attribution — shows the project on OpenRouter's leaderboards.
      ...(env.openrouterSiteUrl ? { "HTTP-Referer": env.openrouterSiteUrl } : {}),
      ...(env.openrouterAppName ? { "X-Title": env.openrouterAppName } : {}),
    },
    body: JSON.stringify({
      model: env.openrouterModel,
      stream: true,
      // Vlad is 1-3 short sentences. Free models ramble without a hard cap,
      // and a low temperature keeps him deadpan rather than chatty.
      max_tokens: 400,
      temperature: 0.6,
      messages: [{ role: "system", content: system }, ...messages],
    }),
    signal: AbortSignal.timeout(60_000),
  });

  if (!res.ok || !res.body) {
    const detail = await res.text().catch(() => "");
    throw new Error(`openrouter ${res.status}: ${detail.slice(0, 200)}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() ?? ""; // keep the partial line

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      // OpenRouter sends ": OPENROUTER PROCESSING" keepalive comments while a
      // free model is queued. Skipping SSE comments is not optional here.
      if (trimmed.startsWith(":")) continue;
      if (!trimmed.startsWith("data:")) continue;

      const data = trimmed.slice(5).trim();
      if (data === "[DONE]") return;

      let parsed;
      try {
        parsed = JSON.parse(data);
      } catch {
        continue; // partial or malformed frame — next chunk completes it
      }

      if (parsed.error) throw new Error(`openrouter: ${parsed.error.message || "upstream error"}`);

      const delta = parsed.choices?.[0]?.delta?.content;
      if (delta) yield delta;
    }
  }
}
