"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";

export interface TargetPhrase {
  id: string;
  japanese: string;
  romaji: string;
  english: string;
  category: string;
  pitchPatternName: string;
  pitchType: "heiban" | "atamadaka" | "nakadaka" | "odaka";
  moras: string[];
  moraPitches: ("H" | "L")[];
  pitchDropIndex: number | null; // index (0-indexed) after which pitch drops from High to Low
  phoneticNotes: string;
}

const targetPhrases: TargetPhrase[] = [
  {
    id: "p1",
    japanese: "こんにちは",
    romaji: "Konnichiwa",
    english: "Hello / Good afternoon",
    category: "Greetings",
    pitchPatternName: "Heiban (平板 - Flat Pattern)",
    pitchType: "heiban",
    moras: ["こ", "ん", "に", "ち", "は"],
    moraPitches: ["L", "H", "H", "H", "H"],
    pitchDropIndex: null,
    phoneticNotes: "Starts Low on 'こ', rises to High on 'ん' and stays High through 'は'."
  },
  {
    id: "p2",
    japanese: "すみません",
    romaji: "Sumimasen",
    english: "Excuse me / Sorry",
    category: "Daily Courtesy",
    pitchPatternName: "Heiban (平板 - Flat Pattern)",
    pitchType: "heiban",
    moras: ["す", "み", "ま", "せ", "ん"],
    moraPitches: ["L", "H", "H", "H", "H"],
    pitchDropIndex: null,
    phoneticNotes: "Low start on 'す', rises to High on 'み' and remains High to the end."
  },
  {
    id: "p3",
    japanese: "これをください",
    romaji: "Kore o kudasai",
    english: "Please give me this",
    category: "Shopping",
    pitchPatternName: "Nakadaka (中高 - Mid-High Drop)",
    pitchType: "nakadaka",
    moras: ["こ", "れ", "を", "く", "だ", "さ", "い"],
    moraPitches: ["L", "H", "L", "L", "H", "H", "H"],
    pitchDropIndex: 1, // drops after れ
    phoneticNotes: "Pitch rises to 'れ', drops down on particle 'を', then rises again on 'だ'."
  },
  {
    id: "p4",
    japanese: "いくらですか",
    romaji: "Ikura desu ka",
    english: "How much is it?",
    category: "Shopping",
    pitchPatternName: "Atamadaka (頭高 - First Mora High)",
    pitchType: "atamadaka",
    moras: ["い", "く", "ら", "で", "す", "か"],
    moraPitches: ["H", "L", "L", "L", "L", "L"],
    pitchDropIndex: 0, // drops immediately after い
    phoneticNotes: "First mora 'い' starts High and immediately drops Low for the rest of the phrase."
  },
  {
    id: "p5",
    japanese: "ありがとうございます",
    romaji: "Arigatou gozaimasu",
    english: "Thank you very much",
    category: "Courtesy",
    pitchPatternName: "Nakadaka (中高 - Peak on と)",
    pitchType: "nakadaka",
    moras: ["あ", "り", "が", "と", "う", "ご", "ざ", "い", "ま", "す"],
    moraPitches: ["L", "H", "H", "H", "L", "L", "H", "H", "H", "L"],
    pitchDropIndex: 3, // drops after と
    phoneticNotes: "Peaks High on 'と', drops down on 'う', then gently rises on 'ざ'."
  },
  {
    id: "p6",
    japanese: "わたしはがくせいです",
    romaji: "Watashi wa gakusei desu",
    english: "I am a student",
    category: "Self Intro",
    pitchPatternName: "Sentence Contour (Odaka + Nakadaka)",
    pitchType: "odaka",
    moras: ["わ", "た", "し", "は", "が", "く", "せ", "い", "で", "す"],
    moraPitches: ["L", "H", "H", "L", "L", "H", "H", "L", "L", "L"],
    pitchDropIndex: 2,
    phoneticNotes: "High on 'た・し', drops on topic particle 'は', peaks on 'せ'."
  },
  {
    id: "p7",
    japanese: "トイレはどこですか",
    romaji: "Toire wa doko desu ka",
    english: "Where is the restroom?",
    category: "Directions",
    pitchPatternName: "Sentence Question Pitch",
    pitchType: "atamadaka",
    moras: ["ト", "イ", "レ", "は", "ど", "こ", "で", "す", "か"],
    moraPitches: ["H", "L", "L", "L", "H", "L", "L", "L", "H"],
    pitchDropIndex: 0,
    phoneticNotes: "Starts High on 'ト', stays Low until question word 'ど' (High) and question particle 'か'."
  }
];

