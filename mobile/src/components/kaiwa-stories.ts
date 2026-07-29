export interface StoryOption {
  text: string;
  romaji: string;
  english: string;
  isCorrect: boolean;
  feedback: string;
}

export interface StoryLine {
  id: string;
  speaker: 'npc' | 'user';
  npcName?: string;
  avatar: string;
  japanese: string;
  romaji: string;
  english: string;
  options?: StoryOption[];
}

export interface DuolingoStory {
  id: string;
  title: string;
  japaneseTitle: string;
  category: string;
  icon: string;
  npcName: string;
  npcAvatar: string;
  npcRole: string;
  lines: StoryLine[];
}

export const STORIES: DuolingoStory[] = [
  {
    id: 'cafe',
    title: 'Ordering at a Shibuya Cafe',
    japaneseTitle: '渋谷の喫茶店で',
    category: 'Food & Dining',
    icon: '☕',
    npcName: 'Kenji',
    npcAvatar: '☕',
    npcRole: 'Barista',
    lines: [
      {
        id: 'l1',
        speaker: 'npc',
        npcName: 'Kenji',
        avatar: '☕',
        japanese: 'いらっしゃいませ！ご注文はお決まりですか？',
        romaji: 'Irasshaimase! Go-chuumon wa o-kimari desu ka?',
        english: 'Welcome! Are you ready to order?',
      },
      {
        id: 'l2',
        speaker: 'user',
        avatar: '👤',
        japanese: 'Choose your response:',
        romaji: '',
        english: '',
        options: [
          {
            text: 'アイスコーヒーをひとつお願いします。',
            romaji: 'Aisu koohii o hitotsu onegaishimasu.',
            english: 'One iced coffee, please.',
            isCorrect: true,
            feedback: "🌟 Perfect! 'Hitotsu onegaishimasu' is standard for ordering.",
          },
          {
            text: '水はいりません。',
            romaji: 'Mizu wa irimasen.',
            english: "I don't need water.",
            isCorrect: false,
            feedback: "💡 Place your item order first using 'onegaishimasu'.",
          },
        ],
      },
      {
        id: 'l3',
        speaker: 'npc',
        npcName: 'Kenji',
        avatar: '☕',
        japanese: 'かしこまりました。500円になります！',
        romaji: 'Kashikomari shita. Gohaku-en ni narimasu!',
        english: 'Certainly. That will be 500 yen!',
      },
    ],
  },
  {
    id: 'ramen',
    title: 'Ordering Ramen at Shinjuku',
    japaneseTitle: '新宿のラーメン屋',
    category: 'Food & Dining',
    icon: '🍜',
    npcName: 'Chef Hiro',
    npcAvatar: '🍜',
    npcRole: 'Master Chef',
    lines: [
      {
        id: 'r1',
        speaker: 'npc',
        npcName: 'Chef Hiro',
        avatar: '🍜',
        japanese: 'いらっしゃい！麺のかたさはどうする？',
        romaji: 'Irasshai! Men no katasa wa dou suru?',
        english: 'Welcome! How would you like your noodle firmness?',
      },
      {
        id: 'r2',
        speaker: 'user',
        avatar: '👤',
        japanese: 'Choose your response:',
        romaji: '',
        english: '',
        options: [
          {
            text: 'かためでおねがいします！',
            romaji: 'Katame de onegaishimasu!',
            english: 'Firm noodles, please!',
            isCorrect: true,
            feedback: '🔥 Chef approved! Firm noodles are very popular in Tokyo.',
          },
          {
            text: 'ラーメンはいりません。',
            romaji: 'Raamen wa irimasen.',
            english: "I don't want ramen.",
            isCorrect: false,
            feedback: '💡 Specify firmness preference like "Katame".',
          },
        ],
      },
      {
        id: 'r3',
        speaker: 'npc',
        npcName: 'Chef Hiro',
        avatar: '🍜',
        japanese: 'あいよ！特製とんこつ、へいお待ち！',
        romaji: 'Aiyo! Tokusei tonkotsu, hei omachi!',
        english: 'Right on! Special Tonkotsu, coming right up!',
      },
    ],
  },
];
