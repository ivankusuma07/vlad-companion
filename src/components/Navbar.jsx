"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { BRAND } from "@/brand.config.js";

const links = [
  { to: "/", label: "Scout" },
  { to: "/who-is-vlad", label: "Who is Vlad" },
  { to: "/roadmap", label: "Roadmap" },
  { to: "/trade", label: "Trade", soon: true },
  { to: "/chain", label: "Robinhood" },
];

// A rounded pill, floating at top-center, width fit to its own content
// rather than stretched edge-to-edge — the nav reads as one distinct object
// sitting above the page, not a chrome bar attached to it.
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header style={s.header}>
      <nav style={{ ...s.bar, borderRadius: open ? "var(--radius)" : 999 }}>
        <Link href="/" style={s.logo} className="display" onClick={() => setOpen(false)}>
          {BRAND.name}
          <span className="live-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", display: "inline-block" }} />
        </Link>
        <button aria-label={open ? "Close menu" : "Open menu"} style={s.burger} className="nav-burger" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className={"nav-links" + (open ? " open" : "")} style={{ ...s.links, ...(open ? s.linksOpen : {}) }}>
          {links.map((l) => {
            if (l.soon) {
              return (
                <span key={l.to} style={s.soonLink} aria-disabled="true">
                  {l.label}
                  <span className="tag" style={s.soonTag}>soon</span>
                </span>
              );
            }
            const active = l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
            return (
              <Link key={l.to} href={l.to} onClick={() => setOpen(false)}
                className={"nav-link" + (active ? " is-active" : "")}
                style={{ ...s.link, color: active ? "var(--green)" : "var(--text-2)" }}>
                {l.label}
              </Link>
            );
          })}
        </div>
      </nav>
      <style>{`
        @media (max-width: 860px) {
          .nav-burger { display: block !important; }
          .nav-links { display: none !important; }
          .nav-links.open { display: flex !important; }
        }
      `}</style>
    </header>
  );
}

const s = {
  header: { position: "fixed", top: 16, left: 0, right: 0, zIndex: 50, display: "flex", justifyContent: "center", padding: "0 20px", pointerEvents: "none" },
  bar: {
    pointerEvents: "auto", width: "fit-content", maxWidth: "calc(100vw - 40px)",
    display: "flex", alignItems: "center", gap: 30, flexWrap: "wrap",
    padding: "12px 24px", background: "var(--base-raised)", border: "1px solid var(--rule-strong)",
    boxShadow: "var(--shadow-lg)",
  },
  logo: { fontSize: 18, display: "flex", gap: 8, alignItems: "center", flexShrink: 0 },
  burger: { display: "none", background: "none", border: "none", color: "var(--text-1)", cursor: "pointer", alignItems: "center" },
  links: { display: "flex", gap: 26, alignItems: "center" },
  linksOpen: { width: "100%", flexDirection: "column", paddingTop: 14, gap: 14, alignItems: "flex-start" },
  link: { fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 500, whiteSpace: "nowrap" },
  soonLink: { fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 500, color: "var(--text-3)", display: "inline-flex", alignItems: "center", gap: 6, cursor: "default", whiteSpace: "nowrap" },
  soonTag: { fontSize: 9.5, padding: "1px 6px", border: "1px solid var(--rule-strong)", borderRadius: 999 },
};
