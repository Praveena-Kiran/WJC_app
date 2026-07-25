"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";

export interface RadicalPuzzleItem {
  id: string;
  targetKanji: string;
  meaning: string;
  onyomi: string;
  kunyomi: string;
  radicals: Array<{ char: string; meaning: string }>;
  candidateRadicals: Array<{ char: string; meaning: string }>;
  explanation: string;
}

const puzzleItems: RadicalPuzzleItem[] = [
  {
    id: "p1",
    targetKanji: "休",
    meaning: "Rest / Take a break",
    onyomi: "KYUU",
    kunyomi: "yasu(mu)",
    radicals: [
      { char: "人", meaning: "Person (亻)" },
      { char: "木", meaning: "Tree" }
    ],
    candidateRadicals: [
      { char: "人", meaning: "Person" },
      { char: "木", meaning: "Tree" },
      { char: "日", meaning: "Sun" },
      { char: "水", meaning: "Water" }
    ],
    explanation: "A person (人) leaning against a tree (木) to rest."
  },
  {
    id: "p2",
    targetKanji: "明",
    meaning: "Bright / Clear",
    onyomi: "MEI",
    kunyomi: "aka(rii)",
    radicals: [
      { char: "日", meaning: "Sun" },
      { char: "月", meaning: "Moon" }
    ],
    candidateRadicals: [
      { char: "日", meaning: "Sun" },
      { char: "月", meaning: "Moon" },
      { char: "火", meaning: "Fire" },
      { char: "金", meaning: "Gold" }
    ],
    explanation: "The sun (日) and the moon (月) coming together to illuminate brightness."
  },
  {
    id: "p3",
    targetKanji: "好",
    meaning: "Like / Fond of",
    onyomi: "KOU",
    kunyomi: "su(ki)",
    radicals: [
      { char: "女", meaning: "Woman / Mother" },
      { char: "子", meaning: "Child" }
    ],
    candidateRadicals: [
      { char: "女", meaning: "Woman" },
      { char: "子", meaning: "Child" },
      { char: "心", meaning: "Heart" },
      { char: "手", meaning: "Hand" }
    ],
    explanation: "A mother (女) holding her child (子) represents love and fond affection."
  },
  {
    id: "p4",
    targetKanji: "男",
    meaning: "Man / Male",
    onyomi: "DAN",
    kunyomi: "otoko",
    radicals: [
      { char: "田", meaning: "Rice Field" },
      { char: "力", meaning: "Power / Strength" }
    ],
    candidateRadicals: [
      { char: "田", meaning: "Rice Field" },
      { char: "力", meaning: "Power" },
      { char: "土", meaning: "Soil" },
      { char: "車", meaning: "Car" }
    ],
    explanation: "Exerting power (力) to farm in the rice fields (田)."
  }
];

