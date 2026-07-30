export interface KanjiItem {
  char: string;
  level: 'N5' | 'N4';
  meaning: string;
  onyomi: string;
  kunyomi: string;
  strokes?: string[];
}

export const KANJI_DATA: KanjiItem[] = [
  { char: '一', level: 'N5', meaning: 'One', onyomi: 'イチ', kunyomi: 'ひと', strokes: ['M10,54 L100,54'] },
  { char: '二', level: 'N5', meaning: 'Two', onyomi: 'ニ', kunyomi: 'ふた', strokes: ['M25,35 L85,35', 'M10,75 L100,75'] },
  { char: '三', level: 'N5', meaning: 'Three', onyomi: 'サン', kunyomi: 'み', strokes: ['M25,25 L85,25', 'M30,54 L80,54', 'M10,85 L100,85'] },
  { char: '日', level: 'N5', meaning: 'Sun, Day', onyomi: 'ニチ, ジツ', kunyomi: 'ひ, か' },
  { char: '月', level: 'N5', meaning: 'Moon, Month', onyomi: 'ゲツ, ガツ', kunyomi: 'つき' },
  { char: '水', level: 'N5', meaning: 'Water', onyomi: 'スイ', kunyomi: 'みず' },
  { char: '火', level: 'N5', meaning: 'Fire', onyomi: 'カ', kunyomi: 'ひ' },
  { char: '木', level: 'N5', meaning: 'Tree, Wood', onyomi: 'モク, ボク', kunyomi: 'き' },
  { char: '金', level: 'N5', meaning: 'Gold, Money', onyomi: 'キン', kunyomi: 'かね' },
  { char: '土', level: 'N5', meaning: 'Soil, Earth', onyomi: 'ド, ト', kunyomi: 'つち' },
  { char: '時', level: 'N4', meaning: 'Time, Hour', onyomi: 'ジ', kunyomi: 'とき' },
  { char: '間', level: 'N4', meaning: 'Interval, Between', onyomi: 'カン,ケン', kunyomi: 'あいだ' },
];
