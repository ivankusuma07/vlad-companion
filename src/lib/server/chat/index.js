// Chat backend entry point: validates input, picks a provider, streams the
// reply, and runs the output guardrail.
//
// Providers are interchangeable — each is an async generator yielding text
// chunks. Swapping one is an env change, not a code change.
import { env } from "../env.js";
import { cannedReply } from "../persona.js";
import { streamAnthropic } from "./anthropic.js";
import { streamOpenRouter } from "./openrouter.js";
import { trips, SAFE_REPLY } from "./guardrail.js";

export const MAX_MESSAGE_CHARS = 2000;
export const MAX_HISTORY = 20;

// "auto" resolves to whichever key is present. If both are, Anthropic wins:
// the persona carries legal weight (real person, real trademark) and the
// stronger model holds the hard rules more reliably. Force the other with
// CHAT_PROVIDER=openrouter.
export function resolveProvider() {
  if (env.chatProvider === "anthropic") return env.anthropicApiKey ? "anthropic" : "canned";
  if (env.chatProvider === "openrouter") return env.openrouterApiKey ? "openrouter" : "canned";
  if (env.anthropicApiKey) return "anthropic";
  if (env.openrouterApiKey) return "openrouter";
  return "canned";
}

export function providerModel(provider = resolveProvider()) {
  if (provider === "anthropic") return env.chatModel;
  if (provider === "openrouter") return env.openrouterModel;
  return "canned-fallback";
}

// Accepts whatever the browser posted and returns a clean message array, or an
// error string. Never trusts role, length, or ordering from the client.
export function validateMessages(input) {
  if (!Array.isArray(input) || input.length === 0) return { error: "messages must be a non-empty array" };
  if (input.length > MAX_HISTORY) return { error: `at most ${MAX_HISTORY} messages` };

  const messages = [];
  for (const m of input) {
    const role = m?.role === "assistant" ? "assistant" : "user";
    const content = typeof m?.content === "string" ? m.content.trim() : "";
    if (!content) return { error: "each message needs non-empty string content" };
    if (content.length > MAX_MESSAGE_CHARS) return { error: `messages are capped at ${MAX_MESSAGE_CHARS} characters` };
    messages.push({ role, content });
  }

  if (messages[0].role !== "user") return { error: "conversation must start with a user message" };
  if (messages[messages.length - 1].role !== "user") return { error: "last message must be from the user" };
  return { messages };
}

// Yields protocol events for the SSE route:
//   { type: "delta",   text }            — append to the bubble
//   { type: "replace", text }            — guardrail tripped, overwrite it
//   { type: "done",    provider, model } — end of turn
export async function* streamReply({ messages, radar }) {
  const provider = resolveProvider();

  if (provider === "canned") {
    yield { type: "delta", text: cannedReply() };
    yield { type: "done", provider, model: providerModel(provider) };
    return;
  }

  const source = provider === "openrouter"
    ? streamOpenRouter({ messages, radar })
    : streamAnthropic({ messages, radar });

  // Accumulated so the guardrail can judge the finished sentence. Judging
  // individual deltas would false-positive on words split across chunks.
  let full = "";

  for await (const text of source) {
    full += text;
    yield { type: "delta", text };
  }

  if (trips(full)) {
    console.warn(`[chat] guardrail tripped on ${provider}/${providerModel(provider)}`);
    yield { type: "replace", text: SAFE_REPLY };
  }

  yield { type: "done", provider, model: providerModel(provider) };
}
