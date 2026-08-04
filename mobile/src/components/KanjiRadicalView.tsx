import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { SPACING, RADIUS, TYPE } from '@/src/theme/tokens';
import { Screen } from '@/src/components/ui/Screen';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Icon } from '@/src/components/ui/Icon';
import { PUZZLES } from './radical-data';

export function KanjiRadicalView() {
  const { theme } = useTheme();
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
      setFeedback({ isCorrect: true, text: `Perfect! ${currentPuzzle.radicals.join(' + ')} = ${currentPuzzle.targetKanji} (${currentPuzzle.meaning})` });
    } else {
      setFeedback({ isCorrect: false, text: `Try again! Combine radicals to form ${currentPuzzle.targetKanji}.` });
    }
  };

  const handleNext = () => {
    setSelectedParts([]);
    setFeedback(null);
    setPuzzleIndex((prev) => prev + 1);
  };

  return (
    <Screen scroll padding={SPACING.lg}>
      <View style={{ marginBottom: SPACING.lg }}>
        <Text style={[TYPE.title, { color: theme.text }]}>Kanji Radical Builder</Text>
        <Text style={[TYPE.caption, { color: theme.textMuted, marginTop: SPACING.xs }]}>
          Deconstruct & assemble Kanji characters from fundamental radical components (部首).
        </Text>
      </View>

      <Card padding={SPACING.lg}>
        <Text style={[TYPE.display, { color: theme.accent, textAlign: 'center' }]}>{currentPuzzle.targetKanji}</Text>
        <Text style={[TYPE.bodyStrong, { color: theme.textMuted, textAlign: 'center', marginBottom: SPACING.lg }]}>
          Meaning: {currentPuzzle.meaning}
        </Text>

        <Text style={[TYPE.caption, { fontWeight: '700', color: theme.text, marginBottom: SPACING.sm }]}>Assembly Slot:</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: SPACING.sm,
            minHeight: 52,
            padding: SPACING.sm + 2,
            backgroundColor: theme.surfaceAlt,
            borderRadius: RADIUS.sm,
            borderWidth: 1,
            borderColor: theme.border,
            marginBottom: SPACING.lg,
          }}
        >
          {selectedParts.length === 0 ? (
            <Text style={[TYPE.caption, { color: theme.textMuted }]}>Tap radical parts below to assemble</Text>
          ) : (
            selectedParts.map((p, idx) => (
              <View
                key={idx}
                style={{
                  paddingHorizontal: SPACING.md,
                  paddingVertical: SPACING.xs + 2,
                  backgroundColor: theme.accent,
                  borderRadius: RADIUS.sm - 2,
                }}
              >
                <Text style={{ color: theme.onAccent, fontSize: 18, fontWeight: '800' }}>{p}</Text>
              </View>
            ))
          )}
        </View>

        <Text style={[TYPE.caption, { fontWeight: '700', color: theme.text, marginBottom: SPACING.sm }]}>Available Radicals:</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm + 2, marginBottom: SPACING.lg }}>
          {allOptions.map((part, idx) => {
            const isPicked = selectedParts.includes(part);
            return (
              <TouchableOpacity
                key={idx}
                style={{
                  width: 52,
                  height: 52,
                  backgroundColor: isPicked ? theme.accentMuted : theme.surfaceAlt,
                  borderColor: isPicked ? theme.accent : theme.border,
                  borderWidth: 1,
                  borderRadius: RADIUS.sm,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => handleSelectPart(part)}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: '800',
                    color: isPicked ? theme.accent : theme.text,
                  }}
                >
                  {part}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {feedback && (
          <View
            style={{
              padding: SPACING.md,
              borderRadius: RADIUS.sm,
              backgroundColor: feedback.isCorrect ? theme.successMuted : theme.errorMuted,
              flexDirection: 'row',
              alignItems: 'center',
              gap: SPACING.sm,
              marginBottom: SPACING.lg,
            }}
          >
            <Icon
              name={feedback.isCorrect ? 'check-circle' : 'info'}
              size={16}
              color={feedback.isCorrect ? theme.success : theme.error}
            />
            <Text style={[TYPE.caption, { fontWeight: '700', color: theme.text, flex: 1 }]}>{feedback.text}</Text>
          </View>
        )}

        <View style={{ flexDirection: 'row', gap: SPACING.sm + 2 }}>
          <Button title="Check Assembly" onPress={handleCheck} style={{ flex: 1 }} />

          {feedback?.isCorrect && (
            <Button title="Next Puzzle" onPress={handleNext} variant="secondary" style={{ flex: 1 }} />
          )}
        </View>
      </Card>
    </Screen>
  );
}
