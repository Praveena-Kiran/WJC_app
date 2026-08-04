import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { SPACING, RADIUS, TYPE } from '@/src/theme/tokens';
import { ProgressBar } from '@/src/components/ui/ProgressBar';
import { Icon } from '@/src/components/ui/Icon';

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
  const { theme } = useTheme();
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
      <View style={[styles.overlay, { backgroundColor: 'rgba(15, 23, 42, 0.6)' }]}>
        <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={[TYPE.title, { fontSize: 18, color: theme.text }]}>
                Lesson {lesson.id}: {lesson.title}
              </Text>
              {Boolean(lesson.jpTitle) && (
                <Text style={[TYPE.body, { fontSize: 13, color: theme.accent, marginTop: 2 }]}>
                  {lesson.jpTitle}
                </Text>
              )}
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="x" size={20} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={styles.progressRow}>
            <View style={{ flex: 1 }}>
              <ProgressBar progress={(slideIndex + 1) / totalSlides} height={8} />
            </View>
            <Text style={[TYPE.caption, { color: theme.textMuted, marginLeft: SPACING.sm }]}>
              Slide {slideIndex + 1} of {totalSlides}
            </Text>
          </View>

          <ScrollView style={styles.body}>
            {slideIndex === 0 && (
              <View>
                <Text style={[TYPE.bodyStrong, { fontSize: 15, color: theme.text, marginBottom: SPACING.md }]}>
                  Grammar & Key Patterns
                </Text>
                {grammarItems.length > 0 ? (
                  grammarItems.map((item, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.cardItem,
                        {
                          backgroundColor: theme.surfaceAlt,
                          borderLeftColor: theme.accent,
                        },
                      ]}
                    >
                      <Text style={[TYPE.bodyStrong, { fontSize: 14, color: theme.text }]}>
                        {item.replace(/^Grammar:/i, '').trim()}
                      </Text>
                      <Text style={[TYPE.caption, { color: theme.textMuted, marginTop: 2 }]}>
                        Learn and apply this pattern in conversation.
                      </Text>
                    </View>
                  ))
                ) : (
                  <View
                    style={[
                      styles.cardItem,
                      {
                        backgroundColor: theme.surfaceAlt,
                        borderLeftColor: theme.accent,
                      },
                    ]}
                  >
                    <Text style={[TYPE.bodyStrong, { fontSize: 14, color: theme.text }]}>Overview</Text>
                    <Text style={[TYPE.caption, { color: theme.textMuted, marginTop: 2 }]}>
                      {lesson.description}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {slideIndex === 1 && (
              <View>
                <Text style={[TYPE.bodyStrong, { fontSize: 15, color: theme.text, marginBottom: SPACING.md }]}>
                  Vocabulary Spotlight
                </Text>
                {lesson.vocabulary && lesson.vocabulary.length > 0 ? (
                  lesson.vocabulary.map((vocab, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.cardItem,
                        {
                          backgroundColor: theme.surfaceAlt,
                          borderLeftColor: theme.accent,
                        },
                      ]}
                    >
                      <Text style={[TYPE.bodyStrong, { fontSize: 14, color: theme.text }]}>{vocab}</Text>
                    </View>
                  ))
                ) : (
                  <View
                    style={[
                      styles.cardItem,
                      {
                        backgroundColor: theme.surfaceAlt,
                        borderLeftColor: theme.accent,
                      },
                    ]}
                  >
                    <Text style={[TYPE.caption, { color: theme.textMuted }]}>
                      No vocabulary listed for this lesson.
                    </Text>
                  </View>
                )}
              </View>
            )}

            {slideIndex === 2 && (
              <View>
                <Text style={[TYPE.bodyStrong, { fontSize: 15, color: theme.text, marginBottom: SPACING.md }]}>
                  Kanji Focus
                </Text>
                {lesson.kanji && lesson.kanji.length > 0 ? (
                  <View style={styles.kanjiGrid}>
                    {lesson.kanji.map((char, idx) => (
                      <View
                        key={idx}
                        style={[
                          styles.kanjiBadge,
                          { backgroundColor: theme.surfaceAlt },
                        ]}
                      >
                        <Text style={[TYPE.glyph, { fontSize: 22, color: theme.accent }]}>
                          {char}
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View
                    style={[
                      styles.cardItem,
                      {
                        backgroundColor: theme.surfaceAlt,
                        borderLeftColor: theme.accent,
                      },
                    ]}
                  >
                    <Text style={[TYPE.caption, { color: theme.textMuted }]}>
                      No kanji required for this lesson.
                    </Text>
                  </View>
                )}
              </View>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.footerButton,
                { backgroundColor: theme.surfaceAlt },
                slideIndex === 0 && styles.disabledButton,
              ]}
              onPress={handlePrev}
              disabled={slideIndex === 0}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.xs }}>
                <Icon name="arrow-left" size={12} color={theme.textMuted} />
                <Text style={[TYPE.bodyStrong, { fontSize: 13, color: theme.textMuted }]}>Previous</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.footerButton,
                { backgroundColor: theme.accent },
              ]}
              onPress={handleNext}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.xs }}>
                <Text style={[TYPE.bodyStrong, { fontSize: 13, color: theme.onAccent }]}>
                  {slideIndex === totalSlides - 1 ? 'Finish Lesson' : 'Next'}
                </Text>
                {slideIndex < totalSlides - 1 && (
                  <Icon name="arrow-right" size={12} color={theme.onAccent} />
                )}
              </View>
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
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    maxHeight: '80%',
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  closeButton: {
    padding: SPACING.sm,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  body: {
    minHeight: 180,
    maxHeight: 280,
    marginBottom: SPACING.lg,
  },
  cardItem: {
    padding: SPACING.md,
    borderRadius: RADIUS.sm,
    borderLeftWidth: 4,
    marginBottom: SPACING.sm,
  },
  kanjiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  kanjiBadge: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  footerButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.4,
  },
});
