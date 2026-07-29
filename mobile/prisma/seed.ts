/**
 * seed.ts — Zengo reference data seeder
 *
 * Ports all content from web/src/lib/data.ts and web component files into Neon DB.
 * Idempotent: safe to re-run. Uses upserts so row counts stay stable on re-runs.
 *
 * Run via: npx prisma db seed
 * Or directly: npx tsx prisma/seed.ts
 */

import path from 'path';
import { PrismaClient } from '@prisma/client';

// ── Import web source data ────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { lessons, kanaData, kanaStrokes, dictionary, kanjiData } = require(
  path.resolve(__dirname, '../../web/src/lib/data.ts')
);

// Inline KaiwaScenario data (from web/src/components/KaiwaView.tsx)
// Copied here to avoid bundler/TSX cross-package issues.
const kaiwaScenarios = [
  {
    id: 'cafe-order',
    title: 'Ordering at a Café',
    japaneseTitle: 'カフェで注文する',
    category: 'Shopping & Services',
    icon: '☕',
    description: 'Practice ordering coffee and food at a Japanese café.',
    dialogue: [
      { speaker: 'Clerk (店員)', avatar: '🧑‍💼', japanese: 'いらっしゃいませ！ご注文はお決まりですか？', furigana: 'いらっしゃいませ！ごちゅうもんはおきまりですか？', romaji: 'Irasshaimase! Go-chuumon wa okimari desu ka?', english: 'Welcome! Are you ready to order?' },
      { speaker: 'You (あなた)', avatar: '🙋', japanese: 'コーヒーをください。', furigana: 'コーヒーをください。', romaji: 'Koohii o kudasai.', english: 'Coffee, please.', options: [
        { text: 'コーヒーをください。', romaji: 'Koohii o kudasai.', english: 'Coffee, please.', isCorrect: true, feedback: '✅ Perfect! Natural and polite.' },
        { text: 'コーヒーがほしいです。', romaji: 'Koohii ga hoshii desu.', english: 'I want coffee.', isCorrect: false, feedback: '⚠️ Grammatically correct but less natural in a café.' },
        { text: 'コーヒーをとってください。', romaji: 'Koohii o totte kudasai.', english: 'Please get the coffee for me.', isCorrect: false, feedback: '❌ Too direct — sounds rude to a server.' },
      ]},
      { speaker: 'Clerk (店員)', avatar: '🧑‍💼', japanese: 'サイズはいかがですか？', furigana: 'サイズはいかがですか？', romaji: 'Saizu wa ikaga desu ka?', english: 'What size would you like?' },
      { speaker: 'You (あなた)', avatar: '🙋', japanese: 'Mサイズでお願いします。', furigana: 'えむサイズでおねがいします。', romaji: 'Emu saizu de onegaishimasu.', english: 'Medium size, please.', options: [
        { text: 'Mサイズでお願いします。', romaji: 'Emu saizu de onegaishimasu.', english: 'Medium, please.', isCorrect: true, feedback: '✅ Excellent! Very natural phrasing.' },
        { text: 'Mがいいです。', romaji: 'Emu ga ii desu.', english: 'Medium is fine.', isCorrect: false, feedback: '⚠️ Correct but informal for a service setting.' },
        { text: 'Mサイズをください。', romaji: 'Emu saizu o kudasai.', english: 'Give me medium.', isCorrect: false, feedback: '⚠️ Slightly direct but acceptable.' },
      ]},
      { speaker: 'Clerk (店員)', avatar: '🧑‍💼', japanese: '450円になります。', furigana: '450えんになります。', romaji: 'Yonhyaku-gojuu-en ni narimasu.', english: 'That will be 450 yen.' },
      { speaker: 'You (あなた)', avatar: '🙋', japanese: 'はい、どうぞ。', furigana: 'はい、どうぞ。', romaji: 'Hai, douzo.', english: 'Here you go.', options: [
        { text: 'はい、どうぞ。', romaji: 'Hai, douzo.', english: 'Here you go.', isCorrect: true, feedback: '✅ Polite and natural when handing over cash.' },
        { text: 'お金です。', romaji: 'Okane desu.', english: 'This is money.', isCorrect: false, feedback: '❌ Awkward — sounds like you\'re narrating.' },
        { text: 'これをどうぞ。', romaji: 'Kore o douzo.', english: 'Please take this.', isCorrect: false, feedback: '⚠️ Understandable but less natural.' },
      ]},
    ],
  },
  {
    id: 'train-ticket',
    title: 'Buying a Train Ticket',
    japaneseTitle: '電車の切符を買う',
    category: 'Transportation',
    icon: '🚆',
    description: 'Navigate a Japanese train station and purchase a ticket.',
    dialogue: [
      { speaker: 'Station Staff (駅員)', avatar: '🚉', japanese: 'どちらまで行かれますか？', furigana: 'どちらまでいかれますか？', romaji: 'Dochira made ikaremasu ka?', english: 'Where are you going?' },
      { speaker: 'You (あなた)', avatar: '🙋', japanese: '新宿まで一枚お願いします。', furigana: 'しんじゅくまでいちまいおねがいします。', romaji: 'Shinjuku made ichimai onegaishimasu.', english: 'One ticket to Shinjuku, please.', options: [
        { text: '新宿まで一枚お願いします。', romaji: 'Shinjuku made ichimai onegaishimasu.', english: 'One ticket to Shinjuku, please.', isCorrect: true, feedback: '✅ Perfect! Clear and polite.' },
        { text: '新宿に行きたいです。', romaji: 'Shinjuku ni ikitai desu.', english: 'I want to go to Shinjuku.', isCorrect: false, feedback: '⚠️ Expresses desire but doesn\'t ask to buy a ticket.' },
        { text: '新宿の切符ください。', romaji: 'Shinjuku no kippu kudasai.', english: 'Shinjuku ticket please.', isCorrect: false, feedback: '⚠️ Understandable but skips 一枚 (quantity).' },
      ]},
      { speaker: 'Station Staff (駅員)', avatar: '🚉', japanese: '500円でございます。', furigana: '500えんでございます。', romaji: 'Gohyaku-en de gozaimasu.', english: 'That is 500 yen.' },
    ],
  },
  {
    id: 'doctor-visit',
    title: 'At the Doctor\'s Office',
    japaneseTitle: '病院で',
    category: 'Health & Emergency',
    icon: '🏥',
    description: 'Describe symptoms and communicate with a doctor in Japanese.',
    dialogue: [
      { speaker: 'Doctor (医者)', avatar: '👨‍⚕️', japanese: 'どうされましたか？', furigana: 'どうされましたか？', romaji: 'Dou saremashita ka?', english: 'What seems to be the problem?' },
      { speaker: 'You (あなた)', avatar: '🙋', japanese: '頭が痛いです。', furigana: 'あたまがいたいです。', romaji: 'Atama ga itai desu.', english: 'I have a headache.', options: [
        { text: '頭が痛いです。', romaji: 'Atama ga itai desu.', english: 'I have a headache.', isCorrect: true, feedback: '✅ Clear and natural.' },
        { text: '頭は悪いです。', romaji: 'Atama wa warui desu.', english: 'My head is bad.', isCorrect: false, feedback: '❌ Means your head is "bad/stupid," not painful.' },
        { text: '頭が大変です。', romaji: 'Atama ga taihen desu.', english: 'My head is tough/hard.', isCorrect: false, feedback: '❌ Doesn\'t convey pain correctly.' },
      ]},
      { speaker: 'Doctor (医者)', avatar: '👨‍⚕️', japanese: 'いつからですか？', furigana: 'いつからですか？', romaji: 'Itsu kara desu ka?', english: 'Since when?' },
      { speaker: 'You (あなた)', avatar: '🙋', japanese: '昨日からです。', furigana: 'きのうからです。', romaji: 'Kinou kara desu.', english: 'Since yesterday.', options: [
        { text: '昨日からです。', romaji: 'Kinou kara desu.', english: 'Since yesterday.', isCorrect: true, feedback: '✅ Perfect response.' },
        { text: '昨日がありました。', romaji: 'Kinou ga arimashita.', english: 'There was yesterday.', isCorrect: false, feedback: '❌ Grammatically incorrect in this context.' },
        { text: '昨日から始まりました。', romaji: 'Kinou kara hajimarimashita.', english: 'It started from yesterday.', isCorrect: false, feedback: '⚠️ Correct but overly verbose.' },
      ]},
    ],
  },
  {
    id: 'restaurant-order',
    title: 'Ordering at a Restaurant',
    japaneseTitle: 'レストランで注文',
    category: 'Food & Dining',
    icon: '🍜',
    description: 'Order a meal and communicate dietary preferences at a Japanese restaurant.',
    dialogue: [
      { speaker: 'Waiter (ウェイター)', avatar: '🍽️', japanese: 'ご注文はお決まりですか？', furigana: 'ごちゅうもんはおきまりですか？', romaji: 'Go-chuumon wa okimari desu ka?', english: 'Have you decided your order?' },
      { speaker: 'You (あなた)', avatar: '🙋', japanese: 'ラーメンをひとつお願いします。', furigana: 'ラーメンをひとつおねがいします。', romaji: 'Raamen o hitotsu onegaishimasu.', english: 'One ramen, please.', options: [
        { text: 'ラーメンをひとつお願いします。', romaji: 'Raamen o hitotsu onegaishimasu.', english: 'One ramen, please.', isCorrect: true, feedback: '✅ Natural and polite ordering phrase.' },
        { text: 'ラーメンがほしいです。', romaji: 'Raamen ga hoshii desu.', english: 'I want ramen.', isCorrect: false, feedback: '⚠️ Acceptable but sounds childlike in a restaurant.' },
        { text: 'ラーメンを食べたい。', romaji: 'Raamen o tabetai.', english: 'I want to eat ramen.', isCorrect: false, feedback: '⚠️ Casual — too informal for a restaurant setting.' },
      ]},
    ],
  },
  {
    id: 'hotel-checkin',
    title: 'Hotel Check-In',
    japaneseTitle: 'ホテルのチェックイン',
    category: 'Travel & Accommodation',
    icon: '🏨',
    description: 'Check in to a Japanese hotel and ask about amenities.',
    dialogue: [
      { speaker: 'Receptionist (フロント)', avatar: '🛎️', japanese: 'いらっしゃいませ。チェックインでございますか？', furigana: 'いらっしゃいませ。チェックインでございますか？', romaji: 'Irasshaimase. Chekkuin de gozaimasu ka?', english: 'Welcome. Are you checking in?' },
      { speaker: 'You (あなた)', avatar: '🙋', japanese: 'はい、予約しております。山田です。', furigana: 'はい、よやくしております。やまだです。', romaji: 'Hai, yoyaku shite orimasu. Yamada desu.', english: 'Yes, I have a reservation. My name is Yamada.', options: [
        { text: 'はい、予約しております。山田です。', romaji: 'Hai, yoyaku shite orimasu. Yamada desu.', english: 'Yes, I have a reservation. My name is Yamada.', isCorrect: true, feedback: '✅ Formal and clear. Perfect for hotel check-in.' },
        { text: 'はい、予約しました。山田です。', romaji: 'Hai, yoyaku shimashita. Yamada desu.', english: 'Yes, I made a reservation. My name is Yamada.', isCorrect: false, feedback: '⚠️ Grammatically correct but less formal than しております.' },
        { text: 'はい。山田です。', romaji: 'Hai. Yamada desu.', english: 'Yes. I am Yamada.', isCorrect: false, feedback: '⚠️ Too brief — doesn\'t mention the reservation.' },
      ]},
    ],
  },
];

