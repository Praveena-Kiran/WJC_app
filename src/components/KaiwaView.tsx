"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";

export interface DialogueTurn {
  speaker: string;
  avatar: string;
  japanese: string;
  furigana: string;
  romaji: string;
  english: string;
  options?: Array<{
    text: string;
    romaji: string;
    english: string;
    isCorrect: boolean;
    feedback: string;
  }>;
}

export interface Scenario {
  id: string;
  title: string;
  japaneseTitle: string;
  category: string;
  icon: string;
  description: string;
  dialogue: DialogueTurn[];
}

const scenarios: Scenario[] = [
  {
    id: "cafe",
    title: "At a Tokyo Cafe",
    japaneseTitle: "喫茶店で",
    category: "Food & Dining",
    icon: "fa-solid fa-mug-hot",
    description: "Order a coffee, specify hot/iced, and handle payment at a traditional kissaten in Shibuya.",
    dialogue: [
      {
        speaker: "Clerk (店員)",
        avatar: "☕",
        japanese: "いらっしゃいませ！ご注文はお決まりですか？",
        furigana: "いらっしゃいませ！ごちゅうもんはおきまりですか？",
        romaji: "Irasshaimase! Go-chuumon wa o-kimari desu ka?",
        english: "Welcome! Are you ready to order?"
      },
      {
        speaker: "You (あなた)",
        avatar: "👤",
        japanese: "Choose your response:",
        furigana: "",
        romaji: "",
        english: "",
        options: [
          {
            text: "コーヒーをひとつください。",
            romaji: "Koohii o hitotsu kudasai.",
            english: "One coffee, please.",
            isCorrect: true,
            feedback: "Perfect! 'Hitotsu kudasai' is the natural way to order 1 item."
          },
          {
            text: "水はいりません。",
            romaji: "Mizu wa irimasen.",
            english: "I don't need water.",
            isCorrect: false,
            feedback: "A bit abrupt! Order your item first using 'kudasai'."
          },
          {
            text: "さようなら。",
            romaji: "Sayounara.",
            english: "Goodbye.",
            isCorrect: false,
            feedback: "Don't leave yet! You haven't ordered."
          }
        ]
      },
      {
        speaker: "Clerk (店員)",
        avatar: "☕",
        japanese: "かしこまりました。ホットとアイス、どちらにしますか？",
        furigana: "かしこまりました。ホットとアイス、どちらにしますか？",
        romaji: "Kashikomarima shita. Hotto to aisu, dochira ni shimasu ka?",
        english: "Certainly. Would you like hot or iced?"
      },
      {
        speaker: "You (あなた)",
        avatar: "👤",
        japanese: "Choose your response:",
        furigana: "",
        romaji: "",
        english: "",
        options: [
          {
            text: "アイスコーヒーでお願いします。",
            romaji: "Aisu koohii de onegaishimasu.",
            english: "Iced coffee, please.",
            isCorrect: true,
            feedback: "Great! 'de onegaishimasu' is polite and accurate."
          },
          {
            text: "あついです。",
            romaji: "Atsui desu.",
            english: "It is hot.",
            isCorrect: false,
            feedback: "Say 'Hotto de' or 'Aisu de' to specify beverage temperature."
          }
        ]
      },
      {
        speaker: "Clerk (店員)",
        avatar: "☕",
        japanese: "ありがとうございます。450円になります。",
        furigana: "ありがとうございます。450えんになります。",
        romaji: "Arigatou gozaimasu. Yonhyaku gojuu en ni narimasu.",
        english: "Thank you. That will be 450 yen."
      },
      {
        speaker: "You (あなた)",
        avatar: "👤",
        japanese: "Choose your response:",
        furigana: "",
        romaji: "",
        english: "",
        options: [
          {
            text: "はい、どうぞ。ありがとう。",
            romaji: "Hai, douzo. Arigatou.",
            english: "Here you go. Thank you.",
            isCorrect: true,
            feedback: "Excellent polite cafe exchange!"
          },
          {
            text: "たかいです！",
            romaji: "Takai desu!",
            english: "That's expensive!",
            isCorrect: false,
            feedback: "Haha, 450 yen is standard price for Tokyo coffee!"
          }
        ]
      }
    ]
  },
  {
    id: "konbini",
    title: "At the Konbini (Convenience Store)",
    japaneseTitle: "コンビニで",
    category: "Daily Life",
    icon: "fa-solid fa-store",
    description: "Buy a bento, answer bento warming questions, and get chopsticks.",
    dialogue: [
      {
        speaker: "Clerk (店員)",
        avatar: "🏪",
        japanese: "お弁当、温めますか？",
        furigana: "おべんとう、あたためますか？",
        romaji: "Obentou, atatame masu ka?",
        english: "Would you like your bento warmed up?"
      },
      {
        speaker: "You (あなた)",
        avatar: "👤",
        japanese: "Choose your response:",
        furigana: "",
        romaji: "",
        english: "",
        options: [
          {
            text: "はい、おねがいします。",
            romaji: "Hai, onegaishimasu.",
            english: "Yes, please.",
            isCorrect: true,
            feedback: "Spot on! 'Hai, onegaishimasu' confirms warming."
          },
          {
            text: "いいえ、たべません。",
            romaji: "Iie, tabemasen.",
            english: "No, I won't eat.",
            isCorrect: false,
            feedback: "If you don't want it warmed, say 'Daijoubu desu' or 'Sono mama de'."
          }
        ]
      },
      {
        speaker: "Clerk (店員)",
        avatar: "🏪",
        japanese: "お箸はお付けしますか？",
        furigana: "おはしはおつけしますか？",
        romaji: "O-hashi wa otsuke shimasu ka?",
        english: "Should I include chopsticks?"
      },
      {
        speaker: "You (あなた)",
        avatar: "👤",
        japanese: "Choose your response:",
        furigana: "",
        romaji: "",
        english: "",
        options: [
          {
            text: "はい、一膳おねがいします。",
            romaji: "Hai, ichizen onegaishimasu.",
            english: "Yes, one pair please.",
            isCorrect: true,
            feedback: "Perfect! 'Ichizen' is the counter for chopsticks."
          },
          {
            text: "スプーンをください。",
            romaji: "Supuun o kudasai.",
            english: "Please give me a spoon.",
            isCorrect: true,
            feedback: "Also valid if eating soup or curry!"
          }
        ]
      }
    ]
  },
  {
    id: "station",
    title: "Tokyo Train Station",
    japaneseTitle: "東京駅で",
    category: "Travel & Transit",
    icon: "fa-solid fa-train",
    description: "Purchase a ticket to Kyoto and confirm the track platform number.",
    dialogue: [
      {
        speaker: "Staff (駅員)",
        avatar: "🚉",
        japanese: "どちらまでいらっしゃいますか？",
        furigana: "どちらまでいらっしゃいますか？",
        romaji: "Dochira made irasshaimasu ka?",
        english: "Where are you traveling to?"
      },
      {
        speaker: "You (あなた)",
        avatar: "👤",
        japanese: "Choose your response:",
        furigana: "",
        romaji: "",
        english: "",
        options: [
          {
            text: "京都までのチケットを一枚ください。",
            romaji: "Kyouto made no chiketto o ichimai kudasai.",
            english: "One ticket to Kyoto, please.",
            isCorrect: true,
            feedback: "Great! 'Ichimai' is the flat item counter for tickets."
          },
          {
            text: "どこですか？",
            romaji: "Doko desu ka?",
            english: "Where is it?",
            isCorrect: false,
            feedback: "State your destination first: 'Kyoto made'."
          }
        ]
      },
      {
        speaker: "Staff (駅員)",
        avatar: "🚉",
        japanese: "はい。新幹線は14番線から発車します。",
        furigana: "はい。しんかんせんはじゅうよんばんせんからはっしゃします。",
        romaji: "Hai. Shinkansen wa juu-yon ban sen kara hassha shimasu.",
        english: "Yes. The Shinkansen departs from Track 14."
      },
      {
        speaker: "You (あなた)",
        avatar: "👤",
        japanese: "Choose your response:",
        furigana: "",
        romaji: "",
        english: "",
        options: [
          {
            text: "14番線ですね。ありがとうございます！",
            romaji: "Juu-yon ban sen desu ne. Arigatou gozaimasu!",
            english: "Track 14, right? Thank you very much!",
            isCorrect: true,
            feedback: "Excellent confirmation using particle 'ne'."
          }
        ]
      }
    ]
  }
];

