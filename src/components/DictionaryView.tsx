"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { dictionary, conjugateVerb } from "@/lib/data";

export function DictionaryView() {
  const { state, toggleStarVocab, speakJapanese, playSound } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [conjugateInput, setConjugateInput] = useState("たべる");

  // Verb conjugator calculation
  const conjugationResult = conjugateVerb(conjugateInput.trim());

  // Filter dictionary
  const filteredWords = dictionary.filter((item: any) => {
    // Category filter
    if (activeCategory === "starred") {
      if (!state.starredVocab.includes(item.word)) return false;
    } else if (activeCategory !== "all") {
      if (!item.tag || !item.tag.toLowerCase().includes(activeCategory.slice(0, 4))) return false;
    }

    // Search query filter
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.word.toLowerCase().includes(q) ||
      item.reading.toLowerCase().includes(q) ||
      item.english.toLowerCase().includes(q) ||
      (item.romaji && item.romaji.toLowerCase().includes(q))
    );
  });

  return (
    <section id="dictionary-view" className="view-section active">
      <div className="header-row">
        <div className="welcome-msg">
          <h2>Dictionary & Verb Conjugator</h2>
          <p>Search over 100+ JLPT vocabulary words, view grammar tags, or test verb form conjugations live.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Search & Word List */}
        <div className="content-card">
          <div className="search-container" style={{ marginBottom: "15px" }}>
            <i className="fa-solid fa-magnifying-glass search-icon"></i>
            <input
              type="text"
              className="search-input"
              placeholder="Search by English, Japanese, or Romaji..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Chips */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
            {["all", "verbs", "nouns", "adjectives", "phrases", "starred"].map((cat) => (
              <button
                key={cat}
                className={`btn-utility ${activeCategory === cat ? "active" : ""}`}
                onClick={() => {
                  playSound("click");
                  setActiveCategory(cat);
                }}
                style={{
                  padding: "6px 14px",
                  fontSize: "0.82rem",
                  borderRadius: "20px",
                  textTransform: "capitalize",
                  backgroundColor: activeCategory === cat ? "var(--accent)" : undefined,
                  color: activeCategory === cat ? "#fff" : undefined
                }}
              >
                {cat === "starred" ? `★ Starred (${state.starredVocab.length})` : cat}
              </button>
            ))}
          </div>

          {/* Word List */}
          <div className="vocab-list-container" style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "550px", overflowY: "auto", paddingRight: "5px" }}>
            {filteredWords.length === 0 ? (
              <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "20px" }}>
                No words match your search query.
              </p>
            ) : (
              filteredWords.map((item) => {
                const isStarred = state.starredVocab.includes(item.word);
                return (
                  <div
                    key={item.word}
                    style={{
                      padding: "16px",
                      background: "var(--panel-active)",
                      borderRadius: "var(--border-radius-md)",
                      border: "1px solid var(--card-border)",
                      boxShadow: "var(--shadow-sm)"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-main)", display: "flex", alignItems: "center", gap: "8px" }}>
                          <span>{item.word}</span>
                          <span style={{ fontSize: "0.88rem", fontWeight: 500, color: "var(--text-muted)" }}>
                            ({item.reading})
                          </span>
                          <span style={{ fontSize: "0.72rem", padding: "2px 8px", borderRadius: "10px", background: "var(--card-bg)", color: "var(--accent)", border: "1px solid var(--card-border)" }}>
                            {item.tag}
                          </span>
                        </div>
                        <div style={{ fontSize: "0.92rem", color: "var(--text-main)", marginTop: "4px" }}>
                          {item.english}
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <button
                          className="speak-btn"
                          onClick={() => speakJapanese(item.word)}
                          style={{ background: "var(--panel-hover)", border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", color: "var(--accent)" }}
                        >
                          <i className="fa-solid fa-volume-high"></i>
                        </button>
                        <button
                          onClick={() => toggleStarVocab(item.word)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: isStarred ? "#f59e0b" : "var(--text-muted)", fontSize: "1.1rem" }}
                        >
                          <i className={`fa-${isStarred ? "solid" : "regular"} fa-star`}></i>
                        </button>
                      </div>
                    </div>

                    {item.example && (
                      <div style={{ marginTop: "10px", padding: "8px 12px", background: "var(--card-bg)", borderRadius: "var(--border-radius-sm)", fontSize: "0.84rem", borderLeft: "3px solid var(--accent)" }}>
                        <div style={{ color: "var(--text-main)", fontWeight: 600 }}>{item.example.jp}</div>
                        <div style={{ color: "var(--text-muted)" }}>{item.example.en}</div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Live Verb Conjugator Engine */}
        <div>
          <div className="content-card">
            <div className="card-title">
              <i className="fa-solid fa-gears"></i>
              <span>Live Verb Conjugator Engine</span>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "15px" }}>
              Enter any dictionary form verb (e.g. たべる, いきます, はなす) to see instant conjugations.
            </p>

            <input
              type="text"
              className="search-input"
              value={conjugateInput}
              onChange={(e) => setConjugateInput(e.target.value)}
              placeholder="Enter dictionary verb..."
              style={{ marginBottom: "20px" }}
            />

            {conjugationResult ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ padding: "12px", background: "var(--panel-active)", borderRadius: "var(--border-radius-md)", border: "1px solid var(--card-border)" }}>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Verb Type</div>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--accent)" }}>{conjugationResult.type}</div>
                </div>
                <div style={{ padding: "12px", background: "var(--panel-active)", borderRadius: "var(--border-radius-md)", border: "1px solid var(--card-border)" }}>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Polite Form (-masu)</div>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-main)" }}>{conjugationResult.masu}</div>
                </div>
                <div style={{ padding: "12px", background: "var(--panel-active)", borderRadius: "var(--border-radius-md)", border: "1px solid var(--card-border)" }}>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Te-Form (Connecting)</div>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-main)" }}>{conjugationResult.te}</div>
                </div>
                <div style={{ padding: "12px", background: "var(--panel-active)", borderRadius: "var(--border-radius-md)", border: "1px solid var(--card-border)" }}>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Negative Form (-nai)</div>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-main)" }}>{conjugationResult.nai}</div>
                </div>
                <div style={{ padding: "12px", background: "var(--panel-active)", borderRadius: "var(--border-radius-md)", border: "1px solid var(--card-border)" }}>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Past Form (-ta)</div>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-main)" }}>{conjugationResult.ta}</div>
                </div>
              </div>
            ) : (
              <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
                Enter a valid Japanese verb in hiragana or kanji.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
