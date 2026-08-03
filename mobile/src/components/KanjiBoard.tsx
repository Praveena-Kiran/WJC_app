import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KanjiDrawingCanvas } from './drawing/KanjiDrawingCanvas';
import { KANJI_DATA, KanjiItem } from './kanji-data';

export function KanjiBoard() {
  const [levelFilter, setLevelFilter] = useState<'N5' | 'N4'>('N5');
  const [selectedKanji, setSelectedKanji] = useState<KanjiItem>(KANJI_DATA[0]);
  const [accuracyScore, setAccuracyScore] = useState<number | null>(null);

  const filteredKanji = KANJI_DATA.filter((k) => k.level === levelFilter);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Kanji Practice Board</Text>
          <Text style={styles.subtitle}>
            Interactive stroke order drawing canvas, onyomi/kunyomi readings & accuracy feedback.
          </Text>
        </View>

      {/* Level Toggle */}
      <View style={styles.levelRow}>
        {(['N5', 'N4'] as const).map((lvl) => (
          <TouchableOpacity
            key={lvl}
            style={[styles.levelBtn, levelFilter === lvl && styles.levelBtnActive]}
            onPress={() => {
              setLevelFilter(lvl);
              const first = KANJI_DATA.find((k) => k.level === lvl);
              if (first) setSelectedKanji(first);
            }}
          >
            <Text style={[styles.levelText, levelFilter === lvl && styles.levelTextActive]}>
              {lvl} Kanji ({KANJI_DATA.filter((k) => k.level === lvl).length})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Kanji Selector Grid */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Select Kanji Character</Text>
        <View style={styles.kanjiGrid}>
          {filteredKanji.map((item) => {
            const isSelected = selectedKanji.char === item.char;
            return (
              <TouchableOpacity
                key={item.char}
                style={[styles.kanjiCell, isSelected && styles.kanjiCellSelected]}
                onPress={() => {
                  setSelectedKanji(item);
                  setAccuracyScore(null);
                }}
              >
                <Text style={[styles.kanjiCellChar, isSelected && styles.kanjiCellCharSelected]}>
                  {item.char}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Drawing Workspace */}
      <View style={[styles.card, { marginTop: 16 }]}>
        <Text style={styles.cardTitle}>
          Workspace: {selectedKanji.char} ({selectedKanji.meaning})
        </Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Onyomi: <Text style={styles.infoVal}>{selectedKanji.onyomi}</Text></Text>
          <Text style={styles.infoLabel}>Kunyomi: <Text style={styles.infoVal}>{selectedKanji.kunyomi}</Text></Text>
        </View>

        <View style={styles.drawingWrapper}>
          <KanjiDrawingCanvas
            guidePaths={selectedKanji.strokes || []}
            onCheckResult={(score) => setAccuracyScore(score)}
          />
        </View>

        {accuracyScore !== null && (
          <View
            style={[
              styles.accuracyBanner,
              accuracyScore >= 70 ? styles.accuracyPass : styles.accuracyFail,
            ]}
          >
            <Text style={styles.accuracyBannerText}>
              {accuracyScore >= 70
                ? `🎉 Great Job! Accuracy: ${accuracyScore}% (+Practiced!)`
                : `💡 Stroke Accuracy: ${accuracyScore}%. Follow guide paths carefully.`}
            </Text>
          </View>
        )}
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
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
  levelRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  levelBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#e2e8f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  levelBtnActive: {
    backgroundColor: '#5c60f5',
  },
  levelText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  levelTextActive: {
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
  kanjiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  kanjiCell: {
    width: 48,
    height: 48,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kanjiCellSelected: {
    backgroundColor: '#5c60f5',
    borderColor: '#5c60f5',
  },
  kanjiCellChar: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  kanjiCellCharSelected: {
    color: '#ffffff',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  infoVal: {
    fontSize: 13,
    color: '#5c60f5',
    fontWeight: '700',
  },
  drawingWrapper: {
    alignItems: 'center',
    marginVertical: 8,
  },
  accuracyBanner: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  accuracyPass: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  accuracyFail: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  accuracyBannerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
});
