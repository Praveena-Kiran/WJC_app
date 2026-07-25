"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { kanaData, dictionary } from "@/lib/data";

interface QuizQuestion {
  prompt: string;
  correctAnswer: string;
  options: string[];
}

export function QuizView() {
  const { playSound } = useApp();
  const [deckType, setDeckType] = useState<"hiragana" | "katakana" | "vocab">("hiragana");
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [quizState, setQuizState] = useState<"lobby" | "active" | "finished">("lobby");

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const generateQuiz = () => {
    playSound("click");
    let pool: Array<{ prompt: string; answer: string }> = [];

    if (deckType === "hiragana" || deckType === "katakana") {
      pool = kanaData
        .filter((k) => k.type === deckType)
        .map((k) => ({ prompt: k.char, answer: k.romaji }));
    } else {
      pool = dictionary.map((d) => ({ prompt: d.word, answer: d.english }));
    }

    // Shuffle pool
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, questionCount);

    const generatedQuestions: QuizQuestion[] = selected.map((q) => {
      // Pick 3 wrong options
      const otherAnswers = pool.map((p) => p.answer).filter((a) => a !== q.answer);
      const wrongOptions = [...otherAnswers].sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [...wrongOptions, q.answer].sort(() => Math.random() - 0.5);

      return {
        prompt: q.prompt,
        correctAnswer: q.answer,
        options
      };
    });

    setQuestions(generatedQuestions);
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setQuizState("active");
  };

  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    const currentQ = questions[currentIndex];
    if (option === currentQ.correctAnswer) {
      playSound("correct");
      setScore((prev) => prev + 1);
    } else {
      playSound("incorrect");
    }
  };

  const handleNextQuestion = () => {
    playSound("click");
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      playSound("success");
      setQuizState("finished");
    }
  };

  return (
    <section id="quiz-view" className="view-section active">
      <div className="header-row">
        <div className="welcome-msg">
          <h2>Multiple Choice Kana & Vocab Quiz</h2>
          <p>Test your knowledge under timed or casual quiz sessions. Track score accuracy.</p>
        </div>
      </div>

      <div className="content-card" style={{ maxWidth: "680px", margin: "0 auto" }}>
        {/* State 1: Quiz Lobby */}
        {quizState === "lobby" && (
          <div style={{ textAlign: "center", padding: "20px 10px" }}>
            <i className="fa-solid fa-gamepad" style={{ fontSize: "3rem", color: "var(--accent)", marginBottom: "15px" }}></i>
            <h3 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "20px" }}>Configure Quiz Parameters</h3>

            <div style={{ marginBottom: "20px" }}>
              <div className="mode-control-label" style={{ marginBottom: "8px" }}>Select Deck</div>
              <div className="btn-group" style={{ justifyContent: "center" }}>
                <button
                  className={`btn-tab ${deckType === "hiragana" ? "active" : ""}`}
                  onClick={() => setDeckType("hiragana")}
                >
                  Hiragana
                </button>
                <button
                  className={`btn-tab ${deckType === "katakana" ? "active" : ""}`}
                  onClick={() => setDeckType("katakana")}
                >
                  Katakana
                </button>
                <button
                  className={`btn-tab ${deckType === "vocab" ? "active" : ""}`}
                  onClick={() => setDeckType("vocab")}
                >
                  N5 Vocabulary
                </button>
              </div>
            </div>

            <div style={{ marginBottom: "30px" }}>
              <div className="mode-control-label" style={{ marginBottom: "8px" }}>Question Count</div>
              <div className="btn-group" style={{ justifyContent: "center" }}>
                {[5, 10, 20].map((cnt) => (
                  <button
                    key={cnt}
                    className={`btn-tab ${questionCount === cnt ? "active" : ""}`}
                    onClick={() => setQuestionCount(cnt)}
                  >
                    {cnt} Questions
                  </button>
                ))}
              </div>
            </div>

            <button
              className="lesson-btn-start"
              onClick={generateQuiz}
              style={{ padding: "14px 32px", fontSize: "1.05rem", borderRadius: "var(--border-radius-md)", width: "100%", maxWidth: "300px", margin: "0 auto" }}
            >
              <i className="fa-solid fa-play"></i> Start Challenge
            </button>
          </div>
        )}

        {/* State 2: Active Quiz */}
        {quizState === "active" && questions.length > 0 && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid var(--card-border)", paddingBottom: "12px" }}>
              <span style={{ fontWeight: 700, color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span style={{ fontWeight: 700, color: "var(--accent)", fontSize: "0.95rem" }}>
                Score: {score}
              </span>
            </div>

            {/* Prompt */}
            <div style={{ textAlign: "center", margin: "30px 0" }}>
              <span style={{ fontSize: "4.5rem", fontWeight: 700, color: "var(--accent)" }}>
                {questions[currentIndex].prompt}
              </span>
            </div>

            {/* Options */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "25px" }}>
              {questions[currentIndex].options.map((option, idx) => {
                let btnStyle: React.CSSProperties = {
                  padding: "16px",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  borderRadius: "var(--border-radius-md)",
                  border: "1px solid var(--card-border)",
                  background: "var(--panel-active)",
                  color: "var(--text-main)",
                  cursor: isAnswered ? "default" : "pointer"
                };

                if (isAnswered) {
                  if (option === questions[currentIndex].correctAnswer) {
                    btnStyle.background = "rgba(16, 185, 129, 0.2)";
                    btnStyle.border = "2px solid var(--accent-success, #10b981)";
                    btnStyle.color = "var(--accent-success, #10b981)";
                  } else if (option === selectedOption) {
                    btnStyle.background = "rgba(239, 68, 68, 0.2)";
                    btnStyle.border = "2px solid #ef4444";
                    btnStyle.color = "#ef4444";
                  }
                }

                return (
                  <button
                    key={idx}
                    style={btnStyle}
                    onClick={() => handleOptionSelect(option)}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <button
                className="lesson-btn-start"
                onClick={handleNextQuestion}
                style={{ width: "100%", justifyContent: "center", marginTop: 0 }}
              >
                {currentIndex === questions.length - 1 ? "Finish Quiz" : "Next Question →"}
              </button>
            )}
          </div>
        )}

        {/* State 3: Quiz Finished */}
        {quizState === "finished" && (
          <div style={{ textAlign: "center", padding: "30px 10px" }}>
            <i className="fa-solid fa-trophy" style={{ fontSize: "3.5rem", color: "#f59e0b", marginBottom: "15px" }}></i>
            <h3 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: "8px" }}>Quiz Completed!</h3>
            <p style={{ fontSize: "1.1rem", color: "var(--text-muted)", marginBottom: "20px" }}>
              You scored <strong>{score}</strong> out of <strong>{questions.length}</strong> ({Math.round((score / questions.length) * 100)}%)
            </p>

            <button
              className="lesson-btn-start"
              onClick={() => setQuizState("lobby")}
              style={{ padding: "14px 32px", fontSize: "1rem", borderRadius: "var(--border-radius-md)", width: "100%", maxWidth: "260px", margin: "0 auto" }}
            >
              Return to Lobby
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
