"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

// Chat UI under the character. Streams from POST /api/chat, so text lands word
// by word instead of after a long pause.
//
// Persona rules live in the backend system prompt (src/lib/server/persona.js) —
// not here. Anything enforced in the browser is a suggestion, and "never gives
// buy/sell advice" has to be a rule.
const MAX_CHARS = 2000;
const HISTORY_LIMIT = 20; // matches the server cap; trimmed here to avoid a 400

const dispatchCharacterState = (state) =>
  window.dispatchEvent(new CustomEvent("vlad:state", { detail: { state } }));

// The API speaks SSE. This walks the byte stream and yields {event, data}.
async function* readSSE(response) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // Frames are separated by a blank line; a partial frame stays in buffer.
    const frames = buffer.split("\n\n");
    buffer = frames.pop() ?? "";

    for (const frame of frames) {
      let event = "message";
      let data = "";
      for (const line of frame.split("\n")) {
        if (line.startsWith("event: ")) event = line.slice(7).trim();
        else if (line.startsWith("data: ")) data += line.slice(6);
      }
      if (!data) continue;
      try {
        yield { event, data: JSON.parse(data) };
      } catch {
        // A malformed frame shouldn't kill the stream.
      }
    }
  }
}

export default function ChatPanel() {
  const [msgs, setMsgs] = useState([{ from: "vlad", text: "you found me. ask, or read the chain." }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    // Scroll only this container's own scrollbar, never the page's.
    // `endRef.scrollIntoView()` looked equivalent but isn't: when the
    // browser decides the nearest scrollable ancestor doesn't fully reveal
    // the target, it scrolls outer ancestors too — including the whole
    // page — which showed up as an unrelated scroll jump whenever content
    // elsewhere on the page (e.g. the radar's skeleton-to-loaded swap)
    // changed the page's height around the same time. Setting scrollTop
    // directly can only ever affect this one element.
    const list = listRef.current;
    if (list) list.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
  }, [msgs]);

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;

    const next = [...msgs, { from: "you", text }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    // Character reacts to the conversation, not just the radar. The radar's
    // own 20s poll can still override this mid-reply — acceptable; nothing
    // here locks the two together, and a stray SCANNING flash isn't worth
    // coordinating across components for.
    dispatchCharacterState("REPORT");

    // Rebuild the API history from what's on screen, dropping the opening line
    // (Vlad speaks first, but the API needs a user message to start).
    const history = next
      .slice(1)
      .slice(-HISTORY_LIMIT)
      .map((m) => ({ role: m.from === "you" ? "user" : "assistant", content: m.text }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok || !res.body) {
        const { error } = await res.json().catch(() => ({}));
        setMsgs((m) => [...m, { from: "vlad", text: error || "the line dropped. try again." }]);
        return;
      }

      // Open an empty bubble and fill it as deltas arrive.
      setMsgs((m) => [...m, { from: "vlad", text: "" }]);
      for await (const { event, data } of readSSE(res)) {
        if (event === "delta") {
          setMsgs((m) => {
            const copy = [...m];
            copy[copy.length - 1] = { from: "vlad", text: copy[copy.length - 1].text + data.text };
            return copy;
          });
        } else if (event === "replace") {
          // Server-side guardrail caught something in the finished reply and
          // sent a safe line to overwrite it with.
          setMsgs((m) => {
            const copy = [...m];
            copy[copy.length - 1] = { from: "vlad", text: data.text };
            return copy;
          });
        } else if (event === "error") {
          setMsgs((m) => {
            const copy = [...m];
            copy[copy.length - 1] = { from: "vlad", text: data.error };
            return copy;
          });
        }
      }
    } catch {
      setMsgs((m) => [...m, { from: "vlad", text: "connection lost. i measure what i can reach." }]);
    } finally {
      setBusy(false);
      dispatchCharacterState("SCANNING"); // back to the radar's own ambient default
    }
  };

  return (
    <div className="glass" style={{ padding: "var(--sp-4)", marginTop: "var(--sp-3)", display: "flex", flexDirection: "column", height: 300 }}>
      <div ref={listRef} style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "var(--sp-2)", paddingRight: "var(--sp-1)" }}>
        {msgs.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.from === "you" ? "flex-end" : "flex-start",
            maxWidth: "85%", fontSize: 13, lineHeight: 1.5,
            padding: "var(--sp-2) var(--sp-3)",
            // Asymmetric corner on the "tail" side — the small detail that
            // separates an actual chat bubble from a uniformly-rounded box.
            borderRadius: m.from === "you" ? "12px 12px 3px 12px" : "12px 12px 12px 3px",
            background: m.from === "you" ? "var(--green-soft)" : "rgba(255,255,255,0.06)",
            color: m.from === "you" ? "var(--green)" : "var(--text-1)",
            border: "1px solid " + (m.from === "you" ? "rgba(204,255,0,0.25)" : "var(--glass-edge)"),
          }}>
            {m.text || "…"}
          </div>
        ))}
        {busy && <div style={{ fontSize: 12, color: "var(--text-3)" }}>vlad is typing…</div>}
      </div>
      <div style={{ display: "flex", gap: "var(--sp-2)", marginTop: "var(--sp-3)" }}>
        <input value={input} maxLength={MAX_CHARS} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="ask vlad…" disabled={busy}
          style={{ flex: 1, background: "var(--base-sunken)", border: "1px solid var(--rule)", borderRadius: "var(--radius-sm)", padding: "var(--sp-2) var(--sp-4)", color: "var(--text-1)", fontSize: 13, outline: "none", transition: "border-color 0.15s ease" }} />
        <button className="btn" style={{ padding: "var(--sp-2) var(--sp-3)", fontSize: 13 }} onClick={send} disabled={busy} aria-label="Send message">
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}
