"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";

export function OnboardingModal() {
  const { state, completeOnboarding, closeOnboardingModal, playSound } = useApp();

  const [step, setStep] = useState(1);
  const [name, setName] = useState(state.activeStudentName || "Learner");
  const [role, setRole] = useState<"external" | "woxsen-student" | "teacher" | "admin">(state.userRole || "external");
  const [level, setLevel] = useState<"N5" | "N4" | "N3" | "N2" | "N1">(state.targetJlptLevel || "N5");
  
  const defaultDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const [targetDate, setTargetDate] = useState(state.n5TargetDate || defaultDate);

  if (!state.showOnboardingModal) return null;

  // Date math for preview
  const target = new Date(targetDate);
  const now = new Date();
  const diffTime = target.getTime() - now.getTime();
  const daysRemaining = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const dailyKanaTarget = Math.ceil(92 / daysRemaining);
  const dailyKanjiTarget = Math.ceil(100 / daysRemaining);
  const dailyVocabTarget = Math.ceil(800 / daysRemaining);

  const handlePresetDays = (days: number) => {
    playSound("click");
    const future = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    setTargetDate(future.toISOString().split("T")[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    completeOnboarding({ name, role, targetDate, level });
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        background: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
      }}
    >
      <div
        className="content-card"
        style={{
          width: "100%",
          maxWidth: "580px",
          background: "var(--card-bg)",
          border: "2px solid var(--accent)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.4)",
          borderRadius: "var(--border-radius-lg)",
          position: "relative",
          animation: "modalFadeIn 0.3s ease"
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "1px" }}>
              Welcome to Zengo • Step {step} of 3
            </span>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-main)", marginTop: "2px" }}>
              Personalize Your Study Journey
            </h2>
          </div>
          {state.hasCompletedOnboarding && (
            <button
              onClick={() => closeOnboardingModal()}
              style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "1.2rem", cursor: "pointer" }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>

        {/* Step Indicators */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "25px" }}>
          <div style={{ flex: 1, height: "4px", background: step >= 1 ? "var(--accent)" : "var(--panel-active)", borderRadius: "4px" }}></div>
          <div style={{ flex: 1, height: "4px", background: step >= 2 ? "var(--accent)" : "var(--panel-active)", borderRadius: "4px" }}></div>
          <div style={{ flex: 1, height: "4px", background: step >= 3 ? "var(--accent)" : "var(--panel-active)", borderRadius: "4px" }}></div>
        </div>

        {/* STEP 1: Profile & Portal */}
        {step === 1 && (
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "12px" }}>
              1. What is your name & portal role?
            </h3>
            <p style={{ fontSize: "0.86rem", color: "var(--text-muted)", marginBottom: "20px" }}>
              Tell us your name so we can customize your streak badges and course achievements.
            </p>

            <div style={{ marginBottom: "18px" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>
                Your Name
              </label>
              <input
                type="text"
                className="search-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name..."
                style={{ width: "100%", padding: "12px 14px", fontSize: "0.95rem" }}
              />
            </div>

            <div style={{ marginBottom: "25px" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>
                Select User Portal
              </label>
              <select
                className="search-input"
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                style={{ width: "100%", padding: "12px 14px", fontSize: "0.95rem" }}
              >
                <option value="external">External Student (Zengo Suite)</option>
                <option value="woxsen-student">Woxsen University Student</option>
                <option value="teacher">WJC Instructor / Faculty</option>
                <option value="admin">⚡ Super Admin Portal</option>
              </select>
            </div>

            <button
              className="btn-action"
              onClick={() => {
                playSound("click");
                setStep(2);
              }}
              style={{ width: "100%", justifyContent: "center", padding: "12px" }}
            >
              Next: Select JLPT Level Goal <i className="fa-solid fa-arrow-right" style={{ marginLeft: "6px" }}></i>
            </button>
          </div>
        )}

        {/* STEP 2: Target JLPT Level */}
        {step === 2 && (
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "8px" }}>
              2. What is your Target JLPT Goal Level?
            </h3>
            <p style={{ fontSize: "0.86rem", color: "var(--text-muted)", marginBottom: "18px" }}>
              Select the proficiency level you are working towards:
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "280px", overflowY: "auto", marginBottom: "20px", paddingRight: "4px" }}>
              {[
                { id: "N5", name: "N5 Beginner (Recommended)", kanji: "100 Kanji", vocab: "800 Words", desc: "Basic classroom Japanese & slow daily talk" },
                { id: "N4", name: "N4 Elementary", kanji: "300 Kanji", vocab: "1,500 Words", desc: "Foundational daily life conversations" },
                { id: "N3", name: "N3 Intermediate", kanji: "650 Kanji", vocab: "3,700 Words", desc: "Everyday texts & near-normal speech" },
                { id: "N2", name: "N2 Pre-Advanced", kanji: "1,000 Kanji", vocab: "6,000 Words", desc: "Comprehend newspapers, magazines & fluent speech" },
                { id: "N1", name: "N1 Advanced", kanji: "2,000 Kanji", vocab: "10,000 Words", desc: "Complex, abstract & formal Japanese" }
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    playSound("click");
                    setLevel(item.id as any);
                  }}
                  style={{
                    padding: "14px",
                    borderRadius: "var(--border-radius-md)",
                    background: level === item.id ? "rgba(34, 102, 76, 0.12)" : "var(--panel-active)",
                    border: level === item.id ? "2px solid var(--accent)" : "1px solid var(--card-border)",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem", color: level === item.id ? "var(--accent)" : "var(--text-main)" }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
                      {item.desc}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", fontSize: "0.75rem", fontWeight: 700, color: "var(--accent-secondary)" }}>
                    <div>{item.kanji}</div>
                    <div>{item.vocab}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className="btn-utility"
                onClick={() => setStep(1)}
                style={{ flex: 1, justifyContent: "center" }}
              >
                Back
              </button>
              <button
                className="btn-action"
                onClick={() => {
                  playSound("click");
                  setStep(3);
                }}
                style={{ flex: 2, justifyContent: "center", padding: "12px" }}
              >
                Next: Set Exam Target Date <i className="fa-solid fa-arrow-right" style={{ marginLeft: "6px" }}></i>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Exam Target Date & Calculated Pace */}
        {step === 3 && (
          <form onSubmit={handleSubmit}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "8px" }}>
              3. When is your Target Study / Exam Date?
            </h3>
            <p style={{ fontSize: "0.86rem", color: "var(--text-muted)", marginBottom: "18px" }}>
              Select how many days you have until your exam or target completion date:
            </p>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "18px" }}>
              <button type="button" className="btn-utility" onClick={() => handlePresetDays(14)}>14 Days</button>
              <button type="button" className="btn-utility" onClick={() => handlePresetDays(30)}>30 Days</button>
              <button type="button" className="btn-utility" onClick={() => handlePresetDays(60)}>60 Days</button>
              <button type="button" className="btn-utility" onClick={() => handlePresetDays(90)}>90 Days</button>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>
                Or Pick Custom Target Date:
              </label>
              <input
                type="date"
                className="search-input"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                style={{ width: "100%", padding: "12px 14px", fontSize: "0.95rem" }}
              />
            </div>

            {/* Daily Pace Calculation Preview */}
            <div style={{ background: "var(--panel-active)", padding: "14px", borderRadius: "var(--border-radius-md)", border: "1px solid var(--card-border)", marginBottom: "25px" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", marginBottom: "8px" }}>
                Your Dynamic Daily Pace ({daysRemaining} Days Remaining)
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", textAlign: "center", fontSize: "0.82rem" }}>
                <div>
                  <div style={{ color: "var(--text-muted)" }}>Kana</div>
                  <div style={{ fontWeight: 700, color: "var(--text-main)", fontSize: "1.1rem" }}>{dailyKanaTarget}/day</div>
                </div>
                <div>
                  <div style={{ color: "var(--text-muted)" }}>Kanji</div>
                  <div style={{ fontWeight: 700, color: "var(--text-main)", fontSize: "1.1rem" }}>{dailyKanjiTarget}/day</div>
                </div>
                <div>
                  <div style={{ color: "var(--text-muted)" }}>Vocab</div>
                  <div style={{ fontWeight: 700, color: "var(--text-main)", fontSize: "1.1rem" }}>{dailyVocabTarget}/day</div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                className="btn-utility"
                onClick={() => setStep(2)}
                style={{ flex: 1, justifyContent: "center" }}
              >
                Back
              </button>
              <button
                type="submit"
                className="btn-action"
                style={{ flex: 2, justifyContent: "center", padding: "12px", background: "linear-gradient(135deg, var(--accent), var(--accent-secondary))" }}
              >
                Launch My Personalized Plan 🚀
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
