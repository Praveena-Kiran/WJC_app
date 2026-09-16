import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/src/theme/ThemeContext';
import { SPACING, RADIUS, TYPE } from '@/src/theme/tokens';
import { Screen, Card, Button, SegmentedControl, Chip, Icon } from '@/src/components/ui';
import { apiFetch } from '@/src/lib/api-fetch';

export interface QuizQuestion {
  prompt: string;
  correctAnswer: string;
  options: string[];
}

const KANA_POOL = [
  { prompt: 'あ', answer: 'a', type: 'hiragana' },
  { prompt: 'い', answer: 'i', type: 'hiragana' },
  { prompt: 'う', answer: 'u', type: 'hiragana' },
  { prompt: 'え', answer: 'e', type: 'hiragana' },
  { prompt: 'お', answer: 'o', type: 'hiragana' },
  { prompt: 'か', answer: 'ka', type: 'hiragana' },
  { prompt: 'き', answer: 'ki', type: 'hiragana' },
  { prompt: 'く', answer: 'ku', type: 'hiragana' },
  { prompt: 'け', answer: 'ke', type: 'hiragana' },
  { prompt: 'こ', answer: 'ko', type: 'hiragana' },
  { prompt: 'ア', answer: 'a', type: 'katakana' },
  { prompt: 'イ', answer: 'i', type: 'katakana' },
  { prompt: 'ウ', answer: 'u', type: 'katakana' },
  { prompt: 'エ', answer: 'e', type: 'katakana' },
  { prompt: 'オ', answer: 'o', type: 'katakana' },
  { prompt: 'カ', answer: 'ka', type: 'katakana' },
  { prompt: 'キ', answer: 'ki', type: 'katakana' },
  { prompt: 'ク', answer: 'ku', type: 'katakana' },
  { prompt: 'ケ', answer: 'ke', type: 'katakana' },
  { prompt: 'コ', answer: 'ko', type: 'katakana' },
];

const VOCAB_POOL = [
  { prompt: '猫 (ねこ)', answer: 'Cat' },
  { prompt: '犬 (いぬ)', answer: 'Dog' },
  { prompt: '水 (みず)', answer: 'Water' },
  { prompt: '本 (ほん)', answer: 'Book' },
  { prompt: '車 (くるま)', answer: 'Car' },
  { prompt: '学校 (がっこう)', answer: 'School' },
  { prompt: '友だち (ともだち)', answer: 'Friend' },
  { prompt: '山 (やま)', answer: 'Mountain' },
  { prompt: '川 (かわ)', answer: 'River' },
  { prompt: '空 (そら)', answer: 'Sky' },
];

const DECK_OPTIONS: { label: string; value: 'hiragana' | 'katakana' | 'vocab' }[] = [
  { label: 'Hiragana', value: 'hiragana' },
  { label: 'Katakana', value: 'katakana' },
  { label: 'Vocab', value: 'vocab' },
];

const COUNT_OPTIONS = [5, 10, 20];

