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

// Stroke animations paths for Kana (represented as modular SVG path draws)
export const kanaStrokes = {
  // Hiragana
  "あ": [
    "M 25,35 L 75,35", // stroke 1: horizontal
    "M 50,15 C 50,45 46,72 32,88", // stroke 2: vertical curve
    "M 40,55 C 65,35 88,58 75,76 C 63,92 38,82 45,62 C 48,45 68,48 78,56" // stroke 3: loops
  ],
  "い": [
    "M 32,25 C 32,45 30,70 18,80 C 17,82 14,80 15,75",
    "M 65,32 C 65,48 62,60 55,68"
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
  // Fallbacks are handled in the component
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
  { word: "日本語", reading: "にほんご", romaji: "nihongo", english: "Japanese language", tag: "Noun", lesson: 9 },
  { word: "猫", reading: "ねこ", romaji: "neko", english: "Cat", tag: "Noun", lesson: 10 },
  { word: "犬", reading: "いぬ", romaji: "inu", english: "Dog", tag: "Noun", lesson: 10 },
  { word: "机", reading: "つくえ", romaji: "tsukue", english: "Desk", tag: "Noun", lesson: 10 },
  
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
