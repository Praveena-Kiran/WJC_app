"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { kanaStrokes } from "@/lib/data";
import { TracingCanvas } from "@/lib/canvas";

export function KanaModal({ kana, onClose }: { kana: any; onClose: () => void }) {
  const { state, toggleMasterKana, speakJapanese, playSound } = useApp();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [accuracyMsg, setAccuracyMsg] = useState<string | null>(null);
  const [canvasController, setCanvasController] = useState<TracingCanvas | null>(null);

  const strokes = kanaStrokes[kana.char as keyof typeof kanaStrokes] || [];
  const isMastered = state.masteredKana.includes(kana.id);

  useEffect(() => {
    if (canvasRef.current) {
      const tc = new TracingCanvas(canvasRef.current, null, null, null);
      setCanvasController(tc);
    }
  }, []);

  const handleCheckAccuracy = () => {
    if (!canvasController) return;
    if (!canvasController.hasDrawing()) {
      setAccuracyMsg("Please draw the character on the canvas first!");
      return;
    }
    if (strokes.length === 0) {
      setAccuracyMsg("Practice recorded! Master this character anytime.");
      return;
    }
    const score = canvasController.checkDrawing(strokes);
    if (score >= 60) {
      playSound("correct");
      setAccuracyMsg(`Great job! Stroke accuracy: ${score}% 🎉`);
    } else {
      playSound("incorrect");
      setAccuracyMsg(`Keep practicing! Stroke accuracy: ${score}%. Try matching the guide strokes.`);
    }
  };

  const handleClear = () => {
    playSound("click");
    canvasController?.clear();
    setAccuracyMsg(null);
  };

  return (
    <div className="modal-backdrop active">
      <div
        className="modal-content"
        style={{
          maxWidth: "520px",
          width: "92%",
          padding: "25px",
          borderRadius: "var(--border-radius-lg)",
          background: "var(--card-bg)",
          border: "1px solid var(--card-border)"
        }}
      >
        <div className="modal-header" style={{ marginBottom: "15px" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-main)" }}>
            Character Spotlight ({kana.type.toUpperCase()})
          </h3>
          <button className="btn-close-modal" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {/* Header Info */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px", background: "var(--panel-active)", padding: "15px", borderRadius: "var(--border-radius-md)" }}>
            <div style={{ fontSize: "3.5rem", fontWeight: 700, color: "var(--accent)", width: "80px", height: "80px", display: "flex", justifyContent: "center", alignItems: "center", background: "var(--card-bg)", borderRadius: "var(--border-radius-md)" }}>
              {kana.char}
            </div>
            <div>
              <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-main)" }}>
                {kana.romaji}
              </div>
              <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginTop: "4px" }}>
                Vocab: <strong>{kana.vocab}</strong> ({kana.translation})
              </div>
              {kana.notes && (
                <div style={{ fontSize: "0.82rem", color: "var(--accent-secondary)", marginTop: "4px" }}>
                  💡 {kana.notes}
                </div>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              className="btn-utility"
              onClick={() => speakJapanese(kana.char)}
              style={{ flex: 1, justifyContent: "center" }}
            >
              <i className="fa-solid fa-volume-high"></i> Pronounce
            </button>
            <button
              className="btn-utility"
              onClick={() => toggleMasterKana(kana.id)}
              style={{
                flex: 1,
                justifyContent: "center",
                backgroundColor: isMastered ? "rgba(16, 185, 129, 0.2)" : undefined,
                color: isMastered ? "var(--accent-success, #10b981)" : undefined
              }}
            >
              <i className="fa-solid fa-check-double"></i> {isMastered ? "Mastered" : "Mark Mastered"}
            </button>
          </div>

          {/* Canvas Tracing Area */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-main)" }}>Stroke Order Practice</span>
              <button onClick={handleClear} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.82rem" }}>
                <i className="fa-solid fa-eraser"></i> Clear Canvas
              </button>
            </div>

            <div style={{ position: "relative", width: "100%", height: "240px", background: "var(--panel-active)", borderRadius: "var(--border-radius-md)", overflow: "hidden" }}>
              {/* Guide Stroke SVG overlay */}
              <svg
                viewBox="0 0 100 100"
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0.25, pointerEvents: "none" }}
              >
                {strokes.map((d: string, idx: number) => (
                  <path key={idx} d={d} stroke="var(--text-main)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                ))}
              </svg>
              <canvas ref={canvasRef} style={{ width: "100%", height: "100%", position: "relative", zIndex: 2, cursor: "crosshair" }}></canvas>
            </div>
          </div>

          {accuracyMsg && (
            <div style={{ padding: "10px 14px", borderRadius: "var(--border-radius-md)", background: "var(--panel-active)", fontSize: "0.88rem", fontWeight: 600, color: "var(--text-main)", textAlign: "center" }}>
              {accuracyMsg}
            </div>
          )}

          <button
            className="lesson-btn-start"
            onClick={handleCheckAccuracy}
            style={{ width: "100%", justifyContent: "center", marginTop: 0 }}
          >
            Check Stroke Accuracy
          </button>
        </div>
      </div>
    </div>
  );
}
