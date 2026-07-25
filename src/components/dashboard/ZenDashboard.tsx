"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { lessons } from "@/lib/data";
import { StudyModal } from "@/components/StudyModal";
import { N5DeadlineCard } from "@/components/dashboard/N5DeadlineCard";

export interface MasterNode {
  id: number;
  unitId: number;
  unitTitle: string;
  unitSubtitle: string;
  title: string;
  subtitle: string;
  icon: string;
  type: "kana" | "lesson" | "voice" | "kaiwa" | "kanji" | "radicals" | "quiz" | "conjugator";
  actionView?: string;
  lessonId?: number;
}

export const masterNodes: MasterNode[] = [
  // UNIT 1
  {
    id: 1,
    unitId: 1,
    unitTitle: "Unit 1: Kana & Pronunciation Foundations",
    unitSubtitle: "Master Hiragana, Katakana & basic voice greetings",
    title: "Hiragana Foundations",
    subtitle: "Learn basic 46 Hiragana characters",
    icon: "fa-solid fa-graduation-cap",
    type: "kana",
    actionView: "kana-trainer"
  },
  {
    id: 2,
    unitId: 1,
    unitTitle: "Unit 1: Kana & Pronunciation Foundations",
    unitSubtitle: "Master Hiragana, Katakana & basic voice greetings",
    title: "Katakana & Special Sounds",
    subtitle: "Learn loanword characters & audio",
    icon: "fa-solid fa-language",
    type: "kana",
    actionView: "kana-trainer"
  },
  {
    id: 3,
    unitId: 1,
    unitTitle: "Unit 1: Kana & Pronunciation Foundations",
    unitSubtitle: "Master Hiragana, Katakana & basic voice greetings",
    title: "Voice Greetings Drill",
    subtitle: "Practice speaking Japanese with voice recognition",
    icon: "fa-solid fa-microphone-lines",
    type: "voice",
    actionView: "voice-coach"
  },

  // UNIT 2
  {
    id: 4,
    unitId: 2,
    unitTitle: "Unit 2: First Steps & Self-Introduction",
    unitSubtitle: "Learn basic identity sentences, objects & greetings",
    title: "Lesson 1: Self-Introductions",
    subtitle: "N1 wa N2 desu (Identity & Copula)",
    icon: "fa-solid fa-feather",
    type: "lesson",
    lessonId: 1
  },
  {
    id: 5,
    unitId: 2,
    unitTitle: "Unit 2: First Steps & Self-Introduction",
    unitSubtitle: "Learn basic identity sentences, objects & greetings",
    title: "Lesson 2: Demonstratives",
    subtitle: "Kore / Sore / Are (This, That)",
    icon: "fa-solid fa-feather",
    type: "lesson",
    lessonId: 2
  },
  {
    id: 6,
    unitId: 2,
    unitTitle: "Unit 2: First Steps & Self-Introduction",
    unitSubtitle: "Learn basic identity sentences, objects & greetings",
    title: "Classroom Kaiwa Roleplay",
    subtitle: "Self-introduction dialogue with sensei",
    icon: "fa-solid fa-comments",
    type: "kaiwa",
    actionView: "kaiwa"
  },

  // UNIT 3
  {
    id: 7,
    unitId: 3,
    unitTitle: "Unit 3: Daily Life & Kanji Building",
    unitSubtitle: "Locations, telling time & 100 essential Kanji",
    title: "Lesson 3 & 4: Locations & Time",
    subtitle: "Koko/Soko/Asoko & telling time (-ji/-fun)",
    icon: "fa-solid fa-clock",
    type: "lesson",
    lessonId: 3
  },
  {
    id: 8,
    unitId: 3,
    unitTitle: "Unit 3: Daily Life & Kanji Building",
    unitSubtitle: "Locations, telling time & 100 essential Kanji",
    title: "100 N5 Kanji Tracing Board",
    subtitle: "Trace core Kanji characters on canvas",
    icon: "fa-solid fa-brush",
    type: "kanji",
    actionView: "kanji-board"
  },
  {
    id: 9,
    unitId: 3,
    unitTitle: "Unit 3: Daily Life & Kanji Building",
    unitSubtitle: "Locations, telling time & 100 essential Kanji",
    title: "Kanji Radical Assembly Puzzle",
    subtitle: "Deconstruct and assemble Kanji radicals",
    icon: "fa-solid fa-puzzle-piece",
    type: "radicals",
    actionView: "kanji-radicals"
  },

  // UNIT 4
  {
    id: 10,
    unitId: 4,
    unitTitle: "Unit 4: Real-World Conversations & Verbs",
    unitSubtitle: "Action verbs, travel particles & real-world dialogues",
    title: "Lesson 5 & 6: Verbs & Movements",
    subtitle: "Transitive verbs & destination particle e",
    icon: "fa-solid fa-plane-departure",
    type: "lesson",
    lessonId: 5
  },
  {
    id: 11,
    unitId: 4,
    unitTitle: "Unit 4: Real-World Conversations & Verbs",
    unitSubtitle: "Action verbs, travel particles & real-world dialogues",
    title: "Tokyo Cafe Order Kaiwa",
    subtitle: "Order coffee & handle payment in Shibuya",
    icon: "fa-solid fa-mug-hot",
    type: "kaiwa",
    actionView: "kaiwa"
  },
  {
    id: 12,
    unitId: 4,
    unitTitle: "Unit 4: Real-World Conversations & Verbs",
    unitSubtitle: "Action verbs, travel particles & real-world dialogues",
    title: "Konbini Shopping Kaiwa",
    subtitle: "Buy bentos & handle convenience store talk",
    icon: "fa-solid fa-store",
    type: "kaiwa",
    actionView: "kaiwa"
  },

  // UNIT 5
  {
    id: 13,
    unitId: 5,
    unitTitle: "Unit 5: JLPT N5 Mastery & Mock Exam",
    unitSubtitle: "Adjectives, existence & final practice quiz",
    title: "Lessons 7–10: Adjectives & Existence",
    subtitle: "i/na adjectives & arimasu/imasu",
    icon: "fa-solid fa-book-open-reader",
    type: "lesson",
    lessonId: 7
  },
  {
    id: 14,
    unitId: 5,
    unitTitle: "Unit 5: JLPT N5 Mastery & Mock Exam",
    unitSubtitle: "Adjectives, existence & final practice quiz",
    title: "Verb Form Conjugator Engine",
    subtitle: "Master -masu, -te, -nai, -ta forms",
    icon: "fa-solid fa-book-open",
    type: "conjugator",
    actionView: "dictionary"
  },
  {
    id: 15,
    unitId: 5,
    unitTitle: "Unit 5: JLPT N5 Mastery & Mock Exam",
    unitSubtitle: "Adjectives, existence & final practice quiz",
    title: "N5 Final Mock Quiz Exam",
    subtitle: "Test your full N5 readiness with scored drills",
    icon: "fa-solid fa-trophy",
    type: "quiz",
    actionView: "quiz"
  }
];

