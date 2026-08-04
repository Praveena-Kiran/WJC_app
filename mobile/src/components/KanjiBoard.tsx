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
import { SegmentedControl } from '@/src/components/ui/SegmentedControl';
import { Icon } from '@/src/components/ui/Icon';
import { KanjiDrawingCanvas } from './drawing/KanjiDrawingCanvas';
import { KANJI_DATA, KanjiItem } from './kanji-data';

export function KanjiBoard() {
  const { theme } = useTheme();
  const [levelFilter, setLevelFilter] = useState<'N5' | 'N4'>('N5');
  const [selectedKanji, setSelectedKanji] = useState<KanjiItem>(KANJI_DATA[0]);
  const [accuracyScore, setAccuracyScore] = useState<number | null>(null);

  const filteredKanji = KANJI_DATA.filter((k) => k.level === levelFilter);

  return (
    <Screen scroll padding={SPACING.lg}>
      <View style={{ marginBottom: SPACING.lg }}>
        <Text style={[TYPE.title, { color: theme.text }]}>Kanji Practice Board</Text>
        <Text style={[TYPE.caption, { color: theme.textMuted, marginTop: SPACING.xs }]}>
          Interactive stroke order drawing canvas, onyomi/kunyomi readings & accuracy feedback.
        </Text>
      </View>

      {/* Level Toggle */}
      <SegmentedControl<'N5' | 'N4'>
        options={[
          { label: `N5 Kanji (${KANJI_DATA.filter((k) => k.level === 'N5').length})`, value: 'N5' },
          { label: `N4 Kanji (${KANJI_DATA.filter((k) => k.level === 'N4').length})`, value: 'N4' },
        ]}
        value={levelFilter}
        onChange={(lvl) => {
          setLevelFilter(lvl);
          const first = KANJI_DATA.find((k) => k.level === lvl);
          if (first) setSelectedKanji(first);
        }}
        style={{ marginBottom: SPACING.lg }}
      />

      {/* Kanji Selector Grid */}
      <Card padding={SPACING.lg} style={{ marginBottom: SPACING.lg }}>
        <Text style={[TYPE.bodyStrong, { color: theme.text, marginBottom: SPACING.md }]}>Select Kanji Character</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm + 2 }}>
          {filteredKanji.map((item) => {
            const isSelected = selectedKanji.char === item.char;
            return (
              <TouchableOpacity
                key={item.char}
                style={{
                  width: 52,
                  height: 52,
                  backgroundColor: isSelected ? theme.accent : theme.surfaceAlt,
                  borderWidth: 1,
                  borderColor: isSelected ? theme.accent : theme.border,
                  borderRadius: RADIUS.sm,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  setSelectedKanji(item);
                  setAccuracyScore(null);
                }}
              >
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: '800',
                    color: isSelected ? theme.onAccent : theme.text,
                  }}
                >
                  {item.char}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Card>

      {/* Drawing Workspace */}
      <Card padding={SPACING.lg}>
        <Text style={[TYPE.bodyStrong, { color: theme.text, marginBottom: SPACING.md }]}>
          Workspace: {selectedKanji.char} ({selectedKanji.meaning})
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginBottom: SPACING.lg,
            backgroundColor: theme.surfaceAlt,
            padding: SPACING.sm + 2,
            borderRadius: RADIUS.sm,
          }}
        >
          <Text style={[TYPE.caption, { color: theme.textMuted }]}>
            Onyomi: <Text style={{ color: theme.accent, fontWeight: '700', fontSize: 13 }}>{selectedKanji.onyomi}</Text>
          </Text>
          <Text style={[TYPE.caption, { color: theme.textMuted }]}>
            Kunyomi: <Text style={{ color: theme.accent, fontWeight: '700', fontSize: 13 }}>{selectedKanji.kunyomi}</Text>
          </Text>
        </View>

        <View style={{ alignItems: 'center', marginVertical: SPACING.sm }}>
          <KanjiDrawingCanvas
            guidePaths={selectedKanji.strokes || []}
            onCheckResult={(score) => setAccuracyScore(score)}
          />
        </View>

        {accuracyScore !== null && (
          <View
            style={{
              marginTop: SPACING.lg,
              padding: SPACING.md,
              borderRadius: RADIUS.sm,
              backgroundColor: accuracyScore >= 70 ? theme.successMuted : theme.errorMuted,
              flexDirection: 'row',
              alignItems: 'center',
              gap: SPACING.sm,
            }}
          >
            <Icon
              name={accuracyScore >= 70 ? 'check-circle' : 'info'}
              size={16}
              color={accuracyScore >= 70 ? theme.success : theme.error}
            />
            <Text style={[TYPE.caption, { fontWeight: '700', color: theme.text }]}>
              {accuracyScore >= 70
                ? `Great Job! Accuracy: ${accuracyScore}% (+Practiced!)`
                : `Stroke Accuracy: ${accuracyScore}%. Follow guide paths carefully.`}
            </Text>
          </View>
        )}
      </Card>
    </Screen>
  );
}
