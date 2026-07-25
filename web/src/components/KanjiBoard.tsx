"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { kanjiData } from "@/lib/data";
import { TracingCanvas } from "@/lib/canvas";

export function KanjiBoard() {
  const { state, addPracticedKanji, speakJapanese, playSound } = useApp();
  const [selectedChar, setSelectedChar] = useState<string>("一");
  const [accuracyMsg, setAccuracyMsg] = useState<string | null>(null);
  const [brushSize, setBrushSize] = useState(5);
  const [currentColor, setCurrentColor] = useState("#ff7597");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasControllerRef = useRef<TracingCanvas | null>(null);

  const selectedKanji = kanjiData.find((k) => k.char === selectedChar) || kanjiData[0];

  useEffect(() => {
    if (canvasRef.current) {
      const tc = new TracingCanvas(canvasRef.current, null, null, null);
      tc.currentBrushSize = brushSize;
      tc.currentColor = currentColor;
      canvasControllerRef.current = tc;
    }
  }, [selectedChar]);

  const handleCharSelect = (char: string) => {
    playSound("click");
    setSelectedChar(char);
    setAccuracyMsg(null);
    canvasControllerRef.current?.clear();
  };

  const handleClear = () => {
    playSound("click");
    canvasControllerRef.current?.clear();
    setAccuracyMsg(null);
  };

  const handleCheckDrawing = () => {
    if (!canvasControllerRef.current) return;
    if (!canvasControllerRef.current.hasDrawing()) {
      setAccuracyMsg("Please draw the Kanji on the canvas first!");
      return;
    }
    playSound("correct");
    addPracticedKanji(selectedKanji.char);
    setAccuracyMsg(`Kanji practice recorded for "${selectedKanji.char}"! Keep practicing stroke order. ✨`);
  };

  const handleColorChange = (color: string) => {
    setCurrentColor(color);
    if (canvasControllerRef.current) {
      canvasControllerRef.current.currentColor = color;
    }
  };

  const handleBrushChange = (size: number) => {
    setBrushSize(size);
    if (canvasControllerRef.current) {
      canvasControllerRef.current.currentBrushSize = size;
    }
  };

  return (
    <section id="kanji-board-view" className="view-section active">
      <div className="header-row">
        <div className="welcome-msg">
          <h2>Interactive Kanji Tracing Board</h2>
          <p>Select any N5/N4 Kanji. Trace stroke paths, test stroke accuracy, and hear native audio.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Left: Kanji Grid Selector */}
        <div className="content-card">
          <div className="card-title">
            <i className="fa-solid fa-brush"></i>
            <span>Kanji Selector</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(65px, 1fr))", gap: "10px", maxHeight: "500px", overflowY: "auto", paddingRight: "5px" }}>
            {kanjiData.map((k) => {
              const isPracticed = state.practicedKanji.includes(k.char);
              const isSelected = selectedChar === k.char;
              return (
                <button
                  key={k.char}
                  onClick={() => handleCharSelect(k.char)}
                  style={{
                    height: "65px",
                    background: isSelected ? "var(--accent)" : "var(--panel-active)",
                    color: isSelected ? "#fff" : "var(--text-main)",
                    borderRadius: "var(--border-radius-md)",
                    border: isSelected ? "2px solid var(--accent-secondary)" : "1px solid var(--card-border)",
                    fontSize: "1.6rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    position: "relative"
                  }}
                >
                  {k.char}
                  {isPracticed && (
                    <div style={{ position: "absolute", top: "4px", right: "4px", fontSize: "0.65rem", color: isSelected ? "#fff" : "var(--accent-success, #10b981)" }}>
                      ✓
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Tracing Board & Details */}
        <div className="content-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
            <div>
              <span style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--accent)", marginRight: "12px" }}>
                {selectedKanji.char}
              </span>
              <span style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--text-main)" }}>
                {selectedKanji.meaning}
              </span>
            </div>
            <button
              className="btn-utility"
              onClick={() => speakJapanese(selectedKanji.char)}
            >
              <i className="fa-solid fa-volume-high"></i> Pronounce
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "15px", background: "var(--panel-active)", padding: "12px", borderRadius: "var(--border-radius-md)", fontSize: "0.88rem" }}>
            <div><strong>Kunyomi:</strong> {selectedKanji.kunyomi}</div>
            <div><strong>Onyomi:</strong> {selectedKanji.onyomi}</div>
            <div><strong>Strokes:</strong> {selectedKanji.strokes}</div>
            <div><strong>JLPT:</strong> N5</div>
          </div>

          {/* Canvas Tracing Box */}
          <div style={{ position: "relative", width: "100%", height: "280px", background: "var(--panel-active)", borderRadius: "var(--border-radius-md)", overflow: "hidden", marginBottom: "15px" }}>
            {/* Stroke guide text watermark */}
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "10rem", color: "var(--text-main)", opacity: 0.12, pointerEvents: "none", userSelect: "none" }}>
              {selectedKanji.char}
            </div>
            <canvas ref={canvasRef} style={{ width: "100%", height: "100%", position: "relative", zIndex: 2, cursor: "crosshair" }}></canvas>
          </div>

          {/* Canvas Controls */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", gap: "10px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-muted)" }}>Color:</span>
              {["#ff7597", "#5c60f5", "#10b981", "#2c2a29"].map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    backgroundColor: color,
                    border: currentColor === color ? "2px solid var(--text-main)" : "none",
                    cursor: "pointer"
                  }}
                />
              ))}
            </div>

            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-muted)" }}>Size:</span>
              <input
                type="range"
                min="2"
                max="15"
                value={brushSize}
                onChange={(e) => handleBrushChange(parseInt(e.target.value))}
                style={{ width: "80px" }}
              />
            </div>

            <button className="btn-utility" onClick={handleClear} style={{ fontSize: "0.82rem" }}>
              <i className="fa-solid fa-eraser"></i> Clear
            </button>
          </div>

          {accuracyMsg && (
            <div style={{ padding: "10px", borderRadius: "var(--border-radius-md)", background: "var(--panel-active)", fontSize: "0.88rem", fontWeight: 600, color: "var(--text-main)", textAlign: "center", marginBottom: "15px" }}>
              {accuracyMsg}
            </div>
          )}

          <button
            className="lesson-btn-start"
            onClick={handleCheckDrawing}
            style={{ width: "100%", justifyContent: "center", marginTop: 0 }}
          >
            Mark Kanji Practiced
          </button>
        </div>
      </div>
    </section>
  );
}