// Inline PronunciationPhrase data (from web/src/components/PronunciationCoach.tsx)
const pronunciationPhrases = [
  { id: 'p1', japanese: '橋 (はし)', romaji: 'hashi', english: 'Bridge', category: 'Minimal Pairs', pitchPatternName: 'Heiban (Flat)', pitchType: 'heiban', moras: ['は', 'し'], moraPitches: ['L', 'H'], pitchDropIndex: null, phoneticNotes: 'No pitch drop. The second mora rises and stays high.' },
  { id: 'p2', japanese: '箸 (はし)', romaji: 'hashi', english: 'Chopsticks', category: 'Minimal Pairs', pitchPatternName: 'Atamadaka (Head-high)', pitchType: 'atamadaka', moras: ['は', 'し'], moraPitches: ['H', 'L'], pitchDropIndex: 1, phoneticNotes: 'First mora is high, drops from the second.' },
  { id: 'p3', japanese: '雨 (あめ)', romaji: 'ame', english: 'Rain', category: 'Nature', pitchPatternName: 'Atamadaka (Head-high)', pitchType: 'atamadaka', moras: ['あ', 'め'], moraPitches: ['H', 'L'], pitchDropIndex: 1, phoneticNotes: 'High on first mora, drops immediately.' },
  { id: 'p4', japanese: '飴 (あめ)', romaji: 'ame', english: 'Candy', category: 'Minimal Pairs', pitchPatternName: 'Heiban (Flat)', pitchType: 'heiban', moras: ['あ', 'め'], moraPitches: ['L', 'H'], pitchDropIndex: null, phoneticNotes: 'Starts low, rises and stays flat.' },
  { id: 'p5', japanese: '花 (はな)', romaji: 'hana', english: 'Flower', category: 'Nature', pitchPatternName: 'Heiban (Flat)', pitchType: 'heiban', moras: ['は', 'な'], moraPitches: ['L', 'H'], pitchDropIndex: null, phoneticNotes: 'Low start, rises on second mora, stays flat.' },
  { id: 'p6', japanese: '鼻 (はな)', romaji: 'hana', english: 'Nose', category: 'Minimal Pairs', pitchPatternName: 'Atamadaka (Head-high)', pitchType: 'atamadaka', moras: ['は', 'な'], moraPitches: ['H', 'L'], pitchDropIndex: 1, phoneticNotes: 'High start, drops from the second mora.' },
  { id: 'p7', japanese: '学校 (がっこう)', romaji: 'gakkou', english: 'School', category: 'Common Words', pitchPatternName: 'Heiban (Flat)', pitchType: 'heiban', moras: ['が', 'っ', 'こ', 'う'], moraPitches: ['L', 'H', 'H', 'H'], pitchDropIndex: null, phoneticNotes: 'Rises from second mora and stays flat — very common pattern for compound nouns.' },
  { id: 'p8', japanese: '電話 (でんわ)', romaji: 'denwa', english: 'Telephone', category: 'Technology', pitchPatternName: 'Heiban (Flat)', pitchType: 'heiban', moras: ['で', 'ん', 'わ'], moraPitches: ['L', 'H', 'H'], pitchDropIndex: null, phoneticNotes: 'A flat pattern — low start, rises on second mora.' },
  { id: 'p9', japanese: '桜 (さくら)', romaji: 'sakura', english: 'Cherry Blossom', category: 'Nature', pitchPatternName: 'Nakadaka (Middle-high)', pitchType: 'nakadaka', moras: ['さ', 'く', 'ら'], moraPitches: ['L', 'H', 'L'], pitchDropIndex: 2, phoneticNotes: 'Low-High-Low — the classic nakadaka (middle-high) pattern.' },
  { id: 'p10', japanese: 'ありがとう', romaji: 'arigatou', english: 'Thank you', category: 'Common Words', pitchPatternName: 'Heiban (Flat)', pitchType: 'heiban', moras: ['あ', 'り', 'が', 'と', 'う'], moraPitches: ['L', 'H', 'H', 'H', 'H'], pitchDropIndex: null, phoneticNotes: 'Low start, rises on second mora, stays high. Very common pattern.' },
  { id: 'p11', japanese: 'すみません', romaji: 'sumimasen', english: 'Excuse me / Sorry', category: 'Politeness', pitchPatternName: 'Heiban (Flat)', pitchType: 'heiban', moras: ['す', 'み', 'ま', 'せ', 'ん'], moraPitches: ['L', 'H', 'H', 'H', 'H'], pitchDropIndex: null, phoneticNotes: 'Another flat (heiban) pattern. Master this — you\'ll use it constantly.' },
  { id: 'p12', japanese: 'いただきます', romaji: 'itadakimasu', english: 'I humbly receive (said before eating)', category: 'Cultural Phrases', pitchPatternName: 'Odaka (Tail-drop)', pitchType: 'odaka', moras: ['い', 'た', 'だ', 'き', 'ま', 'す'], moraPitches: ['L', 'H', 'H', 'H', 'H', 'L'], pitchDropIndex: 5, phoneticNotes: 'Low start, rises on second mora, stays flat, drops at the final mora.' },
];

