import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
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
  const [isMastered, setIsMastered] = useState(false);

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
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.typeBadge}>{kana.type.toUpperCase()}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Character Box */}
          <View style={styles.charBox}>
            <Text style={styles.bigChar}>{kana.char}</Text>
            <Text style={styles.romajiText}>{kana.romaji}</Text>
          </View>

          {/* Details */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Example Vocabulary</Text>
            <Text style={styles.vocabText}>{kana.vocab}</Text>
            <Text style={styles.translationText}>{kana.translation}</Text>
          </View>

          {/* Mastery Toggle */}
          <TouchableOpacity
            style={[styles.masteryButton, isMastered && styles.masteryButtonActive]}
            onPress={handleToggleMastery}
          >
            <Text style={[styles.masteryText, isMastered && styles.masteryTextActive]}>
              {isMastered ? '✓ Mastered Character' : 'Mark as Mastered'}
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
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  typeBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: '#5c60f5',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    fontSize: 18,
    color: '#94a3b8',
    fontWeight: '700',
  },
  charBox: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginBottom: 16,
  },
  bigChar: {
    fontSize: 72,
    fontWeight: '800',
    color: '#5c60f5',
  },
  romajiText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 4,
  },
  infoBox: {
    backgroundColor: '#f8fafc',
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 4,
  },
  vocabText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  translationText: {
    fontSize: 13,
    color: '#64748b',
  },
  masteryButton: {
    paddingVertical: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    alignItems: 'center',
  },
  masteryButtonActive: {
    backgroundColor: '#10b981',
  },
  masteryText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  masteryTextActive: {
    color: '#ffffff',
  },
});
