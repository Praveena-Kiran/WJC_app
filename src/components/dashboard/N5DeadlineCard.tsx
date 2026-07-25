"use client";

import React from "react";
import { useApp } from "@/context/AppContext";

export function N5DeadlineCard() {
  const { state, setActiveView, playSound } = useApp();

  // Target date math
  const target = new Date(state.n5TargetDate || Date.now());
  const now = new Date();
  const diffTime = target.getTime() - now.getTime();
  const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Progress metrics
  const solvedCount = state.solvedLessons?.length || 0;
  const kanaCount = state.masteredKana?.length || 0;
  const kanjiCount = state.practicedKanji?.length || 0;
  const starredVocabCount = state.starredVocab?.length || 0;

  // Overall readiness % (weighted: Kana 25%, Lessons 35%, Kanji 25%, Vocab/Practice 15%)
  const lessonPct = Math.min(100, (solvedCount / 10) * 100);
  const kanaPct = Math.min(100, (kanaCount / 92) * 100);
  const kanjiPct = Math.min(100, (kanjiCount / 100) * 100);
  const overallPct = Math.round(lessonPct * 0.35 + kanaPct * 0.25 + kanjiPct * 0.25 + (starredVocabCount > 0 ? 15 : 5));

  // Status badge
  let statusLabel = "On Track 🟢";
  let statusBg = "rgba(16, 185, 129, 0.15)";
  let statusColor = "var(--accent-success, #10b981)";

  if (overallPct < 25 && daysLeft < 15) {
    statusLabel = "Pace Boost Needed ⚡";
    statusBg = "rgba(239, 68, 68, 0.15)";
    statusColor = "#ef4444";
  } else if (overallPct >= 80) {
    statusLabel = "Exam Ready 🎉";
    statusBg = "rgba(92, 96, 245, 0.15)";
    statusColor = "var(--accent)";
  }

  return (
    <div className="content-card" style={{ borderLeft: "4px solid var(--accent)" }}>
      <div className="card-title" style={{ justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <i className="fa-regular fa-calendar-check" style={{ color: "var(--accent)" }}></i>
          <span>N5 Exam Deadline Target</span>
        </div>
        <span
          style={{
            padding: "4px 10px",
            borderRadius: "20px",
            fontSize: "0.78rem",
            fontWeight: 700,
            background: statusBg,
            color: statusColor
          }}
        >
          {statusLabel}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: "10px", margin: "10px 0" }}>
        <span style={{ fontSize: "2.4rem", fontWeight: 700, color: "var(--accent)" }}>
          {daysLeft}
        </span>
        <span style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-muted)" }}>
          Days Remaining
        </span>
      </div>

      {/* Readiness Progress Bar */}
      <div style={{ marginBottom: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", fontWeight: 600, marginBottom: "6px" }}>
          <span style={{ color: "var(--text-main)" }}>Overall N5 Readiness</span>
          <span style={{ color: "var(--accent)" }}>{overallPct}%</span>
        </div>
        <div style={{ height: "8px", background: "var(--panel-active)", borderRadius: "10px", overflow: "hidden" }}>
          <div
            style={{
              width: `${overallPct}%`,
              height: "100%",
              background: "linear-gradient(90deg, var(--accent), var(--accent-secondary))",
              borderRadius: "10px",
              transition: "width 0.4s ease"
            }}
          ></div>
        </div>
      </div>

      {/* Mini Roadmap Quick Info */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "6px", background: "var(--panel-active)", padding: "10px 6px", borderRadius: "var(--border-radius-md)", fontSize: "0.75rem", textAlign: "center", marginBottom: "14px" }}>
        <div>
          <div style={{ color: "var(--text-muted)" }}>Kana</div>
          <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{kanaCount}/92</div>
        </div>
        <div>
          <div style={{ color: "var(--text-muted)" }}>Lessons</div>
          <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{solvedCount}/10</div>
        </div>
        <div>
          <div style={{ color: "var(--text-muted)" }}>Kanji</div>
          <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{kanjiCount}/100</div>
        </div>
        <div>
          <div style={{ color: "var(--text-muted)" }}>Vocab</div>
          <div style={{ fontWeight: 700, color: "var(--text-main)" }}>~800 Target</div>
        </div>
      </div>

      <button
        className="btn-utility"
        onClick={() => {
          playSound("click");
          setActiveView("n5-roadmap");
        }}
        style={{ width: "100%", justifyContent: "center", fontWeight: 700, backgroundColor: "var(--panel-active)" }}
      >
        View N5 Roadmap & Plan <i className="fa-solid fa-arrow-right" style={{ marginLeft: "4px" }}></i>
      </button>
    </div>
  );
}
