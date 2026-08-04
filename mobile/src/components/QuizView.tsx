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
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.lg }}>
        <View style={{ flex: 1, paddingRight: SPACING.sm }}>
          <Text style={[TYPE.title, { color: theme.text }]}>Multiple Choice Quiz</Text>
          <Text style={[TYPE.caption, { color: theme.textMuted, marginTop: SPACING.xs }]}>
            Test your Hiragana, Katakana, and N5 Vocabulary skills.
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/more/settings')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={{ paddingTop: SPACING.xs }}
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
            <Text style={[TYPE.caption, { color: theme.textMuted, fontWeight: '700' }]}>
              Question {currentIndex + 1} of {questions.length}
            </Text>
            <Text style={[TYPE.caption, { color: theme.accent, fontWeight: '700' }]}>
              Score: {score}
            </Text>
          </View>

          <View style={{ alignItems: 'center', marginVertical: SPACING.xxl }}>
            <Text style={[TYPE.glyph, { color: theme.accent }]}>
              {questions[currentIndex].prompt}
            </Text>
          </View>

          <View style={{ gap: SPACING.sm, marginBottom: SPACING.lg }}>
            {questions[currentIndex].options.map((option, idx) => {
              const correct = questions[currentIndex].correctAnswer;
              let borderColor = theme.border;
              let bg = theme.surfaceAlt;
              let textColor = theme.text;

              if (isAnswered) {
                if (option === correct) {
                  borderColor = theme.success;
                  bg = theme.successMuted;
                  textColor = theme.success;
                } else if (option === selectedOption) {
                  borderColor = theme.error;
                  bg = theme.errorMuted;
                  textColor = theme.error;
                }
              }

              return (
                <TouchableOpacity
                  key={idx}
                  onPress={() => handleOptionSelect(option)}
                  disabled={isAnswered}
                  activeOpacity={0.7}
                  style={{
                    paddingVertical: SPACING.md,
                    paddingHorizontal: SPACING.lg,
                    backgroundColor: bg,
                    borderWidth: 1,
                    borderColor,
                    borderRadius: RADIUS.sm,
                    alignItems: 'center',
                  }}
                >
                  <Text style={[TYPE.bodyStrong, { color: textColor }]}>{option}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {isAnswered && (
            <Button
              title={currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              onPress={handleNextQuestion}
            />
          )}
        </Card>
      )}

      {quizState === 'finished' && (
        <Card style={{ alignItems: 'center' }}>
          <Icon name="award" size={48} color={theme.accent} />
          <Text style={[TYPE.title, { color: theme.text, marginTop: SPACING.md }]}>
            Quiz Completed!
          </Text>
          <Text style={[TYPE.display, { color: theme.accent, marginVertical: SPACING.sm }]}>
            {score} / {questions.length} ({Math.round((score / questions.length) * 100)}%)
          </Text>
          <Text style={[TYPE.body, { color: theme.textMuted, marginBottom: SPACING.xl }]}>
            {feedbackMsg}
          </Text>
          <Button title="Return to Lobby" onPress={() => setQuizState('lobby')} />
        </Card>
      )}
    </Screen>
  );
}
