"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND } from "@/brand.config.js";

const links = [
  { to: "/", label: "SCOUT" },
  { to: "/who-is-vlad", label: "WHO IS VLAD?" },
  { to: "/roadmap", label: "ROADMAP" },
  { to: "/chain", label: "THE CHAIN" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header style={s.header}>
      <nav className="glass glass--strong" style={s.bar}>
        <Link href="/" style={s.logo} className="display" onClick={() => setOpen(false)}>
          <span style={{ color: "var(--green)" }}>●</span> {BRAND.name}
        </Link>
        <button aria-label="Menu" style={s.burger} className="nav-burger" onClick={() => setOpen(!open)}>≡</button>
        <div className={"nav-links" + (open ? " open" : "")} style={{ ...s.links, ...(open ? s.linksOpen : {}) }}>
          {links.map((l) => {
            const active = l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
            return (
              <Link key={l.to} href={l.to} onClick={() => setOpen(false)}
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
  header: { position: "fixed", top: 14, left: 0, right: 0, zIndex: 50, padding: "0 20px" },
  bar: { maxWidth: 1240, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 22px", borderRadius: 999, flexWrap: "wrap" },
  logo: { fontWeight: 600, fontSize: 18, letterSpacing: "0.04em", display: "flex", gap: 8, alignItems: "center" },
  burger: { display: "none", background: "none", border: "none", color: "var(--text-1)", fontSize: 26, cursor: "pointer" },
  links: { display: "flex", gap: 26, alignItems: "center" },
  linksOpen: { width: "100%", flexDirection: "column", paddingTop: 14, gap: 14 },
  link: { fontFamily: "var(--font-display)", fontSize: 13, letterSpacing: "0.1em", fontWeight: 500 },
};
