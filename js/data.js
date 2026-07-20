// Zengo Japanese Language Learning Suite - Core Datasets

// 1. Lessons Curriculum (Mapped to Minna no Nihongo & Basic Kanji Book)
export const lessons = [
  {
    id: 1,
    title: "Introductions & Numbers",
    description: "Learn basic self-introductions, greetings, and Kanji numbers 1 to 3.",
    japaneseTitle: "自己紹介と数字",
    syllabus: [
      "Grammar: N1 wa N2 desu (Identity/Copula)",
      "Grammar: Watashi wa ... desu (I am...)",
      "Vocabulary: Watashi (I), Gakusei (Student), Sensei (Teacher)",
      "Kanji: 一 (1), 二 (2), 三 (3)"
    ],
    kanji: ["一", "二", "三"],
    vocabulary: ["わたし", "がくせい", "せんせい"]
  },
  {
    id: 2,
    title: "Objects & Space",
    description: "Learn to identify objects around you using demonstratives and Kanji for 4, 5, 6, Sun, and Moon.",
    japaneseTitle: "これ・それ・あれ",
    syllabus: [
      "Grammar: Kore/Sore/Are wa N desu (This/That/That over there)",
      "Grammar: Kono/Sono/Ano N (This/That/That Noun)",
      "Vocabulary: Hon (Book), Enpitsu (Pencil), Tokei (Clock)",
      "Kanji: 四 (4), 五 (5), 六 (6), 日 (Sun/Day), 月 (Moon/Month)"
    ],
    kanji: ["四", "五", "六", "日", "月"],
    vocabulary: ["ほん", "えんぴつ", "とけい"]
  },
  {
    id: 3,
    title: "Places & Directions",
    description: "Learn how to ask for and describe locations, featuring Kanji for mountain, river, field, inside, and outside.",
    japaneseTitle: "ここ・そこ・あそこ",
    syllabus: [
      "Grammar: Place wa Koko/Soko/Asoko desu (Location marking)",
      "Grammar: Kochira/Sochira/Achira (Polite direction)",
      "Vocabulary: Kyoushitsu (Classroom), Shokudou (Cafeteria), Toilet (Restroom)",
      "Kanji: 山 (Mountain), 川 (River), 田 (Rice Field), 中 (Inside), 外 (Outside)"
    ],
    kanji: ["山", "川", "田", "中", "外"],
    vocabulary: ["きょうしつ", "しょくどう", "トイレ"]
  },
  {
    id: 4,
    title: "Time & Calendar",
    description: "Learn to tell time, talk about days of the week, and cover calendar Kanji.",
    japaneseTitle: "時間と曜日",
    syllabus: [
      "Grammar: Telling time (-ji, -fun) and days (-yobi)",
      "Grammar: Verb polite structures (-masu, -masen, -mashita)",
      "Vocabulary: Ima (Now), Asa (Morning), Ban (Evening)",
      "Kanji: 火 (Fire), 水 (Water), 木 (Wood/Tree), 金 (Gold/Metal), 土 (Earth/Soil)"
    ],
    kanji: ["火", "水", "木", "金", "土"],
    vocabulary: ["いま", "あさ", "ばん"]
  },
  {
    id: 5,
    title: "Movement & Vehicles",
    description: "Learn verbs of motion, travel, and Kanji for transport and gates.",
    japaneseTitle: "行く・来る・帰る",
    syllabus: [
      "Grammar: Place e ikimasu/kimasu/kaerimasu (Destination particle 'e')",
      "Grammar: Vehicle de ikimasu (Means/Instrument particle 'de')",
      "Vocabulary: Densha (Train), Kuruma (Car), Gakkou (School)",
      "Kanji: 行 (Go), 来 (Come), 帰 (Return), 車 (Car), 門 (Gate)"
    ],
    kanji: ["行", "来", "帰", "車", "門"],
    vocabulary: ["でんしゃ", "くるま", "がっこう"]
  },
  {
    id: 6,
    title: "Daily Actions & Food",
    description: "Learn transitive verbs, eating, drinking, and the object particle 'o'.",
    japaneseTitle: "食事と日常生活",
    syllabus: [
      "Grammar: Noun o V-masu (Object marker 'o')",
      "Grammar: Place de Verb (Location of action)",
      "Vocabulary: Gohan (Meal/Rice), Mizu (Water), Ringo (Apple)",
      "Kanji: 食 (Eat), 飲 (Drink), 見 (See/Watch), 読 (Read), 書 (Write)"
    ],
    kanji: ["食", "飲", "見", "読", "書"],
    vocabulary: ["ごはん", "みず", "りんご"]
  },
  {
    id: 7,
    title: "Communication & Giving",
    description: "Learn giving and receiving objects, and Kanji for speech, listening, and trading.",
    japaneseTitle: "あげる・もらうと対話",
    syllabus: [
      "Grammar: Noun o agemasu (Give to someone)",
      "Grammar: Noun o moraimasu (Receive from someone)",
      "Vocabulary: Hana (Flower), Purezento (Gift), Tegami (Letter)",
      "Kanji: 話 (Speak), 聞 (Listen/Hear), 買 (Buy), 人 (Person), 口 (Mouth)"
    ],
    kanji: ["話", "聞", "買", "人", "口"],
    vocabulary: ["はな", "プレゼント", "てがみ"]
  },
  {
    id: 8,
    title: "Descriptions & Adjectives",
    description: "Learn to describe nouns using i-adjectives and na-adjectives.",
    japaneseTitle: "形容詞と描写",
    syllabus: [
      "Grammar: Noun wa Adj-i desu (i-Adjective modification)",
      "Grammar: Noun wa Adj-na desu (na-Adjective modification)",
      "Vocabulary: Oishii (Delicious), Kirei (Beautiful/Clean), Samui (Cold)",
      "Kanji: 本 (Book/Origin), 子 (Child), 朝 (Morning), 夜 (Night)"
    ],
    kanji: ["本", "子", "朝", "夜"],
    vocabulary: ["おいしい", "きれい", "さむい"]
  },
  {
    id: 9,
    title: "Likes, Dislikes & Ability",
    description: "Learn to express likes, dislikes, and proficiency.",
    japaneseTitle: "好き・嫌い・上手",
    syllabus: [
      "Grammar: Noun ga suki desu / kirai desu (Like/Dislike)",
      "Grammar: Noun ga jouzu desu / heta desu (Good at/Poor at)",
      "Vocabulary: Nihongo (Japanese), Ongaku (Music), Sakana (Fish)",
      "Kanji: 会 (Meet), 社 (Company), 夕 (Evening), 方 (Direction/Person)"
    ],
    kanji: ["会", "社", "夕", "方"],
    vocabulary: ["にほんご", "おんがく", "さかな"]
  },
  {
    id: 10,
    title: "Existence & Review",
    description: "Learn where things are using existence verbs, and master high numbers.",
    japaneseTitle: "存在と総復習",
    syllabus: [
      "Grammar: Place ni Noun ga arimasu/imasu (Existence of inanimate/animate objects)",
      "Grammar: Noun wa Place ni arimasu/imasu",
      "Vocabulary: Tsukue (Desk), Neko (Cat), Inu (Dog)",
      "Kanji: 百 (100), 千 (1000), 万 (10000), 円 (Yen), 年 (Year)"
    ],
    kanji: ["百", "千", "万", "円", "年"],
    vocabulary: ["つくえ", "ねこ", "いぬ"]
  }
];

