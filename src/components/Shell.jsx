"use client";

import { useEffect, useState } from "react";
import LoadingGate from "./LoadingGate.jsx";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

// Wraps every page: gate first, then chrome. sessionStorage is read in an
// effect, not during render — on the server there is no sessionStorage, and
// touching it during render would hydrate-mismatch.
export default function Shell({ children }) {
  const [entered, setEntered] = useState(null); // null = not yet known

  useEffect(() => {
    setEntered(sessionStorage.getItem("vlad_entered") === "1");
  }, []);

  const enter = () => {
    sessionStorage.setItem("vlad_entered", "1");
    setEntered(true);
  };

  // First paint before the effect runs. Rendering the gate here would make it
  // flash for returning visitors, so hold the dark background instead.
  if (entered === null) return <div style={{ minHeight: "100vh" }} />;
  if (!entered) return <LoadingGate onEnter={enter} />;

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
