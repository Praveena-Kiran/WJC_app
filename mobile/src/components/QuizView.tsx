import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { apiFetch } from '../lib/api';

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

export function QuizView() {
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
      // Save QuizRun via API
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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Multiple Choice Quiz</Text>
        <Text style={styles.subtitle}>
          Test your Hiragana, Katakana, and N5 Vocabulary skills.
        </Text>
      </View>

      {/* State 1: Lobby */}
      {quizState === 'lobby' && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Configure Quiz</Text>

          <Text style={styles.label}>Select Deck</Text>
          <View style={styles.btnGroup}>
            {(['hiragana', 'katakana', 'vocab'] as const).map((type) => (
              <TouchableOpacity
                key={type}
                style={[styles.tabButton, deckType === type && styles.tabButtonActive]}
                onPress={() => setDeckType(type)}
              >
                <Text
                  style={[styles.tabButtonText, deckType === type && styles.tabButtonTextActive]}
                >
                  {type.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Question Count</Text>
          <View style={styles.btnGroup}>
            {[5, 10, 20].map((cnt) => (
              <TouchableOpacity
                key={cnt}
                style={[styles.tabButton, questionCount === cnt && styles.tabButtonActive]}
                onPress={() => setQuestionCount(cnt)}
              >
                <Text
                  style={[styles.tabButtonText, questionCount === cnt && styles.tabButtonTextActive]}
                >
                  {cnt} Qs
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={generateQuiz}>
            <Text style={styles.primaryButtonText}>Start Challenge ▶</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* State 2: Active Game */}
      {quizState === 'active' && questions.length > 0 && (
        <View style={styles.card}>
          <View style={styles.quizHeader}>
            <Text style={styles.questionTracker}>
              Question {currentIndex + 1} of {questions.length}
            </Text>
            <Text style={styles.scoreText}>Score: {score}</Text>
          </View>

          <View style={styles.promptBox}>
            <Text style={styles.promptText}>{questions[currentIndex].prompt}</Text>
          </View>

          <View style={styles.optionsGrid}>
            {questions[currentIndex].options.map((option, idx) => {
              const buttonStyle: StyleProp<ViewStyle>[] = [styles.optionButton];
              const textStyle: StyleProp<TextStyle>[] = [styles.optionText];

              if (isAnswered) {
                if (option === questions[currentIndex].correctAnswer) {
                  buttonStyle.push(styles.optionCorrect);
                  textStyle.push(styles.optionTextCorrect);
                } else if (option === selectedOption) {
                  buttonStyle.push(styles.optionIncorrect);
                  textStyle.push(styles.optionTextIncorrect);
                }
              }

              return (
                <TouchableOpacity
                  key={idx}
                  style={buttonStyle}
                  onPress={() => handleOptionSelect(option)}
                  disabled={isAnswered}
                >
                  <Text style={textStyle}>{option}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {isAnswered && (
            <TouchableOpacity style={styles.primaryButton} onPress={handleNextQuestion}>
              <Text style={styles.primaryButtonText}>
                {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question →'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* State 3: Scoreboard */}
      {quizState === 'finished' && (
        <View style={styles.card}>
          <Text style={styles.trophyIcon}>🏆</Text>
          <Text style={styles.sectionTitle}>Quiz Completed!</Text>

          <Text style={styles.scoreResult}>
            {score} / {questions.length} (
            {Math.round((score / questions.length) * 100)}%)
          </Text>
          <Text style={styles.feedbackText}>{feedbackMsg}</Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setQuizState('lobby')}
          >
            <Text style={styles.primaryButtonText}>Return to Lobby</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8fafc',
    flexGrow: 1,
  },
  headerContainer: {
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
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  btnGroup: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#5c60f5',
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  tabButtonTextActive: {
    color: '#ffffff',
  },
  primaryButton: {
    backgroundColor: '#5c60f5',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  questionTracker: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
  },
  scoreText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5c60f5',
  },
  promptBox: {
    alignItems: 'center',
    marginVertical: 24,
  },
  promptText: {
    fontSize: 48,
    fontWeight: '800',
    color: '#5c60f5',
  },
  optionsGrid: {
    gap: 10,
    marginBottom: 16,
  },
  optionButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    alignItems: 'center',
  },
  optionCorrect: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#10b981',
  },
  optionIncorrect: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#ef4444',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  optionTextCorrect: {
    color: '#10b981',
  },
  optionTextIncorrect: {
    color: '#ef4444',
  },
  trophyIcon: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 12,
  },
  scoreResult: {
    fontSize: 24,
    fontWeight: '800',
    color: '#5c60f5',
    textAlign: 'center',
    marginVertical: 8,
  },
  feedbackText: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
  },
});
