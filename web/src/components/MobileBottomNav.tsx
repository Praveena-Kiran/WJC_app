"use client";

import React from "react";
import { useApp } from "@/context/AppContext";

export function MobileBottomNav() {
  const { state, setActiveView } = useApp();

  if (state.userRole === "teacher") return null;

  return (
    <nav id="mobile-bottom-nav">
      <button
        className={`nav-item ${state.activeView === "dashboard" ? "active" : ""}`}
        onClick={() => setActiveView("dashboard")}
      >
        <i className="fa-solid fa-house-chimney"></i>
        <span>Home</span>
      </button>
      <button
        className={`nav-item ${state.activeView === "kana-trainer" ? "active" : ""}`}
        onClick={() => setActiveView("kana-trainer")}
      >
        <i className="fa-solid fa-graduation-cap"></i>
        <span>Kana</span>
      </button>
      <button
        className={`nav-item ${state.activeView === "dictionary" ? "active" : ""}`}
        onClick={() => setActiveView("dictionary")}
      >
        <i className="fa-solid fa-book-open"></i>
        <span>Dictionary</span>
      </button>
      <button
        className={`nav-item ${state.activeView === "kanji-board" ? "active" : ""}`}
        onClick={() => setActiveView("kanji-board")}
      >
        <i className="fa-solid fa-brush"></i>
        <span>Kanji</span>
      </button>
      <button
        className={`nav-item ${state.activeView === "quiz" ? "active" : ""}`}
        onClick={() => setActiveView("quiz")}
      >
        <i className="fa-solid fa-gamepad"></i>
        <span>Quiz</span>
      </button>
    </nav>
  );
}
