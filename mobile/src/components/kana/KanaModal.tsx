import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { SPACING, RADIUS, TYPE } from '@/src/theme/tokens';
import { Badge } from '@/src/components/ui/Badge';
import { Icon } from '@/src/components/ui/Icon';
import { KanjiDrawingCanvas } from '@/src/components/drawing/KanjiDrawingCanvas';
import { KanaItem } from './kana-data';

interface KanaModalProps {
  visible: boolean;
  kana: KanaItem | null;
  onClose: () => void;
  onToggleMastery?: (kanaId: string) => void;
}

export function KanaModal({
  visible,
  kana,
  onClose,
  onToggleMastery,
}: KanaModalProps) {
  const { theme } = useTheme();
  const [isMastered, setIsMastered] = useState(false);
  const [accuracyScore, setAccuracyScore] = useState<number | null>(null);

  if (!kana) return null;

  const handleToggleMastery = () => {
    setIsMastered(!isMastered);
    if (onToggleMastery) {
      onToggleMastery(kana.id);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: 'rgba(15, 23, 42, 0.6)' }]}>
        <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
          <View style={styles.header}>
            <Badge label={kana.type.toUpperCase()} variant="accent" />
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="x" size={20} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={[styles.charBox, { backgroundColor: theme.surfaceAlt }]}>
            <Text style={[TYPE.glyph, { fontSize: 72, color: theme.accent }]}>
              {kana.char}
            </Text>
            <Text style={[TYPE.title, { fontSize: 24, color: theme.text, marginTop: SPACING.xs }]}>
              {kana.romaji}
            </Text>
          </View>

          <View style={[styles.infoBox, { backgroundColor: theme.surfaceAlt }]}>
            <Text style={[TYPE.caption, { color: theme.textMuted, marginBottom: SPACING.xs }]}>
              Example Vocabulary
            </Text>
            <Text style={[TYPE.bodyStrong, { fontSize: 16, color: theme.text }]}>
              {kana.vocab}
            </Text>
            <Text style={[TYPE.body, { fontSize: 13, color: theme.textMuted }]}>
              {kana.translation}
            </Text>
          </View>

          {kana.strokes && kana.strokes.length > 0 && (
            <View style={{ alignItems: 'center', marginBottom: SPACING.lg }}>
              <KanjiDrawingCanvas
                guidePaths={kana.strokes}
                viewBox={100}
                onCheckResult={(score) => setAccuracyScore(score)}
              />
            </View>
          )}

          {accuracyScore !== null && (
            <View
              style={{
                marginBottom: SPACING.lg,
                padding: SPACING.md,
                borderRadius: RADIUS.sm,
                backgroundColor: accuracyScore >= 60 ? theme.successMuted : theme.errorMuted,
                flexDirection: 'row',
                alignItems: 'center',
                gap: SPACING.sm,
              }}
            >
              <Icon
                name={accuracyScore >= 60 ? 'check-circle' : 'info'}
                size={16}
                color={accuracyScore >= 60 ? theme.success : theme.error}
              />
              <Text style={[TYPE.caption, { fontWeight: '700', color: theme.text }]}>
                {accuracyScore >= 60
                  ? `Great job! Stroke accuracy: ${accuracyScore}%`
                  : `Stroke Accuracy: ${accuracyScore}%. Follow guide strokes carefully.`}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.masteryButton,
              {
                backgroundColor: isMastered ? theme.success : theme.surfaceAlt,
              },
            ]}
            onPress={handleToggleMastery}
          >
            <Text
              style={[
                TYPE.bodyStrong,
                { fontSize: 13, color: isMastered ? theme.onAccent : theme.textMuted },
              ]}
            >
              {isMastered ? 'Mastered Character' : 'Mark as Mastered'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  modalContent: {
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  charBox: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.lg,
  },
  infoBox: {
    padding: 14,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.lg,
  },
  masteryButton: {
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
  },
});
