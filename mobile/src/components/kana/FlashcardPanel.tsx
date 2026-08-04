import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { SPACING, RADIUS, TYPE, CARD_SHADOW } from '@/src/theme/tokens';
import { Card } from '@/src/components/ui/Card';
import { KANA_DATA, KanaItem } from './kana-data';

interface FlashcardPanelProps {
  onRating?: (kanaId: string, rating: 'again' | 'hard' | 'good' | 'easy') => void;
}

type Rating = 'again' | 'hard' | 'good' | 'easy';

const RATINGS: { rating: Rating; label: string }[] = [
  { rating: 'again', label: 'Again (1d)' },
  { rating: 'hard', label: 'Hard' },
  { rating: 'good', label: 'Good' },
  { rating: 'easy', label: 'Easy' },
];

export function FlashcardPanel({ onRating }: FlashcardPanelProps) {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard: KanaItem = KANA_DATA[currentIndex % KANA_DATA.length];

  const handleRating = (rating: Rating) => {
    if (onRating) {
      onRating(currentCard.id, rating);
    }
    setIsFlipped(false);
    setCurrentIndex((prev) => prev + 1);
  };

  const ratingColor = (rating: Rating) => {
    switch (rating) {
      case 'again': return { bg: theme.errorMuted, text: theme.error };
      case 'hard': return { bg: theme.warningMuted, text: theme.warning };
      case 'good': return { bg: theme.successMuted, text: theme.success };
      case 'easy': return { bg: theme.accentMuted, text: theme.accent };
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.cardTouchable,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            ...CARD_SHADOW,
          },
        ]}
        onPress={() => setIsFlipped(!isFlipped)}
        activeOpacity={0.85}
      >
        {!isFlipped ? (
          <View style={styles.cardContent}>
            <Text style={[TYPE.glyph, { fontSize: 72, color: theme.accent }]}>
              {currentCard.char}
            </Text>
            <Text style={[TYPE.caption, { color: theme.textMuted, marginTop: SPACING.lg }]}>
              Tap card to reveal answer
            </Text>
          </View>
        ) : (
          <View style={styles.cardContent}>
            <Text style={[TYPE.display, { fontSize: 32, color: theme.text }]}>
              {currentCard.romaji}
            </Text>
            <Text style={[TYPE.bodyStrong, { fontSize: 16, color: theme.accent, marginTop: SPACING.sm }]}>
              {currentCard.vocab}
            </Text>
            <Text style={[TYPE.body, { fontSize: 13, color: theme.textMuted, marginTop: SPACING.xs }]}>
              {currentCard.translation}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.btnRow}>
        {RATINGS.map(({ rating, label }) => {
          const c = ratingColor(rating);
          return (
            <TouchableOpacity
              key={rating}
              style={[
                styles.rateButton,
                { backgroundColor: c.bg },
              ]}
              onPress={() => handleRating(rating)}
            >
              <Text style={[TYPE.caption, { color: c.text }]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  cardTouchable: {
    width: '100%',
    maxWidth: 320,
    height: 240,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  cardContent: {
    alignItems: 'center',
  },
  btnRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.xl,
  },
  rateButton: {
    paddingHorizontal: 14,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.sm,
  },
});
