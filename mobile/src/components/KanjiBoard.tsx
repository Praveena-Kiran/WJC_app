import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
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
  const router = useRouter();
  const [levelFilter, setLevelFilter] = useState<'N5' | 'N4'>('N5');
  const [selectedKanji, setSelectedKanji] = useState<KanjiItem>(KANJI_DATA[0]);
  const [accuracyScore, setAccuracyScore] = useState<number | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const filteredKanji = KANJI_DATA.filter((k) => k.level === levelFilter);

  return (
    <Screen scroll scrollEnabled={!isDrawing} padding={SPACING.lg}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg }}>
        <Text style={[TYPE.title, { color: theme.text, flex: 1 }]}>Kanji Practice Board</Text>
        <TouchableOpacity
          onPress={() => router.push('/more/settings')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Settings"
        >
          <Icon name="sliders" size={20} color={theme.accent} />
        </TouchableOpacity>
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
        <Text style={[TYPE.subhead, { color: theme.textMuted, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: SPACING.sm }]}>
          Select Kanji Character
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm }}>
          {filteredKanji.map((item) => {
            const isSelected = selectedKanji.char === item.char;
            return (
              <TouchableOpacity
                key={item.char}
                activeOpacity={0.7}
                style={{
                  width: 52,
                  height: 52,
                  backgroundColor: isSelected ? theme.accent : theme.surfaceAlt,
                  borderWidth: isSelected ? 2 : 1,
                  borderColor: isSelected ? theme.accent : theme.border,
                  borderRadius: RADIUS.md,
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
                    fontSize: 24,
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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md }}>
          <Text style={[TYPE.titleSm, { color: theme.text, fontWeight: '700' }]}>
            {selectedKanji.char} — {selectedKanji.meaning}
          </Text>
          <View style={{ backgroundColor: theme.accentMuted, paddingHorizontal: 8, paddingVertical: 2, borderRadius: RADIUS.full }}>
            <Text style={[TYPE.micro, { color: theme.accent }]}>
              {selectedKanji.strokes?.length ?? 0} STROKES
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            gap: SPACING.sm,
            marginBottom: SPACING.lg,
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: theme.surfaceAlt,
              paddingVertical: SPACING.sm,
              paddingHorizontal: SPACING.md,
              borderRadius: RADIUS.sm,
              alignItems: 'center',
            }}
          >
            <Text style={[TYPE.micro, { color: theme.textMuted }]}>ONYOMI (音読み)</Text>
            <Text style={[TYPE.bodyStrong, { color: theme.accent, marginTop: 2 }]}>
              {selectedKanji.onyomi}
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: theme.surfaceAlt,
              paddingVertical: SPACING.sm,
              paddingHorizontal: SPACING.md,
              borderRadius: RADIUS.sm,
              alignItems: 'center',
            }}
          >
            <Text style={[TYPE.micro, { color: theme.textMuted }]}>KUNYOMI (訓読み)</Text>
            <Text style={[TYPE.bodyStrong, { color: theme.accent, marginTop: 2 }]}>
              {selectedKanji.kunyomi}
            </Text>
          </View>
        </View>

        <View style={{ alignItems: 'center', marginVertical: SPACING.sm }}>
          <KanjiDrawingCanvas
            guidePaths={selectedKanji.strokes || []}
            onCheckResult={(score) => setAccuracyScore(score)}
            onDrawingStart={() => setIsDrawing(true)}
            onDrawingEnd={() => setIsDrawing(false)}
          />
        </View>

        {accuracyScore !== null && (
          <View
            style={{
              marginTop: SPACING.lg,
              padding: SPACING.md,
              borderRadius: RADIUS.md,
              backgroundColor: accuracyScore >= 70 ? theme.successMuted : theme.errorMuted,
              borderWidth: 1,
              borderColor: accuracyScore >= 70 ? theme.success : theme.error,
              flexDirection: 'row',
              alignItems: 'center',
              gap: SPACING.sm,
            }}
          >
            <Icon
              name={accuracyScore >= 70 ? 'check-circle' : 'info'}
              size={18}
              color={accuracyScore >= 70 ? theme.success : theme.error}
            />
            <Text style={[TYPE.subhead, { fontWeight: '700', color: theme.text, flex: 1 }]}>
              {accuracyScore >= 70
                ? `Mastered! Stroke Accuracy: ${accuracyScore}% (+Recorded!)`
                : `Stroke Accuracy: ${accuracyScore}%. Trace stroke directions carefully.`}
            </Text>
          </View>
        )}
      </Card>
    </Screen>
  );
}
