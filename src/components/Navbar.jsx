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
  { to: "/chain", label: "The Chain" },
];

// Edge-to-edge instrument header, not a floating blurred pill — a bottom
// hairline is the only separator from the page, same device every panel in
// the app uses.
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header style={s.header}>
      <nav style={s.bar}>
        <Link href="/" style={s.logo} className="display" onClick={() => setOpen(false)}>
          {BRAND.name}
          <span className="live-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", display: "inline-block" }} />
        </Link>
        <button aria-label={open ? "Close menu" : "Open menu"} style={s.burger} className="nav-burger" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
        <div className={"nav-links" + (open ? " open" : "")} style={{ ...s.links, ...(open ? s.linksOpen : {}) }}>
          {links.map((l) => {
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
        @media (max-width: 780px) {
          .nav-burger { display: block !important; }
          .nav-links { display: none !important; }
          .nav-links.open { display: flex !important; }
        }
      `}</style>
    </header>
  );
}

const s = {
  header: { position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(9,11,9,0.86)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", borderBottom: "1px solid var(--rule)" },
  bar: { maxWidth: 1240, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", flexWrap: "wrap" },
  logo: { fontSize: 19, display: "flex", gap: 8, alignItems: "center" },
  burger: { display: "none", background: "none", border: "none", color: "var(--text-1)", cursor: "pointer", alignItems: "center" },
  links: { display: "flex", gap: 30, alignItems: "center" },
  linksOpen: { width: "100%", flexDirection: "column", paddingTop: 16, gap: 16 },
  link: { fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 500 },
};
