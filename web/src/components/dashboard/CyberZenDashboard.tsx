"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { dictionary, kanjiData } from "@/lib/data";
import { N5DeadlineCard } from "@/components/dashboard/N5DeadlineCard";

export function CyberZenDashboard() {
  const { state, setActiveView, toggleStarVocab, speakJapanese } = useApp();

  const kanaMasteryPct = Math.round((state.masteredKana.length / 92) * 100);
  const starredItems = state.starredVocab
    .map((word) => dictionary.find((d) => d.word === word))
    .filter(Boolean);

  return (
    <section id="cyber-zen-dashboard-view" className="view-section active">
      <div className="header-row">
        <div className="welcome-msg">
          <h2>こんにちわ, Cyber Learner</h2>
          <p>Ready to sync? Optimize your Japanese mastery metrics today.</p>
        </div>
        <div className="streak-badge">
          <i className="fa-solid fa-fire flame-icon"></i>
          <span>{state.streakCount} Days Streak</span>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="stats-row">
        <div className="stat-item-card">
          <div className="stat-label">Kana Mastery</div>
          <div className="stat-value">{kanaMasteryPct}%</div>
        </div>
        <div className="stat-item-card">
          <div className="stat-label">Kanji Read Ratio</div>
          <div className="stat-value">
            {state.practicedKanji.length}/{kanjiData.length}
          </div>
        </div>
        <div className="stat-item-card">
          <div className="stat-label">Starred Dictionary</div>
          <div className="stat-value">{state.starredVocab.length}</div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Starred Vocabularies */}
        <div className="content-card">
          <div className="card-title">
            <i className="fa-solid fa-star"></i>
            <span>Starred Vocabulary Vault</span>
          </div>

          {starredItems.length === 0 ? (
            <p style={{ color: "var(--text-muted)" }}>
              No vocabulary starred yet. Add stars inside the Dictionary tab!
            </p>
          ) : (
            <div className="vocab-list-container" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
              {starredItems.map((item: any) => (
                <div
                  key={item.word}
                  style={{
                    padding: "14px 16px",
                    background: "var(--panel-active)",
                    borderRadius: "var(--border-radius-md)",
                    border: "1px solid var(--card-border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-main)" }}>
                      {item.word} <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>({item.reading})</span>
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "2px" }}>
                      {item.english}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <button
                      className="speak-btn"
                      onClick={() => speakJapanese(item.word)}
                      style={{ background: "var(--panel-hover)", border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", color: "var(--accent)" }}
                    >
                      <i className="fa-solid fa-volume-high"></i>
                    </button>
                    <button
                      onClick={() => toggleStarVocab(item.word)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#f59e0b", fontSize: "1.1rem" }}
                    >
                      <i className="fa-solid fa-star"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Shortcuts Panel */}
        <div>
          <N5DeadlineCard />

          <div className="content-card">
            <div className="card-title">
              <i className="fa-solid fa-bolt"></i>
              <span>Quick Modules</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <button
                className="btn-utility"
                style={{ width: "100%", justifyContent: "flex-start" }}
                onClick={() => setActiveView("kana-trainer")}
              >
                <i className="fa-solid fa-graduation-cap"></i>
                <span>Launch Kana Trainer</span>
              </button>
              <button
                className="btn-utility"
                style={{ width: "100%", justifyContent: "flex-start" }}
                onClick={() => setActiveView("dictionary")}
              >
                <i className="fa-solid fa-book-open"></i>
                <span>Dictionary Conjugator</span>
              </button>
              <button
                className="btn-utility"
                style={{ width: "100%", justifyContent: "flex-start" }}
                onClick={() => setActiveView("kanji-board")}
              >
                <i className="fa-solid fa-brush"></i>
                <span>Kanji Practice Board</span>
              </button>
              <button
                className="btn-utility"
                style={{ width: "100%", justifyContent: "flex-start" }}
                onClick={() => setActiveView("quiz")}
              >
                <i className="fa-solid fa-gamepad"></i>
                <span>Start Multiple Choice Quiz</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
