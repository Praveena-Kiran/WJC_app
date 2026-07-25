"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { kanaData } from "@/lib/data";
import { KanaModal } from "@/components/kana/KanaModal";
import { FlashcardPanel } from "@/components/kana/FlashcardPanel";

export function KanaTrainer() {
  const { state, playSound, speakJapanese } = useApp();
  const [kanaType, setKanaType] = useState<"hiragana" | "katakana" | "flashcard">("hiragana");
  const [showRomaji, setShowRomaji] = useState(true);
  const [selectedKana, setSelectedKana] = useState<any | null>(null);

  const filteredKanas = kanaData.filter((k) => k.type === kanaType);

  return (
    <section id="kana-trainer-view" className="view-section active">
      <div className="header-row">
        <div className="welcome-msg">
          <h2>Kana Trainer Workspace</h2>
          <p>Select Hiragana or Katakana. Click any card to launch pronunciation and stroke guide tracing.</p>
        </div>
      </div>

      <div className="content-card trainer-layout">
        <div className="trainer-options-row">
          <div className="btn-group" id="kana-type-select">
            <button
              className={`btn-tab ${kanaType === "hiragana" ? "active" : ""}`}
              onClick={() => {
                playSound("click");
                setKanaType("hiragana");
              }}
            >
              Hiragana (平仮名)
            </button>
            <button
              className={`btn-tab ${kanaType === "katakana" ? "active" : ""}`}
              onClick={() => {
                playSound("click");
                setKanaType("katakana");
              }}
            >
              Katakana (片仮名)
            </button>
            <button
              className={`btn-tab ${kanaType === "flashcard" ? "active" : ""}`}
              onClick={() => {
                playSound("click");
                setKanaType("flashcard");
              }}
            >
              ⚡ Flashcards (SRS)
            </button>
          </div>

          {kanaType !== "flashcard" && (
            <div className="toggle-switch-container">
              <span>Show Romaji guides</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={showRomaji}
                  onChange={(e) => setShowRomaji(e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
          )}
        </div>

        {kanaType === "flashcard" ? (
          <FlashcardPanel />
        ) : (
          <div className="kana-grid" id="kanas-grid-container">
            {filteredKanas.map((kana) => {
              const isMastered = state.masteredKana.includes(kana.id);
              return (
                <div
                  key={kana.id}
                  className={`kana-card ${isMastered ? "mastered" : ""}`}
                  onClick={() => {
                    playSound("click");
                    speakJapanese(kana.char);
                    setSelectedKana(kana);
                  }}
                >
                  <span className="kana-char">{kana.char}</span>
                  {showRomaji && <span className="kana-romaji">{kana.romaji}</span>}
                  {isMastered && (
                    <div className="mastered-badge">
                      <i className="fa-solid fa-check"></i>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedKana && <KanaModal kana={selectedKana} onClose={() => setSelectedKana(null)} />}
    </section>
  );
}