// Inline RadicalPuzzle data (from web/src/components/KanjiRadicalView.tsx)
const radicalPuzzles = [
  {
    id: 'rp1', targetKanji: '明', meaning: 'Bright / Clear', onyomi: 'メイ (mei), ミョウ (myou)', kunyomi: 'あか-るい (akarui), あき-らか (akiraka)',
    radicals: [{ char: '日', meaning: 'Sun' }, { char: '月', meaning: 'Moon' }],
    candidateRadicals: [{ char: '日', meaning: 'Sun' }, { char: '月', meaning: 'Moon' }, { char: '目', meaning: 'Eye' }, { char: '木', meaning: 'Tree' }],
    explanation: 'Sun (日) + Moon (月) = Bright (明). When both the sun and moon shine together, it is bright!'
  },
  {
    id: 'rp2', targetKanji: '森', meaning: 'Forest', onyomi: 'シン (shin)', kunyomi: 'もり (mori)',
    radicals: [{ char: '木', meaning: 'Tree' }, { char: '木', meaning: 'Tree' }, { char: '木', meaning: 'Tree' }],
    candidateRadicals: [{ char: '木', meaning: 'Tree' }, { char: '林', meaning: 'Grove' }, { char: '山', meaning: 'Mountain' }, { char: '土', meaning: 'Earth' }],
    explanation: 'Three trees (木 + 木 + 木) = Forest (森). More trees together make a forest!'
  },
  {
    id: 'rp3', targetKanji: '休', meaning: 'Rest / Vacation', onyomi: 'キュウ (kyuu)', kunyomi: 'やす-む (yasumu)',
    radicals: [{ char: '人', meaning: 'Person' }, { char: '木', meaning: 'Tree' }],
    candidateRadicals: [{ char: '人', meaning: 'Person' }, { char: '木', meaning: 'Tree' }, { char: '土', meaning: 'Earth' }, { char: '日', meaning: 'Sun' }],
    explanation: 'A person (人) leaning against a tree (木) = Rest (休). Imagine taking a break under a tree!'
  },
  {
    id: 'rp4', targetKanji: '男', meaning: 'Man / Male', onyomi: 'ダン (dan)', kunyomi: 'おとこ (otoko)',
    radicals: [{ char: '田', meaning: 'Rice Field' }, { char: '力', meaning: 'Power/Strength' }],
    candidateRadicals: [{ char: '田', meaning: 'Rice Field' }, { char: '力', meaning: 'Power/Strength' }, { char: '女', meaning: 'Woman' }, { char: '人', meaning: 'Person' }],
    explanation: 'Rice Field (田) + Power (力) = Man (男). A man is one who works in the field with strength!'
  },
  {
    id: 'rp5', targetKanji: '語', meaning: 'Language / Word', onyomi: 'ゴ (go)', kunyomi: 'かた-る (kataru)',
    radicals: [{ char: '言', meaning: 'Speech/Say' }, { char: '吾', meaning: 'I/My' }],
    candidateRadicals: [{ char: '言', meaning: 'Speech' }, { char: '吾', meaning: 'I/My' }, { char: '口', meaning: 'Mouth' }, { char: '五', meaning: 'Five' }],
    explanation: 'Speech (言) + I (吾) = Language (語). Language is "my words" — how I express myself.'
  },
  {
    id: 'rp6', targetKanji: '岩', meaning: 'Rock / Boulder', onyomi: 'ガン (gan)', kunyomi: 'いわ (iwa)',
    radicals: [{ char: '山', meaning: 'Mountain' }, { char: '石', meaning: 'Stone' }],
    candidateRadicals: [{ char: '山', meaning: 'Mountain' }, { char: '石', meaning: 'Stone' }, { char: '土', meaning: 'Earth' }, { char: '木', meaning: 'Tree' }],
    explanation: 'Mountain (山) + Stone (石) = Rock/Boulder (岩). Big stones found on mountains!'
  },
  {
    id: 'rp7', targetKanji: '花', meaning: 'Flower', onyomi: 'カ (ka)', kunyomi: 'はな (hana)',
    radicals: [{ char: '艹', meaning: 'Grass/Plant' }, { char: '化', meaning: 'Change/Transform' }],
    candidateRadicals: [{ char: '艹', meaning: 'Grass' }, { char: '化', meaning: 'Change' }, { char: '木', meaning: 'Tree' }, { char: '土', meaning: 'Earth' }],
    explanation: 'Plant (艹) + Change (化) = Flower (花). A plant that transforms beautifully into a flower!'
  },
  {
    id: 'rp8', targetKanji: '間', meaning: 'Between / Space / Time', onyomi: 'カン (kan), ケン (ken)', kunyomi: 'あいだ (aida), ま (ma)',
    radicals: [{ char: '門', meaning: 'Gate' }, { char: '日', meaning: 'Sun' }],
    candidateRadicals: [{ char: '門', meaning: 'Gate' }, { char: '日', meaning: 'Sun' }, { char: '月', meaning: 'Moon' }, { char: '木', meaning: 'Tree' }],
    explanation: 'Gate (門) + Sun (日) = Between/Space (間). Sunlight shining through the gaps of a gate!'
  },
];

