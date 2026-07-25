// Mobile Datasets for WJC Japanese App

export const targetPhrases = [
  {
    id: "p1",
    japanese: "こんにちは",
    romaji: "Konnichiwa",
    english: "Hello / Good afternoon",
    category: "Greetings",
    pitchPatternName: "Heiban (平板 - Flat Pattern)",
    pitchType: "heiban",
    moras: ["こ", "ん", "に", "ち", "は"],
    moraPitches: ["L", "H", "H", "H", "H"],
    pitchDropIndex: null,
    phoneticNotes: "Starts Low on 'こ', rises to High on 'ん' and stays High through 'は'."
  },
  {
    id: "p2",
    japanese: "すみません",
    romaji: "Sumimasen",
    english: "Excuse me / Sorry",
    category: "Daily Courtesy",
    pitchPatternName: "Heiban (平板 - Flat Pattern)",
    pitchType: "heiban",
    moras: ["す", "み", "ま", "せ", "ん"],
    moraPitches: ["L", "H", "H", "H", "H"],
    pitchDropIndex: null,
    phoneticNotes: "Low start on 'す', rises to High on 'み' and remains High to the end."
  },
  {
    id: "p3",
    japanese: "これをください",
    romaji: "Kore o kudasai",
    english: "Please give me this",
    category: "Shopping",
    pitchPatternName: "Nakadaka (中高 - Mid-High Drop)",
    pitchType: "nakadaka",
    moras: ["こ", "れ", "を", "く", "だ", "さ", "い"],
    moraPitches: ["L", "H", "L", "L", "H", "H", "H"],
    pitchDropIndex: 1,
    phoneticNotes: "Pitch rises to 'れ', drops down on particle 'を', then rises again on 'だ'."
  },
  {
    id: "p4",
    japanese: "いくらですか",
    romaji: "Ikura desu ka",
    english: "How much is it?",
    category: "Shopping",
    pitchPatternName: "Atamadaka (頭高 - First Mora High)",
    pitchType: "atamadaka",
    moras: ["い", "く", "ら", "で", "す", "か"],
    moraPitches: ["H", "L", "L", "L", "L", "L"],
    pitchDropIndex: 0,
    phoneticNotes: "First mora 'い' starts High and immediately drops Low for the rest of the phrase."
  },
  {
    id: "p5",
    japanese: "ありがとうございます",
    romaji: "Arigatou gozaimasu",
    english: "Thank you very much",
    category: "Courtesy",
    pitchPatternName: "Nakadaka (中高 - Peak on と)",
    pitchType: "nakadaka",
    moras: ["あ", "り", "が", "と", "う", "ご", "ざ", "い", "ま", "す"],
    moraPitches: ["L", "H", "H", "H", "L", "L", "H", "H", "H", "L"],
    pitchDropIndex: 3,
    phoneticNotes: "Peaks High on 'と', drops down on 'う', then gently rises on 'ざ'."
  }
];

export const dictionary = [
  { id: 1, word: "こんにちは", romaji: "Konnichiwa", english: "Hello / Good afternoon", category: "Greetings" },
  { id: 2, word: "ありがとう", romaji: "Arigatou", english: "Thank you", category: "Courtesy" },
  { id: 3, word: "さようなら", romaji: "Sayounara", english: "Goodbye", category: "Greetings" },
  { id: 4, word: "すみません", romaji: "Sumimasen", english: "Excuse me / I'm sorry", category: "Courtesy" },
  { id: 5, word: "はい", romaji: "Hai", english: "Yes", category: "Basics" },
  { id: 6, word: "いいえ", romaji: "Iie", english: "No", category: "Basics" },
  { id: 7, word: "わたし", romaji: "Watashi", english: "I / Myself", category: "Nouns" },
  { id: 8, word: "がくせい", romaji: "Gakusei", english: "Student", category: "Nouns" },
  { id: 9, word: "せんせい", romaji: "Sensei", english: "Teacher / Professor", category: "Nouns" },
  { id: 10, word: "にほんご", romaji: "Nihongo", english: "Japanese language", category: "Nouns" }
];
