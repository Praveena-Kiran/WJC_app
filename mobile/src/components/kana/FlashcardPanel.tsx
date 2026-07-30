import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { KANA_DATA, KanaItem } from './kana-data';

interface FlashcardPanelProps {
  onRating?: (kanaId: string, rating: 'again' | 'hard' | 'good' | 'easy') => void;
}

export function FlashcardPanel({ onRating }: FlashcardPanelProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard: KanaItem = KANA_DATA[currentIndex % KANA_DATA.length];

  const handleRating = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    if (onRating) {
      onRating(currentCard.id, rating);
    }
    setIsFlipped(false);
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => setIsFlipped(!isFlipped)}
        activeOpacity={0.85}
      >
        {!isFlipped ? (
          <View style={styles.cardContent}>
            <Text style={styles.bigChar}>{currentCard.char}</Text>
            <Text style={styles.flipHint}>Tap card to reveal answer</Text>
          </View>
        ) : (
          <View style={styles.cardContent}>
            <Text style={styles.romajiText}>{currentCard.romaji}</Text>
            <Text style={styles.vocabText}>{currentCard.vocab}</Text>
            <Text style={styles.translationText}>{currentCard.translation}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Rating Buttons */}
      <View style={styles.btnRow}>
        <TouchableOpacity
          style={[styles.rateButton, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}
          onPress={() => handleRating('again')}
        >
          <Text style={[styles.rateText, { color: '#ef4444' }]}>Again (1d)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.rateButton, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}
          onPress={() => handleRating('hard')}
        >
          <Text style={[styles.rateText, { color: '#f59e0b' }]}>Hard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.rateButton, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}
          onPress={() => handleRating('good')}
        >
          <Text style={[styles.rateText, { color: '#10b981' }]}>Good</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.rateButton, { backgroundColor: 'rgba(92, 96, 245, 0.15)' }]}
          onPress={() => handleRating('easy')}
        >
          <Text style={[styles.rateText, { color: '#5c60f5' }]}>Easy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    height: 240,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  cardContent: {
    alignItems: 'center',
  },
  bigChar: {
    fontSize: 72,
    fontWeight: '800',
    color: '#5c60f5',
  },
  flipHint: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 16,
  },
  romajiText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0f172a',
  },
  vocabText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5c60f5',
    marginTop: 8,
  },
  translationText: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
  },
  rateButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  rateText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
