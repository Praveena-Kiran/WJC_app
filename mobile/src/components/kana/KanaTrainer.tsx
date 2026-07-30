import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import { KANA_DATA, KanaItem } from './kana-data';
import { KanaModal } from './KanaModal';
import { FlashcardPanel } from './FlashcardPanel';

export function KanaTrainer() {
  const [activeTab, setActiveTab] = useState<'hiragana' | 'katakana' | 'flashcards'>('hiragana');
  const [showRomaji, setShowRomaji] = useState(true);
  const [selectedKana, setSelectedKana] = useState<KanaItem | null>(null);

  const filteredKana = KANA_DATA.filter((k) => k.type === activeTab);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Kana Trainer</Text>
        <Text style={styles.subtitle}>
          Master Hiragana and Katakana characters, practice pronunciation, and review SRS cards.
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {(['hiragana', 'katakana', 'flashcards'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Kana Grid View */}
      {activeTab !== 'flashcards' && (
        <View style={styles.card}>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Show Romaji Readings</Text>
            <Switch value={showRomaji} onValueChange={setShowRomaji} />
          </View>

          <View style={styles.grid}>
            {filteredKana.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.gridCell}
                onPress={() => setSelectedKana(item)}
              >
                <Text style={styles.cellChar}>{item.char}</Text>
                {showRomaji && <Text style={styles.cellRomaji}>{item.romaji}</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Flashcards View */}
      {activeTab === 'flashcards' && <FlashcardPanel />}

      {/* Kana Detail Spotlight Modal */}
      <KanaModal
        visible={Boolean(selectedKana)}
        kana={selectedKana}
        onClose={() => setSelectedKana(null)}
      />
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
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#e2e8f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#5c60f5',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  tabTextActive: {
    color: '#ffffff',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  toggleLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridCell: {
    width: 54,
    height: 64,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellChar: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
  },
  cellRomaji: {
    fontSize: 10,
    fontWeight: '700',
    color: '#5c60f5',
    marginTop: 2,
  },
});
