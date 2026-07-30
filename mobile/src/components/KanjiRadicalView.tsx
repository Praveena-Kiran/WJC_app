import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { PUZZLES, RadicalPuzzle } from './radical-data';

export function KanjiRadicalView() {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  const currentPuzzle = PUZZLES[puzzleIndex % PUZZLES.length];
  const allOptions = [...currentPuzzle.radicals, ...currentPuzzle.distractors].sort();

  const handleSelectPart = (part: string) => {
    if (selectedParts.includes(part)) {
      setSelectedParts(selectedParts.filter((p) => p !== part));
    } else {
      setSelectedParts([...selectedParts, part]);
    }
  };

  const handleCheck = () => {
    const isCorrect =
      selectedParts.length === currentPuzzle.radicals.length &&
      currentPuzzle.radicals.every((r) => selectedParts.includes(r));

    if (isCorrect) {
      setFeedback({ isCorrect: true, text: `🎉 Perfect! ${currentPuzzle.radicals.join(' + ')} = ${currentPuzzle.targetKanji} (${currentPuzzle.meaning})` });
    } else {
      setFeedback({ isCorrect: false, text: `💡 Try again! Combine radicals to form ${currentPuzzle.targetKanji}.` });
    }
  };

  const handleNext = () => {
    setSelectedParts([]);
    setFeedback(null);
    setPuzzleIndex((prev) => prev + 1);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Kanji Radical Builder</Text>
        <Text style={styles.subtitle}>
          Deconstruct & assemble Kanji characters from fundamental radical components (部首).
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.targetTitle}>Target Kanji: {currentPuzzle.targetKanji}</Text>
        <Text style={styles.targetMeaning}>Meaning: {currentPuzzle.meaning}</Text>

        <Text style={styles.sectionLabel}>Assembly Slot:</Text>
        <View style={styles.slotRow}>
          {selectedParts.length === 0 ? (
            <Text style={styles.emptySlotText}>Tap radical parts below to assemble</Text>
          ) : (
            selectedParts.map((p, idx) => (
              <View key={idx} style={styles.selectedBadge}>
                <Text style={styles.selectedBadgeText}>{p}</Text>
              </View>
            ))
          )}
        </View>

        <Text style={styles.sectionLabel}>Available Radicals:</Text>
        <View style={styles.optionsRow}>
          {allOptions.map((part, idx) => {
            const isPicked = selectedParts.includes(part);
            return (
              <TouchableOpacity
                key={idx}
                style={[styles.partChip, isPicked && styles.partChipPicked]}
                onPress={() => handleSelectPart(part)}
              >
                <Text style={[styles.partText, isPicked && styles.partTextPicked]}>
                  {part}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {feedback && (
          <View style={[styles.banner, feedback.isCorrect ? styles.bannerPass : styles.bannerFail]}>
            <Text style={styles.bannerText}>{feedback.text}</Text>
          </View>
        )}

        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.btnPrimary} onPress={handleCheck}>
            <Text style={styles.btnPrimaryText}>Check Assembly</Text>
          </TouchableOpacity>

          {feedback?.isCorrect && (
            <TouchableOpacity style={[styles.btnPrimary, styles.btnNext]} onPress={handleNext}>
              <Text style={styles.btnPrimaryText}>Next Puzzle →</Text>
            </TouchableOpacity>
          )}
        </View>
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
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  targetTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#5c60f5',
    textAlign: 'center',
  },
  targetMeaning: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  slotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 52,
    padding: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginBottom: 16,
  },
  emptySlotText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  selectedBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#5c60f5',
    borderRadius: 6,
  },
  selectedBadgeText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  partChip: {
    width: 48,
    height: 48,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  partChipPicked: {
    backgroundColor: 'rgba(92, 96, 245, 0.15)',
    borderColor: '#5c60f5',
    borderWidth: 1,
  },
  partText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  partTextPicked: {
    color: '#5c60f5',
  },
  banner: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  bannerPass: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  bannerFail: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  bannerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  btnPrimary: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#5c60f5',
    borderRadius: 8,
    alignItems: 'center',
  },
  btnNext: {
    backgroundColor: '#10b981',
  },
  btnPrimaryText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
