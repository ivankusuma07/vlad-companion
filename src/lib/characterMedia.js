// Detects real VP9-alpha WebM decode support — not just "can this browser
// play webm at all". Verified against real engines: Chromium decodes it and
// renders genuine transparency. WebKit (Safari) accepts the <video> source,
// reports it as `currentSrc`, and then simply never advances past
// `networkState: loading` — no `error` event, no `loadeddata`, nothing. It
// does not fail; it hangs. That means a plain multi-<source> fallback
// (webm then mp4) is not safe here: WebKit picks the webm and never falls
// through to the mp4 sibling.
//
// This probes affirmatively instead, with a hard timeout standing in for
// the error event that browsers like WebKit never send.
const PROBE_TIMEOUT_MS = 1500;

let cached = null;

export function probeAlphaVideoSupport(sampleUrl) {
  if (cached) return cached;
  if (typeof window === "undefined" || typeof document === "undefined") {
    return Promise.resolve(false);
  }

  cached = new Promise((resolve) => {
    const probe = document.createElement("video");
    let settled = false;

    const finish = (ok) => {
      if (settled) return;
      settled = true;
      probe.removeAttribute("src");
      probe.load(); // release the underlying resource
      resolve(ok);
    };

    probe.muted = true;
    probe.playsInline = true;
    probe.preload = "auto";
    probe.addEventListener("loadeddata", () => finish(true), { once: true });
    probe.addEventListener("error", () => finish(false), { once: true });
    setTimeout(() => finish(false), PROBE_TIMEOUT_MS);

    probe.src = sampleUrl;
    probe.load();
  });

  return cached;
}
