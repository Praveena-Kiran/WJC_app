export interface KanaItem {
  id: string;
  char: string;
  romaji: string;
  type: 'hiragana' | 'katakana';
  vocab: string;
  translation: string;
  notes?: string;
}

export const KANA_DATA: KanaItem[] = [
  // Hiragana Vowels
  { id: 'h-a', char: 'あ', romaji: 'a', type: 'hiragana', vocab: '朝 (あさ)', translation: 'Morning' },
  { id: 'h-i', char: 'い', romaji: 'i', type: 'hiragana', vocab: '犬 (いぬ)', translation: 'Dog' },
  { id: 'h-u', char: 'う', romaji: 'u', type: 'hiragana', vocab: '海 (うみ)', translation: 'Sea, ocean' },
  { id: 'h-e', char: 'え', romaji: 'e', type: 'hiragana', vocab: '駅 (えき)', translation: 'Station' },
  { id: 'h-o', char: 'お', romaji: 'o', type: 'hiragana', vocab: '鬼 (おに)', translation: 'Demon, ogre' },
  // Hiragana K-row
  { id: 'h-ka', char: 'か', romaji: 'ka', type: 'hiragana', vocab: '川 (かわ)', translation: 'River' },
  { id: 'h-ki', char: 'き', romaji: 'ki', type: 'hiragana', vocab: '木 (き)', translation: 'Tree' },
  { id: 'h-ku', char: 'く', romaji: 'ku', type: 'hiragana', vocab: '車 (くるま)', translation: 'Car' },
  { id: 'h-ke', char: 'け', romaji: 'ke', type: 'hiragana', vocab: '毛 (け)', translation: 'Hair' },
  { id: 'h-ko', char: 'こ', romaji: 'ko', type: 'hiragana', vocab: '声 (こえ)', translation: 'Voice' },
  // Katakana Vowels
  { id: 'k-a', char: 'ア', romaji: 'a', type: 'katakana', vocab: 'アイス (Aisu)', translation: 'Ice cream' },
  { id: 'k-i', char: 'イ', romaji: 'i', type: 'katakana', vocab: 'インク (Inku)', translation: 'Ink' },
  { id: 'k-u', char: 'ウ', romaji: 'u', type: 'katakana', vocab: 'ウエイト (Ueito)', translation: 'Weight' },
  { id: 'k-e', char: 'エ', romaji: 'e', type: 'katakana', vocab: 'エアコン (Eakon)', translation: 'Air conditioner' },
  { id: 'k-o', char: 'オ', romaji: 'o', type: 'katakana', vocab: 'オレンジ (Orenji)', translation: 'Orange' },
  // Katakana K-row
  { id: 'k-ka', char: 'カ', romaji: 'ka', type: 'katakana', vocab: 'カメラ (Kamera)', translation: 'Camera' },
  { id: 'k-ki', char: 'キ', romaji: 'ki', type: 'katakana', vocab: 'キャンプ (Kyampu)', translation: 'Camp' },
  { id: 'k-ku', char: 'ク', romaji: 'ku', type: 'katakana', vocab: 'クラス (Kurasu)', translation: 'Class' },
  { id: 'k-ke', char: 'ケ', romaji: 'ke', type: 'katakana', vocab: 'ケーキ (Keeki)', translation: 'Cake' },
  { id: 'k-ko', char: 'コ', romaji: 'ko', type: 'katakana', vocab: 'コーヒー (Koohii)', translation: 'Coffee' },
];