export function QuizView() {
  const { theme } = useTheme();
  const router = useRouter();
  const [deckType, setDeckType] = useState<'hiragana' | 'katakana' | 'vocab'>('hiragana');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [quizState, setQuizState] = useState<'lobby' | 'active' | 'finished'>('lobby');

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const generateQuiz = () => {
    let pool: Array<{ prompt: string; answer: string }> = [];

    if (deckType === 'hiragana' || deckType === 'katakana') {
      pool = KANA_POOL.filter((k) => k.type === deckType).map((k) => ({
        prompt: k.prompt,
        answer: k.answer,
      }));
    } else {
      pool = VOCAB_POOL;
    }

    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(questionCount, shuffled.length));

    const generatedQuestions: QuizQuestion[] = selected.map((q) => {
      const otherAnswers = pool.map((p) => p.answer).filter((a) => a !== q.answer);
      const wrongOptions = [...otherAnswers].sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [...wrongOptions, q.answer].sort(() => Math.random() - 0.5);

      return {
        prompt: q.prompt,
        correctAnswer: q.answer,
        options,
      };
    });

    setQuestions(generatedQuestions);
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setQuizState('active');
  };

  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    const currentQ = questions[currentIndex];
    if (option === currentQ.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizState('finished');
      try {
        await apiFetch('/api/quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            deck: deckType,
            length: questions.length,
            score,
          }),
        });
      } catch (err) {
        console.warn('Failed to save quiz run:', err);
      }
    }
  };

  const feedbackMsg =
    score <= Math.floor(questions.length * 0.3)
      ? 'Keep practicing!'
      : score <= Math.floor(questions.length * 0.7)
      ? 'Good effort!'
      : 'Excellent!';

  return (
    <Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg }}>
        <Text style={[TYPE.title, { color: theme.text, flex: 1 }]}>Multiple Choice Quiz</Text>
        <TouchableOpacity
          onPress={() => router.push('/more/settings')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Settings"
        >
          <Icon name="sliders" size={20} color={theme.accent} />
        </TouchableOpacity>
      </View>

      {quizState === 'lobby' && (
        <Card>
          <Text
            style={[
              TYPE.bodyStrong,
              { color: theme.text, textAlign: 'center', marginBottom: SPACING.lg },
            ]}
          >
            Configure Quiz
          </Text>

          <Text style={[TYPE.caption, { color: theme.textMuted, marginBottom: SPACING.sm }]}>
            Select Deck
          </Text>
          <SegmentedControl
            options={DECK_OPTIONS}
            value={deckType}
            onChange={setDeckType}
          />

          <View style={{ marginTop: SPACING.xl }}>
            <Text style={[TYPE.caption, { color: theme.textMuted, marginBottom: SPACING.sm }]}>
              Question Count
            </Text>
            <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
              {COUNT_OPTIONS.map((cnt) => (
                <Chip
                  key={cnt}
                  label={`${cnt} Qs`}
                  selected={questionCount === cnt}
                  onPress={() => setQuestionCount(cnt)}
                  style={{ flex: 1 }}
                />
              ))}
            </View>
          </View>

          <Button
            title="Start Challenge"
            size="lg"
            fullWidth
            rightIcon="play"
            onPress={generateQuiz}
            style={{ marginTop: SPACING.xl }}
          />
        </Card>
      )}

      {quizState === 'active' && questions.length > 0 && (
        <Card>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: SPACING.md,
              paddingBottom: SPACING.md,
              borderBottomWidth: 1,
              borderBottomColor: theme.border,
            }}
          >
            <Text style={[TYPE.subhead, { color: theme.textMuted, fontWeight: '700' }]}>
              Question {currentIndex + 1} of {questions.length}
            </Text>
            <View
              style={{
                backgroundColor: theme.accentMuted,
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: RADIUS.full,
              }}
            >
              <Text style={[TYPE.micro, { color: theme.accent }]}>
                SCORE: {score}
              </Text>
            </View>
          </View>

          <View style={{ alignItems: 'center', marginVertical: SPACING.xl }}>
            <Text style={[TYPE.glyph, { color: theme.accent, fontSize: 56 }]}>
              {questions[currentIndex].prompt}
            </Text>
          </View>

          {/* 4 Tactile Option Cards */}
          <View style={{ gap: SPACING.sm, marginBottom: SPACING.lg }}>
            {questions[currentIndex].options.map((option, idx) => {
              const letter = ['A', 'B', 'C', 'D'][idx] || `${idx + 1}`;
              const correct = questions[currentIndex].correctAnswer;
              let borderColor = theme.border;
              let bg = theme.surfaceAlt;
              let textColor = theme.text;
              let statusIcon: 'check-circle' | 'x-circle' | null = null;
              let statusColor = theme.textMuted;

              if (isAnswered) {
                if (option === correct) {
                  borderColor = theme.success;
                  bg = theme.successMuted;
                  textColor = theme.success;
                  statusIcon = 'check-circle';
                  statusColor = theme.success;
                } else if (option === selectedOption) {
                  borderColor = theme.error;
                  bg = theme.errorMuted;
                  textColor = theme.error;
                  statusIcon = 'x-circle';
                  statusColor = theme.error;
                }
              }

              return (
                <TouchableOpacity
                  key={idx}
                  onPress={() => handleOptionSelect(option)}
                  disabled={isAnswered}
                  activeOpacity={0.7}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: SPACING.md,
                    paddingHorizontal: SPACING.md,
                    backgroundColor: bg,
                    borderWidth: 1.5,
                    borderColor,
                    borderRadius: RADIUS.md,
                    minHeight: 56,
                  }}
                >
                  <View
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      backgroundColor: isAnswered && (option === correct || option === selectedOption)
                        ? (option === correct ? theme.success : theme.error)
                        : theme.surface,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: SPACING.md,
                    }}
                  >
                    <Text
                      style={[
                        TYPE.micro,
                        {
                          color: isAnswered && (option === correct || option === selectedOption)
                            ? theme.surface
                            : theme.textMuted,
                          fontWeight: '800',
                        },
                      ]}
                    >
                      {letter}
                    </Text>
                  </View>

                  <Text
                    style={[
                      TYPE.bodyStrong,
                      { color: textColor, flex: 1, fontSize: 16 },
                    ]}
                  >
                    {option}
                  </Text>

                  {statusIcon ? (
                    <Icon name={statusIcon} size={20} color={statusColor} />
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Action Button Container */}
          <View style={{ minHeight: 48, justifyContent: 'center' }}>
            {isAnswered ? (
              <Button
                title={
                  currentIndex === questions.length - 1
                    ? 'Finish Quiz'
                    : 'Next Question'
                }
                size="lg"
                fullWidth
                rightIcon="arrow-right"
                onPress={handleNextQuestion}
              />
            ) : (
              <Text
                style={[
                  TYPE.caption,
                  { color: theme.textMuted, textAlign: 'center' },
                ]}
              >
                Select your answer to proceed
              </Text>
            )}
          </View>
        </Card>
      )}

      {quizState === 'finished' && (
        <Card style={{ alignItems: 'center', padding: SPACING.xl }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: theme.accentMuted,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="award" size={36} color={theme.accent} />
          </View>

          <Text style={[TYPE.title, { color: theme.text, marginTop: SPACING.md }]}>
            Quiz Completed!
          </Text>
          <Text style={[TYPE.display, { color: theme.accent, marginVertical: SPACING.xs }]}>
            {score} / {questions.length} ({Math.round((score / questions.length) * 100)}%)
          </Text>
          <Text style={[TYPE.body, { color: theme.textMuted, marginBottom: SPACING.xl }]}>
            {feedbackMsg}
          </Text>

          <View style={{ width: '100%', gap: SPACING.sm }}>
            <Button
              title="Try Again"
              size="lg"
              fullWidth
              leftIcon="rotate-ccw"
              onPress={generateQuiz}
            />
            <Button
              title="Return to Lobby"
              variant="outline"
              size="md"
              fullWidth
              onPress={() => setQuizState('lobby')}
            />
          </View>
        </Card>
      )}
    </Screen>
  );
}
