"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { lessons, dictionary, kanjiData } from "@/lib/data";

export function StudyModal({ lessonId, onClose }: { lessonId: number | null; onClose: () => void }) {
  const { markLessonSolved, markNodeSolved, playSound, speakJapanese } = useApp();
  const [slideIndex, setSlideIndex] = useState(0);

  const lesson = lessons.find((l) => l.id === lessonId);

  useEffect(() => {
    setSlideIndex(0);
  }, [lessonId]);

  if (!lessonId || !lesson) return null;

  // Build slides
  const grammarItems = lesson.syllabus.filter((item) => item.startsWith("Grammar:"));
  const vocabItems = (lesson.vocabulary || [])
    .map((hiragana) => dictionary.find((d) => d.reading === hiragana || d.word === hiragana))
    .filter(Boolean);
  const kanjiItems = (lesson.kanji || [])
    .map((char) => kanjiData.find((k) => k.char === char))
    .filter(Boolean);

  const totalSlides = 3;

  const handleNext = () => {
    playSound("click");
    if (slideIndex < totalSlides - 1) {
      setSlideIndex((prev) => prev + 1);
    } else {
      markLessonSolved(lesson.id);
      if (lesson.id === 1) markNodeSolved(4);
      else if (lesson.id === 2) markNodeSolved(5);
      else if (lesson.id === 3) markNodeSolved(7);
      else if (lesson.id === 5) markNodeSolved(10);
      else if (lesson.id === 7) markNodeSolved(13);
      else markNodeSolved(lesson.id);

      playSound("success");
      onClose();
    }
  };

  const handlePrev = () => {
    if (slideIndex > 0) {
      playSound("click");
      setSlideIndex((prev) => prev - 1);
    }
  };

  return (
    <div id="study-modal" className="modal-backdrop active">
      <div
        className="modal-content"
        style={{
          maxWidth: "650px",
          width: "92%",
          padding: "25px",
          borderRadius: "var(--border-radius-lg)",
          background: "var(--card-bg)",
          border: "1px solid var(--card-border)",
          boxShadow: "var(--shadow-hover)"
        }}
      >
        <div className="modal-header" style={{ marginBottom: "15px", borderBottom: "1px solid var(--card-border)", paddingBottom: "10px" }}>
          <h3 id="study-modal-title" style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-main)" }}>
            Study Lesson {lesson.id}: {lesson.title}
          </h3>
          <button className="btn-close-modal" id="btn-close-study" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Slide Progress */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "15px" }}>
          <div style={{ flex: 1, height: "12px", background: "var(--panel-active)", borderRadius: "10px", overflow: "hidden" }}>
            <div
              style={{
                width: `${((slideIndex + 1) / totalSlides) * 100}%`,
                height: "100%",
                background: "linear-gradient(90deg, #58cc02, #78d804)",
                transition: "width 0.3s ease"
              }}
            ></div>
          </div>
          <span style={{ fontWeight: 700, color: "var(--text-muted)", fontSize: "0.85rem" }}>
            Slide {slideIndex + 1} of {totalSlides}
          </span>
        </div>

        {/* Slide Container */}
        <div style={{ minHeight: "240px", padding: "10px 0" }}>
          {slideIndex === 0 && (
            <div className="grammar-slide">
              <h4 style={{ marginBottom: "15px", color: "var(--accent)", fontWeight: 700, fontSize: "1.15rem", display: "flex", alignItems: "center", gap: "8px" }}>
                <i className="fa-solid fa-book-open-reader"></i> Grammar & Key Patterns
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "240px", overflowY: "auto" }}>
                {grammarItems.length > 0 ? (
                  grammarItems.map((item, idx) => (
                    <div key={idx} style={{ padding: "14px 16px", background: "var(--panel-active)", borderRadius: "var(--border-radius-md)", borderLeft: "4px solid var(--accent-secondary)" }}>
                      <span style={{ fontWeight: 700, color: "var(--text-main)", fontSize: "1.02rem" }}>
                        {item.replace("Grammar:", "").trim()}
                      </span>
                      <p style={{ fontSize: "0.86rem", color: "var(--text-muted)", marginTop: "6px" }}>
                        Learn and apply this pattern in conversation.
                      </p>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: "20px", background: "var(--panel-active)", borderRadius: "var(--border-radius-md)", textAlign: "center", color: "var(--text-muted)" }}>
                    No explicit grammar patterns listed for this lesson.
                  </div>
                )}
              </div>
            </div>
          )}

          {slideIndex === 1 && (
            <div className="vocab-slide">
              <h4 style={{ marginBottom: "5px", color: "var(--accent)", fontWeight: 700, fontSize: "1.15rem", display: "flex", alignItems: "center", gap: "8px" }}>
                <i className="fa-solid fa-volume-high"></i> Vocabulary Spotlight
              </h4>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "12px" }}>Tap the speaker icon to hear pronunciation.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", maxHeight: "240px", overflowY: "auto" }}>
                {vocabItems.length > 0 ? (
                  vocabItems.map((dictItem: any, idx) => (
                    <div key={idx} style={{ padding: "12px 14px", background: "var(--panel-active)", borderRadius: "var(--border-radius-md)", border: "1px solid var(--card-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-main)" }}>
                          {dictItem.word} <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>({dictItem.reading})</span>
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{dictItem.english}</div>
                      </div>
                      <button
                        onClick={() => speakJapanese(dictItem.word)}
                        style={{ background: "var(--panel-hover)", border: "none", borderRadius: "50%", width: "28px", height: "28px", cursor: "pointer", color: "var(--accent)" }}
                      >
                        <i className="fa-solid fa-volume-high" style={{ fontSize: "0.8rem" }}></i>
                      </button>
                    </div>
                  ))
                ) : (
                  <div style={{ gridColumn: "span 2", padding: "20px", background: "var(--panel-active)", borderRadius: "var(--border-radius-md)", textAlign: "center", color: "var(--text-muted)" }}>
                    No custom vocabulary listed for this lesson.
                  </div>
                )}
              </div>
            </div>
          )}

          {slideIndex === 2 && (
            <div className="kanji-slide">
              <h4 style={{ marginBottom: "5px", color: "var(--accent)", fontWeight: 700, fontSize: "1.15rem", display: "flex", alignItems: "center", gap: "8px" }}>
                <i className="fa-solid fa-pen-nib"></i> Kanji Spotlight
              </h4>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "12px" }}>Essential N5 Kanji characters in this lesson.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", maxHeight: "240px", overflowY: "auto" }}>
                {kanjiItems.length > 0 ? (
                  kanjiItems.map((kanjiItem: any, idx) => (
                    <div key={idx} style={{ padding: "12px", background: "var(--panel-active)", borderRadius: "var(--border-radius-md)", border: "1px solid var(--card-border)", display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--accent)", minWidth: "40px", textAlign: "center" }}>
                        {kanjiItem.char}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-main)" }}>{kanjiItem.english}</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Onyomi: {kanjiItem.onyomi}</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Kunyomi: {kanjiItem.kunyomi}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ gridColumn: "span 2", padding: "20px", background: "var(--panel-active)", borderRadius: "var(--border-radius-md)", textAlign: "center", color: "var(--text-muted)" }}>
                    No custom Kanji listed for this lesson.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "15px", paddingTop: "15px", borderTop: "1px solid var(--card-border)" }}>
          <button
            className="btn-utility"
            onClick={handlePrev}
            disabled={slideIndex === 0}
            style={{ padding: "12px 20px", fontWeight: 700, borderRadius: "12px", opacity: slideIndex === 0 ? 0.5 : 1 }}
          >
            <i className="fa-solid fa-chevron-left"></i> Prev
          </button>
          <button
            className="lesson-btn-start"
            onClick={handleNext}
            style={{ marginTop: 0, padding: "12px 26px", fontSize: "0.95rem", borderRadius: "12px" }}
          >
            {slideIndex === totalSlides - 1 ? (
              <>
                Finish & Unlock Path ➔ <i className="fa-solid fa-seedling" style={{ marginLeft: "4px" }}></i>
              </>
            ) : (
              <>
                Next <i className="fa-solid fa-chevron-right" style={{ marginLeft: "4px" }}></i>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
