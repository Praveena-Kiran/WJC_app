"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";

interface FacultyMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "active" | "inactive";
}

export function AdminDashboard() {
  const {
    state,
    addStudentToRoster,
    removeStudentFromRoster,
    toggleStudentRosterStatus,
    addAnnouncement,
    deleteAnnouncement,
    playSound
  } = useApp();

  // Search states
  const [studentSearch, setStudentSearch] = useState<string>("");
  const [facultySearch, setFacultySearch] = useState<string>("");

  // Add Student state
  const [showAddStudentForm, setShowAddStudentForm] = useState<boolean>(false);
  const [newStudentName, setNewStudentName] = useState<string>("");
  const [newStudentRoll, setNewStudentRoll] = useState<string>("");
  const [newStudentLevel, setNewStudentLevel] = useState<"N5" | "N4" | "N3" | "N2" | "N1">("N5");

  // Faculty state
  const [facultyList, setFacultyList] = useState<FacultyMember[]>([
    { id: "f1", name: "Tanaka Sensei", email: "tanaka@woxsen.edu.in", role: "Lead Japanese Instructor", department: "School of Humanities", status: "active" },
    { id: "f2", name: "Sato Sensei", email: "sato@woxsen.edu.in", role: "JLPT N5 Specialist", department: "WJC Language Centre", status: "active" },
    { id: "f3", name: "Yamada Sensei", email: "yamada@woxsen.edu.in", role: "Kanji & Culture Coach", department: "WJC Language Centre", status: "active" }
  ]);
  const [showAddFacultyForm, setShowAddFacultyForm] = useState<boolean>(false);
  const [newFacultyName, setNewFacultyName] = useState<string>("");
  const [newFacultyEmail, setNewFacultyEmail] = useState<string>("");
  const [newFacultyRole, setNewFacultyRole] = useState<string>("");

  // Announcement state
  const [annTitle, setAnnTitle] = useState<string>("");
  const [annContent, setAnnContent] = useState<string>("");

  // S3 Status
  const [s3Status, setS3Status] = useState<{ configured: boolean; message: string }>({
    configured: false,
    message: "Checking S3 status..."
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
          message: "Operating in local fallback mode."
        });
      });
  }, []);

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;
    addStudentToRoster({
      name: newStudentName.trim(),
      rollNo: newStudentRoll.trim() || `WOX2026-00${state.studentsRoster.length + 1}`,
      jlptLevel: newStudentLevel
    });
    setNewStudentName("");
    setNewStudentRoll("");
    setShowAddStudentForm(false);
  };

  const handleAddFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFacultyName.trim()) return;
    playSound("success");
    setFacultyList((prev) => [
      {
        id: `f-${Date.now()}`,
        name: newFacultyName.trim(),
        email: newFacultyEmail.trim() || `${newFacultyName.toLowerCase().replace(/\s+/g, ".")}@woxsen.edu.in`,
        role: newFacultyRole.trim() || "Japanese Faculty",
        department: "Woxsen Japanese Centre",
        status: "active"
      },
      ...prev
    ]);
    setNewFacultyName("");
    setNewFacultyEmail("");
    setNewFacultyRole("");
    setShowAddFacultyForm(false);
  };

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;
    addAnnouncement({
      title: annTitle.trim(),
      content: annContent.trim()
    });
    setAnnTitle("");
    setAnnContent("");
  };

  const filteredStudents = state.studentsRoster.filter(
    (s) =>
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const filteredFaculty = facultyList.filter(
    (f) =>
      f.name.toLowerCase().includes(facultySearch.toLowerCase()) ||
      f.email.toLowerCase().includes(facultySearch.toLowerCase())
  );

  return (
    <section id="admin-dashboard-view" className="view-section active">
      {/* Header */}
      <div className="header-row" style={{ marginBottom: "20px" }}>
        <div className="welcome-msg">
          <h2>⚡ WJC System Administrator Portal</h2>
          <p>Master administrative control center for Woxsen Japanese Centre. Manage students, faculty teachers, system announcements, and S3 cloud infrastructure.</p>
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
          <span>{s3Status.configured ? "AWS S3 Active" : "Local Storage Mode"}</span>
        </div>
      </div>

      {/* Top System Metrics */}
      <div className="stats-row" style={{ marginBottom: "25px" }}>
        <div className="stat-item-card">
          <div className="stat-label">Total Enrolled Students</div>
          <div className="stat-value">{state.studentsRoster.length}</div>
        </div>
        <div className="stat-item-card">
          <div className="stat-label">Faculty Teachers</div>
          <div className="stat-value">{facultyList.length}</div>
        </div>
        <div className="stat-item-card">
          <div className="stat-label">Course Announcements</div>
          <div className="stat-value">{state.announcements.length}</div>
        </div>
        <div className="stat-item-card">
          <div className="stat-label">Shared Vault PDFs</div>
          <div className="stat-value">{state.uploadedFiles.length}</div>
        </div>
      </div>

      {/* Grid Row 1: Student Roster & Teacher Roster */}
      <div className="dashboard-grid" style={{ marginBottom: "25px" }}>
        {/* Student Roster Card */}
        <div className="content-card">
          <div className="card-title" style={{ justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <i className="fa-solid fa-graduation-cap" style={{ color: "var(--accent)" }}></i>
              <span>Student Roster Management</span>
            </div>
            <button
              className="btn-action"
              onClick={() => {
                playSound("click");
                setShowAddStudentForm(!showAddStudentForm);
              }}
              style={{ padding: "6px 14px", fontSize: "0.82rem" }}
            >
              <i className={`fa-solid ${showAddStudentForm ? "fa-minus" : "fa-user-plus"}`}></i>{" "}
              {showAddStudentForm ? "Close" : "Enroll Student"}
            </button>
          </div>

          {/* Add Student Inline Form */}
          {showAddStudentForm && (
            <form
              onSubmit={handleAddStudent}
              style={{
                background: "var(--panel-active)",
                padding: "16px",
                borderRadius: "var(--border-radius-md)",
                border: "1.5px solid var(--accent)",
                marginBottom: "20px"
              }}
            >
              <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "12px", color: "var(--accent)" }}>
                ➕ Enroll New Student
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priyanshu Das"
                    className="search-input"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                    Roll Number / Email
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. WOX2026-009"
                    className="search-input"
                    value={newStudentRoll}
                    onChange={(e) => setNewStudentRoll(e.target.value)}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)" }}>Target JLPT:</span>
                  {(["N5", "N4", "N3", "N2", "N1"] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setNewStudentLevel(lvl)}
                      style={{
                        padding: "4px 8px",
                        borderRadius: "10px",
                        border: newStudentLevel === lvl ? "1.5px solid var(--accent)" : "1px solid var(--card-border)",
                        background: newStudentLevel === lvl ? "var(--accent)" : "var(--card-bg)",
                        color: newStudentLevel === lvl ? "#fff" : "var(--text-main)",
                        fontWeight: 700,
                        fontSize: "0.76rem",
                        cursor: "pointer"
                      }}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>

                <button type="submit" className="btn-action" style={{ padding: "8px 16px", fontSize: "0.84rem" }}>
                  Save Student
                </button>
              </div>
            </form>
          )}

          <div style={{ marginBottom: "15px" }}>
            <input
              type="text"
              className="search-input"
              placeholder="🔍 Filter student roster..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "300px", overflowY: "auto" }}>
            {filteredStudents.map((student) => (
              <div
                key={student.id}
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
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "var(--text-main)" }}>
                    {student.name}{" "}
                    <span style={{ fontSize: "0.74rem", padding: "2px 8px", borderRadius: "10px", background: "rgba(59, 130, 246, 0.15)", color: "#60a5fa", fontWeight: 700 }}>
                      {student.jlptLevel}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
                    {student.rollNo} • Enrolled {student.dateJoined}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <button
                    onClick={() => toggleStudentRosterStatus(student.id)}
                    style={{
                      padding: "4px 10px",
                      borderRadius: "14px",
                      fontSize: "0.76rem",
                      fontWeight: 700,
                      border: "none",
                      cursor: "pointer",
                      background: student.status === "active" ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)",
                      color: student.status === "active" ? "#10b981" : "#ef4444"
                    }}
                  >
                    {student.status === "active" ? "🟢 Active" : "🔴 Inactive"}
                  </button>

                  <button
                    onClick={() => removeStudentFromRoster(student.id)}
                    style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "0.95rem" }}
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Teacher / Faculty Roster Card */}
        <div className="content-card">
          <div className="card-title" style={{ justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <i className="fa-solid fa-chalkboard-user" style={{ color: "var(--accent)" }}></i>
              <span>Faculty & Teacher Roster</span>
            </div>
            <button
              className="btn-action"
              onClick={() => {
                playSound("click");
                setShowAddFacultyForm(!showAddFacultyForm);
              }}
              style={{ padding: "6px 14px", fontSize: "0.82rem" }}
            >
              <i className={`fa-solid ${showAddFacultyForm ? "fa-minus" : "fa-user-tie"}`}></i>{" "}
              {showAddFacultyForm ? "Close" : "Add Faculty"}
            </button>
          </div>

          {/* Add Faculty Form */}
          {showAddFacultyForm && (
            <form
              onSubmit={handleAddFaculty}
              style={{
                background: "var(--panel-active)",
                padding: "16px",
                borderRadius: "var(--border-radius-md)",
                border: "1.5px solid var(--accent)",
                marginBottom: "20px"
              }}
            >
              <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "12px", color: "var(--accent)" }}>
                ➕ Register Faculty Teacher
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Faculty Name (e.g. Tanaka Sensei)"
                    className="search-input"
                    value={newFacultyName}
                    onChange={(e) => setNewFacultyName(e.target.value)}
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Role (e.g. Kanji Coach)"
                    className="search-input"
                    value={newFacultyRole}
                    onChange={(e) => setNewFacultyRole(e.target.value)}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
              <button type="submit" className="btn-action" style={{ width: "100%", justifyContent: "center" }}>
                Register Teacher 🎓
              </button>
            </form>
          )}

          <div style={{ marginBottom: "15px" }}>
            <input
              type="text"
              className="search-input"
              placeholder="🔍 Filter faculty teachers..."
              value={facultySearch}
              onChange={(e) => setFacultySearch(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "300px", overflowY: "auto" }}>
            {filteredFaculty.map((teacher) => (
              <div
                key={teacher.id}
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
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "var(--text-main)" }}>
                    👩‍🏫 {teacher.name}
                  </div>
                  <div style={{ fontSize: "0.76rem", color: "var(--accent)" }}>
                    {teacher.role} • {teacher.email}
                  </div>
                </div>

                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: "14px",
                    fontSize: "0.76rem",
                    fontWeight: 700,
                    background: "rgba(16, 185, 129, 0.2)",
                    color: "#10b981"
                  }}
                >
                  Faculty Active
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Row 2: Announcements Publisher & System Settings */}
      <div className="dashboard-grid">
        {/* System Announcements Publisher */}
        <div className="content-card">
          <div className="card-title">
            <i className="fa-solid fa-bullhorn" style={{ color: "var(--accent)" }}></i>
            <span>System & Course Announcements</span>
          </div>

          <form onSubmit={handleAddAnnouncement} style={{ marginBottom: "20px" }}>
            <div style={{ marginBottom: "10px" }}>
              <input
                type="text"
                required
                placeholder="Announcement Title..."
                className="search-input"
                value={annTitle}
                onChange={(e) => setAnnTitle(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <textarea
                required
                placeholder="Write official announcement details..."
                className="search-input"
                rows={2}
                value={annContent}
                onChange={(e) => setAnnContent(e.target.value)}
                style={{ width: "100%", borderRadius: "var(--border-radius-md)" }}
              />
            </div>
            <button type="submit" className="btn-action" style={{ width: "100%", justifyContent: "center" }}>
              Publish Announcement 📢
            </button>
          </form>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "250px", overflowY: "auto" }}>
            {state.announcements.map((ann) => (
              <div
                key={ann.id}
                style={{
                  padding: "12px 14px",
                  background: "var(--panel-active)",
                  borderRadius: "var(--border-radius-md)",
                  border: "1px solid var(--card-border)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-main)" }}>{ann.title}</span>
                  <button
                    onClick={() => deleteAnnouncement(ann.id)}
                    style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "0.85rem" }}
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "4px" }}>{ann.content}</div>
                <div style={{ fontSize: "0.74rem", color: "var(--accent)" }}>
                  Posted by {ann.author} • {ann.date}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AWS S3 Infrastructure Status */}
        <div className="content-card">
          <div className="card-title">
            <i className="fa-solid fa-server" style={{ color: "var(--accent)" }}></i>
            <span>System Infrastructure & Cloud</span>
          </div>

          <div style={{ padding: "14px", borderRadius: "12px", background: "var(--panel-active)", border: "1px solid var(--card-border)", marginBottom: "15px" }}>
            <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "4px" }}>AWS S3 Cloud Storage</div>
            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "10px" }}>
              {s3Status.configured
                ? "S3 Presigned URLs active. Direct cloud uploads enabled."
                : "Local storage fallback mode active. Configure AWS_ACCESS_KEY_ID in .env.local for production S3."}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--accent)", fontWeight: 700 }}>
              Bucket Endpoint: /api/upload
            </div>
          </div>

          <div style={{ padding: "14px", borderRadius: "12px", background: "var(--panel-active)", border: "1px solid var(--card-border)" }}>
            <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "4px" }}>System Status & Academic Term</div>
            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
              Current Academic Term: <strong>Fall 2026 / Spring 2027</strong>
            </div>
            <div style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: 700, marginTop: "6px" }}>
              🟢 All Administration Services Operational
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