const prisma = new PrismaClient({ log: ['error'] });

async function main() {
  console.log('🌱 Starting Zengo seed...\n');

  // ── STEP 1: Lessons ────────────────────────────────────────────────────────
  console.log('📚 Step 1: Seeding Lessons...');
  let lessonCount = 0;
  for (const l of lessons) {
    await prisma.lesson.upsert({
      where: { id: l.id },
      create: {
        id: l.id,
        title: l.title,
        jpTitle: l.japaneseTitle,
        description: l.description,
        syllabus: l.syllabus,
        kanji: l.kanji,
        vocabulary: l.vocabulary,
      },
      update: {
        title: l.title,
        jpTitle: l.japaneseTitle,
        description: l.description,
        syllabus: l.syllabus,
        kanji: l.kanji,
        vocabulary: l.vocabulary,
      },
    });
    lessonCount++;
  }
  console.log(`  ✅ ${lessonCount} lessons upserted.\n`);

  // ── STEP 2: Kana + KanaStrokes ─────────────────────────────────────────────
  console.log('🔤 Step 2: Seeding Kana + KanaStrokes...');
  let kanaCount = 0;
  let kanaStrokeCount = 0;
  for (const k of kanaData) {
    await prisma.kana.upsert({
      where: { id: k.id },
      create: {
        id: k.id,
        char: k.char,
        romaji: k.romaji,
        type: k.type,
        vocab: k.vocab,
        translation: k.translation,
        notes: k.notes ?? null,
        example: k.example ?? null,
      },
      update: {
        char: k.char,
        romaji: k.romaji,
        type: k.type,
        vocab: k.vocab,
        translation: k.translation,
        notes: k.notes ?? null,
        example: k.example ?? null,
      },
    });
    kanaCount++;

    // Seed strokes for this kana character
    const strokes: string[] | undefined = kanaStrokes[k.char];
    if (strokes && strokes.length > 0) {
      for (let pathIndex = 0; pathIndex < strokes.length; pathIndex++) {
        await prisma.kanaStroke.upsert({
          where: { kanaId_pathIndex: { kanaId: k.id, pathIndex } },
          create: { kanaId: k.id, pathIndex, d: strokes[pathIndex] },
          update: { d: strokes[pathIndex] },
        });
        kanaStrokeCount++;
      }
    }
  }
  console.log(`  ✅ ${kanaCount} kana upserted, ${kanaStrokeCount} strokes upserted.\n`);

  // ── STEP 3: Vocabulary ─────────────────────────────────────────────────────
  console.log('📖 Step 3: Seeding Vocabulary...');
  // Delete all and re-insert to handle intentional duplicates cleanly.
  await prisma.vocabulary.deleteMany({});
  const vocabRecords = dictionary.map((v: any) => ({
    word: v.word,
    reading: v.reading,
    romaji: v.romaji,
    english: v.english,
    tag: v.tag,
    type: v.type ?? null,
    lesson: v.lesson,
    example: v.example ?? {},
  }));
  await prisma.vocabulary.createMany({ data: vocabRecords });
  console.log(`  ✅ ${vocabRecords.length} vocabulary entries seeded.\n`);

  // ── STEP 4: Kanji + KanjiStrokes ──────────────────────────────────────────
  console.log('漢 Step 4: Seeding Kanji + KanjiStrokes...');
  let kanjiCount = 0;
  let kanjiStrokeCount = 0;
  for (const k of kanjiData) {
    await prisma.kanji.upsert({
      where: { char: k.char },
      create: {
        char: k.char,
        level: k.level,
        meaning: k.meaning,
        onyomi: k.onyomi,
        kunyomi: k.kunyomi,
      },
      update: {
        level: k.level,
        meaning: k.meaning,
        onyomi: k.onyomi,
        kunyomi: k.kunyomi,
      },
    });
    kanjiCount++;

    for (let pathIndex = 0; pathIndex < k.strokes.length; pathIndex++) {
      await prisma.kanjiStroke.upsert({
        where: { kanjiChar_pathIndex: { kanjiChar: k.char, pathIndex } },
        create: { kanjiChar: k.char, pathIndex, d: k.strokes[pathIndex] },
        update: { d: k.strokes[pathIndex] },
      });
      kanjiStrokeCount++;
    }
  }
  console.log(`  ✅ ${kanjiCount} kanji upserted, ${kanjiStrokeCount} strokes upserted.\n`);

  // ── STEP 5: KaiwaScenarios ─────────────────────────────────────────────────
  console.log('💬 Step 5: Seeding KaiwaScenarios...');
  let kaiwaCount = 0;
  for (const s of kaiwaScenarios) {
    await prisma.kaiwaScenario.upsert({
      where: { id: s.id },
      create: {
        id: s.id,
        title: s.title,
        jpTitle: s.japaneseTitle,
        category: s.category,
        icon: s.icon,
        description: s.description,
        dialogue: s.dialogue as any,
      },
      update: {
        title: s.title,
        jpTitle: s.japaneseTitle,
        category: s.category,
        icon: s.icon,
        description: s.description,
        dialogue: s.dialogue as any,
      },
    });
    kaiwaCount++;
  }
  console.log(`  ✅ ${kaiwaCount} kaiwa scenarios upserted.\n`);

  // ── STEP 6: PronunciationPhrases ──────────────────────────────────────────
  console.log('🎤 Step 6: Seeding PronunciationPhrases...');
  let phraseCount = 0;
  for (const p of pronunciationPhrases) {
    await prisma.pronunciationPhrase.upsert({
      where: { id: p.id },
      create: {
        id: p.id,
        japanese: p.japanese,
        romaji: p.romaji,
        english: p.english,
        category: p.category,
        pitchName: p.pitchPatternName,
        pitchType: p.pitchType,
        moras: p.moras,
        moraPitches: p.moraPitches,
        pitchDropIndex: p.pitchDropIndex,
        notes: p.phoneticNotes,
      },
      update: {
        japanese: p.japanese,
        romaji: p.romaji,
        english: p.english,
        category: p.category,
        pitchName: p.pitchPatternName,
        pitchType: p.pitchType,
        moras: p.moras,
        moraPitches: p.moraPitches,
        pitchDropIndex: p.pitchDropIndex,
        notes: p.phoneticNotes,
      },
    });
    phraseCount++;
  }
  console.log(`  ✅ ${phraseCount} pronunciation phrases upserted.\n`);

  // ── STEP 7: RadicalPuzzles ─────────────────────────────────────────────────
  console.log('🧩 Step 7: Seeding RadicalPuzzles...');
  let puzzleCount = 0;
  for (const p of radicalPuzzles) {
    await prisma.radicalPuzzle.upsert({
      where: { id: p.id },
      create: {
        id: p.id,
        targetKanji: p.targetKanji,
        meaning: p.meaning,
        onyomi: p.onyomi,
        kunyomi: p.kunyomi,
        radicals: p.radicals as any,
        candidates: p.candidateRadicals as any,
        explanation: p.explanation,
      },
      update: {
        targetKanji: p.targetKanji,
        meaning: p.meaning,
        onyomi: p.onyomi,
        kunyomi: p.kunyomi,
        radicals: p.radicals as any,
        candidates: p.candidateRadicals as any,
        explanation: p.explanation,
      },
    });
    puzzleCount++;
  }
  console.log(`  ✅ ${puzzleCount} radical puzzles upserted.\n`);

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log('📊 Seed Summary:');
  console.table({
    lessons: { count: lessonCount },
    kana: { count: kanaCount },
    kanaStrokes: { count: kanaStrokeCount },
    vocabulary: { count: vocabRecords.length },
    kanji: { count: kanjiCount },
    kanjiStrokes: { count: kanjiStrokeCount },
    kaiwaScenarios: { count: kaiwaCount },
    pronunciationPhrases: { count: phraseCount },
    radicalPuzzles: { count: puzzleCount },
  });

  console.log('\n✨ Seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