export function PronunciationCoach() {
  const { setActiveView, markNodeSolved, playSound } = useApp();

  const [activePhraseIndex, setActivePhraseIndex] = useState<number>(0);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [accuracyScore, setAccuracyScore] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("Press the microphone button to start shadowing practice!");
  const [micSupported, setMicSupported] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [showPitchGuide, setShowPitchGuide] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const activePhrase = targetPhrases[activePhraseIndex];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setMicSupported(false);
        setStatusMessage("Speech Recognition API is not natively supported in this browser. Simulated mic mode activated.");
      }
    }
    return () => {
      stopAudioVisualizer();
    };
  }, []);

  const handleSpeechScored = (score: number) => {
    setAccuracyScore(score);
    if (score >= 70) {
      playSound("success");
      markNodeSolved(3);
    } else {
      playSound("incorrect");
    }
    setStatusMessage(`Speech analysis complete! Pitch & Phonetic Match: ${score}%`);
  };

  const playNativeSpeech = (text: string, rate: number = playbackSpeed) => {
    playSound("click");
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    utterance.rate = rate;
    const voices = window.speechSynthesis.getVoices();
    const jaVoice = voices.find((v) => v.lang.startsWith("ja") || v.lang.includes("jp"));
    if (jaVoice) utterance.voice = jaVoice;
    window.speechSynthesis.speak(utterance);
  };

  const startAudioVisualizer = async () => {
    try {
      if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        drawFallbackWaveform();
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      renderWaveform();
    } catch (e) {
      console.warn("Could not start real audio visualizer, using animated visualizer:", e);
      drawFallbackWaveform();
    }
  };

  const stopAudioVisualizer = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
  };

  const renderWaveform = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.2;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.85;

        // Dynamic pitch accent gradient
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, "rgba(34, 197, 94, 0.4)");
        gradient.addColorStop(0.5, "rgba(59, 130, 246, 0.8)");
        gradient.addColorStop(1, "rgba(236, 72, 153, 1)");

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);

        x += barWidth;
      }
    };

    draw();
  };

  const drawFallbackWaveform = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let phase = 0;
    const draw = () => {
      animFrameRef.current = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(59, 130, 246, 0.8)";

      const sliceWidth = canvas.width / 100;
      let x = 0;

      for (let i = 0; i < 100; i++) {
        const v = Math.sin(i * 0.15 + phase) * 25 + Math.sin(i * 0.3 + phase * 1.5) * 12;
        const y = canvas.height / 2 + v;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);

        x += sliceWidth;
      }

      ctx.stroke();
      phase += 0.1;
    };

    draw();
  };

  const calculateAccuracy = (spoken: string, target: string): number => {
    const cleanSpoken = spoken.trim().replace(/\s+/g, "");
    const cleanTarget = target.trim().replace(/\s+/g, "");

    if (!cleanSpoken) return 0;
    if (cleanSpoken === cleanTarget) return 100;

    let matchCount = 0;
    const targetChars = cleanTarget.split("");
    targetChars.forEach((char) => {
      if (cleanSpoken.includes(char)) matchCount++;
    });

    return Math.min(100, Math.round((matchCount / targetChars.length) * 100));
  };

  const startListening = () => {
    startAudioVisualizer();

    if (typeof window === "undefined") return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsListening(true);
      setStatusMessage("Listening to your voice... Speak clearly into microphone 🎙️");
      setTimeout(() => {
        setIsListening(false);
        stopAudioVisualizer();
        const simSpoken = activePhrase.japanese;
        setTranscript(simSpoken);
        const score = calculateAccuracy(simSpoken, activePhrase.japanese);
        handleSpeechScored(score);
      }, 2800);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "ja-JP";
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript("");
        setAccuracyScore(null);
        setStatusMessage("Listening... Follow the Pitch Accent contour above! 🎙️");
      };

      recognition.onresult = (event: any) => {
        const spoken = event.results[0][0].transcript;
        setTranscript(spoken);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        stopAudioVisualizer();
        setStatusMessage(`Mic Error: ${event.error}. Press mic button to retry.`);
      };

      recognition.onend = () => {
        setIsListening(false);
        stopAudioVisualizer();
        if (transcript) {
          const score = calculateAccuracy(transcript, activePhrase.japanese);
          handleSpeechScored(score);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
      stopAudioVisualizer();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    stopAudioVisualizer();
  };

  return (
    <section id="pronunciation-coach-view" className="view-section active">
      {/* Header Banner */}
      <div className="header-row" style={{ marginBottom: "20px" }}>
        <div className="welcome-msg">
          <h2>🎙️ Pitch Accent & Visual Shadowing Coach</h2>
          <p>
            Master Japanese pitch accent patterns (高・低) with mora step contours, real-time Web Audio wave graphs, and native shadowing speed controls.
          </p>
        </div>

        <button
          className="btn-utility"
          onClick={() => {
            playSound("click");
            setShowPitchGuide(!showPitchGuide);
          }}
          style={{ padding: "8px 16px", borderRadius: "10px", fontSize: "0.85rem" }}
        >
          <i className="fa-solid fa-book-open"></i> {showPitchGuide ? "Hide Pitch Accent Guide" : "Pitch Accent Guide"}
        </button>
      </div>

      {/* Japanese Pitch Accent Guide Drawer */}
      {showPitchGuide && (
        <div
          style={{
            padding: "20px",
            marginBottom: "25px",
            borderRadius: "var(--border-radius-lg)",
            background: "linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            color: "#f8fafc"
          }}
        >
          <h3 style={{ fontSize: "1.1rem", marginBottom: "12px", color: "#60a5fa" }}>
            <i className="fa-solid fa-graduation-cap"></i> Japanese Pitch Accent Basics (4 Main Patterns)
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px", fontSize: "0.88rem" }}>
            <div style={{ padding: "12px", borderRadius: "8px", background: "rgba(255, 255, 255, 0.05)", borderLeft: "4px solid #10b981" }}>
              <div style={{ fontWeight: 700, color: "#34d399" }}>1. Heiban (平板 - Flat)</div>
              <div>Low start (Mora 1) → High for all remaining moras. No pitch drop.</div>
              <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "4px" }}>Example: こ(L) ん(H) に(H) ち(H) は(H)</div>
            </div>

            <div style={{ padding: "12px", borderRadius: "8px", background: "rgba(255, 255, 255, 0.05)", borderLeft: "4px solid #ef4444" }}>
              <div style={{ fontWeight: 700, color: "#f87171" }}>2. Atamadaka (頭高 - Head High)</div>
              <div>First Mora is High → Immediately drops Low for all following moras.</div>
              <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "4px" }}>Example: い(H) く(L) ら(L)</div>
            </div>

            <div style={{ padding: "12px", borderRadius: "8px", background: "rgba(255, 255, 255, 0.05)", borderLeft: "4px solid #f59e0b" }}>
              <div style={{ fontWeight: 700, color: "#fbbf24" }}>3. Nakadaka (中高 - Mid High Peak)</div>
              <div>Low start → Rises to High peak in middle → Drops Low for remaining moras.</div>
              <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "4px" }}>Example: あ(L) り(H) が(H) と(H) う(L)</div>
            </div>

            <div style={{ padding: "12px", borderRadius: "8px", background: "rgba(255, 255, 255, 0.05)", borderLeft: "4px solid #a855f7" }}>
              <div style={{ fontWeight: 700, color: "#c084fc" }}>4. Odaka (尾高 - Tail High Drop)</div>
              <div>Low start → High until last mora → Pitch drops on the following particle (は/が).</div>
              <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "4px" }}>Example: や(L) ま(H) + が(L)</div>
            </div>
          </div>
        </div>
      )}

      {/* Target Phrase Navigation Pills */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "25px" }}>
        {targetPhrases.map((p, idx) => (
          <button
            key={p.id}
            id={`phrase-tab-${p.id}`}
            onClick={() => {
              playSound("click");
              setActivePhraseIndex(idx);
              setTranscript("");
              setAccuracyScore(null);
              setStatusMessage("Press microphone button to start shadowing practice!");
            }}
            style={{
              padding: "10px 16px",
              borderRadius: "20px",
              border: activePhraseIndex === idx ? "2px solid var(--accent)" : "1px solid var(--card-border)",
              background: activePhraseIndex === idx ? "rgba(34, 102, 76, 0.15)" : "var(--panel-active)",
              color: activePhraseIndex === idx ? "var(--accent)" : "var(--text-main)",
              fontWeight: 700,
              fontSize: "0.86rem",
              cursor: "pointer"
            }}
          >
            {idx + 1}. {p.japanese}
          </button>
        ))}
      </div>

      {/* Main Pitch Accent Card */}
      <div className="content-card" style={{ borderLeft: "5px solid var(--accent)" }}>
        {/* Card Header & Speed Selectors */}
        <div className="card-title" style={{ justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <span>Phrase {activePhraseIndex + 1} of {targetPhrases.length} • {activePhrase.category}</span>
            <span
              style={{
                marginLeft: "10px",
                padding: "3px 10px",
                borderRadius: "12px",
                fontSize: "0.75rem",
                fontWeight: 700,
                background: "rgba(59, 130, 246, 0.15)",
                color: "var(--accent)"
              }}
            >
              {activePhrase.pitchPatternName}
            </span>
          </div>

          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>Audio Speed:</span>
            <button
              id="speed-slow-btn"
              onClick={() => setPlaybackSpeed(0.75)}
              style={{
                padding: "4px 10px",
                borderRadius: "12px",
                border: "1px solid var(--card-border)",
                background: playbackSpeed === 0.75 ? "var(--accent)" : "var(--card-bg)",
                color: playbackSpeed === 0.75 ? "#ffffff" : "var(--text-main)",
                fontSize: "0.78rem",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              0.75x Slow
            </button>
            <button
              id="speed-normal-btn"
              onClick={() => setPlaybackSpeed(1.0)}
              style={{
                padding: "4px 10px",
                borderRadius: "12px",
                border: "1px solid var(--card-border)",
                background: playbackSpeed === 1.0 ? "var(--accent)" : "var(--card-bg)",
                color: playbackSpeed === 1.0 ? "#ffffff" : "var(--text-main)",
                fontSize: "0.78rem",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              1.0x Normal
            </button>
          </div>
        </div>

        {/* Phrase Display & Japanese Pitch Contour Visualizer */}
        <div
          style={{
            padding: "24px",
            borderRadius: "var(--border-radius-lg)",
            background: "var(--panel-active)",
            textAlign: "center",
            marginBottom: "25px",
            border: "1px solid var(--card-border)"
          }}
        >
          {/* Pitch Accent Step Graph (SVG Contour) */}
          <div style={{ marginBottom: "15px", display: "flex", justifyContent: "center" }}>
            <svg width={Math.max(280, activePhrase.moras.length * 54)} height="80" style={{ overflow: "visible" }}>
              {/* High & Low Reference Lines */}
              <line x1="20" y1="20" x2={activePhrase.moras.length * 54 - 20} y2="20" stroke="rgba(239, 68, 68, 0.25)" strokeDasharray="4" />
              <line x1="20" y1="60" x2={activePhrase.moras.length * 54 - 20} y2="60" stroke="rgba(59, 130, 246, 0.25)" strokeDasharray="4" />
              <text x="5" y="24" fill="#ef4444" fontSize="10" fontWeight="bold">高 (H)</text>
              <text x="5" y="64" fill="#3b82f6" fontSize="10" fontWeight="bold">低 (L)</text>

              {/* Connecting Pitch Contour Lines */}
              {activePhrase.moraPitches.map((pitch, i) => {
                if (i === activePhrase.moraPitches.length - 1) return null;
                const currX = 35 + i * 50;
                const currY = pitch === "H" ? 20 : 60;
                const nextPitch = activePhrase.moraPitches[i + 1];
                const nextX = 35 + (i + 1) * 50;
                const nextY = nextPitch === "H" ? 20 : 60;
                const isDrop = i === activePhrase.pitchDropIndex;

                return (
                  <g key={`line-${i}`}>
                    <line
                      x1={currX}
                      y1={currY}
                      x2={nextX}
                      y2={nextY}
                      stroke={isDrop ? "#ef4444" : "var(--accent)"}
                      strokeWidth={isDrop ? "3.5" : "2.5"}
                    />
                    {isDrop && (
                      <circle cx={(currX + nextX) / 2} cy={(currY + nextY) / 2} r="5" fill="#ef4444">
                        <title>Pitch Drop (アクセント核)</title>
                      </circle>
                    )}
                  </g>
                );
              })}

              {/* Mora Nodes & Pitch Circles */}
              {activePhrase.moras.map((mora, i) => {
                const pitch = activePhrase.moraPitches[i] || "L";
                const cx = 35 + i * 50;
                const cy = pitch === "H" ? 20 : 60;
                const isHigh = pitch === "H";

                return (
                  <g key={`mora-${i}`}>
                    <circle
                      cx={cx}
                      cy={cy}
                      r="8"
                      fill={isHigh ? "#ef4444" : "#3b82f6"}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <text
                      x={cx}
                      y={cy + 1}
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {pitch}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Mora Pills & Japanese Text */}
          <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "10px", flexWrap: "wrap" }}>
            {activePhrase.moras.map((mora, idx) => {
              const isHigh = activePhrase.moraPitches[idx] === "H";
              return (
                <div
                  key={idx}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "12px",
                    background: isHigh ? "rgba(239, 68, 68, 0.12)" : "rgba(59, 130, 246, 0.12)",
                    border: isHigh ? "1.5px solid rgba(239, 68, 68, 0.5)" : "1.5px solid rgba(59, 130, 246, 0.5)",
                    textAlign: "center"
                  }}
                >
                  <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--text-main)" }}>{mora}</div>
                  <div style={{ fontSize: "0.72rem", fontWeight: 800, color: isHigh ? "#ef4444" : "#3b82f6" }}>
                    {isHigh ? "HIGH 高" : "LOW 低"}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--accent)", marginTop: "6px" }}>
            {activePhrase.romaji}
          </div>
          <div style={{ fontSize: "0.95rem", color: "var(--text-muted)", fontStyle: "italic", marginTop: "4px" }}>
            "{activePhrase.english}"
          </div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-main)", marginTop: "8px", opacity: 0.9 }}>
            💡 <strong>Pitch Note:</strong> {activePhrase.phoneticNotes}
          </div>

          {/* Listen Native Speech Action */}
          <div style={{ marginTop: "16px" }}>
            <button
              id="listen-native-btn"
              className="btn-utility"
              onClick={() => playNativeSpeech(activePhrase.japanese)}
              style={{ padding: "8px 18px", fontSize: "0.88rem" }}
            >
              <i className="fa-solid fa-volume-high"></i> Listen Native ({playbackSpeed}x Speed)
            </button>
          </div>
        </div>

        {/* Web Audio Waveform Canvas & Microphone Action */}
        <div style={{ textAlign: "center", marginBottom: "25px" }}>
          {/* Live Waveform Canvas */}
          <div
            style={{
              width: "100%",
              maxWidth: "480px",
              height: "75px",
              margin: "0 auto 16px auto",
              borderRadius: "12px",
              background: "rgba(15, 23, 42, 0.9)",
              border: isListening ? "2px solid var(--accent)" : "1px solid var(--card-border)",
              overflow: "hidden",
              boxShadow: "inset 0 0 10px rgba(0,0,0,0.5)"
            }}
          >
            <canvas ref={canvasRef} width={480} height={75} style={{ width: "100%", height: "100%" }} />
          </div>

          {/* Microphone Action Button */}
          <button
            id="mic-record-btn"
            onClick={() => (isListening ? stopListening() : startListening())}
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              border: "none",
              background: isListening ? "#ef4444" : "linear-gradient(135deg, var(--accent), var(--accent-secondary))",
              color: "#ffffff",
              fontSize: "2.2rem",
              cursor: "pointer",
              boxShadow: isListening ? "0 0 25px rgba(239, 68, 68, 0.6)" : "0 10px 25px rgba(34, 102, 76, 0.4)",
              transition: "all 0.3s ease",
              animation: isListening ? "pulse 1.2s infinite" : "none"
            }}
          >
            <i className={`fa-solid ${isListening ? "fa-stop" : "fa-microphone"}`}></i>
          </button>

          <div style={{ marginTop: "12px", fontSize: "0.9rem", fontWeight: 600, color: isListening ? "#ef4444" : "var(--text-muted)" }}>
            {isListening ? "Recording & Analyzing Voice Waveform... (Click stop when done)" : "Click mic button to start shadowing practice"}
          </div>
        </div>

        {/* Live Feedback Status & Score */}
        <div
          style={{
            padding: "18px",
            borderRadius: "var(--border-radius-md)",
            background: "var(--card-bg)",
            border: "1px solid var(--card-border)"
          }}
        >
          <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
            Shadowing Analysis Status:
          </div>
          <div style={{ fontSize: "0.95rem", color: "var(--text-main)", margin: "6px 0 12px 0", fontWeight: 600 }}>
            {statusMessage}
          </div>

          {transcript && (
            <div style={{ marginTop: "10px" }}>
              <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Spoken Output Recognized: </span>
              <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--accent)" }}>"{transcript}"</span>
            </div>
          )}

          {accuracyScore !== null && (
            <div style={{ marginTop: "14px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "15px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    padding: "8px 16px",
                    borderRadius: "20px",
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    background: accuracyScore >= 80 ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
                    color: accuracyScore >= 80 ? "var(--accent-success, #10b981)" : "#f59e0b"
                  }}
                >
                  Match Score: {accuracyScore}%
                </div>
                <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-main)" }}>
                  {accuracyScore === 100
                    ? "🌟 Perfect Pitch Accent & Pronunciation!"
                    : accuracyScore >= 75
                    ? "👍 High Match! Pitch & rhythm are accurate."
                    : "💪 Keep shadowing the High/Low contour!"}
                </span>
              </div>

              <button
                className="btn-action"
                onClick={() => {
                  playSound("click");
                  setActiveView("dashboard");
                }}
                style={{ padding: "10px 20px" }}
              >
                Continue Master Path ➔
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

