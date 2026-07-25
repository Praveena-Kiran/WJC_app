"use client";

import React from "react";
import { useApp } from "@/context/AppContext";

export function WoxsenStudentDashboard() {
  const { state } = useApp();

  const studentName = state.activeStudentName;
  const dates = Object.keys(state.attendanceDb).sort();
  let attendedCount = 0;
  let totalCount = dates.length;

  dates.forEach((date) => {
    if (state.attendanceDb[date]?.[studentName] === "present") {
      attendedCount++;
    }
  });

  const attendancePct = totalCount > 0 ? Math.round((attendedCount / totalCount) * 100) : 100;

  return (
    <section id="woxsen-student-dashboard-view" className="view-section active">
      <div className="header-row">
        <div className="welcome-msg">
          <h2>こんにちわ, Woxsen Student ({studentName})</h2>
          <p>Welcome to the Woxsen Japanese Centre (WJC) Student Portal. Track your grades and classes.</p>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="stats-row">
        <div className="stat-item-card">
          <div className="stat-label">Your Attendance</div>
          <div className="stat-value">{attendancePct}%</div>
        </div>
        <div className="stat-item-card">
          <div className="stat-label">Classes Attended</div>
          <div className="stat-value">
            {attendedCount}/{totalCount}
          </div>
        </div>
        <div className="stat-item-card">
          <div className="stat-label">Course Documents</div>
          <div className="stat-value">{state.uploadedFiles.length}</div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Calendar History Card */}
        <div className="content-card">
          <div className="card-title">
            <i className="fa-solid fa-calendar-days"></i>
            <span>Attendance History</span>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "15px" }}>
            Visual summary of dates marked by WJC instructors.
          </p>
          <div className="calendar-list" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {dates.length === 0 ? (
              <p style={{ color: "var(--text-muted)" }}>No attendance records found.</p>
            ) : (
              dates.map((date) => {
                const status = state.attendanceDb[date]?.[studentName] || "absent";
                const isPresent = status === "present";
                return (
                  <div
                    key={date}
                    style={{
                      padding: "12px 16px",
                      background: "var(--panel-active)",
                      borderRadius: "var(--border-radius-md)",
                      border: "1px solid var(--card-border)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>{date}</span>
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        backgroundColor: isPresent ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                        color: isPresent ? "var(--accent-success, #10b981)" : "#ef4444"
                      }}
                    >
                      {isPresent ? "Present ✓" : "Absent ✗"}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Classroom Download Resource File List */}
        <div className="content-card">
          <div className="card-title">
            <i className="fa-solid fa-folder-open"></i>
            <span>Course Vault Downloads</span>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "15px" }}>
            Download curriculum guides, homework PDFs and slides uploaded by your teacher.
          </p>
          {state.uploadedFiles.length === 0 ? (
            <div style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
              No files uploaded by instructor yet.
            </div>
          ) : (
            <div className="classroom-files-list" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {state.uploadedFiles.map((file, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "12px 16px",
                    background: "var(--panel-active)",
                    borderRadius: "var(--border-radius-md)",
                    border: "1px solid var(--card-border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <i className="fa-solid fa-file-pdf" style={{ fontSize: "1.5rem", color: "var(--accent)" }}></i>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.92rem", color: "var(--text-main)" }}>
                        {file.name}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                        {file.size} • {file.date}
                      </div>
                    </div>
                  </div>
                  <button
                    className="btn-utility"
                    onClick={() => alert(`Simulated download for: ${file.name}`)}
                    style={{ padding: "6px 12px", fontSize: "0.8rem" }}
                  >
                    <i className="fa-solid fa-download"></i> Download
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Official Course Announcements Banner */}
        <div className="content-card" style={{ gridColumn: "1 / -1" }}>
          <div className="card-title">
            <i className="fa-solid fa-bullhorn" style={{ color: "var(--accent)" }}></i>
            <span>Official WJC Announcements</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "12px", marginTop: "10px" }}>
            {state.announcements.map((ann) => (
              <div
                key={ann.id}
                style={{
                  padding: "14px 18px",
                  background: "var(--panel-active)",
                  borderRadius: "var(--border-radius-md)",
                  border: "1px solid var(--card-border)",
                  borderLeft: "4px solid var(--accent)"
                }}
              >
                <div style={{ fontWeight: 700, fontSize: "0.98rem", color: "var(--text-main)", marginBottom: "4px" }}>
                  {ann.title}
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "8px" }}>
                  {ann.content}
                </div>
                <div style={{ fontSize: "0.76rem", color: "var(--accent)", fontWeight: 600 }}>
                  📢 {ann.author} • {ann.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
