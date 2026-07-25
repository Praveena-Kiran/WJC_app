"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { kanaData } from "@/lib/data";

export function FlashcardPanel() {
  const { updateSrsData, speakJapanese, playSound } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const deck = kanaData;
  const currentCard = deck[currentIndex % deck.length];

  const handleRating = (rating: "again" | "hard" | "good" | "easy") => {
    playSound("click");
    updateSrsData(currentCard.id, rating);
    setIsFlipped(false);
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <div id="flashcard-panel" style={{ textAlign: "center", marginTop: "20px" }}>
      <div className="flashcard-wrapper" style={{ margin: "0 auto", maxWidth: "340px" }}>
        <div
          className={`flashcard ${isFlipped ? "flipped" : ""}`}
          onClick={() => {
            playSound("click");
            setIsFlipped(!isFlipped);
          }}
          style={{
            minHeight: "260px",
            background: "var(--card-bg)",
            border: "1px solid var(--card-border)",
            borderRadius: "var(--border-radius-lg)",
            padding: "30px 20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            boxShadow: "var(--shadow-hover)"
          }}
        >
          {!isFlipped ? (
            <div className="flashcard-front">
              <span style={{ fontSize: "5rem", fontWeight: 700, color: "var(--accent)" }}>
                {currentCard.char}
              </span>
              <div style={{ marginTop: "15px" }}>
                <button
                  className="btn-utility"
                  onClick={(e) => {
                    e.stopPropagation();
                    speakJapanese(currentCard.char);
                  }}
                  style={{ fontSize: "0.85rem" }}
                >
                  <i className="fa-solid fa-volume-high"></i> Listen
                </button>
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "15px" }}>
                Tap card to flip answer
              </p>
            </div>
          ) : (
            <div className="flashcard-back">
              <span style={{ fontSize: "2rem", fontWeight: 700, color: "var(--accent-secondary)" }}>
                {currentCard.romaji}
              </span>
              <p style={{ fontSize: "0.95rem", fontWeight: 600, marginTop: "10px", color: "var(--text-main)" }}>
                {currentCard.vocab}
              </p>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "4px" }}>
                {currentCard.translation}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* SRS Answer Buttons */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "20px", flexWrap: "wrap" }}>
        <button
          className="btn-utility"
          onClick={() => handleRating("again")}
          style={{ backgroundColor: "rgba(239, 68, 68, 0.15)", color: "#ef4444" }}
        >
          Again (1d)
        </button>
        <button
          className="btn-utility"
          onClick={() => handleRating("hard")}
          style={{ backgroundColor: "rgba(245, 158, 11, 0.15)", color: "#f59e0b" }}
        >
          Hard
        </button>
        <button
          className="btn-utility"
          onClick={() => handleRating("good")}
          style={{ backgroundColor: "rgba(16, 185, 129, 0.15)", color: "var(--accent-success, #10b981)" }}
        >
          Good
        </button>
        <button
          className="btn-utility"
          onClick={() => handleRating("easy")}
          style={{ backgroundColor: "rgba(92, 96, 245, 0.15)", color: "var(--accent)" }}
        >
          Easy
        </button>
      </div>
    </div>
  );
}
