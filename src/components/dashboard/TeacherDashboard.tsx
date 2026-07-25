"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";

const ROSTER_STUDENTS = [
  "Sneha Reddy",
  "Rohan Sharma",
  "Arjun Verma",
  "Pooja Patel",
  "Vince Carter"
];

export function TeacherDashboard() {
  const { state, saveAttendanceRecord, addUploadedFile, deleteUploadedFile, playSound } = useApp();
  const [selectedDate, setSelectedDate] = useState<string>("2026-07-21");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [s3Status, setS3Status] = useState<{ configured: boolean; message: string }>({
    configured: false,
    message: "Checking S3 status..."
  });

  const [attendanceMap, setAttendanceMap] = useState<Record<string, "present" | "absent">>(() => {
    return {
      "Sneha Reddy": "present",
      "Rohan Sharma": "present",
      "Arjun Verma": "present",
      "Pooja Patel": "present",
      "Vince Carter": "present"
    };
  });

  useEffect(() => {
    // Check AWS S3 storage status
    fetch("/api/upload")
      .then((res) => res.json())
      .then((data) => {
        setS3Status({
          configured: data.s3Configured,
          message: data.message
        });
      })
      .catch(() => {
        setS3Status({
          configured: false,
          message: "Operating in local storage mode."
        });
      });
  }, []);

  const handleDateChange = (dateStr: string) => {
    setSelectedDate(dateStr);
    const existing = state.attendanceDb[dateStr];
    if (existing) {
      setAttendanceMap(existing as Record<string, "present" | "absent">);
    } else {
      const defaultRecord: Record<string, "present" | "absent"> = {};
      ROSTER_STUDENTS.forEach((student) => {
        defaultRecord[student] = "present";
      });
      setAttendanceMap(defaultRecord);
    }
  };

  const toggleStudentStatus = (student: string) => {
    playSound("click");
    setAttendanceMap((prev) => ({
      ...prev,
      [student]: prev[student] === "present" ? "absent" : "present"
    }));
  };

  const handleSaveAttendance = () => {
    saveAttendanceRecord(selectedDate, attendanceMap);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData
        });

        const data = await res.json();
        setIsUploading(false);

        if (res.ok) {
          addUploadedFile({
            name: file.name,
            size: data.size || `${(file.size / 1024 / 1024).toFixed(1)} MB`,
            date: new Date().toISOString().split("T")[0]
          });
          playSound("success");
        } else {
          console.error("Upload error:", data.error);
        }
      } catch (err) {
        console.error("File upload failed:", err);
        setIsUploading(false);
      }
    }
  };

  // Stats calculation
  const totalRecords = Object.values(state.attendanceDb);
  let totalPresentCount = 0;
  let totalSlotCount = 0;

  totalRecords.forEach((record) => {
    Object.values(record).forEach((val) => {
      totalSlotCount++;
      if (val === "present") totalPresentCount++;
    });
  });

  const avgAttendancePct = totalSlotCount > 0 ? Math.round((totalPresentCount / totalSlotCount) * 100) : 90;

  return (
    <section id="teacher-dashboard-view" className="view-section active">
      <div className="header-row">
        <div className="welcome-msg">
          <h2>WJC Faculty Dashboard</h2>
          <p>Admin portal for Woxsen Japanese Centre (WJC) instructors. Manage rosters, files, and attendance.</p>
        </div>

        {/* S3 Storage Status Badge */}
        <div
          style={{
            padding: "8px 14px",
            borderRadius: "20px",
            fontSize: "0.8rem",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: s3Status.configured ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
            color: s3Status.configured ? "#10b981" : "#f59e0b",
            border: s3Status.configured ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(245, 158, 11, 0.3)"
          }}
        >
          <i className={`fa-solid ${s3Status.configured ? "fa-cloud-check" : "fa-cloud"}`}></i>
          <span>{s3Status.configured ? "AWS S3 Storage Connected" : "Local Storage Mode (.env.local missing)"}</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="stats-row">
        <div className="stat-item-card">
          <div className="stat-label">Class Average Attendance</div>
          <div className="stat-value">{avgAttendancePct}%</div>
        </div>
        <div className="stat-item-card">
          <div className="stat-label">Total Roster Students</div>
          <div className="stat-value">{ROSTER_STUDENTS.length}</div>
        </div>
        <div className="stat-item-card">
          <div className="stat-label">Shared Classroom Files</div>
          <div className="stat-value">{state.uploadedFiles.length}</div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Attendance Marker */}
        <div className="content-card">
          <div className="card-title">
            <i className="fa-solid fa-calendar-check"></i>
            <span>Class Attendance Marker</span>
          </div>
          <div className="search-container" style={{ alignItems: "center", marginBottom: "20px" }}>
            <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-muted)" }}>
              Select Class Date:
            </span>
            <input
              type="date"
              className="search-input"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              style={{ maxWidth: "200px" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {ROSTER_STUDENTS.map((student) => {
              const status = attendanceMap[student] || "present";
              const isPresent = status === "present";

              return (
                <div
                  key={student}
                  onClick={() => toggleStudentStatus(student)}
                  style={{
                    padding: "12px 16px",
                    background: "var(--panel-active)",
                    borderRadius: "var(--border-radius-md)",
                    border: "1px solid var(--card-border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer"
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>{student}</span>
                  <span
                    style={{
                      padding: "4px 14px",
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      backgroundColor: isPresent ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)",
                      color: isPresent ? "var(--accent-success, #10b981)" : "#ef4444"
                    }}
                  >
                    {isPresent ? "Present ✓" : "Absent ✗"}
                  </span>
                </div>
              );
            })}
          </div>

          <button
            className="lesson-btn-start"
            onClick={handleSaveAttendance}
            style={{ marginTop: "20px", width: "100%", justifyContent: "center", display: "flex", alignItems: "center", gap: "8px" }}
          >
            <i className="fa-solid fa-floppy-disk"></i> Save Attendance Record
          </button>
        </div>

        {/* File Upload Panel */}
        <div className="content-card">
          <div className="card-title" style={{ justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <i className="fa-solid fa-cloud-arrow-up"></i>
              <span>Upload Study Resource</span>
            </div>
            {isUploading && <span style={{ fontSize: "0.8rem", color: "var(--accent)", fontWeight: 600 }}>Uploading to S3...</span>}
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "20px" }}>
            Upload lecture files or vocabulary decks directly to AWS S3 storage for students.
          </p>

          <label
            style={{
              backgroundColor: "var(--panel-active)",
              border: "2px dashed var(--card-border)",
              borderRadius: "var(--border-radius-md)",
              padding: "30px 15px",
              textAlign: "center",
              marginBottom: "20px",
              cursor: "pointer",
              display: "block"
            }}
          >
            <i className="fa-solid fa-file-pdf" style={{ fontSize: "2.5rem", color: "var(--accent)", marginBottom: "10px" }}></i>
            <p style={{ fontWeight: 600, fontSize: "0.95rem" }}>
              {isUploading ? "Uploading file..." : "Drag & drop study file here"}
            </p>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "5px" }}>or click to select from file explorer</p>
            <input type="file" onChange={handleFileUpload} disabled={isUploading} style={{ display: "none" }} />
          </label>

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
                    <div style={{ fontWeight: 600, fontSize: "0.92rem", color: "var(--text-main)" }}>{file.name}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      {file.size} • {file.date}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteUploadedFile(file.name)}
                  style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "1.1rem" }}
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

