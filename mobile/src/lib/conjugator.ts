export interface VerbObj {
  word: string;
  reading?: string;
  type?: string; // 'ru' | 'u' | 'irr'
  tag?: string;
}

export interface ConjugatedVerb {
  type: string;
  polite: string;
  masu: string;
  negative: string;
  nai: string;
  past: string;
  ta: string;
  te: string;
}

export const iRow: Record<string, string> = {
  う: 'い',
  く: 'き',
  つ: 'ち',
  る: 'り',
  む: 'み',
  ぬ: 'に',
  ぶ: 'び',
  す: 'し',
  ぐ: 'ぎ',
};

export const aRow: Record<string, string> = {
  う: 'わ',
  く: 'か',
  つ: 'た',
  る: 'ら',
  む: 'ま',
  ぬ: 'な',
  ぶ: 'ば',
  す: 'さ',
  ぐ: 'が',
};

export function conjugateVerb(verbInput: string | VerbObj): ConjugatedVerb | null {
  if (!verbInput) return null;

  let verbObj: VerbObj;
  if (typeof verbInput === 'string') {
    verbObj = {
      word: verbInput,
      reading: verbInput,
      type: verbInput.endsWith('る') ? 'ru' : 'u',
    };
  } else {
    verbObj = verbInput;
  }

  const dictionaryForm = verbObj.word || '';
  const type = verbObj.type || (dictionaryForm.endsWith('る') ? 'ru' : 'u');
  const verbType = verbObj.tag || (type === 'ru' ? 'Ru-verb (Group 2)' : 'U-verb (Group 1)');
  const baseReading = verbObj.reading || dictionaryForm;

  let polite = '';
  let negative = '';
  let past = '';
  let te = '';

  if (dictionaryForm === '来る' || baseReading === 'くる') {
    // Irregular - kuru
    polite = '来ます (きます)';
    negative = '来ない (こない)';
    past = '来た (きた)';
    te = '来て (きて)';
  } else if (dictionaryForm === 'する' || baseReading === 'する') {
    // Irregular - suru
    polite = 'します';
    negative = 'しない';
    past = 'した';
    te = 'して';
  } else if (type === 'ru') {
    // Ru-verb (Ichidan): drop 'ru' (る)
    const stem = dictionaryForm.slice(0, -1);
    const readingStem = baseReading.slice(0, -1);
    polite = `${stem}ます (${readingStem}ます)`;
    negative = `${stem}ない (${readingStem}ない)`;
    past = `${stem}た (${readingStem}た)`;
    te = `${stem}て (${readingStem}て)`;
  } else if (type === 'u') {
    // U-verb (Godan)
    const lastChar = dictionaryForm.slice(-1);
    const lastReading = baseReading.slice(-1);
    const stem = dictionaryForm.slice(0, -1);
    const readingStem = baseReading.slice(0, -1);

    const charI = iRow[lastChar] || 'い';
    const readI = iRow[lastReading] || 'い';
    const charA = aRow[lastChar] || 'わ';
    const readA = aRow[lastReading] || 'わ';

    polite = `${stem}${charI}ます (${readingStem}${readI}ます)`;
    negative = `${stem}${charA}ない (${readingStem}${readA}ない)`;

    if (dictionaryForm === '行く' || baseReading === 'いく') {
      past = '行った (いった)';
      te = '行って (いって)';
    } else if (['う', 'つ', 'る'].includes(lastChar)) {
      past = `${stem}った (${readingStem}った)`;
      te = `${stem}って (${readingStem}って)`;
    } else if (['む', 'ぶ', 'ぬ'].includes(lastChar)) {
      past = `${stem}んだ (${readingStem}んだ)`;
      te = `${stem}んで (${readingStem}んで)`;
    } else if (lastChar === 'く') {
      past = `${stem}いた (${readingStem}いた)`;
      te = `${stem}いて (${readingStem}いて)`;
    } else if (lastChar === 'ぐ') {
      past = `${stem}いだ (${readingStem}いだ)`;
      te = `${stem}いで (${readingStem}いで)`;
    } else if (lastChar === 'す') {
      past = `${stem}した (${readingStem}した)`;
      te = `${stem}して (${readingStem}して)`;
    } else {
      past = `${stem}た`;
      te = `${stem}て`;
    }
  }

  return {
    type: verbType,
    polite,
    masu: polite,
    negative,
    nai: negative,
    past,
    ta: past,
    te,
  };
}
