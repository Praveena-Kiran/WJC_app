"use client";

import React from "react";
import { useApp } from "@/context/AppContext";

export function MobileHeader({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const { playSound } = useApp();

  return (
    <header className="mobile-header">
      <div style={{ width: "24px" }}></div>
      <h1>ZENGO</h1>
      <button
        className="btn-mobile-nav"
        id="mobile-nav-toggle"
        aria-label="Open settings panel"
        onClick={() => {
          playSound("click");
          onToggleSidebar();
        }}
        style={{ background: "none", border: "none", outline: "none", fontSize: "1.4rem", padding: "5px" }}
      >
        <i className="fa-solid fa-gear"></i>
      </button>
    </header>
  );
}