// 2. Kana Dataset (Full Hiragana and Katakana lists with examples)
export const kanaData = [
  // Hiragana
  { id: "h-a", char: "あ", romaji: "a", type: "hiragana", vocab: "朝 (あさ)", translation: "Morning", notes: "Sounds like 'a' in father." },
  { id: "h-i", char: "い", romaji: "i", type: "hiragana", vocab: "犬 (いぬ)", translation: "Dog", notes: "Sounds like 'ee' in meet." },
  { id: "h-u", char: "う", romaji: "u", type: "hiragana", vocab: "海 (うみ)", translation: "Sea/Ocean", notes: "Sounds like 'oo' in cool." },
  { id: "h-e", char: "え", romaji: "e", type: "hiragana", vocab: "駅 (えき)", translation: "Station", notes: "Sounds like 'e' in met." },
  { id: "h-o", char: "お", romaji: "o", type: "hiragana", vocab: "お茶 (おちゃ)", translation: "Green Tea", notes: "Sounds like 'o' in open." },
  { id: "h-ka", char: "か", romaji: "ka", type: "hiragana", vocab: "傘 (かさ)", translation: "Umbrella" },
  { id: "h-ki", char: "き", romaji: "ki", type: "hiragana", vocab: "切手 (きって)", translation: "Postage stamp" },
  { id: "h-ku", char: "く", romaji: "ku", type: "hiragana", vocab: "車 (くるま)", translation: "Car" },
  { id: "h-ke", char: "け", romaji: "ke", type: "hiragana", vocab: "警察 (けいさつ)", translation: "Police" },
  { id: "h-ko", char: "こ", romaji: "ko", type: "hiragana", vocab: "子供 (こども)", translation: "Child" },
  { id: "h-sa", char: "さ", romaji: "sa", type: "hiragana", vocab: "魚 (さかな)", translation: "Fish" },
  { id: "h-shi", char: "し", romaji: "shi", type: "hiragana", vocab: "新聞 (しんぶん)", translation: "Newspaper" },
  { id: "h-su", char: "す", romaji: "su", type: "hiragana", vocab: "寿司 (すし)", translation: "Sushi" },
  { id: "h-se", char: "せ", romaji: "se", type: "hiragana", vocab: "先生 (せんせい)", translation: "Teacher" },
  { id: "h-so", char: "そ", romaji: "so", type: "hiragana", vocab: "空 (そら)", translation: "Sky" },
  { id: "h-ta", char: "た", romaji: "ta", type: "hiragana", vocab: "卵 (たまご)", translation: "Egg" },
  { id: "h-chi", char: "ち", romaji: "chi", type: "hiragana", vocab: "地図 (ちず)", translation: "Map" },
  { id: "h-tsu", char: "つ", romaji: "tsu", type: "hiragana", vocab: "机 (つくえ)", translation: "Desk" },
  { id: "h-te", char: "て", romaji: "te", type: "hiragana", vocab: "手紙 (てがみ)", translation: "Letter" },
  { id: "h-to", char: "と", romaji: "to", type: "hiragana", vocab: "友達 (ともだち)", translation: "Friend" },
  { id: "h-na", char: "な", romaji: "na", type: "hiragana", vocab: "夏 (なつ)", translation: "Summer" },
  { id: "h-ni", char: "に", romaji: "ni", type: "hiragana", vocab: "肉 (にく)", translation: "Meat" },
  { id: "h-nu", char: "ぬ", romaji: "nu", type: "hiragana", vocab: "ぬいぐるみ", translation: "Stuffed toy" },
  { id: "h-ne", char: "ね", romaji: "ne", type: "hiragana", vocab: "猫 (ねこ)", translation: "Cat" },
  { id: "h-no", char: "の", romaji: "no", type: "hiragana", vocab: "飲み物 (のみもの)", translation: "Beverage" },
  { id: "h-ha", char: "は", romaji: "ha", type: "hiragana", vocab: "花 (はな)", translation: "Flower" },
  { id: "h-hi", char: "ひ", romaji: "hi", type: "hiragana", vocab: "飛行機 (ひこうき)", translation: "Airplane" },
  { id: "h-fu", char: "ふ", romaji: "fu", type: "hiragana", vocab: "船 (ふね)", translation: "Ship" },
  { id: "h-he", char: "へ", romaji: "he", type: "hiragana", vocab: "部屋 (へや)", translation: "Room" },
  { id: "h-ho", char: "ほ", romaji: "ho", type: "hiragana", vocab: "本 (ほん)", translation: "Book" },
  { id: "h-ma", char: "ま", romaji: "ma", type: "hiragana", vocab: "窓 (まど)", translation: "Window" },
  { id: "h-mi", char: "み", romaji: "mi", type: "hiragana", vocab: "水 (みず)", translation: "Water" },
  { id: "h-mu", char: "む", romaji: "mu", type: "hiragana", vocab: "虫 (むし)", translation: "Insect" },
  { id: "h-me", char: "め", romaji: "me", type: "hiragana", vocab: "眼鏡 (めがね)", translation: "Glasses" },
  { id: "h-mo", char: "も", romaji: "mo", type: "hiragana", vocab: "森 (もり)", translation: "Forest" },
  { id: "h-ya", char: "や", romaji: "ya", type: "hiragana", vocab: "山 (やま)", translation: "Mountain" },
  { id: "h-yu", char: "ゆ", romaji: "yu", type: "hiragana", vocab: "雪 (ゆき)", translation: "Snow" },
  { id: "h-yo", char: "よ", romaji: "yo", type: "hiragana", vocab: "夜 (よる)", translation: "Night" },
  { id: "h-ra", char: "ら", romaji: "ra", type: "hiragana", vocab: "来週 (らいしゅう)", translation: "Next week" },
  { id: "h-ri", char: "り", romaji: "ri", type: "hiragana", vocab: "林檎 (りんご)", translation: "Apple" },
  { id: "h-ru", char: "る", romaji: "ru", type: "hiragana", vocab: "留守 (るす)", translation: "Absence" },
  { id: "h-re", char: "れ", romaji: "re", type: "hiragana", vocab: "冷蔵庫 (れいぞうこ)", translation: "Refrigerator" },
  { id: "h-ro", char: "ろ", romaji: "ro", type: "hiragana", vocab: "蝋燭 (ろうそく)", translation: "Candle" },
  { id: "h-wa", char: "わ", romaji: "wa", type: "hiragana", vocab: "私 (わたし)", translation: "I/Me" },
  { id: "h-wo", char: "を", romaji: "wo", type: "hiragana", vocab: "本を読む (ほんをよむ)", translation: "Read a book" },
  { id: "h-n", char: "ん", romaji: "n", type: "hiragana", vocab: "日本 (にほん)", translation: "Japan" },

  // Katakana
  { id: "k-a", char: "ア", romaji: "a", type: "katakana", vocab: "アメリカ", translation: "America" },
  { id: "k-i", char: "イ", romaji: "i", type: "katakana", vocab: "イギリス", translation: "UK" },
  { id: "k-u", char: "ウ", romaji: "u", type: "katakana", vocab: "ウクライナ", translation: "Ukraine" },
  { id: "k-e", char: "エ", romaji: "e", type: "katakana", vocab: "エアコン", translation: "Air conditioner" },
  { id: "k-o", char: "オ", romaji: "o", type: "katakana", vocab: "オレンジ", translation: "Orange" },
  { id: "k-ka", char: "カ", romaji: "ka", type: "katakana", vocab: "カメラ", translation: "Camera" },
  { id: "k-ki", char: "キ", romaji: "ki", type: "katakana", vocab: "ギター", translation: "Guitar" },
  { id: "k-ku", char: "ク", romaji: "ku", type: "katakana", vocab: "クラス", translation: "Class" },
  { id: "k-ke", char: "ケ", romaji: "ke", type: "katakana", vocab: "ケーキ", translation: "Cake" },
  { id: "k-ko", char: "コ", romaji: "ko", type: "katakana", vocab: "コーヒー", translation: "Coffee" },
  { id: "k-sa", char: "サ", romaji: "sa", type: "katakana", vocab: "サラダ", translation: "Salad" },
  { id: "k-shi", char: "シ", romaji: "shi", type: "katakana", vocab: "シャツ", translation: "Shirt" },
  { id: "k-su", char: "ス", romaji: "su", type: "katakana", vocab: "スポーツ", translation: "Sports" },
  { id: "k-se", char: "セ", romaji: "se", type: "katakana", vocab: "セーター", translation: "Sweater" },
  { id: "k-so", char: "ソ", romaji: "so", type: "katakana", vocab: "ソフト", translation: "Software" },
  { id: "k-ta", char: "タ", romaji: "ta", type: "katakana", vocab: "タクシー", translation: "Taxi" },
  { id: "k-chi", char: "チ", romaji: "chi", type: "katakana", vocab: "チーズ", translation: "Cheese" },
  { id: "k-tsu", char: "ツ", romaji: "tsu", type: "katakana", vocab: "ツアー", translation: "Tour" },
  { id: "k-te", char: "テ", romaji: "te", type: "katakana", vocab: "テレビ", translation: "Television" },
  { id: "k-to", char: "ト", romaji: "to", type: "katakana", vocab: "トイレ", translation: "Toilet" },
  { id: "k-na", char: "ナ", romaji: "na", type: "katakana", vocab: "ナイフ", translation: "Knife" },
  { id: "k-ni", char: "ニ", romaji: "ni", type: "katakana", vocab: "ニュース", translation: "News" },
  { id: "k-nu", char: "ヌ", romaji: "nu", type: "katakana", vocab: "ヌードル", translation: "Noodles" },
  { id: "k-ne", char: "ネ", romaji: "ne", type: "katakana", vocab: "ネクタイ", translation: "Necktie" },
  { id: "k-no", char: "ノ", romaji: "no", type: "katakana", vocab: "ノート", translation: "Notebook" },
  { id: "k-ha", char: "ハ", romaji: "ha", type: "katakana", vocab: "ハム", translation: "Ham" },
  { id: "k-hi", char: "ヒ", romaji: "hi", type: "katakana", vocab: "ヒーター", translation: "Heater" },
  { id: "k-fu", char: "フ", romaji: "fu", type: "katakana", vocab: "フィルム", translation: "Film" },
  { id: "k-he", char: "ヘ", romaji: "he", type: "katakana", vocab: "ベッド", translation: "Bed" },
  { id: "k-ho", char: "ホ", romaji: "ho", type: "katakana", vocab: "ホテル", translation: "Hotel" },
  { id: "k-ma", char: "マ", romaji: "ma", type: "katakana", vocab: "マフラー", translation: "Muffler" },
  { id: "k-mi", char: "ミ", romaji: "mi", type: "katakana", vocab: "ミルク", translation: "Milk" },
  { id: "k-mu", char: "ム", romaji: "mu", type: "katakana", vocab: "ムービー", translation: "Movie" },
  { id: "k-me", char: "メ", romaji: "me", type: "katakana", vocab: "メール", translation: "Email" },
  { id: "k-mo", char: "モ", romaji: "mo", type: "katakana", vocab: "モニター", translation: "Monitor" },
  { id: "k-ya", char: "ヤ", romaji: "ya", type: "katakana", vocab: "ヤード", translation: "Yard" },
  { id: "k-yu", char: "ユ", romaji: "yu", type: "katakana", vocab: "ユーモア", translation: "Humour" },
  { id: "k-yo", char: "ヨ", romaji: "yo", type: "katakana", vocab: "ヨーグルト", translation: "Yoghurt" },
  { id: "k-ra", char: "ラ", romaji: "ra", type: "katakana", vocab: "ラジオ", translation: "Radio" },
  { id: "k-ri", char: "リ", romaji: "ri", type: "katakana", vocab: "リボン", translation: "Ribbon" },
  { id: "k-ru", char: "ル", romaji: "ru", type: "katakana", vocab: "ルール", translation: "Rule" },
  { id: "k-re", char: "レ", romaji: "re", type: "katakana", vocab: "レポート", translation: "Report" },
  { id: "k-ro", char: "ロ", romaji: "ro", type: "katakana", vocab: "ロケット", translation: "Rocket" },
  { id: "k-wa", char: "ワ", romaji: "wa", type: "katakana", vocab: "ワイン", translation: "Wine" },
  { id: "k-wo", char: "ヲ", romaji: "wo", type: "katakana", vocab: "ヲタ", translation: "Otaku shorthand" },
  { id: "k-n", char: "ン", romaji: "n", type: "katakana", vocab: "パン", translation: "Bread" }
];

