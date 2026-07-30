import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

export interface PitchPhrase {
  id: string;
  japanese: string;
  romaji: string;
  english: string;
  pitchType: 'heiban' | 'atamadaka' | 'nakadaka' | 'odaka';
}

export const PHRASES: PitchPhrase[] = [
  { id: 'p1', japanese: 'こんにちは', romaji: 'Konnichiwa', english: 'Hello / Good afternoon', pitchType: 'heiban' },
  { id: 'p2', japanese: 'ありがとう', romaji: 'Arigatou', english: 'Thank you', pitchType: 'atamadaka' },
  { id: 'p3', japanese: 'すみません', romaji: 'Sumimasen', english: 'Excuse me / Sorry', pitchType: 'nakadaka' },
  { id: 'p4', japanese: 'さようなら', romaji: 'Sayounara', english: 'Goodbye', pitchType: 'odaka' },
];

export function PronunciationCoach() {
  const [activeType, setActiveType] = useState<string>('all');
  const [selectedPhrase, setSelectedPhrase] = useState<PitchPhrase>(PHRASES[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedScore, setRecordedScore] = useState<number | null>(null);

  const filteredPhrases = PHRASES.filter(
    (p) => activeType === 'all' || p.pitchType === activeType
  );

  const handleRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordedScore(null);
      setTimeout(() => {
        setIsRecording(false);
        setRecordedScore(Math.floor(Math.random() * 20) + 80); // 80-99% mock pitch accuracy
      }, 2000);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pronunciation & Pitch Coach</Text>
        <Text style={styles.subtitle}>
          Master Japanese pitch accent patterns (平板, 頭高, 中高, 尾高) with voice practice.
        </Text>
      </View>

      {/* Pitch Type Filter Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
        {['all', 'heiban', 'atamadaka', 'nakadaka', 'odaka'].map((type) => {
          const isActive = activeType === type;
          return (
            <TouchableOpacity
              key={type}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => setActiveType(type)}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {type.toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Phrase Selection Cards */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Select Practice Phrase</Text>
        {filteredPhrases.map((phrase) => {
          const isSelected = selectedPhrase.id === phrase.id;
          return (
            <TouchableOpacity
              key={phrase.id}
              style={[styles.phraseRow, isSelected && styles.phraseRowSelected]}
              onPress={() => {
                setSelectedPhrase(phrase);
                setRecordedScore(null);
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.phraseJp}>{phrase.japanese}</Text>
                <Text style={styles.phraseRomaji}>{phrase.romaji} • {phrase.english}</Text>
              </View>
              <View style={styles.pitchBadge}>
                <Text style={styles.pitchBadgeText}>{phrase.pitchType}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Pitch Contour Practice Area */}
      <View style={[styles.card, { marginTop: 16 }]}>
        <Text style={styles.cardTitle}>Voice Recording & Contour Analysis</Text>

        <View style={styles.contourBox}>
          <Text style={styles.bigJp}>{selectedPhrase.japanese}</Text>
          <Text style={styles.bigRomaji}>{selectedPhrase.romaji}</Text>
          <Text style={styles.pitchPatternText}>Pattern: {selectedPhrase.pitchType.toUpperCase()}</Text>
        </View>

        <TouchableOpacity
          style={[styles.recordBtn, isRecording && styles.recordBtnActive]}
          onPress={handleRecord}
          disabled={isRecording}
        >
          <Text style={styles.recordBtnText}>
            {isRecording ? '🎙️ Listening to pitch...' : '🎙️ Record Voice Practice'}
          </Text>
        </TouchableOpacity>

        {recordedScore !== null && (
          <View style={styles.scoreBanner}>
            <Text style={styles.scoreText}>
              🌟 Pitch Accent Accuracy: {recordedScore}%! Excellent pitch intonation.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8fafc',
    flexGrow: 1,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
  },
  chipRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 16,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: '#5c60f5',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  chipTextActive: {
    color: '#ffffff',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  phraseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  phraseRowSelected: {
    borderColor: '#5c60f5',
    backgroundColor: 'rgba(92, 96, 245, 0.08)',
  },
  phraseJp: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  phraseRomaji: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  pitchBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pitchBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#5c60f5',
  },
  contourBox: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginBottom: 16,
  },
  bigJp: {
    fontSize: 32,
    fontWeight: '800',
    color: '#5c60f5',
  },
  bigRomaji: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 4,
  },
  pitchPatternText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    marginTop: 6,
  },
  recordBtn: {
    backgroundColor: '#5c60f5',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  recordBtnActive: {
    backgroundColor: '#ef4444',
  },
  recordBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  scoreBanner: {
    marginTop: 12,
    padding: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderRadius: 8,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#10b981',
  },
});