export function KanjiRadicalView() {
  const { setActiveView, markNodeSolved, speakJapanese, playSound } = useApp();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedRadicals, setSelectedRadicals] = useState<string[]>([]);
  const [solved, setSolved] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const currentItem = puzzleItems[currentIndex];

  const handleTileClick = (radChar: string) => {
    playSound("click");
    if (selectedRadicals.includes(radChar)) {
      setSelectedRadicals(selectedRadicals.filter((c) => c !== radChar));
      return;
    }

    const nextSelected = [...selectedRadicals, radChar];
    setSelectedRadicals(nextSelected);

    // Check if correct 2 radicals selected
    const requiredChars = currentItem.radicals.map((r) => r.char);
    const isMatch = requiredChars.every((c) => nextSelected.includes(c)) && nextSelected.length === requiredChars.length;

    if (isMatch) {
      playSound("correct");
      setSolved(true);
      setScore((prev) => prev + 25);
      markNodeSolved(9);
    } else if (nextSelected.length >= 2) {
      playSound("incorrect");
    }
  };

  const handleNext = () => {
    playSound("click");
    if (currentIndex + 1 < puzzleItems.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedRadicals([]);
      setSolved(false);
    }
  };

  return (
    <section id="kanji-radical-view" className="view-section active">
      <div className="header-row">
        <div className="welcome-msg">
          <h2>部首 Kanji Radical Assembly Puzzle</h2>
          <p>Deconstruct Kanji into their primitive root radicals and assemble them interactively.</p>
        </div>
      </div>

      {/* Main Puzzle Area */}
      <div className="content-card" style={{ borderLeft: "5px solid var(--accent-secondary)" }}>
        <div className="card-title" style={{ justifyContent: "space-between" }}>
          <span>Kanji Puzzle {currentIndex + 1} of {puzzleItems.length}</span>
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--accent)" }}>
            Score: {score} pts
          </span>
        </div>

        {/* Target Concept Header */}
        <div
          style={{
            padding: "20px",
            borderRadius: "var(--border-radius-lg)",
            background: "var(--panel-active)",
            textAlign: "center",
            marginBottom: "25px",
            border: "1px solid var(--card-border)"
          }}
        >
          <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--accent-secondary)", textTransform: "uppercase" }}>
            Target Kanji Meaning
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--text-main)", margin: "4px 0" }}>
            "{currentItem.meaning}"
          </div>
          <div style={{ fontSize: "0.86rem", color: "var(--text-muted)" }}>
            Onyomi: <strong>{currentItem.onyomi}</strong> • Kunyomi: <strong>{currentItem.kunyomi}</strong>
          </div>
        </div>

        {/* Assembly Canvas Tray */}
        <div style={{ marginBottom: "25px" }}>
          <div style={{ fontSize: "0.86rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "10px" }}>
            Assembly Workspace (Select 2 Radicals):
          </div>

          <div
            style={{
              minHeight: "120px",
              borderRadius: "var(--border-radius-md)",
              background: "var(--card-bg)",
              border: "2px dashed var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px",
              padding: "15px"
            }}
          >
            {selectedRadicals.length === 0 ? (
              <div style={{ color: "var(--text-muted)", fontSize: "0.9rem", fontStyle: "italic" }}>
                Click radical tiles below to build the Kanji...
              </div>
            ) : (
              selectedRadicals.map((char) => (
                <div
                  key={char}
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "12px",
                    background: "rgba(92, 96, 245, 0.15)",
                    border: "2px solid var(--accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.8rem",
                    fontWeight: 700,
                    color: "var(--accent)"
                  }}
                >
                  {char}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Radical Candidate Tiles */}
        <div style={{ marginBottom: "25px" }}>
          <div style={{ fontSize: "0.86rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "10px" }}>
            Available Radical Tiles:
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "12px" }}>
            {currentItem.candidateRadicals.map((rad) => {
              const isSelected = selectedRadicals.includes(rad.char);
              return (
                <button
                  key={rad.char}
                  onClick={() => handleTileClick(rad.char)}
                  style={{
                    padding: "16px 12px",
                    borderRadius: "var(--border-radius-md)",
                    background: isSelected ? "rgba(34, 102, 76, 0.2)" : "var(--panel-active)",
                    border: isSelected ? "2px solid var(--accent)" : "1px solid var(--card-border)",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ fontSize: "2rem", fontWeight: 700, color: isSelected ? "var(--accent)" : "var(--text-main)" }}>
                    {rad.char}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>
                    {rad.meaning}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Solved Result Card */}
        {solved && (
          <div style={{ padding: "20px", borderRadius: "var(--border-radius-md)", background: "rgba(34, 102, 76, 0.15)", border: "2px solid var(--accent-success, #10b981)", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <div style={{ fontSize: "3rem", fontWeight: 700, color: "var(--accent)" }}>
                {currentItem.targetKanji}
              </div>
              <div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--accent-success, #10b981)" }}>
                  🎉 Kanji Assembled Successfully!
                </div>
                <div style={{ fontSize: "0.88rem", color: "var(--text-main)", marginTop: "4px" }}>
                  {currentItem.explanation}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "15px", flexWrap: "wrap" }}>
              {currentIndex + 1 < puzzleItems.length && (
                <button className="btn-action" onClick={handleNext}>
                  Next Kanji Puzzle <i className="fa-solid fa-arrow-right" style={{ marginLeft: "6px" }}></i>
                </button>
              )}
              <button
                className="btn-utility"
                onClick={() => {
                  playSound("click");
                  setActiveView("dashboard");
                }}
                style={{ padding: "10px 16px" }}
              >
                Continue Master Path ➔
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