// Stroke animations paths for Kana (SVG path draws, viewBox 0 0 100 100)
export const kanaStrokes = {
  // ── HIRAGANA ──────────────────────────────────────────────────────
  "あ": [
    "M 25,35 L 75,35",
    "M 50,15 C 50,45 46,72 32,88",
    "M 42,55 C 65,36 88,58 75,76 C 63,92 38,82 45,62 C 48,46 68,48 78,56"
  ],
  "い": [
    "M 28,25 C 28,50 25,70 20,75 C 19,77 17,75 18,72 C 20,66 26,56 32,58",
    "M 72,30 C 72,45 70,55 65,62"
  ],
  "う": [
    "M 35,25 C 48,25 55,20 60,15 C 60,18 55,28 42,32",
    "M 32,45 C 58,45 72,55 68,75 C 64,90 40,90 32,82"
  ],
  "え": [
    "M 38,20 C 48,20 55,18 58,15",
    "M 30,45 L 70,45 L 35,78 C 50,75 70,72 75,85"
  ],
  "お": [
    "M 28,38 L 72,38",
    "M 50,18 L 50,72 C 50,85 45,90 35,85 C 28,80 32,70 40,72 C 55,75 72,68 72,50 C 72,35 55,42 50,48",
    "M 70,25 C 72,28 72,32 72,35"
  ],
  "か": [
    "M 30,25 C 45,25 60,22 70,18",
    "M 50,18 L 50,85",
    "M 28,55 C 45,50 72,52 80,62 C 85,72 75,85 60,80"
  ],
  "き": [
    "M 25,28 L 75,28",
    "M 25,48 L 75,48",
    "M 50,15 L 50,60 C 50,75 55,85 68,82",
    "M 35,68 C 42,58 62,58 72,65 C 80,72 72,88 55,88 C 40,88 30,78 38,68"
  ],
  "く": [
    "M 68,20 C 40,38 30,55 45,75 C 55,88 72,85 80,75"
  ],
  "け": [
    "M 35,15 L 35,85",
    "M 35,42 C 55,38 70,30 75,22",
    "M 62,42 C 68,58 65,75 55,82"
  ],
  "こ": [
    "M 25,32 L 75,32",
    "M 25,68 L 75,68"
  ],
  "さ": [
    "M 28,30 L 72,30",
    "M 50,15 C 50,45 48,65 42,78",
    "M 35,55 C 55,42 78,50 80,68 C 80,82 65,92 50,85 C 35,78 30,62 42,55"
  ],
  "し": [
    "M 50,15 C 50,55 48,72 42,80 C 35,90 25,88 20,80"
  ],
  "す": [
    "M 25,30 L 75,30",
    "M 50,15 L 50,65 C 50,78 55,88 68,88 C 80,88 85,75 80,62",
    "M 60,50 C 68,48 75,44 78,38"
  ],
  "せ": [
    "M 42,15 L 42,85",
    "M 25,42 L 75,42",
    "M 62,42 C 68,58 68,72 58,82"
  ],
  "そ": [
    "M 28,28 C 48,28 68,25 78,20",
    "M 38,48 C 58,38 80,45 82,62 C 82,78 65,90 48,85 C 32,80 25,65 35,55"
  ],
  "た": [
    "M 28,35 L 72,35",
    "M 50,15 L 50,70",
    "M 28,58 C 38,48 62,48 72,55 C 80,62 78,78 65,85 C 52,90 40,80 45,68"
  ],
  "ち": [
    "M 25,32 C 45,28 68,25 78,20",
    "M 52,32 C 58,50 58,68 48,80 C 38,90 22,90 18,78 C 14,66 25,55 42,58 C 60,62 75,55 80,45"
  ],
  "つ": [
    "M 28,38 C 55,28 78,40 82,58 C 85,75 70,90 50,85 C 30,80 20,62 28,48"
  ],
  "て": [
    "M 25,35 L 75,35",
    "M 50,35 C 50,55 55,72 68,78 C 78,82 82,75 80,65"
  ],
  "と": [
    "M 50,15 L 50,60",
    "M 30,60 C 50,48 75,58 80,72 C 83,82 72,90 58,86 C 42,80 35,68 42,60"
  ],
  "な": [
    "M 28,35 L 72,35",
    "M 50,15 C 50,45 48,62 40,72",
    "M 35,52 C 55,38 78,50 80,68 C 80,82 65,92 50,85 C 35,78 30,62 40,52"
  ],
  "に": [
    "M 30,25 L 30,75",
    "M 30,50 L 70,50",
    "M 70,25 L 70,75"
  ],
  "ぬ": [
    "M 35,25 C 35,55 32,72 25,82",
    "M 35,42 C 58,38 78,48 80,62 C 82,75 68,88 52,82 C 38,78 35,65 45,60 C 58,55 75,58 80,68"
  ],
  "ね": [
    "M 35,25 L 35,78",
    "M 35,48 C 55,38 75,45 78,62 C 80,75 68,88 52,82 C 38,78 35,65 45,60 C 58,55 78,60 82,72"
  ],
  "の": [
    "M 62,20 C 45,20 25,35 22,55 C 18,75 35,90 55,85 C 72,80 82,65 78,48 C 74,32 58,25 45,30"
  ],
  "は": [
    "M 28,15 L 28,85",
    "M 28,45 C 48,38 68,42 72,55 C 75,65 65,78 52,72 C 40,66 35,52 42,45",
    "M 70,52 C 78,52 85,58 85,68 C 85,80 75,88 62,84"
  ],
  "ひ": [
    "M 30,30 C 30,58 35,72 48,80 C 60,88 75,82 80,68 C 85,54 75,40 60,38 C 45,36 32,45 30,58"
  ],
  "ふ": [
    "M 50,15 C 55,22 58,30 55,38",
    "M 28,42 C 38,35 62,35 72,42",
    "M 28,58 C 22,72 28,85 42,88 C 52,90 60,82 55,72",
    "M 72,58 C 78,72 72,85 58,88"
  ],
  "へ": [
    "M 20,50 C 38,25 62,25 80,50"
  ],
  "ほ": [
    "M 28,15 L 28,85",
    "M 28,42 L 72,42",
    "M 72,15 L 72,65 C 72,78 65,85 52,82",
    "M 38,65 C 48,58 65,65 72,72"
  ],
  "ま": [
    "M 25,38 L 75,38",
    "M 25,58 L 75,58",
    "M 50,38 C 50,68 45,80 35,88"
  ],
  "み": [
    "M 28,28 C 28,55 30,72 38,82",
    "M 38,42 C 58,35 78,45 80,62 C 82,78 68,92 50,88 C 35,84 28,70 35,60"
  ],
  "む": [
    "M 30,30 L 65,30",
    "M 50,15 C 50,50 48,68 38,80",
    "M 28,50 C 48,42 75,50 80,65 C 84,78 72,92 55,88 C 38,84 28,70 35,58"
  ],
  "め": [
    "M 30,30 C 30,58 35,75 48,82",
    "M 30,48 C 52,38 78,50 80,68 C 82,82 65,95 48,88 C 32,82 28,68 38,58"
  ],
  "も": [
    "M 25,38 L 75,38",
    "M 25,58 L 75,58",
    "M 50,38 C 50,75 45,88 32,90"
  ],
  "や": [
    "M 25,48 C 38,38 62,35 78,42",
    "M 52,32 C 52,60 48,78 38,88",
    "M 38,65 C 52,58 68,62 78,72"
  ],
  "ゆ": [
    "M 22,50 C 30,32 48,25 62,30 C 78,35 85,52 78,68 C 72,82 55,90 40,84",
    "M 72,30 L 72,88"
  ],
  "よ": [
    "M 25,35 L 75,35",
    "M 50,35 L 50,85",
    "M 25,65 L 75,65"
  ],
  "ら": [
    "M 28,30 C 45,28 65,25 75,20",
    "M 52,30 C 58,52 55,72 42,82 C 28,90 18,80 20,68 C 22,55 38,50 55,55 C 70,60 80,72 78,85"
  ],
  "り": [
    "M 35,20 C 35,48 32,68 25,80",
    "M 65,20 C 65,50 68,70 72,82"
  ],
  "る": [
    "M 30,30 C 55,22 78,35 80,55 C 82,72 65,88 48,82 C 32,76 25,60 35,50 C 45,40 65,42 72,55 C 78,68 72,82 60,85"
  ],
  "れ": [
    "M 35,18 L 35,82",
    "M 35,45 C 55,38 72,45 75,58 C 78,72 65,85 48,82 C 35,78 30,65 40,58 C 55,52 78,62 82,78"
  ],
  "ろ": [
    "M 28,30 C 52,22 78,35 80,55 C 82,72 65,88 48,82 C 32,76 28,60 40,52"
  ],
  "わ": [
    "M 35,18 L 35,82",
    "M 35,45 C 55,38 78,50 80,68 C 82,82 65,92 48,86"
  ],
  "を": [
    "M 25,28 L 75,28",
    "M 25,45 L 75,45",
    "M 50,28 C 50,60 45,78 30,85"
  ],
  "ん": [
    "M 28,30 C 42,22 62,22 72,32 C 80,42 75,58 58,68 C 42,78 28,85 30,92"
  ],

  // ── KATAKANA ──────────────────────────────────────────────────────
  "ア": [
    "M 25,35 L 75,35",
    "M 50,35 C 50,60 42,78 28,88"
  ],
  "イ": [
    "M 30,20 C 42,38 50,58 48,80",
    "M 70,20 L 48,80"
  ],
  "ウ": [
    "M 50,18 C 55,25 58,32 55,38",
    "M 25,45 L 75,45",
    "M 50,45 L 50,88"
  ],
  "エ": [
    "M 25,32 L 75,32",
    "M 50,32 L 50,68",
    "M 25,68 L 75,68"
  ],
  "オ": [
    "M 25,35 L 75,35",
    "M 50,18 L 50,85",
    "M 50,58 C 60,52 72,55 78,65"
  ],
  "カ": [
    "M 30,20 C 45,20 62,18 72,15",
    "M 50,15 L 50,85",
    "M 25,52 L 75,52"
  ],
  "キ": [
    "M 25,30 L 75,30",
    "M 25,55 L 75,55",
    "M 50,15 L 50,88"
  ],
  "ク": [
    "M 50,18 C 60,18 72,20 78,28",
    "M 28,42 C 40,35 65,38 78,28"
  ],
  "ケ": [
    "M 35,15 L 35,85",
    "M 35,38 C 55,32 72,25 78,18",
    "M 62,38 C 68,55 65,72 55,82"
  ],
  "コ": [
    "M 28,25 L 75,25",
    "M 72,25 L 72,72",
    "M 28,72 L 72,72"
  ],
  "サ": [
    "M 25,38 L 75,38",
    "M 40,20 L 40,85",
    "M 62,20 L 62,72"
  ],
  "シ": [
    "M 25,38 C 32,32 40,30 45,35",
    "M 40,55 C 48,48 58,48 62,55",
    "M 55,72 C 65,62 78,58 82,65"
  ],
  "ス": [
    "M 25,30 L 75,30",
    "M 50,30 C 60,50 68,68 55,82 C 45,92 28,88 22,78"
  ],
  "セ": [
    "M 38,18 L 38,82",
    "M 25,48 L 78,48",
    "M 62,48 L 62,85"
  ],
  "ソ": [
    "M 32,28 C 38,22 45,22 48,28",
    "M 62,20 C 55,40 42,58 25,72"
  ],
  "タ": [
    "M 25,30 L 75,30",
    "M 48,30 C 55,48 58,65 50,80",
    "M 28,52 C 48,45 65,50 75,62"
  ],
  "チ": [
    "M 25,35 L 75,35",
    "M 25,58 L 75,58",
    "M 50,58 C 50,72 48,82 40,88"
  ],
  "ツ": [
    "M 25,40 C 32,35 40,35 42,42",
    "M 45,52 C 52,45 60,45 62,52",
    "M 62,62 C 72,50 80,38 82,28"
  ],
  "テ": [
    "M 25,30 L 75,30",
    "M 25,52 L 75,52",
    "M 50,52 L 50,88"
  ],
  "ト": [
    "M 45,15 L 45,85",
    "M 45,50 C 55,45 70,50 78,62"
  ],
  "ナ": [
    "M 25,42 L 75,42",
    "M 50,20 L 50,85"
  ],
  "ニ": [
    "M 28,35 L 72,35",
    "M 22,65 L 78,65"
  ],
  "ヌ": [
    "M 25,32 L 75,32",
    "M 50,32 C 65,50 75,68 65,82 C 55,92 38,90 25,80"
  ],
  "ネ": [
    "M 50,15 L 50,85",
    "M 25,42 L 75,42",
    "M 35,65 C 45,58 60,62 68,72",
    "M 35,78 C 42,72 58,75 68,82"
  ],
  "ノ": [
    "M 72,20 C 55,40 38,62 22,80"
  ],
  "ハ": [
    "M 35,25 C 35,55 30,75 22,85",
    "M 65,20 C 68,50 72,70 78,82"
  ],
  "ヒ": [
    "M 28,20 L 28,80",
    "M 28,50 L 72,50",
    "M 72,50 L 72,80"
  ],
  "フ": [
    "M 25,28 L 75,28",
    "M 72,28 C 75,45 68,62 50,75 C 32,88 18,82 18,70"
  ],
  "ヘ": [
    "M 20,55 C 38,28 62,28 80,55"
  ],
  "ホ": [
    "M 50,15 L 50,88",
    "M 25,40 L 75,40",
    "M 30,65 C 42,58 58,62 70,65"
  ],
  "マ": [
    "M 22,32 L 78,32",
    "M 50,32 C 55,50 52,68 42,80"
  ],
  "ミ": [
    "M 30,30 L 70,30",
    "M 28,50 L 72,50",
    "M 25,70 L 75,70"
  ],
  "ム": [
    "M 50,15 C 42,35 28,52 22,65 C 18,78 28,88 50,85 C 72,82 82,70 78,58"
  ],
  "メ": [
    "M 22,35 L 78,35",
    "M 50,25 C 52,50 58,68 72,80"
  ],
  "モ": [
    "M 25,32 L 75,32",
    "M 25,55 L 75,55",
    "M 50,55 L 50,88"
  ],
  "ヤ": [
    "M 22,50 C 38,35 58,32 72,40",
    "M 50,28 L 50,88",
    "M 32,68 L 72,68"
  ],
  "ユ": [
    "M 22,45 L 78,45",
    "M 50,45 L 50,80",
    "M 28,80 L 72,80"
  ],
  "ヨ": [
    "M 28,22 L 72,22",
    "M 28,50 L 72,50",
    "M 28,78 L 72,78",
    "M 72,22 L 72,78"
  ],
  "ラ": [
    "M 25,30 L 75,30",
    "M 50,30 C 62,50 65,68 52,82 C 38,92 22,82 22,70"
  ],
  "リ": [
    "M 35,20 C 35,52 32,70 25,82",
    "M 65,20 L 65,78"
  ],
  "ル": [
    "M 35,20 C 35,52 42,70 55,78",
    "M 65,20 L 65,55 C 65,72 72,82 80,85"
  ],
  "レ": [
    "M 35,20 L 35,85",
    "M 35,85 C 52,85 68,80 80,72"
  ],
  "ロ": [
    "M 25,25 L 75,25",
    "M 25,25 L 25,78",
    "M 75,25 L 75,78",
    "M 25,78 L 75,78"
  ],
  "ワ": [
    "M 25,28 L 75,28",
    "M 25,28 L 25,75",
    "M 72,28 C 75,50 68,70 55,82"
  ],
  "ヲ": [
    "M 25,30 L 75,30",
    "M 25,52 L 75,52",
    "M 50,30 C 50,62 45,80 32,88"
  ],
  "ン": [
    "M 35,32 C 42,28 48,28 50,35",
    "M 72,20 C 58,42 38,62 22,75"
  ]
};

