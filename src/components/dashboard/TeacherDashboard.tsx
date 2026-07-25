"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";

export function TeacherDashboard() {
  const {
    state,
    saveAttendanceRecord,
    addUploadedFile,
    deleteUploadedFile,
    playSound
  } = useApp();

  const [selectedDate, setSelectedDate] = useState<string>("2026-07-25");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [s3Status, setS3Status] = useState<{ configured: boolean; message: string }>({
    configured: false,
    message: "Checking S3 status..."
  });

  const [attendanceMap, setAttendanceMap] = useState<Record<string, "present" | "absent">>(() => {
    const map: Record<string, "present" | "absent"> = {};
    state.studentsRoster.forEach((s) => {
      map[s.name] = "present";
    });
    return map;
  });

  useEffect(() => {
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
      state.studentsRoster.forEach((student) => {
        defaultRecord[student.name] = "present";
      });
      setAttendanceMap(defaultRecord);
    }
  };

  const toggleStudentAttendance = (studentName: string) => {
    playSound("click");
    setAttendanceMap((prev) => ({
      ...prev,
      [studentName]: prev[studentName] === "present" ? "absent" : "present"
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
        }
      } catch (err) {
        console.error("File upload failed:", err);
        setIsUploading(false);
      }
    }
  };

  return (
    <section id="teacher-dashboard-view" className="view-section active">
      <div className="header-row" style={{ marginBottom: "20px" }}>
        <div className="welcome-msg">
          <h2>👩‍🏫 WJC Faculty Teacher Portal</h2>
          <p>Teacher interface to mark daily class attendance and upload study PDFs/files for your students.</p>
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
          <span>{s3Status.configured ? "AWS S3 Connected" : "Local Storage Mode"}</span>
        </div>
      </div>

      {/* Stats Overview Bar */}
      <div className="stats-row" style={{ marginBottom: "25px" }}>
        <div className="stat-item-card">
          <div className="stat-label">Enrolled Class Students</div>
          <div className="stat-value">{state.studentsRoster.length}</div>
        </div>
        <div className="stat-item-card">
          <div className="stat-label">Uploaded Course Files</div>
          <div className="stat-value">{state.uploadedFiles.length}</div>
        </div>
        <div className="stat-item-card">
          <div className="stat-label">Logged Attendance Sessions</div>
          <div className="stat-value">{Object.keys(state.attendanceDb).length}</div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Attendance Marker Card */}
        <div className="content-card">
          <div className="card-title">
            <i className="fa-solid fa-calendar-check" style={{ color: "var(--accent)" }}></i>
            <span>Class Attendance Marker</span>
          </div>

          <div className="search-container" style={{ alignItems: "center", marginBottom: "20px" }}>
            <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-muted)" }}>Select Class Date:</span>
            <input
              type="date"
              className="search-input"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              style={{ maxWidth: "200px" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "300px", overflowY: "auto" }}>
            {state.studentsRoster.map((student) => {
              const status = attendanceMap[student.name] || "present";
              const isPresent = status === "present";

              return (
                <div
                  key={student.id}
                  onClick={() => toggleStudentAttendance(student.name)}
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
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "var(--text-main)" }}>{student.name}</div>
                    <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>{student.rollNo} • JLPT {student.jlptLevel}</div>
                  </div>
                  <span
                    style={{
                      padding: "4px 14px",
                      borderRadius: "16px",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      backgroundColor: isPresent ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)",
                      color: isPresent ? "#10b981" : "#ef4444"
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
            <i className="fa-solid fa-floppy-disk"></i> Save Class Attendance
          </button>
        </div>

        {/* AWS S3 File Upload Manager */}
        <div className="content-card">
          <div className="card-title" style={{ justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <i className="fa-solid fa-cloud-arrow-up" style={{ color: "var(--accent)" }}></i>
              <span>Upload Study Resource</span>
            </div>
            {isUploading && <span style={{ fontSize: "0.8rem", color: "var(--accent)", fontWeight: 600 }}>Uploading...</span>}
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "15px" }}>
            Upload lecture notes, grammar slides, or vocabulary PDFs for your students.
          </p>

          <label
            style={{
              backgroundColor: "var(--panel-active)",
              border: "2px dashed var(--card-border)",
              borderRadius: "var(--border-radius-md)",
              padding: "24px 15px",
              textAlign: "center",
              marginBottom: "20px",
              cursor: "pointer",
              display: "block"
            }}
          >
            <i className="fa-solid fa-file-pdf" style={{ fontSize: "2.2rem", color: "var(--accent)", marginBottom: "8px" }}></i>
            <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>
              {isUploading ? "Uploading file..." : "Click or Drag study PDF here"}
            </p>
            <input type="file" onChange={handleFileUpload} disabled={isUploading} style={{ display: "none" }} />
          </label>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "250px", overflowY: "auto" }}>
            {state.uploadedFiles.map((file, idx) => (
              <div
                key={idx}
                style={{
                  padding: "10px 14px",
                  background: "var(--panel-active)",
                  borderRadius: "var(--border-radius-md)",
                  border: "1px solid var(--card-border)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <i className="fa-solid fa-file-pdf" style={{ fontSize: "1.3rem", color: "var(--accent)" }}></i>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--text-main)" }}>{file.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{file.size} • {file.date}</div>
                  </div>
                </div>
                <button
                  onClick={() => deleteUploadedFile(file.name)}
                  style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "1rem" }}
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

