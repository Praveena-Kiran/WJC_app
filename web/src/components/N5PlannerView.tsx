"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { lessons, kanaData, kanjiData } from "@/lib/data";

export function N5PlannerView() {
  const { state, setActiveView, setN5TargetDate, toggleDailyTask, openOnboardingModal, playSound } = useApp();
  const [customDateInput, setCustomDateInput] = useState(state.n5TargetDate || "");

  // Date math
  const target = new Date(state.n5TargetDate || Date.now());
  const now = new Date();
  const diffTime = target.getTime() - now.getTime();
  const daysRemaining = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Progress metrics
  const solvedCount = state.solvedLessons?.length || 0;
  const kanaCount = state.masteredKana?.length || 0;
  const kanjiCount = state.practicedKanji?.length || 0;

  const remainingKana = Math.max(0, 92 - kanaCount);
  const remainingKanji = Math.max(0, 100 - kanjiCount);
  const remainingLessons = Math.max(0, 10 - solvedCount);

  // Daily pace targets (Official JLPT N5: 92 Kana, 100 Kanji, 800 Vocab Words)
  const dailyKanaTarget = remainingKana > 0 ? Math.ceil(remainingKana / daysRemaining) : 0;
  const dailyKanjiTarget = remainingKanji > 0 ? Math.ceil(remainingKanji / daysRemaining) : 0;
  const dailyVocabTarget = Math.ceil(800 / daysRemaining);
  const weeksRemaining = Math.max(1, daysRemaining / 7);
  const weeklyLessonTarget = remainingLessons > 0 ? (remainingLessons / weeksRemaining).toFixed(1) : 0;

  // Preset deadline buttons
  const handlePresetDays = (days: number) => {
    const future = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    const isoDate = future.toISOString().split("T")[0];
    setCustomDateInput(isoDate);
    setN5TargetDate(isoDate);
  };

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomDateInput(val);
    if (val) setN5TargetDate(val);
  };

  // Phase statuses
  const phase1Complete = kanaCount >= 80;
  const phase2Complete = solvedCount >= 5;
  const phase3Complete = solvedCount >= 10 && kanjiCount >= 40;

  // Today's checklist items
  const dailyChecklist = [
    { id: "task-kana", label: `Study ${dailyKanaTarget || 5} Kana cards on Kana Trainer`, view: "kana-trainer" },
    { id: "task-kanji", label: `Trace ${dailyKanjiTarget || 2} Kanji characters on Kanji Board`, view: "kanji-board" },
    { id: "task-lesson", label: `Complete Step L${state.activeLessonId} in Stepping Stones Curriculum`, view: "dashboard" },
    { id: "task-srs", label: "Spend 10 minutes reviewing SRS Flashcards deck", view: "kana-trainer" },
    { id: "task-quiz", label: "Take 1 N5 Multiple Choice Practice Quiz", view: "quiz" }
  ];

  return (
    <section id="n5-planner-view" className="view-section active">
      <div className="header-row">
        <div className="welcome-msg">
          <h2>{state.targetJlptLevel || "N5"} Deadline & Step-by-Step Learning Roadmap</h2>
          <p>Set your target completion date. Follow our structured 4-phase beginner roadmap to hit your {state.targetJlptLevel || "N5"} goal on schedule.</p>
        </div>
        <button
          className="btn-utility"
          onClick={() => openOnboardingModal()}
          style={{ fontWeight: 700, padding: "8px 16px", background: "var(--panel-active)" }}
        >
          <i className="fa-solid fa-sliders" style={{ marginRight: "6px" }}></i> Re-configure Target Goal
        </button>
      </div>

      {/* 1. Target Deadline Control Banner */}
      <div className="content-card" style={{ marginBottom: "25px", background: "linear-gradient(135deg, var(--card-bg), var(--panel-active))", borderLeft: "5px solid var(--accent)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
          <div>
            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "1px" }}>
              Exam / Study Deadline Target
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-main)", marginTop: "4px" }}>
              {daysRemaining} Days Remaining
            </div>
            <div style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginTop: "2px" }}>
              Target Date: <strong>{state.n5TargetDate}</strong>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "240px" }}>
            <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-muted)" }}>
              Change Target Date:
            </label>
            <input
              type="date"
              className="search-input"
              value={customDateInput}
              onChange={handleDateInputChange}
              style={{ padding: "8px 12px" }}
            />
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              <button className="btn-utility" onClick={() => handlePresetDays(14)} style={{ padding: "4px 8px", fontSize: "0.75rem" }}>14 Days</button>
              <button className="btn-utility" onClick={() => handlePresetDays(30)} style={{ padding: "4px 8px", fontSize: "0.75rem" }}>30 Days</button>
              <button className="btn-utility" onClick={() => handlePresetDays(60)} style={{ padding: "4px 8px", fontSize: "0.75rem" }}>60 Days</button>
              <button className="btn-utility" onClick={() => handlePresetDays(90)} style={{ padding: "4px 8px", fontSize: "0.75rem" }}>90 Days</button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Calculated Daily Pace Targets */}
      <div className="stats-row" style={{ marginBottom: "25px" }}>
        <div className="stat-item-card">
          <div className="stat-label">Daily Kana Goal</div>
          <div className="stat-value" style={{ color: "var(--accent)" }}>{dailyKanaTarget} / day</div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>
            {remainingKana} kana left to master
          </div>
        </div>
        <div className="stat-item-card">
          <div className="stat-label">Daily Kanji Goal</div>
          <div className="stat-value" style={{ color: "var(--accent-secondary)" }}>{dailyKanjiTarget} / day</div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>
            {remainingKanji} kanji left (100 target)
          </div>
        </div>
        <div className="stat-item-card">
          <div className="stat-label">Daily Vocab Goal</div>
          <div className="stat-value" style={{ color: "#f59e0b" }}>{dailyVocabTarget} / day</div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>
            800 N5 vocab target
          </div>
        </div>
        <div className="stat-item-card">
          <div className="stat-label">Weekly Lessons Pace</div>
          <div className="stat-value" style={{ color: "var(--accent-success, #10b981)" }}>{weeklyLessonTarget} / week</div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>
            {remainingLessons} lessons left to finish
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Left Column: 4-Phase Beginner Roadmap */}
        <div className="content-card">
          <div className="card-title">
            <i className="fa-solid fa-map-location-dot"></i>
            <span>4-Phase N5 Beginner Roadmap</span>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "20px" }}>
            Step-by-step curriculum path from complete beginner to JLPT N5 mastery.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Phase 1 */}
            <div style={{ padding: "16px", borderRadius: "var(--border-radius-md)", background: "var(--panel-active)", borderLeft: `5px solid ${phase1Complete ? "var(--accent-success, #10b981)" : "var(--accent)"}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", color: "var(--accent)" }}>Phase 1 • Days 1–7</span>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: phase1Complete ? "var(--accent-success, #10b981)" : "var(--text-muted)" }}>
                  {phase1Complete ? "Completed ✓" : `${kanaCount}/92 Mastered`}
                </span>
              </div>
              <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-main)" }}>Foundations: Hiragana & Katakana</h4>
              <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", margin: "6px 0 12px 0", lineHeight: 1.4 }}>
                Learn all 46 Hiragana and 46 Katakana characters along with romaji guide pronunciation and stroke order.
              </p>
              <button
                className="btn-utility"
                onClick={() => {
                  playSound("click");
                  setActiveView("kana-trainer");
                }}
                style={{ fontSize: "0.82rem", padding: "6px 14px" }}
              >
                Go to Kana Trainer <i className="fa-solid fa-arrow-right" style={{ marginLeft: "4px" }}></i>
              </button>
            </div>

            {/* Phase 2 */}
            <div style={{ padding: "16px", borderRadius: "var(--border-radius-md)", background: "var(--panel-active)", borderLeft: `5px solid ${phase2Complete ? "var(--accent-success, #10b981)" : "var(--accent-secondary)"}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", color: "var(--accent-secondary)" }}>Phase 2 • Days 8–18</span>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: phase2Complete ? "var(--accent-success, #10b981)" : "var(--text-muted)" }}>
                  {phase2Complete ? "Completed ✓" : `Lessons 1–5 (${Math.min(5, solvedCount)}/5)`}
                </span>
              </div>
              <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-main)" }}>Core Grammar & Vocabulary (Lessons 1–5)</h4>
              <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", margin: "6px 0 12px 0", lineHeight: 1.4 }}>
                Master basic self-introductions, objects, locations, time, days of the week, and travel verbs.
              </p>
              <button
                className="btn-utility"
                onClick={() => {
                  playSound("click");
                  setActiveView("dashboard");
                }}
                style={{ fontSize: "0.82rem", padding: "6px 14px" }}
              >
                Open Stepping Stones Curriculum <i className="fa-solid fa-arrow-right" style={{ marginLeft: "4px" }}></i>
              </button>
            </div>

            {/* Phase 3 */}
            <div style={{ padding: "16px", borderRadius: "var(--border-radius-md)", background: "var(--panel-active)", borderLeft: `5px solid ${phase3Complete ? "var(--accent-success, #10b981)" : "var(--accent-hover)"}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", color: "var(--accent)" }}>Phase 3 • Days 19–27</span>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: phase3Complete ? "var(--accent-success, #10b981)" : "var(--text-muted)" }}>
                  {phase3Complete ? "Completed ✓" : `Lessons 6–10 & 100 Kanji (${kanjiCount}/100)`}
                </span>
              </div>
              <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-main)" }}>Action Verbs, Adjectives & 100 N5 Kanji</h4>
              <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", margin: "6px 0 12px 0", lineHeight: 1.4 }}>
                Learn transitive verbs, i-adjectives, na-adjectives, likes/dislikes, and 100 essential N5 Kanji characters on the tracing board.
              </p>
              <button
                className="btn-utility"
                onClick={() => {
                  playSound("click");
                  setActiveView("kanji-board");
                }}
                style={{ fontSize: "0.82rem", padding: "6px 14px" }}
              >
                Launch Kanji Practice Board <i className="fa-solid fa-arrow-right" style={{ marginLeft: "4px" }}></i>
              </button>
            </div>

            {/* Phase 4 */}
            <div style={{ padding: "16px", borderRadius: "var(--border-radius-md)", background: "var(--panel-active)", borderLeft: "5px solid var(--accent-success, #10b981)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", color: "var(--accent-success, #10b981)" }}>Phase 4 • Final Review</span>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--accent-success, #10b981)" }}>Practice Active</span>
              </div>
              <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-main)" }}>Speed Drills, SRS & Verb Conjugation</h4>
              <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", margin: "6px 0 12px 0", lineHeight: 1.4 }}>
                Solidify your memory with spaced-repetition flashcards, live verb conjugations, and multiple choice exam quizzes.
              </p>
              <button
                className="btn-utility"
                onClick={() => {
                  playSound("click");
                  setActiveView("quiz");
                }}
                style={{ fontSize: "0.82rem", padding: "6px 14px" }}
              >
                Start Practice Quiz <i className="fa-solid fa-arrow-right" style={{ marginLeft: "4px" }}></i>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Today's Customized Study Checklist */}
        <div>
          <div className="content-card">
            <div className="card-title">
              <i className="fa-solid fa-square-check"></i>
              <span>Today's Recommended Tasks</span>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.86rem", marginBottom: "15px" }}>
              Daily habits designed to keep you on schedule for your target date.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {dailyChecklist.map((task) => {
                const isChecked = state.dailyTasksCompleted?.includes(task.id);
                return (
                  <div
                    key={task.id}
                    onClick={() => toggleDailyTask(task.id)}
                    style={{
                      padding: "12px 14px",
                      borderRadius: "var(--border-radius-md)",
                      background: "var(--panel-active)",
                      border: "1px solid var(--card-border)",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      opacity: isChecked ? 0.65 : 1
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked || false}
                      onChange={() => {}}
                      style={{ width: "18px", height: "18px", accentColor: "var(--accent)", cursor: "pointer" }}
                    />
                    <span style={{ flex: 1, fontSize: "0.88rem", fontWeight: 600, color: "var(--text-main)", textDecoration: isChecked ? "line-through" : "none" }}>
                      {task.label}
                    </span>
                    <button
                      className="btn-utility"
                      onClick={(e) => {
                        e.stopPropagation();
                        playSound("click");
                        setActiveView(task.view);
                      }}
                      style={{ padding: "4px 8px", fontSize: "0.72rem" }}
                    >
                      Go →
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Official JLPT Level Benchmark Reference Guide */}
          <div className="content-card" style={{ marginTop: "20px" }}>
            <div className="card-title">
              <i className="fa-solid fa-layer-group"></i>
              <span>Official JLPT Level Standards</span>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginBottom: "12px" }}>
              Japan Foundation proficiency standards (N5 to N1):
            </p>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", fontSize: "0.8rem", borderCollapse: "collapse", color: "var(--text-main)" }}>
                <thead>
                  <tr style={{ background: "var(--panel-active)", textTransform: "uppercase", fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    <th style={{ padding: "8px", textAlign: "left" }}>Level</th>
                    <th style={{ padding: "8px", textAlign: "center" }}>Kanji</th>
                    <th style={{ padding: "8px", textAlign: "center" }}>Vocab</th>
                    <th style={{ padding: "8px", textAlign: "left" }}>Target Ability</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: "1px solid var(--card-border)", background: "rgba(34, 102, 76, 0.08)", fontWeight: 700 }}>
                    <td style={{ padding: "8px", color: "var(--accent)" }}>N5 (Active Goal)</td>
                    <td style={{ padding: "8px", textAlign: "center" }}>~100</td>
                    <td style={{ padding: "8px", textAlign: "center" }}>~800</td>
                    <td style={{ padding: "8px" }}>Basic classroom Japanese, slow daily talk</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
                    <td style={{ padding: "8px", fontWeight: 600 }}>N4 (Elementary)</td>
                    <td style={{ padding: "8px", textAlign: "center" }}>~300</td>
                    <td style={{ padding: "8px", textAlign: "center" }}>~1,500</td>
                    <td style={{ padding: "8px", color: "var(--text-muted)" }}>Foundational daily life conversations</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
                    <td style={{ padding: "8px", fontWeight: 600 }}>N3 (Intermediate)</td>
                    <td style={{ padding: "8px", textAlign: "center" }}>~650</td>
                    <td style={{ padding: "8px", textAlign: "center" }}>~3,700</td>
                    <td style={{ padding: "8px", color: "var(--text-muted)" }}>Everyday texts & near-normal speech</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
                    <td style={{ padding: "8px", fontWeight: 600 }}>N2 (Pre-Advanced)</td>
                    <td style={{ padding: "8px", textAlign: "center" }}>~1,000</td>
                    <td style={{ padding: "8px", textAlign: "center" }}>~6,000</td>
                    <td style={{ padding: "8px", color: "var(--text-muted)" }}>Comprehend newspapers, magazines & fluent speech</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "8px", fontWeight: 600 }}>N1 (Advanced)</td>
                    <td style={{ padding: "8px", textAlign: "center" }}>~2,000</td>
                    <td style={{ padding: "8px", textAlign: "center" }}>~10,000</td>
                    <td style={{ padding: "8px", color: "var(--text-muted)" }}>Complex, abstract & highly formal Japanese</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