// 3. English-Japanese Vocabulary Dictionary (Persistent local state stars)
export const dictionary = [
  // Nouns
  { word: "私", reading: "わたし", romaji: "watashi", english: "I, me", tag: "Noun", lesson: 1 },
  { word: "学生", reading: "がくせい", romaji: "gakusei", english: "Student", tag: "Noun", lesson: 1 },
  { word: "先生", reading: "せんせい", romaji: "sensei", english: "Teacher, instructor", tag: "Noun", lesson: 1 },
  { word: "会社員", reading: "かいしゃいん", romaji: "kaishain", english: "Company employee", tag: "Noun", lesson: 9 },
  { word: "本", reading: "ほん", romaji: "hon", english: "Book", tag: "Noun", lesson: 2 },
  { word: "鉛筆", reading: "えんぴつ", romaji: "enpitsu", english: "Pencil", tag: "Noun", lesson: 2 },
  { word: "時計", reading: "とけい", romaji: "tokei", english: "Clock, watch", tag: "Noun", lesson: 2 },
  { word: "教室", reading: "きょうしつ", romaji: "kyoushitsu", english: "Classroom", tag: "Noun", lesson: 3 },
  { word: "食堂", reading: "しょくどう", romaji: "shokudou", english: "Cafeteria, dining hall", tag: "Noun", lesson: 3 },
  { word: "電車", reading: "でんしゃ", romaji: "densha", english: "Electric train", tag: "Noun", lesson: 5 },
  { word: "車", reading: "くるま", romaji: "kuruma", english: "Car, vehicle", tag: "Noun", lesson: 5 },
  { word: "学校", reading: "がっこう", romaji: "gakkou", english: "School", tag: "Noun", lesson: 5 },
  { word: "ご飯", reading: "ごはん", romaji: "gohan", english: "Meal, cooked rice", tag: "Noun", lesson: 6 },
  { word: "水", reading: "みず", romaji: "mizu", english: "Water", tag: "Noun", lesson: 6 },
  { word: "花", reading: "はな", romaji: "hana", english: "Flower", tag: "Noun", lesson: 7 },
  { word: "手紙", reading: "てがみ", romaji: "tegami", english: "Letter", tag: "Noun", lesson: 7 },
  { word: "暑い", reading: "あつい", romaji: "atsui", english: "Hot (weather)", tag: "Adjective", type: "i", lesson: 8 },
  { word: "高い", reading: "たかい", romaji: "takai", english: "Expensive, high", tag: "Adjective", type: "i", lesson: 8 },
  { word: "綺麗", reading: "きれい", romaji: "kirei", english: "Beautiful, clean", tag: "Adjective", type: "na", lesson: 8 },
  { word: "静か", reading: "しずか", romaji: "shizuka", english: "Quiet", tag: "Adjective", type: "na", lesson: 8 },
  { word: "好き", reading: "すき", romaji: "suki", english: "Like, liked", tag: "Adjective", type: "na", lesson: 9 },
  { word: "嫌い", reading: "きらい", romaji: "kirai", english: "Dislike, hated", tag: "Adjective", type: "na", lesson: 9 },

  // ── Extra Nouns (Lessons 1–10) ─────────────────────────────────
  { word: "名前", reading: "なまえ", romaji: "namae", english: "Name", tag: "Noun", lesson: 1 },
  { word: "国", reading: "くに", romaji: "kuni", english: "Country", tag: "Noun", lesson: 1 },
  { word: "会社", reading: "かいしゃ", romaji: "kaisha", english: "Company", tag: "Noun", lesson: 1 },
  { word: "人", reading: "ひと", romaji: "hito", english: "Person", tag: "Noun", lesson: 1 },
  { word: "ここ", reading: "ここ", romaji: "koko", english: "Here", tag: "Noun", lesson: 2 },
  { word: "そこ", reading: "そこ", romaji: "soko", english: "There", tag: "Noun", lesson: 2 },
  { word: "あそこ", reading: "あそこ", romaji: "asoko", english: "Over there", tag: "Noun", lesson: 2 },
  { word: "かばん", reading: "かばん", romaji: "kaban", english: "Bag", tag: "Noun", lesson: 2 },
  { word: "傘", reading: "かさ", romaji: "kasa", english: "Umbrella", tag: "Noun", lesson: 2 },
  { word: "靴", reading: "くつ", romaji: "kutsu", english: "Shoes", tag: "Noun", lesson: 2 },
  { word: "電話", reading: "でんわ", romaji: "denwa", english: "Telephone", tag: "Noun", lesson: 3 },
  { word: "病院", reading: "びょういん", romaji: "byouin", english: "Hospital", tag: "Noun", lesson: 3 },
  { word: "銀行", reading: "ぎんこう", romaji: "ginkou", english: "Bank", tag: "Noun", lesson: 3 },
  { word: "郵便局", reading: "ゆうびんきょく", romaji: "yuubinkyoku", english: "Post office", tag: "Noun", lesson: 3 },
  { word: "図書館", reading: "としょかん", romaji: "toshokan", english: "Library", tag: "Noun", lesson: 3 },
  { word: "今", reading: "いま", romaji: "ima", english: "Now", tag: "Noun", lesson: 4 },
  { word: "朝", reading: "あさ", romaji: "asa", english: "Morning", tag: "Noun", lesson: 4 },
  { word: "昼", reading: "ひる", romaji: "hiru", english: "Noon, daytime", tag: "Noun", lesson: 4 },
  { word: "晩", reading: "ばん", romaji: "ban", english: "Evening", tag: "Noun", lesson: 4 },
  { word: "毎日", reading: "まいにち", romaji: "mainichi", english: "Every day", tag: "Noun", lesson: 4 },
  { word: "毎朝", reading: "まいあさ", romaji: "maiasa", english: "Every morning", tag: "Noun", lesson: 4 },
  { word: "今日", reading: "きょう", romaji: "kyou", english: "Today", tag: "Noun", lesson: 4 },
  { word: "明日", reading: "あした", romaji: "ashita", english: "Tomorrow", tag: "Noun", lesson: 4 },
  { word: "昨日", reading: "きのう", romaji: "kinou", english: "Yesterday", tag: "Noun", lesson: 4 },
  { word: "駅", reading: "えき", romaji: "eki", english: "Train station", tag: "Noun", lesson: 5 },
  { word: "バス", reading: "バス", romaji: "basu", english: "Bus", tag: "Noun", lesson: 5 },
  { word: "タクシー", reading: "タクシー", romaji: "takushii", english: "Taxi", tag: "Noun", lesson: 5 },
  { word: "飛行機", reading: "ひこうき", romaji: "hikouki", english: "Airplane", tag: "Noun", lesson: 5 },
  { word: "船", reading: "ふね", romaji: "fune", english: "Boat, ship", tag: "Noun", lesson: 5 },
  { word: "コーヒー", reading: "コーヒー", romaji: "koohii", english: "Coffee", tag: "Noun", lesson: 6 },
  { word: "お茶", reading: "おちゃ", romaji: "ocha", english: "Green tea", tag: "Noun", lesson: 6 },
  { word: "ジュース", reading: "ジュース", romaji: "juusu", english: "Juice", tag: "Noun", lesson: 6 },
  { word: "ビール", reading: "ビール", romaji: "biiru", english: "Beer", tag: "Noun", lesson: 6 },
  { word: "肉", reading: "にく", romaji: "niku", english: "Meat", tag: "Noun", lesson: 6 },
  { word: "魚", reading: "さかな", romaji: "sakana", english: "Fish", tag: "Noun", lesson: 6 },
  { word: "野菜", reading: "やさい", romaji: "yasai", english: "Vegetables", tag: "Noun", lesson: 6 },
  { word: "果物", reading: "くだもの", romaji: "kudamono", english: "Fruit", tag: "Noun", lesson: 6 },
  { word: "映画", reading: "えいが", romaji: "eiga", english: "Movie", tag: "Noun", lesson: 7 },
  { word: "音楽", reading: "おんがく", romaji: "ongaku", english: "Music", tag: "Noun", lesson: 7 },
  { word: "スポーツ", reading: "スポーツ", romaji: "supootsu", english: "Sport", tag: "Noun", lesson: 7 },
  { word: "旅行", reading: "りょこう", romaji: "ryokou", english: "Travel", tag: "Noun", lesson: 7 },
  { word: "料理", reading: "りょうり", romaji: "ryouri", english: "Cooking, cuisine", tag: "Noun", lesson: 7 },
  { word: "天気", reading: "てんき", romaji: "tenki", english: "Weather", tag: "Noun", lesson: 8 },
  { word: "雨", reading: "あめ", romaji: "ame", english: "Rain", tag: "Noun", lesson: 8 },
  { word: "雪", reading: "ゆき", romaji: "yuki", english: "Snow", tag: "Noun", lesson: 8 },
  { word: "風", reading: "かぜ", romaji: "kaze", english: "Wind", tag: "Noun", lesson: 8 },
  { word: "春", reading: "はる", romaji: "haru", english: "Spring", tag: "Noun", lesson: 8 },
  { word: "夏", reading: "なつ", romaji: "natsu", english: "Summer", tag: "Noun", lesson: 8 },
  { word: "秋", reading: "あき", romaji: "aki", english: "Autumn", tag: "Noun", lesson: 8 },
  { word: "冬", reading: "ふゆ", romaji: "fuyu", english: "Winter", tag: "Noun", lesson: 8 },
  { word: "趣味", reading: "しゅみ", romaji: "shumi", english: "Hobby", tag: "Noun", lesson: 9 },
  { word: "仕事", reading: "しごと", romaji: "shigoto", english: "Work, job", tag: "Noun", lesson: 9 },
  { word: "友達", reading: "ともだち", romaji: "tomodachi", english: "Friend", tag: "Noun", lesson: 9 },
  { word: "家族", reading: "かぞく", romaji: "kazoku", english: "Family", tag: "Noun", lesson: 9 },
  { word: "子供", reading: "こども", romaji: "kodomo", english: "Child", tag: "Noun", lesson: 9 },
  { word: "お母さん", reading: "おかあさん", romaji: "okaasan", english: "Mother", tag: "Noun", lesson: 9 },
  { word: "お父さん", reading: "おとうさん", romaji: "otousan", english: "Father", tag: "Noun", lesson: 9 },
  { word: "部屋", reading: "へや", romaji: "heya", english: "Room", tag: "Noun", lesson: 10 },
  { word: "家", reading: "いえ", romaji: "ie", english: "House, home", tag: "Noun", lesson: 10 },
  { word: "窓", reading: "まど", romaji: "mado", english: "Window", tag: "Noun", lesson: 10 },
  { word: "椅子", reading: "いす", romaji: "isu", english: "Chair", tag: "Noun", lesson: 10 },
  { word: "テーブル", reading: "テーブル", romaji: "teeburu", english: "Table", tag: "Noun", lesson: 10 },

  // ── Extra Verbs ────────────────────────────────────────────────
  { word: "起きる", reading: "おきる", romaji: "okiru", english: "To wake up", tag: "Verb", type: "ru", lesson: 4 },
  { word: "寝る", reading: "ねる", romaji: "neru", english: "To sleep", tag: "Verb", type: "ru", lesson: 4 },
  { word: "働く", reading: "はたらく", romaji: "hataraku", english: "To work", tag: "Verb", type: "u", lesson: 4 },
  { word: "休む", reading: "やすむ", romaji: "yasumu", english: "To rest", tag: "Verb", type: "u", lesson: 4 },
  { word: "乗る", reading: "のる", romaji: "noru", english: "To ride", tag: "Verb", type: "u", lesson: 5 },
  { word: "降りる", reading: "おりる", romaji: "oriru", english: "To get off", tag: "Verb", type: "ru", lesson: 5 },
  { word: "会う", reading: "あう", romaji: "au", english: "To meet", tag: "Verb", type: "u", lesson: 7 },
  { word: "送る", reading: "おくる", romaji: "okuru", english: "To send", tag: "Verb", type: "u", lesson: 7 },
  { word: "待つ", reading: "まつ", romaji: "matsu", english: "To wait", tag: "Verb", type: "u", lesson: 7 },
  { word: "借りる", reading: "かりる", romaji: "kariru", english: "To borrow", tag: "Verb", type: "ru", lesson: 7 },
  { word: "貸す", reading: "かす", romaji: "kasu", english: "To lend", tag: "Verb", type: "u", lesson: 7 },
  { word: "持つ", reading: "もつ", romaji: "motsu", english: "To hold, carry", tag: "Verb", type: "u", lesson: 8 },
  { word: "洗う", reading: "あらう", romaji: "arau", english: "To wash", tag: "Verb", type: "u", lesson: 8 },
  { word: "掃除する", reading: "そうじする", romaji: "souji suru", english: "To clean", tag: "Verb", type: "irr", lesson: 8 },
  { word: "勉強する", reading: "べんきょうする", romaji: "benkyou suru", english: "To study", tag: "Verb", type: "irr", lesson: 9 },
  { word: "練習する", reading: "れんしゅうする", romaji: "renshuu suru", english: "To practice", tag: "Verb", type: "irr", lesson: 9 },
  { word: "開ける", reading: "あける", romaji: "akeru", english: "To open", tag: "Verb", type: "ru", lesson: 10 },
  { word: "閉める", reading: "しめる", romaji: "shimeru", english: "To close", tag: "Verb", type: "ru", lesson: 10 },
  { word: "つける", reading: "つける", romaji: "tsukeru", english: "To turn on", tag: "Verb", type: "ru", lesson: 10 },
  { word: "消す", reading: "けす", romaji: "kesu", english: "To turn off, erase", tag: "Verb", type: "u", lesson: 10 },

  // ── Extra Adjectives ──────────────────────────────────────────
  { word: "新しい", reading: "あたらしい", romaji: "atarashii", english: "New", tag: "Adjective", type: "i", lesson: 8 },
  { word: "古い", reading: "ふるい", romaji: "furui", english: "Old (thing)", tag: "Adjective", type: "i", lesson: 8 },
  { word: "大きい", reading: "おおきい", romaji: "ookii", english: "Big", tag: "Adjective", type: "i", lesson: 8 },
  { word: "小さい", reading: "ちいさい", romaji: "chiisai", english: "Small", tag: "Adjective", type: "i", lesson: 8 },
  { word: "長い", reading: "ながい", romaji: "nagai", english: "Long", tag: "Adjective", type: "i", lesson: 8 },
  { word: "短い", reading: "みじかい", romaji: "mijikai", english: "Short", tag: "Adjective", type: "i", lesson: 8 },
  { word: "速い", reading: "はやい", romaji: "hayai", english: "Fast", tag: "Adjective", type: "i", lesson: 8 },
  { word: "遅い", reading: "おそい", romaji: "osoi", english: "Slow, late", tag: "Adjective", type: "i", lesson: 8 },
  { word: "難しい", reading: "むずかしい", romaji: "muzukashii", english: "Difficult", tag: "Adjective", type: "i", lesson: 9 },
  { word: "易しい", reading: "やさしい", romaji: "yasashii", english: "Easy", tag: "Adjective", type: "i", lesson: 9 },
  { word: "面白い", reading: "おもしろい", romaji: "omoshiroi", english: "Interesting, fun", tag: "Adjective", type: "i", lesson: 9 },
  { word: "つまらない", reading: "つまらない", romaji: "tsumaranai", english: "Boring", tag: "Adjective", type: "i", lesson: 9 },
  { word: "忙しい", reading: "いそがしい", romaji: "isogashii", english: "Busy", tag: "Adjective", type: "i", lesson: 9 },
  { word: "暇", reading: "ひま", romaji: "hima", english: "Free time, not busy", tag: "Adjective", type: "na", lesson: 9 },
  { word: "元気", reading: "げんき", romaji: "genki", english: "Healthy, energetic", tag: "Adjective", type: "na", lesson: 1 },
  { word: "丁寧", reading: "ていねい", romaji: "teinei", english: "Polite, careful", tag: "Adjective", type: "na", lesson: 9 },
  { word: "親切", reading: "しんせつ", romaji: "shinsetsu", english: "Kind", tag: "Adjective", type: "na", lesson: 9 },
  { word: "有名", reading: "ゆうめい", romaji: "yuumei", english: "Famous", tag: "Adjective", type: "na", lesson: 9 },
  { word: "便利", reading: "べんり", romaji: "benri", english: "Convenient", tag: "Adjective", type: "na", lesson: 10 },
  { word: "不便", reading: "ふべん", romaji: "fuben", english: "Inconvenient", tag: "Adjective", type: "na", lesson: 10 },

  // Verbs
  { word: "食べる", reading: "たべる", romaji: "taberu", english: "To eat", tag: "Verb", type: "ru", lesson: 6 },
  { word: "行く", reading: "いく", romaji: "iku", english: "To go", tag: "Verb", type: "u", lesson: 5 },
  { word: "帰る", reading: "かえる", romaji: "kaeru", english: "To return, go home", tag: "Verb", type: "u", lesson: 5 },
  { word: "来る", reading: "くる", romaji: "kuru", english: "To come", tag: "Verb", type: "irr", lesson: 5 },
  { word: "飲む", reading: "のむ", romaji: "nomu", english: "To drink", tag: "Verb", type: "u", lesson: 6 },
  { word: "見る", reading: "みる", romaji: "miru", english: "To see, watch", tag: "Verb", type: "ru", lesson: 6 },
  { word: "読む", reading: "よむ", romaji: "yomu", english: "To read", tag: "Verb", type: "u", lesson: 6 },
  { word: "書く", reading: "かく", romaji: "kaku", english: "To write", tag: "Verb", type: "u", lesson: 6 },
  { word: "話す", reading: "はなす", romaji: "hanasu", english: "To speak, talk", tag: "Verb", type: "u", lesson: 7 },
  { word: "聞く", reading: "きく", romaji: "kiku", english: "To hear, listen", tag: "Verb", type: "u", lesson: 7 },
  { word: "買う", reading: "かう", romaji: "kau", english: "To buy", tag: "Verb", type: "u", lesson: 7 },

  // Adjectives
  { word: "美味しい", reading: "おいしい", romaji: "oishii", english: "Delicious", tag: "Adjective", type: "i", lesson: 8 },
  { word: "寒い", reading: "さむい", romaji: "samui", english: "Cold (weather)", tag: "Adjective", type: "i", lesson: 8 },
  { word: "暑い", reading: "あつい", romaji: "atsui", english: "Hot (weather)", tag: "Adjective", type: "i", lesson: 8 },
  { word: "高い", reading: "たかい", romaji: "takai", english: "Expensive, high", tag: "Adjective", type: "i", lesson: 8 },
  { word: "綺麗", reading: "きれい", romaji: "kirei", english: "Beautiful, clean", tag: "Adjective", type: "na", lesson: 8 },
  { word: "静か", reading: "しずか", romaji: "shizuka", english: "Quiet", tag: "Adjective", type: "na", lesson: 8 },
  { word: "好き", reading: "すき", romaji: "suki", english: "Like, liked", tag: "Adjective", type: "na", lesson: 9 },
  { word: "嫌い", reading: "きらい", romaji: "kirai", english: "Dislike, hated", tag: "Adjective", type: "na", lesson: 9 }
];

