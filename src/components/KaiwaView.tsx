"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";

export interface DialogueOption {
  text: string;
  romaji: string;
  english: string;
  isCorrect: boolean;
  feedback: string;
}

export interface DialogueLine {
  id: string;
  speaker: "npc" | "user";
  npcName?: string;
  avatar: string;
  japanese: string;
  romaji: string;
  english: string;
  options?: DialogueOption[];
}

export interface DuolingoStory {
  id: string;
  title: string;
  japaneseTitle: string;
  category: string;
  icon: string;
  npcName: string;
  npcAvatar: string;
  npcRole: string;
  bgTheme: string;
  lines: DialogueLine[];
}

const stories: DuolingoStory[] = [
  {
    id: "cafe",
    title: "Ordering at a Shibuya Cafe",
    japaneseTitle: "渋谷の喫茶店で",
    category: "Food & Dining",
    icon: "☕",
    npcName: "Kenji",
    npcAvatar: "☕",
    npcRole: "Barista",
    bgTheme: "rgba(245, 158, 11, 0.08)",
    lines: [
      {
        id: "l1",
        speaker: "npc",
        npcName: "Kenji",
        avatar: "☕",
        japanese: "いらっしゃいませ！ご注文はお決まりですか？",
        romaji: "Irasshaimase! Go-chuumon wa o-kimari desu ka?",
        english: "Welcome! Are you ready to order?"
      },
      {
        id: "l2",
        speaker: "user",
        avatar: "👤",
        japanese: "Choose your response:",
        romaji: "",
        english: "",
        options: [
          {
            text: "アイスコーヒーをひとつお願いします。",
            romaji: "Aisu koohii o hitotsu onegaishimasu.",
            english: "One iced coffee, please.",
            isCorrect: true,
            feedback: "🌟 Perfect! 'Hitotsu onegaishimasu' is the natural way to order."
          },
          {
            text: "水はいりません。",
            romaji: "Mizu wa irimasen.",
            english: "I don't need water.",
            isCorrect: false,
            feedback: "💡 Place your order first using 'onegaishimasu'."
          }
        ]
      },
      {
        id: "l3",
        speaker: "npc",
        npcName: "Kenji",
        avatar: "☕",
        japanese: "かしこまりました。サイズはMですか？",
        romaji: "Kashikomarima shita. Saizu wa M desu ka?",
        english: "Certainly. Medium size?"
      },
      {
        id: "l4",
        speaker: "user",
        avatar: "👤",
        japanese: "Choose your response:",
        romaji: "",
        english: "",
        options: [
          {
            text: "はい、Mサイズでお願いします。",
            romaji: "Hai, Emuka saizu de onegaishimasu.",
            english: "Yes, Medium size please.",
            isCorrect: true,
            feedback: "👍 Great polite response!"
          },
          {
            text: "いいえ、たかいです。",
            romaji: "Iie, takai desu.",
            english: "No, it's expensive.",
            isCorrect: false,
            feedback: "💡 Say 'Hai, M-saizu de' to confirm size."
          }
        ]
      },
      {
        id: "l5",
        speaker: "npc",
        npcName: "Kenji",
        avatar: "☕",
        japanese: "ありがとうございます。500円になります！",
        romaji: "Arigatou gozaimasu. Gohaku-en ni narimasu!",
        english: "Thank you. That will be 500 yen!"
      }
    ]
  },
  {
    id: "ramen",
    title: "Ordering Ramen at Shinjuku",
    japaneseTitle: "新宿のラーメン屋",
    category: "Food & Dining",
    icon: "🍜",
    npcName: "Chef Hiro",
    npcAvatar: "🍜",
    npcRole: "Master Chef",
    bgTheme: "rgba(239, 68, 68, 0.08)",
    lines: [
      {
        id: "r1",
        speaker: "npc",
        npcName: "Chef Hiro",
        avatar: "🍜",
        japanese: "いらっしゃい！麺のかたさはどうする？",
        romaji: "Irasshai! Men no katasa wa dou suru?",
        english: "Welcome! How would you like your noodle firmness?"
      },
      {
        id: "r2",
        speaker: "user",
        avatar: "👤",
        japanese: "Choose your response:",
        romaji: "",
        english: "",
        options: [
          {
            text: "かためでおねがいします！",
            romaji: "Katame de onegaishimasu!",
            english: "Firm noodles, please!",
            isCorrect: true,
            feedback: "🔥 Chef approved! Firm noodles are super popular in Tokyo."
          },
          {
            text: "やわらかい。",
            romaji: "Yawarakai.",
            english: "Soft.",
            isCorrect: false,
            feedback: "💡 Say 'Katame de' or 'Yawaraka me de'."
          }
        ]
      }
    ]
  }
];

