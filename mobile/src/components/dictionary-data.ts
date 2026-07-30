export interface DictItem {
  word: string;
  reading: string;
  romaji: string;
  english: string;
  tag: string;
  type?: string;
  example?: {
    jp: string;
    en: string;
  };
}

export const DICTIONARY_DATA: DictItem[] = [
  { word: '私', reading: 'わたし', romaji: 'watashi', english: 'I, me', tag: 'Noun' },
  { word: 'あなた', reading: 'あなた', romaji: 'anata', english: 'You', tag: 'Noun' },
  { word: '先生', reading: 'せんせい', romaji: 'sensei', english: 'Teacher, professor', tag: 'Noun' },
  { word: '学生', reading: 'がくせい', romaji: 'gakusei', english: 'Student', tag: 'Noun' },
  { word: '学校', reading: 'がっこう', romaji: 'gakkou', english: 'School', tag: 'Noun' },
  { word: '食べる', reading: 'たべる', romaji: 'taberu', english: 'To eat', tag: 'Verb', type: 'ru' },
  { word: '飲む', reading: 'のむ', romaji: 'nomu', english: 'To drink', tag: 'Verb', type: 'u' },
  { word: '行く', reading: 'いく', romaji: 'iku', english: 'To go', tag: 'Verb', type: 'u' },
  { word: '来る', reading: 'くる', romaji: 'kuru', english: 'To come', tag: 'Verb', type: 'irr' },
  { word: 'する', reading: 'する', romaji: 'suru', english: 'To do', tag: 'Verb', type: 'irr' },
  { word: '買う', reading: 'かう', romaji: 'kau', english: 'To buy', tag: 'Verb', type: 'u' },
  { word: '読む', reading: 'よむ', romaji: 'yomu', english: 'To read', tag: 'Verb', type: 'u' },
  { word: '話す', reading: 'はなす', romaji: 'hanasu', english: 'To speak', tag: 'Verb', type: 'u' },
  { word: '高い', reading: 'たかい', romaji: 'takai', english: 'Expensive, high', tag: 'Adjective', type: 'i' },
  { word: '静か', reading: 'しずか', romaji: 'shizuka', english: 'Quiet', tag: 'Adjective', type: 'na' },
];
