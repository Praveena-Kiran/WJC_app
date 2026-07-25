import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, DimensionValue } from "react-native";
import Svg, { Line, Circle, Text as SvgText, G } from "react-native-svg";
import * as Speech from "expo-speech";
import { targetPhrases } from "../lib/data";

export function PitchAccentCoach() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [showGuide, setShowGuide] = useState(false);

  const activePhrase = targetPhrases[activeIdx];

  const playSpeech = (text: string, rate: number = playbackSpeed) => {
    Speech.stop();
    Speech.speak(text, {
      language: "ja-JP",
      rate: rate,
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Title Banner */}
      <View style={styles.header}>
        <Text style={styles.title}>🎙️ Pitch Accent Coach</Text>
        <Text style={styles.subtitle}>
          Master Japanese pitch accent patterns (高・低) with visual mora step contours.
        </Text>

        <TouchableOpacity
          style={styles.guideBtn}
          onPress={() => setShowGuide(!showGuide)}
        >
          <Text style={styles.guideBtnText}>
            {showGuide ? "Hide Pitch Guide" : "📖 Pitch Accent Guide"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Guide Drawer */}
      {showGuide && (
        <View style={styles.guideCard}>
          <Text style={styles.guideTitle}>Japanese Pitch Patterns</Text>
          <Text style={styles.guideItem}>1. Heiban (平板): Low ➔ High (Flat)</Text>
          <Text style={styles.guideItem}>2. Atamadaka (頭高): High ➔ Drops Low</Text>
          <Text style={styles.guideItem}>3. Nakadaka (中高): Low ➔ High Peak ➔ Low</Text>
          <Text style={styles.guideItem}>4. Odaka (尾高): Low ➔ High ➔ Drop on particle</Text>
        </View>
      )}

      {/* Phrase Navigation Bar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsScroll}>
        {targetPhrases.map((p, idx) => (
          <TouchableOpacity
            key={p.id}
            style={[styles.pill, activeIdx === idx && styles.pillActive]}
            onPress={() => setActiveIdx(idx)}
          >
            <Text style={[styles.pillText, activeIdx === idx && styles.pillTextActive]}>
              {idx + 1}. {p.japanese}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Main Pitch Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.category}>{activePhrase.category}</Text>
          <Text style={styles.patternBadge}>{activePhrase.pitchPatternName}</Text>
        </View>

        {/* Speed Controls */}
        <View style={styles.speedRow}>
          <Text style={styles.speedLabel}>Speed:</Text>
          <TouchableOpacity
            style={[styles.speedBtn, playbackSpeed === 0.75 && styles.speedBtnActive]}
            onPress={() => setPlaybackSpeed(0.75)}
          >
            <Text style={[styles.speedBtnText, playbackSpeed === 0.75 && styles.speedBtnTextActive]}>0.75x Slow</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.speedBtn, playbackSpeed === 1.0 && styles.speedBtnActive]}
            onPress={() => setPlaybackSpeed(1.0)}
          >
            <Text style={[styles.speedBtnText, playbackSpeed === 1.0 && styles.speedBtnTextActive]}>1.0x Normal</Text>
          </TouchableOpacity>
        </View>

        {/* SVG Pitch Accent Contour */}
        <View style={styles.svgContainer}>
          <Svg width={Math.max(280, activePhrase.moras.length * 54)} height={80}>
            {/* High/Low Grid Lines */}
            <Line x1="20" y1="20" x2={activePhrase.moras.length * 54 - 20} y2="20" stroke="rgba(239,68,68,0.3)" strokeDasharray="4" />
            <Line x1="20" y1="60" x2={activePhrase.moras.length * 54 - 20} y2="60" stroke="rgba(59,130,246,0.3)" strokeDasharray="4" />

            {/* Contour Lines */}
            {activePhrase.moraPitches.map((pitch, i) => {
              if (i === activePhrase.moraPitches.length - 1) return null;
              const currX = 35 + i * 50;
              const currY = pitch === "H" ? 20 : 60;
              const nextPitch = activePhrase.moraPitches[i + 1];
              const nextX = 35 + (i + 1) * 50;
              const nextY = nextPitch === "H" ? 20 : 60;
              const isDrop = i === activePhrase.pitchDropIndex;

              return (
                <G key={`line-${i}`}>
                  <Line
                    x1={currX}
                    y1={currY}
                    x2={nextX}
                    y2={nextY}
                    stroke={isDrop ? "#ef4444" : "#10b981"}
                    strokeWidth={isDrop ? 3.5 : 2.5}
                  />
                  {isDrop && <Circle cx={(currX + nextX) / 2} cy={(currY + nextY) / 2} r="5" fill="#ef4444" />}
                </G>
              );
            })}

            {/* Mora Circles */}
            {activePhrase.moras.map((mora, i) => {
              const pitch = activePhrase.moraPitches[i] || "L";
              const cx = 35 + i * 50;
              const cy = pitch === "H" ? 20 : 60;
              const isHigh = pitch === "H";

              return (
                <G key={`mora-${i}`}>
                  <Circle cx={cx} cy={cy} r="9" fill={isHigh ? "#ef4444" : "#3b82f6"} stroke="#fff" strokeWidth="2" />
                  <SvgText x={cx} y={cy + 3} fill="#fff" fontSize="9" fontWeight="bold" textAnchor="middle">
                    {pitch}
                  </SvgText>
                </G>
              );
            })}
          </Svg>
        </View>

        {/* Mora Syllable Pills */}
        <View style={styles.moraRow}>
          {activePhrase.moras.map((mora, idx) => {
            const isHigh = activePhrase.moraPitches[idx] === "H";
            return (
              <View
                key={idx}
                style={[
                  styles.moraCard,
                  {
                    backgroundColor: isHigh ? "rgba(239, 68, 68, 0.1)" : "rgba(59, 130, 246, 0.1)",
                    borderColor: isHigh ? "#ef4444" : "#3b82f6",
                  },
                ]}
              >
                <Text style={styles.moraChar}>{mora}</Text>
                <Text style={[styles.moraTag, { color: isHigh ? "#ef4444" : "#3b82f6" }]}>
                  {isHigh ? "HIGH 高" : "LOW 低"}
                </Text>
              </View>
            );
          })}
        </View>

        <Text style={styles.romajiText}>{activePhrase.romaji}</Text>
        <Text style={styles.englishText}>"{activePhrase.english}"</Text>
        <Text style={styles.phoneticNotes}>💡 {activePhrase.phoneticNotes}</Text>

        {/* Audio Action Button */}
        <TouchableOpacity
          style={styles.audioBtn}
          onPress={() => playSpeech(activePhrase.japanese)}
        >
          <Text style={styles.audioBtnText}>🔊 Listen Native ({playbackSpeed}x Speed)</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a" },
  content: { padding: 16 },
  header: { marginBottom: 16 },
  title: { fontSize: 22, fontWeight: "bold", color: "#f8fafc" },
  subtitle: { fontSize: 13, color: "#94a3b8", marginTop: 4 },
  guideBtn: {
    marginTop: 10,
    backgroundColor: "#1e293b",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  guideBtnText: { color: "#60a5fa", fontSize: 12, fontWeight: "bold" },
  guideCard: {
    backgroundColor: "#1e293b",
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
  },
  guideTitle: { fontSize: 14, fontWeight: "bold", color: "#60a5fa", marginBottom: 6 },
  guideItem: { fontSize: 12, color: "#cbd5e1", marginVertical: 2 },
  pillsScroll: { marginBottom: 16 },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#1e293b",
    marginRight: 8,
  },
  pillActive: { backgroundColor: "rgba(16, 185, 129, 0.2)", borderWidth: 1, borderColor: "#10b981" },
  pillText: { fontSize: 13, color: "#94a3b8", fontWeight: "600" },
  pillTextActive: { color: "#34d399", fontWeight: "bold" },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#10b981",
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  category: { color: "#94a3b8", fontSize: 12, fontWeight: "bold" },
  patternBadge: { color: "#34d399", fontSize: 12, fontWeight: "bold" },
  speedRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  speedLabel: { color: "#94a3b8", fontSize: 12, marginRight: 8 },
  speedBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#334155",
    marginRight: 6,
  },
  speedBtnActive: { backgroundColor: "#10b981" },
  speedBtnText: { color: "#cbd5e1", fontSize: 11, fontWeight: "bold" },
  speedBtnTextActive: { color: "#fff" },
  svgContainer: { alignItems: "center", marginVertical: 12 },
  moraRow: { flexDirection: "row", justifyContent: "center", flexWrap: "wrap", marginVertical: 12 },
  moraCard: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    margin: 4,
  },
  moraChar: { fontSize: 20, fontWeight: "bold", color: "#f8fafc" },
  moraTag: { fontSize: 9, fontWeight: "800", marginTop: 2 },
  romajiText: { fontSize: 16, fontWeight: "bold", color: "#34d399", textAlign: "center", marginTop: 6 },
  englishText: { fontSize: 13, color: "#94a3b8", fontStyle: "italic", textAlign: "center", marginTop: 2 },
  phoneticNotes: { fontSize: 12, color: "#cbd5e1", textAlign: "center", marginTop: 8 },
  audioBtn: {
    marginTop: 16,
    backgroundColor: "#10b981",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  audioBtnText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
});
