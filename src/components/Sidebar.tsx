"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";

export function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const { state, setActiveView, setStudyMode, setCyberTheme, setUserRole } = useApp();

  const isAdmin = state.userRole === "admin";
  const isTeacher = state.userRole === "teacher";
  const isStudentView = !isAdmin && !isTeacher;

  return (
    <aside id="sidebar" className={isOpen ? "open" : ""}>
      <div>
        <div className="logo-container">
          <h1>
            禅郷 <span style={{ fontWeight: 300, fontSize: "1.6rem", color: "var(--accent-secondary)" }}>ZENGO</span>
          </h1>
          <div className="logo-sub">Woxsen Japanese Centre</div>
        </div>

        {/* USER ROLE SWITCHER */}
        <div style={{ marginBottom: "25px", padding: "0 5px" }}>
          <div className="mode-control-label">User Portal</div>
          <select
            className="search-input"
            id="user-role-select"
            value={state.userRole}
            onChange={(e) => setUserRole(e.target.value as any)}
            style={{
              padding: "10px",
              fontSize: "0.9rem",
              fontWeight: 600,
              width: "100%",
              marginTop: "6px",
              background: "var(--panel-active)",
              border: "1px solid var(--card-border)",
              color: "var(--text-main)",
              borderRadius: "var(--border-radius-sm)"
            }}
          >
            <option value="external">External Student (Zengo)</option>
            <option value="woxsen-student">Woxsen Student</option>
            <option value="teacher">WJC Instructor (Teacher)</option>
            <option value="admin">⚡ Super Admin Portal</option>
          </select>
        </div>

        <nav className="nav-links" id="sidebar-nav-container">
          {/* Main Dashboard Link */}
          <button
            className={`nav-item ${state.activeView === "dashboard" ? "active" : ""}`}
            onClick={() => {
              setActiveView("dashboard");
              onClose?.();
            }}
          >
            <i className={`fa-solid ${isAdmin ? "fa-sliders" : "fa-house-chimney"}`}></i>
            <span>{isAdmin ? "Admin Management" : isTeacher ? "Faculty Portal" : "Dashboard"}</span>
          </button>

          {/* Student Learning Links - Hidden for Admin & Teacher */}
          {isStudentView && (
            <>
              <button
                className={`nav-item ${state.activeView === "n5-roadmap" ? "active" : ""}`}
                onClick={() => {
                  setActiveView("n5-roadmap");
                  onClose?.();
                }}
              >
                <i className="fa-regular fa-calendar-check"></i>
                <span>N5 Goal & Roadmap</span>
              </button>

              <button
                className={`nav-item ${state.activeView === "kana-trainer" ? "active" : ""}`}
                onClick={() => {
                  setActiveView("kana-trainer");
                  onClose?.();
                }}
              >
                <i className="fa-solid fa-graduation-cap"></i>
                <span>Kana Trainer</span>
              </button>

              <button
                className={`nav-item ${state.activeView === "dictionary" ? "active" : ""}`}
                onClick={() => {
                  setActiveView("dictionary");
                  onClose?.();
                }}
              >
                <i className="fa-solid fa-book-open"></i>
                <span>Dictionary & Conjugator</span>
              </button>

              <button
                className={`nav-item ${state.activeView === "kanji-board" ? "active" : ""}`}
                onClick={() => {
                  setActiveView("kanji-board");
                  onClose?.();
                }}
              >
                <i className="fa-solid fa-brush"></i>
                <span>Kanji Board</span>
              </button>

              <button
                className={`nav-item ${state.activeView === "quiz" ? "active" : ""}`}
                onClick={() => {
                  setActiveView("quiz");
                  onClose?.();
                }}
              >
                <i className="fa-solid fa-gamepad"></i>
                <span>Kana Quiz</span>
              </button>

              <button
                className={`nav-item ${state.activeView === "kaiwa" ? "active" : ""}`}
                onClick={() => {
                  setActiveView("kaiwa");
                  onClose?.();
                }}
              >
                <i className="fa-solid fa-comments"></i>
                <span>Kaiwa Roleplay</span>
              </button>

              <button
                className={`nav-item ${state.activeView === "voice-coach" ? "active" : ""}`}
                onClick={() => {
                  setActiveView("voice-coach");
                  onClose?.();
                }}
              >
                <i className="fa-solid fa-microphone-lines"></i>
                <span>Voice Coach</span>
              </button>

              <button
                className={`nav-item ${state.activeView === "kanji-radicals" ? "active" : ""}`}
                onClick={() => {
                  setActiveView("kanji-radicals");
                  onClose?.();
                }}
              >
                <i className="fa-solid fa-puzzle-piece"></i>
                <span>Radical Puzzle</span>
              </button>
            </>
          )}

          {/* Teacher links */}
          {isTeacher && (
            <button
              className={`nav-item ${state.activeView === "dictionary" ? "active" : ""}`}
              onClick={() => {
                setActiveView("dictionary");
                onClose?.();
              }}
            >
              <i className="fa-solid fa-book-open"></i>
              <span>Dictionary Reference</span>
            </button>
          )}
        </nav>
      </div>

      {/* Mode & Theme Selection Panel */}
      <div className="sidebar-footer">
        <div className="controls-group">
          <div>
            <div className="mode-control-label">Study Mode</div>
            <div className="toggle-button-group" id="study-mode-toggle">
              <button
                className={`toggle-opt ${state.studyMode === "zen" ? "active" : ""}`}
                onClick={() => setStudyMode("zen")}
              >
                Zen
              </button>
              <button
                className={`toggle-opt ${state.studyMode === "cyber" ? "active" : ""}`}
                onClick={() => setStudyMode("cyber")}
              >
                Cyber
              </button>
            </div>
          </div>

          {state.studyMode === "cyber" && (
            <div id="cyber-theme-row">
              <div className="mode-control-label">Workspace theme</div>
              <div className="toggle-button-group" id="cyber-theme-toggle">
                <button
                  className={`toggle-opt ${state.cyberTheme === "dark" ? "active" : ""}`}
                  onClick={() => setCyberTheme("dark")}
                >
                  Dark
                </button>
                <button
                  className={`toggle-opt ${state.cyberTheme === "light" ? "active" : ""}`}
                  onClick={() => setCyberTheme("light")}
                >
                  Light
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
