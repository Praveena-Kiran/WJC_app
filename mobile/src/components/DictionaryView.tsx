import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Share,
} from 'react-native';
import { conjugateVerb } from '../lib/conjugator';
import { DICTIONARY_DATA, DictItem } from './dictionary-data';

export function DictionaryView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [starredWords, setStarredWords] = useState<string[]>([]);
  const [conjugateInput, setConjugateInput] = useState('食べる');

  const toggleStar = (word: string) => {
    setStarredWords((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]
    );
  };

  const filteredWords = DICTIONARY_DATA.filter((item) => {
    if (activeCategory === 'starred') {
      if (!starredWords.includes(item.word)) return false;
    } else if (activeCategory === 'verbs') {
      if (item.tag !== 'Verb') return false;
    } else if (activeCategory === 'nouns') {
      if (item.tag !== 'Noun') return false;
    } else if (activeCategory === 'adjectives') {
      if (item.tag !== 'Adjective') return false;
    }

    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.word.toLowerCase().includes(q) ||
      item.reading.toLowerCase().includes(q) ||
      item.english.toLowerCase().includes(q) ||
      item.romaji.toLowerCase().includes(q)
    );
  });

  const exportCsv = async () => {
    const csvHeader = 'word,reading,romaji,english,tag\n';
    const csvRows = filteredWords
      .map((w) => `"${w.word}","${w.reading}","${w.romaji}","${w.english}","${w.tag}"`)
      .join('\n');
    const csvContent = csvHeader + csvRows;

    try {
      await Share.share({
        message: csvContent,
        title: 'Export Vocabulary CSV',
      });
    } catch (err) {
      console.warn('CSV share failed:', err);
    }
  };

  const selectedVerbObj = DICTIONARY_DATA.find(
    (w) => w.tag === 'Verb' && (w.word === conjugateInput || w.reading === conjugateInput)
  ) || { word: conjugateInput, reading: conjugateInput, type: 'ru' };

  const conjugationResult = conjugateVerb(selectedVerbObj);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dictionary & Conjugator</Text>
        <Text style={styles.subtitle}>
          Search JLPT vocabulary, filter by tags, and conjugate verbs.
        </Text>
      </View>

      {/* Search Bar & CSV Export */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by English, Japanese, or Romaji..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.exportButton} onPress={exportCsv}>
          <Text style={styles.exportButtonText}>📥 Export</Text>
        </TouchableOpacity>
      </View>

      {/* Category Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
        {['all', 'verbs', 'nouns', 'adjectives', 'starred'].map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {cat === 'starred' ? `★ Starred (${starredWords.length})` : cat.toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Vocabulary List */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Vocabulary Results ({filteredWords.length})</Text>
        {filteredWords.length === 0 ? (
          <Text style={styles.emptyText}>No matching vocabulary found.</Text>
        ) : (
          filteredWords.map((item) => {
            const isStarred = starredWords.includes(item.word);
            return (
              <View key={item.word} style={styles.wordRow}>
                <View style={{ flex: 1 }}>
                  <View style={styles.wordHeader}>
                    <Text style={styles.wordTitle}>{item.word}</Text>
                    <Text style={styles.wordReading}>({item.reading})</Text>
                    <View style={styles.tagBadge}>
                      <Text style={styles.tagText}>{item.tag}</Text>
                    </View>
                  </View>
                  <Text style={styles.wordEnglish}>{item.english}</Text>
                </View>

                <TouchableOpacity
                  onPress={() => toggleStar(item.word)}
                  style={styles.starButton}
                >
                  <Text style={styles.starIcon}>{isStarred ? '★' : '☆'}</Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </View>

      {/* Verb Conjugator Section */}
      <View style={[styles.card, { marginTop: 16 }]}>
        <Text style={styles.cardTitle}>⚙️ Verb Conjugator Engine</Text>

        <Text style={styles.label}>Select Verb</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.verbRow}>
          {DICTIONARY_DATA.filter((w) => w.tag === 'Verb').map((v) => (
            <TouchableOpacity
              key={v.word}
              style={[
                styles.verbChip,
                conjugateInput === v.word && styles.verbChipActive,
              ]}
              onPress={() => setConjugateInput(v.word)}
            >
              <Text
                style={[
                  styles.verbChipText,
                  conjugateInput === v.word && styles.verbChipTextActive,
                ]}
              >
                {v.word} ({v.reading})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {conjugationResult && (
          <View style={styles.conjugationGrid}>
            <View style={styles.gridRow}>
              <Text style={styles.gridLabel}>Polite (Masu):</Text>
              <Text style={styles.gridValue}>{conjugationResult.polite}</Text>
            </View>
            <View style={styles.gridRow}>
              <Text style={styles.gridLabel}>Negative (Nai):</Text>
              <Text style={styles.gridValue}>{conjugationResult.negative}</Text>
            </View>
            <View style={styles.gridRow}>
              <Text style={styles.gridLabel}>Past (Ta):</Text>
              <Text style={styles.gridValue}>{conjugationResult.past}</Text>
            </View>
            <View style={styles.gridRow}>
              <Text style={styles.gridLabel}>Te Form:</Text>
              <Text style={styles.gridValue}>{conjugationResult.te}</Text>
            </View>
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
  searchRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  exportButton: {
    backgroundColor: '#5c60f5',
    paddingHorizontal: 14,
    justifyContent: 'center',
    borderRadius: 8,
  },
  exportButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#94a3b8',
    marginVertical: 16,
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  wordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  wordTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  wordReading: {
    fontSize: 13,
    color: '#64748b',
  },
  tagBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#5c60f5',
  },
  wordEnglish: {
    fontSize: 13,
    color: '#334155',
    marginTop: 2,
  },
  starButton: {
    padding: 8,
  },
  starIcon: {
    fontSize: 20,
    color: '#f59e0b',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  verbRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  verbChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    marginRight: 8,
  },
  verbChipActive: {
    backgroundColor: '#5c60f5',
  },
  verbChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  verbChipTextActive: {
    color: '#ffffff',
  },
  conjugationGrid: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gridLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  gridValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5c60f5',
  },
});