// Verb Conjugator Logic
export function conjugateVerb(verbObj) {
  const dictionaryForm = verbObj.word;
  const type = verbObj.type; // 'ru', 'u', or 'irr'
  const baseReading = verbObj.reading;

  let polite = "";
  let negative = "";
  let past = "";
  let te = "";

  if (dictionaryForm === "来る" || baseReading === "くる") {
    // Irregular - kuru
    polite = "来ます (きます)";
    negative = "来ない (こない)";
    past = "来た (きた)";
    te = "来て (きて)";
  } else if (dictionaryForm === "する" || baseReading === "する") {
    // Irregular - suru
    polite = "します";
    negative = "しない";
    past = "した";
    te = "して";
  } else if (type === "ru") {
    // Ru-verb (Ichidan): drop 'ru' (る)
    const stem = dictionaryForm.slice(0, -1);
    const readingStem = baseReading.slice(0, -1);
    polite = `${stem}ます (${readingStem}ます)`;
    negative = `${stem}ない (${readingStem}ない)`;
    past = `${stem}た (${readingStem}た)`;
    te = `${stem}て (${readingStem}て)`;
  } else if (type === "u") {
    // U-verb (Godan)
    const lastChar = dictionaryForm.slice(-1);
    const lastReading = baseReading.slice(-1);
    const stem = dictionaryForm.slice(0, -1);
    const readingStem = baseReading.slice(0, -1);

    // Polite form: change final u row to i row + masu
    const iRow = { "う": "い", "く": "き", "つ": "ち", "る": "り", "む": "み", "ぬ": "に", "ぶ": "び", "す": "し", "ぐ": "ぎ" };
    // Negative form: change final u row to a row + nai (u becomes wa)
    const aRow = { "う": "わ", "く": "か", "つ": "た", "る": "ら", "む": "ま", "ぬ": "な", "ぶ": "ば", "す": "さ", "ぐ": "が" };

    const charI = iRow[lastChar] || "い";
    const readI = iRow[lastReading] || "い";
    const charA = aRow[lastChar] || "わ";
    const readA = aRow[lastReading] || "わ";

    polite = `${stem}${charI}ます (${readingStem}${readI}ます)`;
    negative = `${stem}${charA}ない (${readingStem}${readA}ない)`;

    // Past & Te Form rules:
    // う, つ, る -> った / って (Special: 行く (iku) -> 行った / 行って)
    // む, ぶ, ぬ -> んだ / んで
    // く -> いた / いて
    // ぐ -> いだ / いで
    // す -> した / して
    if (dictionaryForm === "行く" || baseReading === "いく") {
      past = "行った (いった)";
      te = "行って (いって)";
    } else if (["う", "つ", "る"].includes(lastChar)) {
      past = `${stem}った (${readingStem}った)`;
      te = `${stem}って (${readingStem}って)`;
    } else if (["む", "ぶ", "ぬ"].includes(lastChar)) {
      past = `${stem}んだ (${readingStem}んだ)`;
      te = `${stem}んで (${readingStem}んで)`;
    } else if (lastChar === "く") {
      past = `${stem}いた (${readingStem}いた)`;
      te = `${stem}いて (${readingStem}いて)`;
    } else if (lastChar === "ぐ") {
      past = `${stem}いだ (${readingStem}いだ)`;
      te = `${stem}いで (${readingStem}いで)`;
    } else if (lastChar === "す") {
      past = `${stem}した (${readingStem}した)`;
      te = `${stem}して (${readingStem}して)`;
    } else {
      past = `${stem}た`;
      te = `${stem}て`;
    }
  }

  return { polite, negative, past, te };
}

