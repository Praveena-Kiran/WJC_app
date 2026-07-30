export interface RadicalPuzzle {
  id: string;
  targetKanji: string;
  meaning: string;
  radicals: string[];
  distractors: string[];
}

export const PUZZLES: RadicalPuzzle[] = [
  { id: 'p1', targetKanji: '休', meaning: 'Rest', radicals: ['亻', '木'], distractors: ['日', '口'] },
  { id: 'p2', targetKanji: '明', meaning: 'Bright', radicals: ['日', '月'], distractors: ['木', '水'] },
  { id: 'p3', targetKanji: '男', meaning: 'Man', radicals: ['田', '力'], distractors: ['女', '子'] },
  { id: 'p4', targetKanji: '好', meaning: 'Like', radicals: ['女', '子'], distractors: ['田', '日'] },
];
