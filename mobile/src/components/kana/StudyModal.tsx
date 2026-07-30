import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

export interface LessonData {
  id: number;
  title: string;
  jpTitle?: string;
  description: string;
  syllabus: string[];
  vocabulary?: string[];
  kanji?: string[];
}

interface StudyModalProps {
  visible: boolean;
  lesson: LessonData | null;
  onClose: () => void;
  onFinishLesson: (lessonId: number) => void;
}

export function StudyModal({
  visible,
  lesson,
  onClose,
  onFinishLesson,
}: StudyModalProps) {
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    if (visible) {
      setSlideIndex(0);
    }
  }, [visible, lesson]);

  if (!lesson) return null;

  const totalSlides = 3;
  const grammarItems = lesson.syllabus.filter((item) =>
    item.toLowerCase().startsWith('grammar:')
  );

  const handleNext = () => {
    if (slideIndex < totalSlides - 1) {
      setSlideIndex((prev) => prev + 1);
    } else {
      onFinishLesson(lesson.id);
      onClose();
    }
  };

  const handlePrev = () => {
    if (slideIndex > 0) {
      setSlideIndex((prev) => prev - 1);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>
                Lesson {lesson.id}: {lesson.title}
              </Text>
              {Boolean(lesson.jpTitle) && (
                <Text style={styles.jpTitle}>{lesson.jpTitle}</Text>
              )}
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressRow}>
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${((slideIndex + 1) / totalSlides) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              Slide {slideIndex + 1} of {totalSlides}
            </Text>
          </View>

          {/* Body */}
          <ScrollView style={styles.body}>
            {slideIndex === 0 && (
              <View>
                <Text style={styles.slideTitle}>📖 Grammar & Key Patterns</Text>
                {grammarItems.length > 0 ? (
                  grammarItems.map((item, idx) => (
                    <View key={idx} style={styles.cardItem}>
                      <Text style={styles.cardItemText}>
                        {item.replace(/^Grammar:/i, '').trim()}
                      </Text>
                      <Text style={styles.cardItemSubText}>
                        Learn and apply this pattern in conversation.
                      </Text>
                    </View>
                  ))
                ) : (
                  <View style={styles.cardItem}>
                    <Text style={styles.cardItemText}>Overview</Text>
                    <Text style={styles.cardItemSubText}>{lesson.description}</Text>
                  </View>
                )}
              </View>
            )}

            {slideIndex === 1 && (
              <View>
                <Text style={styles.slideTitle}>🔊 Vocabulary Spotlight</Text>
                {lesson.vocabulary && lesson.vocabulary.length > 0 ? (
                  lesson.vocabulary.map((vocab, idx) => (
                    <View key={idx} style={styles.cardItem}>
                      <Text style={styles.cardItemText}>{vocab}</Text>
                    </View>
                  ))
                ) : (
                  <View style={styles.cardItem}>
                    <Text style={styles.cardItemSubText}>
                      No vocabulary listed for this lesson.
                    </Text>
                  </View>
                )}
              </View>
            )}

            {slideIndex === 2 && (
              <View>
                <Text style={styles.slideTitle}>✍️ Kanji Focus</Text>
                {lesson.kanji && lesson.kanji.length > 0 ? (
                  <View style={styles.kanjiGrid}>
                    {lesson.kanji.map((char, idx) => (
                      <View key={idx} style={styles.kanjiBadge}>
                        <Text style={styles.kanjiBadgeText}>{char}</Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View style={styles.cardItem}>
                    <Text style={styles.cardItemSubText}>
                      No kanji required for this lesson.
                    </Text>
                  </View>
                )}
              </View>
            )}
          </ScrollView>

          {/* Footer Controls */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.footerButton, slideIndex === 0 && styles.disabledButton]}
              onPress={handlePrev}
              disabled={slideIndex === 0}
            >
              <Text style={styles.footerButtonText}>← Previous</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.footerButton, styles.primaryButton]}
              onPress={handleNext}
            >
              <Text style={styles.primaryButtonText}>
                {slideIndex === totalSlides - 1 ? 'Finish Lesson 🎉' : 'Next →'}
              </Text>
            </TouchableOpacity>
          </View>
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
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  jpTitle: {
    fontSize: 13,
    color: '#5c60f5',
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#94a3b8',
    fontWeight: '700',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  progressBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10b981',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },
  body: {
    minHeight: 180,
    maxHeight: 280,
    marginBottom: 16,
  },
  slideTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  cardItem: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#5c60f5',
    marginBottom: 8,
  },
  cardItemText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  cardItemSubText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  kanjiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  kanjiBadge: {
    width: 48,
    height: 48,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kanjiBadgeText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#5c60f5',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
  },
  footerButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.4,
  },
  footerButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  primaryButton: {
    backgroundColor: '#5c60f5',
  },
  primaryButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
});