// 4. Kanji Dataset (N5/N4 level with stroke path vectors)
export const kanjiData = [
  // Level N5
  {
    char: "一",
    level: "N5",
    meaning: "One",
    onyomi: "イチ (ichi), イツ (itsu)",
    kunyomi: "ひと-つ (hito-tsu)",
    strokes: [
      "M 20,50 L 80,50"
    ]
  },
  {
    char: "二",
    level: "N5",
    meaning: "Two",
    onyomi: "ニ (ni), ジ (ji)",
    kunyomi: "ふた-つ (futa-tsu)",
    strokes: [
      "M 30,35 L 70,35",
      "M 20,65 L 80,65"
    ]
  },
  {
    char: "三",
    level: "N5",
    meaning: "Three",
    onyomi: "サン (san)",
    kunyomi: "みっ-つ (mit-tsu)",
    strokes: [
      "M 30,25 L 70,25",
      "M 35,50 L 65,50",
      "M 20,75 L 80,75"
    ]
  },
  {
    char: "四",
    level: "N5",
    meaning: "Four",
    onyomi: "シ (shi)",
    kunyomi: "よっ-つ (yot-tsu), よん (yon)",
    strokes: [
      "M 30,20 L 30,85",
      "M 30,20 L 72,20 L 72,85",
      "M 42,38 C 45,55 42,70 34,80",
      "M 56,36 C 60,44 64,55 68,76",
      "M 30,85 L 72,85"
    ]
  },
  {
    char: "五",
    level: "N5",
    meaning: "Five",
    onyomi: "ゴ (go)",
    kunyomi: "いつ-つ (itsu-tsu)",
    strokes: [
      "M 28,25 L 72,25",
      "M 48,25 L 40,55",
      "M 40,55 L 70,55",
      "M 22,85 L 78,85"
    ]
  },
  {
    char: "六",
    level: "N5",
    meaning: "Six",
    onyomi: "ロク (roku)",
    kunyomi: "むっ-つ (mut-tsu)",
    strokes: [
      "M 50,15 L 50,30",
      "M 22,38 L 78,38",
      "M 38,50 C 35,62 30,75 20,85",
      "M 62,48 C 65,58 72,75 80,85"
    ]
  },
  {
    char: "日",
    level: "N5",
    meaning: "Sun, day, Japan",
    onyomi: "ニチ (nichi), ジツ (jitsu)",
    kunyomi: "ひ (hi), -び (-bi)",
    strokes: [
      "M 30,20 L 30,80",
      "M 30,20 L 70,20 L 70,80",
      "M 30,50 L 70,50",
      "M 30,80 L 70,80"
    ]
  },
  {
    char: "月",
    level: "N5",
    meaning: "Moon, month",
    onyomi: "ゲツ (getsu), ガツ (gatsu)",
    kunyomi: "つき (tsuki)",
    strokes: [
      "M 32,18 C 32,45 30,70 18,88",
      "M 32,20 L 68,20 L 68,88",
      "M 32,44 L 68,44",
      "M 32,66 L 68,66"
    ]
  },
  {
    char: "木",
    level: "N5",
    meaning: "Tree, wood",
    onyomi: "モク (moku), ボク (boku)",
    kunyomi: "き (ki)",
    strokes: [
      "M 20,42 L 80,42",
      "M 50,15 L 50,88",
      "M 50,42 C 43,58 30,75 18,85",
      "M 50,42 C 57,58 70,75 82,85"
    ]
  },
  {
    char: "山",
    level: "N5",
    meaning: "Mountain",
    onyomi: "サン (san)",
    kunyomi: "やま (yama)",
    strokes: [
      "M 50,20 L 50,85",
      "M 28,48 L 28,82 L 72,82",
      "M 72,45 L 72,82"
    ]
  },
  {
    char: "川",
    level: "N5",
    meaning: "River",
    onyomi: "セン (sen)",
    kunyomi: "かわ (kawa)",
    strokes: [
      "M 30,28 C 30,48 28,68 20,80",
      "M 50,28 L 50,75",
      "M 70,20 L 70,85"
    ]
  },
  {
    char: "田",
    level: "N5",
    meaning: "Rice field",
    onyomi: "デン (den)",
    kunyomi: "た (ta)",
    strokes: [
      "M 28,25 L 28,80",
      "M 28,25 L 72,25 L 72,80",
      "M 50,25 L 50,80",
      "M 28,52 L 72,52",
      "M 28,80 L 72,80"
    ]
  },
  {
    char: "人",
    level: "N5",
    meaning: "Person",
    onyomi: "ジン (jin), ニン (nin)",
    kunyomi: "ひと (hito)",
    strokes: [
      "M 52,18 C 50,42 38,68 18,88",
      "M 45,45 C 55,60 68,75 84,88"
    ]
  },
  {
    char: "口",
    level: "N5",
    meaning: "Mouth",
    onyomi: "コウ (kou), ク (ku)",
    kunyomi: "くち (kuchi)",
    strokes: [
      "M 28,28 L 28,80",
      "M 28,28 L 72,28 L 72,80",
      "M 28,80 L 72,80"
    ]
  },
  // Level N4
  {
    char: "会",
    level: "N4",
    meaning: "To meet, society",
    onyomi: "カイ (kai), エ (e)",
    kunyomi: "あ-う (a-u)",
    strokes: [
      "M 50,15 C 40,28 28,45 18,55",
      "M 52,15 C 62,28 75,45 84,55",
      "M 35,48 L 68,48",
      "M 42,65 C 45,65 50,65 65,65 L 65,82",
      "M 25,82 L 78,82"
    ]
  },
  {
    char: "社",
    level: "N4",
    meaning: "Company, shrine",
    onyomi: "シャ (sha)",
    kunyomi: "やしろ (yashiro)",
    strokes: [
      "M 32,15 L 32,28",
      "M 18,34 C 25,34 32,32 40,28 C 38,38 30,55 20,65",
      "M 30,52 L 30,90",
      "M 42,42 C 45,55 45,75 48,90",
      "M 50,22 L 78,22",
      "M 64,22 L 64,62",
      "M 48,62 L 82,62",
      "M 48,88 L 84,88"
    ]
  },
  {
    char: "車",
    level: "N4",
    meaning: "Car, vehicle",
    onyomi: "シャ (sha)",
    kunyomi: "くるま (kuruma)",
    strokes: [
      "M 25,25 L 75,25",
      "M 22,42 L 78,42",
      "M 30,42 L 30,68 L 70,68 L 70,42 Z",
      "M 22,68 L 78,68",
      "M 50,12 L 50,88"
    ]
  },
  {
    char: "門",
    level: "N4",
    meaning: "Gate",
    onyomi: "モン (mon)",
    kunyomi: "かど (kado)",
    strokes: [
      "M 26,18 L 26,88",
      "M 26,18 L 45,18 L 45,50",
      "M 26,45 L 45,45",
      "M 56,18 L 56,50 L 74,50",
      "M 56,18 L 75,18 L 75,88"
    ]
  }
];