export function KaiwaView() {
  const { setActiveView, markNodeSolved, speakJapanese, playSound } = useApp();
  const [selectedStoryId, setSelectedStoryId] = useState<string>("cafe");
  const [lineIdx, setLineIdx] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [completed, setCompleted] = useState<boolean>(false);
  const [selectedWord, setSelectedWord] = useState<{ jp: string; en: string } | null>(null);

  const story = stories.find((s) => s.id === selectedStoryId) || stories[0];
  const currentLine = story.lines[lineIdx];

  // Auto play NPC audio on line advance
  useEffect(() => {
    if (currentLine && currentLine.speaker === "npc") {
      speakJapanese(currentLine.japanese);
    }
  }, [lineIdx, selectedStoryId]);

  const handleSelectOption = (option: DialogueOption) => {
    setFeedback(option.feedback);
    if (option.isCorrect) {
      playSound("correct");
      setScore((prev) => prev + 20);
    } else {
      playSound("incorrect");
    }

    setTimeout(() => {
      setFeedback(null);
      if (lineIdx + 1 < story.lines.length) {
        setLineIdx((prev) => prev + 1);
      } else {
        setCompleted(true);
        playSound("success");
        markNodeSolved(11);
      }
    }, 1400);
  };

  const progressPct = Math.round(((lineIdx + 1) / story.lines.length) * 100);

  return (
    <section id="kaiwa-view" className="view-section active">
      {/* Top Duolingo Progress Bar Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          marginBottom: "20px",
          background: "var(--panel-active)",
          padding: "14px 20px",
          borderRadius: "20px",
          border: "1px solid var(--card-border)"
        }}
      >
        <button
          onClick={() => {
            playSound("click");
            setActiveView("dashboard");
          }}
          style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "1.3rem", cursor: "pointer" }}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* Progress Bar Container */}
        <div style={{ flex: 1, height: "14px", background: "var(--card-bg)", borderRadius: "10px", overflow: "hidden", border: "1px solid var(--card-border)" }}>
          <div style={{ width: `${progressPct}%`, height: "100%", background: "linear-gradient(90deg, #10b981, #34d399)", transition: "width 0.3s ease" }}></div>
        </div>

        <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--accent)", display: "flex", alignItems: "center", gap: "6px" }}>
          <span>⭐</span> {score} XP
        </div>
      </div>

      {/* Story Selector Chips */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        {stories.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              playSound("click");
              setSelectedStoryId(s.id);
              setLineIdx(0);
              setScore(0);
              setCompleted(false);
              setFeedback(null);
            }}
            style={{
              padding: "8px 16px",
              borderRadius: "16px",
              border: selectedStoryId === s.id ? "2px solid #10b981" : "1px solid var(--card-border)",
              background: selectedStoryId === s.id ? "rgba(16, 185, 129, 0.15)" : "var(--panel-active)",
              color: selectedStoryId === s.id ? "#10b981" : "var(--text-main)",
              fontWeight: 700,
              fontSize: "0.85rem",
              cursor: "pointer"
            }}
          >
            {s.icon} {s.title}
          </button>
        ))}
      </div>

      {/* Main Duolingo Story Stage */}
      <div
        className="content-card"
        style={{
          background: story.bgTheme,
          borderRadius: "24px",
          border: "2px solid var(--card-border)",
          padding: "25px",
          minHeight: "480px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >
        {!completed ? (
          <>
            {/* Stage Character Avatars (Duolingo Style Face-to-Face) */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "25px", padding: "0 10px" }}>
              {/* NPC Character Left */}
              <div style={{ textAlign: "center", transform: currentLine?.speaker === "npc" ? "scale(1.08)" : "scale(0.95)", transition: "all 0.3s ease" }}>
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "2.8rem",
                    boxShadow: currentLine?.speaker === "npc" ? "0 0 20px rgba(59, 130, 246, 0.5)" : "none",
                    border: "3px solid #ffffff"
                  }}
                >
                  {story.npcAvatar}
                </div>
                <div style={{ marginTop: "6px", fontWeight: 800, fontSize: "0.95rem", color: "var(--text-main)" }}>{story.npcName}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--accent)" }}>{story.npcRole}</div>
              </div>

              {/* Center VS Indicator */}
              <div style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "2px" }}>
                Duolingo Japanese Story
              </div>

              {/* User Character Right */}
              <div style={{ textAlign: "center", transform: currentLine?.speaker === "user" ? "scale(1.08)" : "scale(0.95)", transition: "all 0.3s ease" }}>
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "2.8rem",
                    boxShadow: currentLine?.speaker === "user" ? "0 0 20px rgba(16, 185, 129, 0.5)" : "none",
                    border: "3px solid #ffffff"
                  }}
                >
                  👤
                </div>
                <div style={{ marginTop: "6px", fontWeight: 800, fontSize: "0.95rem", color: "var(--text-main)" }}>You</div>
                <div style={{ fontSize: "0.75rem", color: "#10b981" }}>Learner</div>
              </div>
            </div>

            {/* Line History Stream (Duolingo Dialogue Bubbles) */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px", overflowY: "auto", marginBottom: "20px" }}>
              {story.lines.slice(0, lineIdx + 1).map((line, idx) => {
                const isNpc = line.speaker === "npc";
                const isLatest = idx === lineIdx;

                if (!line.japanese || line.japanese === "Choose your response:") return null;

                return (
                  <div
                    key={line.id}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      flexDirection: isNpc ? "row" : "row-reverse",
                      animation: isLatest ? "slideIn 0.3s ease" : "none"
                    }}
                  >
                    {/* Speech Bubble */}
                    <div
                      style={{
                        maxWidth: "78%",
                        padding: "16px 20px",
                        borderRadius: isNpc ? "20px 20px 20px 4px" : "20px 20px 4px 20px",
                        background: isNpc ? "var(--panel-active)" : "rgba(16, 185, 129, 0.18)",
                        border: isLatest ? "2px solid #10b981" : "1px solid var(--card-border)",
                        boxShadow: isLatest ? "0 6px 20px rgba(0,0,0,0.15)" : "none"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px", gap: "10px" }}>
                        <span style={{ fontSize: "0.75rem", fontWeight: 800, color: isNpc ? "#3b82f6" : "#10b981" }}>
                          {isNpc ? line.npcName : "You"}
                        </span>

                        <button
                          onClick={() => speakJapanese(line.japanese)}
                          style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: "1rem" }}
                        >
                          🔊
                        </button>
                      </div>

                      <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--text-main)" }}>
                        {line.japanese}
                      </div>

                      <div style={{ fontSize: "0.85rem", color: "var(--accent)", marginTop: "4px" }}>
                        {line.romaji}
                      </div>

                      <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontStyle: "italic", marginTop: "2px" }}>
                        "{line.english}"
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Bottom Area: Continue Button or Choice Options */}
            <div>
              {currentLine.speaker === "npc" && (
                <button
                  className="btn-action"
                  onClick={() => {
                    playSound("click");
                    if (lineIdx + 1 < story.lines.length) {
                      setLineIdx((prev) => prev + 1);
                    } else {
                      setCompleted(true);
                      playSound("success");
                    }
                  }}
                  style={{
                    width: "100%",
                    padding: "16px",
                    fontSize: "1.1rem",
                    fontWeight: 800,
                    borderRadius: "16px",
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    boxShadow: "0 8px 20px rgba(16, 185, 129, 0.4)",
                    border: "none",
                    color: "#ffffff",
                    cursor: "pointer"
                  }}
                >
                  Continue Story ➔
                </button>
              )}

              {currentLine.speaker === "user" && currentLine.options && (
                <div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "12px" }}>
                    🤔 Select the correct Japanese response:
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {currentLine.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(opt)}
                        style={{
                          padding: "16px 20px",
                          borderRadius: "16px",
                          background: "var(--panel-active)",
                          border: "2px solid var(--card-border)",
                          textAlign: "left",
                          cursor: "pointer",
                          transition: "transform 0.15s ease",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                        }}
                      >
                        <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text-main)" }}>
                          {opt.text}
                        </div>
                        <div style={{ fontSize: "0.85rem", color: "var(--accent)", marginTop: "2px" }}>
                          {opt.romaji}
                        </div>
                        <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                          "{opt.english}"
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Feedback Banner */}
              {feedback && (
                <div
                  style={{
                    marginTop: "16px",
                    padding: "14px 20px",
                    borderRadius: "16px",
                    background: "rgba(16, 185, 129, 0.2)",
                    border: "1.5px solid #10b981",
                    color: "#10b981",
                    fontWeight: 800,
                    fontSize: "0.95rem"
                  }}
                >
                  {feedback}
                </div>
              )}
            </div>
          </>
        ) : (
          /* Duolingo Completion Screen */
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ fontSize: "5rem", marginBottom: "15px" }}>🎉</div>
            <h3 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-main)" }}>
              Story Complete!
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "1rem", margin: "10px 0 25px 0" }}>
              You completed <strong>{story.title}</strong> and practiced real Japanese dialogue!
            </p>
            <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#10b981", marginBottom: "30px" }}>
              + {score} XP Earned!
            </div>

            <div style={{ display: "flex", gap: "14px", justifyContent: "center" }}>
              <button
                className="btn-utility"
                onClick={() => {
                  setLineIdx(0);
                  setScore(0);
                  setCompleted(false);
                }}
                style={{ padding: "14px 24px", fontSize: "0.95rem" }}
              >
                Replay Story 🔄
              </button>

              <button
                className="btn-action"
                onClick={() => {
                  playSound("click");
                  setActiveView("dashboard");
                }}
                style={{ padding: "14px 28px", fontSize: "0.95rem", background: "linear-gradient(135deg, #10b981, #059669)" }}
              >
                Continue Path ➔
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
