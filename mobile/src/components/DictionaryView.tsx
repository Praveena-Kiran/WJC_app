import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Share,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/src/theme/ThemeContext';
import { SPACING, RADIUS, TYPE } from '@/src/theme/tokens';
import { Screen } from '@/src/components/ui/Screen';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Chip } from '@/src/components/ui/Chip';
import { Badge } from '@/src/components/ui/Badge';
import { Icon } from '@/src/components/ui/Icon';
import { conjugateVerb } from '../lib/conjugator';
import { DICTIONARY_DATA } from './dictionary-data';

export function DictionaryView() {
  const { theme } = useTheme();
  const router = useRouter();
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

  const categoryChips = [
    { key: 'all', label: 'ALL' },
    { key: 'verbs', label: 'VERBS' },
    { key: 'nouns', label: 'NOUNS' },
    { key: 'adjectives', label: 'ADJECTIVES' },
    { key: 'starred', label: `Starred (${starredWords.length})` },
  ];

  const tagVariant = (tag: string): 'accent' | 'success' | 'warning' | 'muted' => {
    if (tag === 'Verb') return 'success';
    if (tag === 'Adjective') return 'warning';
    return 'accent';
  };

  return (
    <Screen scroll padding={SPACING.lg}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg }}>
        <Text style={[TYPE.title, { color: theme.text, flex: 1 }]}>Dictionary & Conjugator</Text>
        <TouchableOpacity
          onPress={() => router.push('/more/settings')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Settings"
        >
          <Icon name="sliders" size={20} color={theme.accent} />
        </TouchableOpacity>
      </View>

      {/* Search Bar & CSV Export */}
      <View style={{ flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md }}>
        <View style={{ flex: 1 }}>
          <Input
            placeholder="Search by English, Japanese, or Romaji..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <Button title="Export" onPress={exportCsv} size="sm" variant="secondary" />
      </View>

      {/* Category Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: SPACING.lg }}
        contentContainerStyle={{ gap: SPACING.sm }}
      >
        {categoryChips.map((cat) => (
          <Chip
            key={cat.key}
            label={cat.label}
            selected={activeCategory === cat.key}
            onPress={() => setActiveCategory(cat.key)}
          />
        ))}
      </ScrollView>

      {/* Vocabulary List */}
      <Card padding={SPACING.lg} style={{ marginBottom: SPACING.lg }}>
        <Text style={[TYPE.bodyStrong, { color: theme.text, marginBottom: SPACING.md }]}>
          Vocabulary Results ({filteredWords.length})
        </Text>
        {filteredWords.length === 0 ? (
          <Text style={[TYPE.caption, { color: theme.textMuted, textAlign: 'center', marginVertical: SPACING.lg }]}>
            No matching vocabulary found.
          </Text>
        ) : (
          filteredWords.map((item) => {
            const isStarred = starredWords.includes(item.word);
            return (
              <View
                key={item.word}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: SPACING.sm + 2,
                  borderBottomWidth: 1,
                  borderBottomColor: theme.border,
                }}
              >
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.xs + 2 }}>
                    <Text style={[TYPE.bodyStrong, { color: theme.text, fontSize: 16 }]}>{item.word}</Text>
                    <Text style={[TYPE.caption, { color: theme.textMuted }]}>({item.reading})</Text>
                    <Badge label={item.tag} variant={tagVariant(item.tag)} />
                  </View>
                  <Text style={[TYPE.caption, { color: theme.textMuted, marginTop: 2 }]}>{item.english}</Text>
                </View>

                <TouchableOpacity
                  onPress={() => toggleStar(item.word)}
                  style={{ padding: SPACING.sm }}
                >
                  <Icon
                    name="star"
                    size={18}
                    color={isStarred ? theme.warning : theme.textMuted}
                  />
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </Card>

      {/* Verb Conjugator Section */}
      <Card padding={SPACING.lg}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md, gap: SPACING.xs }}>
          <Icon name="settings" size={16} color={theme.text} />
          <Text style={[TYPE.bodyStrong, { color: theme.text }]}>Verb Conjugator Engine</Text>
        </View>

        <Text style={[TYPE.caption, { color: theme.textMuted, marginBottom: SPACING.sm }]}>Select Verb</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: SPACING.md + 2 }}
          contentContainerStyle={{ gap: SPACING.sm }}
        >
          {DICTIONARY_DATA.filter((w) => w.tag === 'Verb').map((v) => (
            <Chip
              key={v.word}
              label={`${v.word} (${v.reading})`}
              selected={conjugateInput === v.word}
              onPress={() => setConjugateInput(v.word)}
            />
          ))}
        </ScrollView>

        {conjugationResult && (
          <View
            style={{
              backgroundColor: theme.surfaceAlt,
              padding: SPACING.md,
              borderRadius: RADIUS.sm,
              gap: SPACING.sm,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={[TYPE.caption, { fontWeight: '600', color: theme.textMuted }]}>Polite (Masu):</Text>
              <Text style={[TYPE.caption, { fontWeight: '700', color: theme.accent }]}>{conjugationResult.polite}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={[TYPE.caption, { fontWeight: '600', color: theme.textMuted }]}>Negative (Nai):</Text>
              <Text style={[TYPE.caption, { fontWeight: '700', color: theme.accent }]}>{conjugationResult.negative}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={[TYPE.caption, { fontWeight: '600', color: theme.textMuted }]}>Past (Ta):</Text>
              <Text style={[TYPE.caption, { fontWeight: '700', color: theme.accent }]}>{conjugationResult.past}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={[TYPE.caption, { fontWeight: '600', color: theme.textMuted }]}>Te Form:</Text>
              <Text style={[TYPE.caption, { fontWeight: '700', color: theme.accent }]}>{conjugationResult.te}</Text>
            </View>
          </View>
        )}
      </Card>
    </Screen>
  );
}