export function KaiwaView() {
  const { setActiveView, markNodeSolved, speakJapanese, playSound } = useApp();
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("cafe");
  const [currentTurnIndex, setCurrentTurnIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showRomaji, setShowRomaji] = useState<boolean>(true);
  const [showEnglish, setShowEnglish] = useState<boolean>(true);

  // Mark Kaiwa Node 6 or 11 solved on completion
  useEffect(() => {
    if (completed) {
      if (selectedScenarioId === "cafe") markNodeSolved(11);
      else markNodeSolved(6);
    }
  }, [completed]);

  const scenario = scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0];
  const currentTurn = scenario.dialogue[currentTurnIndex];

  const handleSelectOption = (option: NonNullable<DialogueTurn["options"]>[number]) => {
    setFeedback(option.feedback);
    if (option.isCorrect) {
      playSound("correct");
      setScore((prev) => prev + 10);
    } else {
      playSound("incorrect");
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentTurnIndex + 1 < scenario.dialogue.length) {
        setCurrentTurnIndex((prev) => prev + 1);
      } else {
        setCompleted(true);
        playSound("success");
      }
    }, 1400);
  };

  const handleRestart = () => {
    setCurrentTurnIndex(0);
    setScore(0);
    setCompleted(false);
    setFeedback(null);
  };

  return (
    <section id="kaiwa-view" className="view-section active">
      <div className="header-row">
        <div className="welcome-msg">
          <h2>会話 Kaiwa Roleplay Engine</h2>
          <p>Practice real-world Japanese conversation scenarios with interactive dialogue, audio, and choice branching.</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            className={`btn-utility ${showRomaji ? "active" : ""}`}
            onClick={() => setShowRomaji(!showRomaji)}
            style={{ fontSize: "0.8rem" }}
          >
            Romaji: {showRomaji ? "ON" : "OFF"}
          </button>
          <button
            className={`btn-utility ${showEnglish ? "active" : ""}`}
            onClick={() => setShowEnglish(!showEnglish)}
            style={{ fontSize: "0.8rem" }}
          >
            English: {showEnglish ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      {/* Scenario Selector Chips */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "25px" }}>
        {scenarios.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              playSound("click");
              setSelectedScenarioId(s.id);
              setCurrentTurnIndex(0);
              setScore(0);
              setCompleted(false);
              setFeedback(null);
            }}
            style={{
              padding: "10px 16px",
              borderRadius: "20px",
              border: selectedScenarioId === s.id ? "2px solid var(--accent)" : "1px solid var(--card-border)",
              background: selectedScenarioId === s.id ? "rgba(34, 102, 76, 0.15)" : "var(--panel-active)",
              color: selectedScenarioId === s.id ? "var(--accent)" : "var(--text-main)",
              fontWeight: 700,
              fontSize: "0.86rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <i className={s.icon}></i>
            <span>{s.title} ({s.japaneseTitle})</span>
          </button>
        ))}
      </div>

      {/* Interactive Dialogue Container */}
      <div className="content-card" style={{ borderLeft: "5px solid var(--accent)" }}>
        <div className="card-title" style={{ justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <i className={scenario.icon} style={{ color: "var(--accent)" }}></i>
            <span>{scenario.title} — {scenario.japaneseTitle}</span>
          </div>
          <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--accent)" }}>
            Score: {score} pts
          </span>
        </div>

        {!completed ? (
          <div>
            {/* Previous Turn History */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px", maxHeight: "300px", overflowY: "auto" }}>
              {scenario.dialogue.slice(0, currentTurnIndex).map((turn, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "12px 14px",
                    borderRadius: "var(--border-radius-md)",
                    background: turn.speaker.includes("You") ? "rgba(92, 96, 245, 0.08)" : "var(--panel-active)",
                    border: "1px solid var(--card-border)"
                  }}
                >
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--accent)", marginBottom: "4px" }}>
                    {turn.avatar} {turn.speaker}
                  </div>
                  <div style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-main)" }}>
                    {turn.japanese}
                  </div>
                  {showRomaji && turn.romaji && (
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
                      {turn.romaji}
                    </div>
                  )}
                  {showEnglish && turn.english && (
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                      "{turn.english}"
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Active Turn */}
            <div
              style={{
                padding: "16px",
                borderRadius: "var(--border-radius-lg)",
                background: currentTurn.speaker.includes("You") ? "rgba(92, 96, 245, 0.12)" : "var(--panel-active)",
                border: "2px solid var(--accent)",
                marginBottom: "20px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--accent)" }}>
                  {currentTurn.avatar} {currentTurn.speaker}
                </span>
                {!currentTurn.options && (
                  <button
                    className="btn-utility"
                    onClick={() => speakJapanese(currentTurn.japanese)}
                    style={{ padding: "4px 10px", fontSize: "0.78rem" }}
                  >
                    <i className="fa-solid fa-volume-high"></i> Listen Audio
                  </button>
                )}
              </div>

              <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-main)" }}>
                {currentTurn.japanese}
              </div>
              {showRomaji && currentTurn.romaji && (
                <div style={{ fontSize: "0.88rem", color: "var(--accent-secondary)", marginTop: "4px" }}>
                  {currentTurn.romaji}
                </div>
              )}
              {showEnglish && currentTurn.english && (
                <div style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginTop: "2px", fontStyle: "italic" }}>
                  "{currentTurn.english}"
                </div>
              )}

              {/* Speaker Advance Button if no options */}
              {!currentTurn.options && (
                <button
                  className="btn-action"
                  onClick={() => {
                    playSound("click");
                    if (currentTurnIndex + 1 < scenario.dialogue.length) {
                      setCurrentTurnIndex((prev) => prev + 1);
                    } else {
                      setCompleted(true);
                      playSound("success");
                    }
                  }}
                  style={{ marginTop: "14px" }}
                >
                  Continue Dialogue <i className="fa-solid fa-arrow-right" style={{ marginLeft: "4px" }}></i>
                </button>
              )}
            </div>

            {/* Options Selection Grid */}
            {currentTurn.options && (
              <div>
                <div style={{ fontSize: "0.86rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "10px" }}>
                  Select your response in Japanese:
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {currentTurn.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(opt)}
                      style={{
                        padding: "14px 16px",
                        borderRadius: "var(--border-radius-md)",
                        background: "var(--card-bg)",
                        border: "1.5px solid var(--card-border)",
                        textAlign: "left",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-main)" }}>
                        {opt.text}
                      </div>
                      {showRomaji && (
                        <div style={{ fontSize: "0.8rem", color: "var(--accent)" }}>
                          {opt.romaji}
                        </div>
                      )}
                      {showEnglish && (
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                          "{opt.english}"
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Instant Feedback Notice */}
            {feedback && (
              <div style={{ marginTop: "15px", padding: "12px", borderRadius: "var(--border-radius-md)", background: "rgba(34, 102, 76, 0.15)", color: "var(--accent-success, #10b981)", fontWeight: 700, fontSize: "0.9rem" }}>
                {feedback}
              </div>
            )}
          </div>
        ) : (
          /* Completion Summary */
          <div style={{ textAlign: "center", padding: "30px 20px" }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "10px" }}>🎉</div>
            <h3 style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--text-main)" }}>
              Scenario Completed!
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", margin: "8px 0 20px 0" }}>
              Great job practicing your conversational Japanese at the <strong>{scenario.title}</strong>!
            </p>
            <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--accent)", marginBottom: "25px" }}>
              Final Score: {score} Points
            </div>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button className="btn-utility" onClick={handleRestart} style={{ padding: "12px 20px" }}>
                Practice Again <i className="fa-solid fa-rotate-right" style={{ marginLeft: "6px" }}></i>
              </button>
              <button
                className="btn-action"
                onClick={() => {
                  playSound("click");
                  setActiveView("dashboard");
                }}
                style={{ padding: "12px 24px", background: "linear-gradient(135deg, var(--accent), var(--accent-secondary))" }}
              >
                Continue Master Path <i className="fa-solid fa-arrow-right" style={{ marginLeft: "6px" }}></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
