export type SupportedLocale = 'en' | 'ja';

export const translations = {
  en: {
    welcome: 'Welcome to Zengo',
    studyGoal: 'JLPT N5 Goal',
    startLesson: 'Start Lesson',
    practiceKanji: 'Practice Kanji',
    quizTitle: 'N5 Practice Quiz',
  },
  ja: {
    welcome: '禅語へようこそ',
    studyGoal: 'JLPT N5目標',
    startLesson: 'レッスンを開始',
    practiceKanji: '漢字を練習',
    quizTitle: 'N5練習クイズ',
  },
};

export function t(key: keyof typeof translations['en'], locale: SupportedLocale = 'en'): string {
  return translations[locale]?.[key] || translations['en'][key] || key;
}
