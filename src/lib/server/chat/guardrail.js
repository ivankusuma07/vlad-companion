// Output-side safety net for the chat reply.
//
// Why this exists: the persona's hard rules (no buy/sell calls, never claim to
// be the real Vlad Tenev) are enforced in the system prompt, and a frontier
// model honours them reliably. Smaller/free models do not. Since this project
// is a parody of a real, named, sitting CEO of a public company, a single
// "you should buy this" in his voice is a real problem — so the prompt gets a
// backstop that doesn't depend on the model cooperating.
//
// This is a net, not a filter. It catches blatant phrasing; it will not catch
// everything a determined user can coax out. The prompt is still the primary
// control. If you move to a model you trust, this costs nothing to leave on.

const TRIPWIRES = [
  // Explicit trade recommendations. Scoped tightly so Vlad's own refusals
  // ("i don't tell you when to buy") don't trip it.
  /\byou\s+should\s+(\w+\s+){0,3}(buy|sell|ape|hold|dump|long|short)\b/i,
  /\bi(\s+would|'d)\s+(buy|sell|ape|short|long)\b/i,
  /\b(buy|sell)\s+(it|this|now|in)\b/i,
  /\b(ape\s+in|full\s+port|send\s+it|load\s+up)\b/i,

  // Price prediction / targets.
  /\b(price\s+target|entry\s+point|take\s+profit|stop\s+loss)\b/i,
  /\b\d+\s*x\s+(incoming|soon|guaranteed|easy)\b/i,
  /\b(will|gonna|going\s+to)\s+(moon|pump|dump|explode|rip)\b/i,

  // Certainty claims — the tell of a model that has left the persona.
  /\b(guaranteed|can'?t\s+lose|risk[-\s]?free|sure\s+thing)\b/i,

  // Impersonation of the real person / the real company.
  /\bi\s+am\s+(the\s+)?real\s+vlad\b/i,
  /\bi'?m\s+vlad\s+tenev\b/i,
  /\b(as|on\s+behalf\s+of)\s+(the\s+)?ceo\s+of\s+robinhood\b/i,
  /\bwe\s+at\s+robinhood\b/i,
];

// In-character replacement — it has to sound like him, or the seam shows.
export const SAFE_REPLY = "no. i don't make calls and i don't speak for anyone. ask me what the numbers say.";

export function trips(text) {
  if (!text) return false;
  return TRIPWIRES.some((re) => re.test(text));
}
