import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { SPACING, RADIUS, TYPE } from '@/src/theme/tokens';
import { Screen } from '@/src/components/ui/Screen';
import { Card } from '@/src/components/ui/Card';
import { SegmentedControl } from '@/src/components/ui/SegmentedControl';
import { KANA_DATA, KanaItem } from './kana-data';
import { KanaModal } from './KanaModal';
import { FlashcardPanel } from './FlashcardPanel';

type KanaTab = 'hiragana' | 'katakana' | 'flashcards';

const TAB_OPTIONS: { label: string; value: KanaTab }[] = [
  { label: 'HIRAGANA', value: 'hiragana' },
  { label: 'KATAKANA', value: 'katakana' },
  { label: 'FLASHCARDS', value: 'flashcards' },
];

export function KanaTrainer() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<KanaTab>('hiragana');
  const [showRomaji, setShowRomaji] = useState(true);
  const [selectedKana, setSelectedKana] = useState<KanaItem | null>(null);

  const filteredKana = KANA_DATA.filter((k) => k.type === activeTab);

  return (
    <Screen scroll padding={SPACING.lg}>
      <View style={{ marginBottom: SPACING.lg }}>
        <Text style={[TYPE.title, { color: theme.text }]}>Kana Trainer</Text>
        <Text style={[TYPE.body, { fontSize: 13, color: theme.textMuted, marginTop: SPACING.xs }]}>
          Master Hiragana and Katakana characters, practice pronunciation, and review SRS cards.
        </Text>
      </View>

      <SegmentedControl
        options={TAB_OPTIONS}
        value={activeTab}
        onChange={setActiveTab}
        style={{ marginBottom: SPACING.lg }}
      />

      {activeTab !== 'flashcards' && (
        <Card>
          <View style={[styles.toggleRow, { borderBottomColor: theme.border }]}>
            <Text style={[TYPE.bodyStrong, { fontSize: 13, color: theme.text }]}>
              Show Romaji Readings
            </Text>
            <Switch
              value={showRomaji}
              onValueChange={setShowRomaji}
              trackColor={{ false: theme.surfaceAlt, true: theme.accentMuted }}
              thumbColor={showRomaji ? theme.accent : theme.textMuted}
            />
          </View>

          <View style={styles.grid}>
            {filteredKana.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.gridCell,
                  {
                    backgroundColor: theme.surfaceAlt,
                    borderColor: theme.border,
                  },
                ]}
                onPress={() => setSelectedKana(item)}
              >
                <Text style={[TYPE.glyph, { fontSize: 24, color: theme.text }]}>
                  {item.char}
                </Text>
                {showRomaji && (
                  <Text style={[TYPE.caption, { fontSize: 10, color: theme.accent, marginTop: 2 }]}>
                    {item.romaji}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Card>
      )}

      {activeTab === 'flashcards' && <FlashcardPanel />}

      <KanaModal
        visible={Boolean(selectedKana)}
        kana={selectedKana}
        onClose={() => setSelectedKana(null)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridCell: {
    width: 54,
    height: 64,
    borderWidth: 1,
    borderRadius: RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