export function ZenDashboard() {
  const { state, setActiveView, setActiveLessonId, playSound } = useApp();
  const [studyModalLessonId, setStudyModalLessonId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const activeLesson = lessons.find((l) => l.id === state.activeLessonId) || lessons[0];
  const solvedNodes = state.solvedNodes || [1];

  // SVG connecting line calculation
  useEffect(() => {
    const drawLines = () => {
      const container = containerRef.current;
      const svg = svgRef.current;
      if (!container || !svg) return;

      svg.innerHTML = "";
      const pebbles = container.querySelectorAll(".pebble-node");
      if (pebbles.length < 2) return;

      const svgRect = svg.getBoundingClientRect();
      svg.setAttribute("width", String(svgRect.width));
      svg.setAttribute("height", String(svgRect.height));

      const points: Array<{ x: number; y: number }> = [];
      pebbles.forEach((pebble) => {
        const pebbleRect = pebble.getBoundingClientRect();
        const x = pebbleRect.left - svgRect.left + pebbleRect.width / 2;
        const y = pebbleRect.top - svgRect.top + pebbleRect.height / 2;
        points.push({ x, y });
      });

      let pathData = `M ${points[0].x} ${points[0].y}`;
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];
        const cpY1 = p0.y + (p1.y - p0.y) / 2;
        const cpY2 = p0.y + (p1.y - p0.y) / 2;
        pathData += ` C ${p0.x} ${cpY1}, ${p1.x} ${cpY2}, ${p1.x} ${p1.y}`;
      }

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", pathData);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "var(--accent-secondary)");
      path.setAttribute("stroke-width", "3");
      path.setAttribute("stroke-dasharray", "8, 8");
      svg.appendChild(path);
    };

    const timer = setTimeout(drawLines, 150);
    window.addEventListener("resize", drawLines);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", drawLines);
    };
  }, [solvedNodes]);

  // Bonsai tree SVG rendering
  const solvedCount = state.solvedLessons.length;
  const bonsaiParts = [
    { d: "M90,140 Q60,110 50,115", type: "branch", w: 5, cx: 50, cy: 115, r: 8 },
    { d: "M108,125 Q135,100 148,105", type: "branch", w: 5, cx: 148, cy: 105, r: 8 },
    { d: "M92,100 Q65,80 52,85", type: "branch", w: 4, cx: 52, cy: 85, r: 9 },
    { d: "M105,95 Q125,70 138,72", type: "branch", w: 4, cx: 138, cy: 72, r: 9 },
    { d: "M96,75 Q78,55 72,58", type: "branch", w: 3, cx: 72, cy: 58, r: 10 },
    { d: "M103,68 Q125,48 130,50", type: "branch", w: 3, cx: 130, cy: 50, r: 10 },
    { d: "M99,50 Q85,30 80,32", type: "branch", w: 2, cx: 80, cy: 32, r: 11 },
    { d: "M102,40 Q118,25 120,28", type: "branch", w: 2, cx: 120, cy: 28, r: 11 },
    { type: "blossom", cx: 100, cy: 40, r: 7 },
    { type: "blossom", cx: 72, cy: 58, r: 6 }
  ];

  const bonsaiPct = Math.round((solvedCount / lessons.length) * 100);

  const handleNodeClick = (node: MasterNode) => {
    const isSolved = solvedNodes.includes(node.id);
    const isUnlocked = node.id === 1 || solvedNodes.includes(node.id - 1) || isSolved;

    if (!isUnlocked) {
      playSound("incorrect");
      return;
    }

    playSound("click");
    if (node.type === "lesson" && node.lessonId) {
      setActiveLessonId(node.lessonId);
      setStudyModalLessonId(node.lessonId);
    } else if (node.actionView) {
      setActiveView(node.actionView);
    }
  };

  return (
    <section id="zen-dashboard-view" className="view-section active">
      <div className="header-row">
        <div className="welcome-msg">
          <h2>こんにちわ, {state.activeStudentName}</h2>
          <p>Welcome to Zengo. Follow your master continuous learning path to achieve JLPT N5 mastery.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Single Master Learning Path Timeline */}
        <div className="content-card">
          <div className="card-title">
            <i className="fa-solid fa-map-location-dot"></i>
            <span>Single Master Learning Path (Units 1–5)</span>
          </div>

          <p style={{ fontSize: "0.86rem", color: "var(--text-muted)", marginBottom: "20px" }}>
            Connected step-by-step curriculum combining Kana, Grammar, Kanji, Kaiwa, Voice Coach & Quizzes into one continuous path.
          </p>

          <div className="pebble-timeline-wrapper">
            <svg className="pebble-timeline-svg" ref={svgRef} xmlns="http://www.w3.org/2000/svg"></svg>
            <div className="pebbles-path-container" ref={containerRef}>
              {masterNodes.map((node, index) => {
                const isSolved = solvedNodes.includes(node.id);
                const isUnlocked = node.id === 1 || solvedNodes.includes(node.id - 1) || isSolved;
                const isUnitHeader = index === 0 || masterNodes[index - 1].unitId !== node.unitId;

                let nodeClass = "pebble-node";
                if (isSolved) nodeClass += " solved";
                else if (isUnlocked) nodeClass += " unlocked active";
                else nodeClass += " locked";

                return (
                  <React.Fragment key={node.id}>
                    {/* Unit Divider Banner */}
                    {isUnitHeader && (
                      <div
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          borderRadius: "var(--border-radius-md)",
                          background: "var(--panel-active)",
                          borderLeft: "4px solid var(--accent)",
                          margin: "15px 0 10px 0",
                          fontSize: "0.85rem",
                          fontWeight: 700,
                          color: "var(--accent)"
                        }}
                      >
                        <i className="fa-solid fa-bookmark" style={{ marginRight: "8px" }}></i>
                        {node.unitTitle}
                      </div>
                    )}

                    <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "14px" }}>
                      <button
                        className={nodeClass}
                        onClick={() => handleNodeClick(node)}
                        title={node.title}
                      >
                        {isSolved ? (
                          <div className="solved-checkmark">
                            <i className="fa-solid fa-check"></i>
                          </div>
                        ) : !isUnlocked ? (
                          <i className="fa-solid fa-lock" style={{ fontSize: "0.9rem" }}></i>
                        ) : (
                          <i className={node.icon} style={{ fontSize: "0.9rem" }}></i>
                        )}
                      </button>

                      <div
                        onClick={() => handleNodeClick(node)}
                        style={{
                          flex: 1,
                          padding: "10px 14px",
                          borderRadius: "var(--border-radius-md)",
                          background: isUnlocked ? "var(--panel-active)" : "var(--card-bg)",
                          border: "1px solid var(--card-border)",
                          cursor: isUnlocked ? "pointer" : "not-allowed",
                          opacity: isUnlocked ? 1 : 0.6
                        }}
                      >
                        <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-main)" }}>
                          Step {node.id}: {node.title}
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "2px" }}>
                          {node.subtitle}
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* Side panels */}
        <div>
          <N5DeadlineCard />

          <div className="content-card" id="lesson-detail-card">
            <div className="card-title">
              <i className="fa-solid fa-feather"></i>
              <span>L{activeLesson.id}: {activeLesson.japaneseTitle}</span>
            </div>
            <div className="lesson-detail-content">
              <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>{activeLesson.description}</p>
              <ul className="lesson-syllabus-list">
                {activeLesson.syllabus.map((item, index) => {
                  let icon = <i className="fa-solid fa-star" style={{ color: "var(--accent)", fontSize: "0.95rem", width: "20px", textAlign: "center" }}></i>;
                  if (item.toLowerCase().includes("grammar:")) {
                    icon = <i className="fa-solid fa-book-bookmark" style={{ color: "var(--accent-secondary)", fontSize: "0.95rem", width: "20px", textAlign: "center" }}></i>;
                  } else if (item.toLowerCase().includes("vocabulary:")) {
                    icon = <i className="fa-solid fa-language" style={{ color: "var(--accent-success)", fontSize: "0.95rem", width: "20px", textAlign: "center" }}></i>;
                  } else if (item.toLowerCase().includes("kanji:")) {
                    icon = <i className="fa-solid fa-pen-fancy" style={{ color: "var(--accent)", fontSize: "0.95rem", width: "20px", textAlign: "center" }}></i>;
                  }
                  const cleanText = item.replace(/^(Grammar:|Vocabulary:|Kanji:)/i, "").trim();

                  return (
                    <li
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px 14px",
                        background: "var(--panel-active)",
                        borderRadius: "var(--border-radius-md)",
                        border: "1px solid var(--card-border)",
                        fontSize: "0.92rem",
                        fontWeight: 600,
                        color: "var(--text-main)"
                      }}
                    >
                      {icon}
                      <span style={{ flex: 1, lineHeight: 1.3 }}>{cleanText}</span>
                    </li>
                  );
                })}
              </ul>
              <button
                className="lesson-btn-start"
                onClick={() => {
                  playSound("click");
                  setStudyModalLessonId(activeLesson.id);
                }}
                style={{
                  backgroundColor: state.solvedLessons.includes(activeLesson.id) ? "var(--accent-secondary)" : "var(--accent)"
                }}
              >
                {state.solvedLessons.includes(activeLesson.id) ? (
                  <>
                    <i className="fa-solid fa-graduation-cap"></i> Review Lesson
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-play"></i> Study Lesson
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Bonsai Progress */}
          <div className="content-card">
            <div className="card-title">
              <i className="fa-solid fa-seedling"></i>
              <span>Bonsai Garden Progress</span>
            </div>
            <div className="bonsai-container">
              <div className="bonsai-svg-wrapper">
                <div className="bonsai-glow-bg"></div>
                <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <rect x="65" y="160" width="70" height="20" rx="3" fill="var(--bonsai-pot)" />
                  <rect x="75" y="180" width="50" height="10" rx="2" fill="var(--bonsai-pot)" />
                  <path d="M100,160 C90,130 92,100 100,80 C103,72 108,60 110,48" stroke="var(--bonsai-trunk)" strokeWidth="12" strokeLinecap="round" fill="none" />
                  <g>
                    {bonsaiParts.slice(0, Math.min(solvedCount, bonsaiParts.length)).map((part: any, i) => (
                      <React.Fragment key={i}>
                        {part.type === "branch" ? (
                          <>
                            <path d={part.d} stroke="var(--bonsai-trunk)" strokeWidth={part.w} strokeLinecap="round" fill="none" />
                            <circle cx={part.cx} cy={part.cy} r={part.r} fill="var(--bonsai-leaf)" />
                          </>
                        ) : (
                          <circle cx={part.cx} cy={part.cy} r={part.r} fill="var(--accent-secondary)" />
                        )}
                      </React.Fragment>
                    ))}
                  </g>
                </svg>
              </div>
              <p style={{ fontWeight: 600, fontSize: "1rem" }}>Gardening Level: {solvedCount}/10</p>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "5px" }}>
                Your Bonsai tree is {bonsaiPct}% mature. Complete lessons to nourish it.
              </p>
            </div>
          </div>
        </div>
      </div>

      {studyModalLessonId && (
        <StudyModal lessonId={studyModalLessonId} onClose={() => setStudyModalLessonId(null)} />
      )}
    </section>
  );
}
