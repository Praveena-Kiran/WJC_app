export function calculateN5Metrics(
  n5TargetDate?: string | null,
  solvedCount = 0,
  kanaCount = 0,
  kanjiCount = 0,
  starredVocabCount = 0
) {
  const targetDateStr = n5TargetDate || '2026-12-06';
  const target = new Date(targetDateStr);
  const now = new Date();
  const diffTime = target.getTime() - now.getTime();
  const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const lessonPct = Math.min(100, (solvedCount / 10) * 100);
  const kanaPct = Math.min(100, (kanaCount / 92) * 100);
  const kanjiPct = Math.min(100, (kanjiCount / 100) * 100);
  const overallPct = Math.round(
    lessonPct * 0.35 + kanaPct * 0.25 + kanjiPct * 0.25 + (starredVocabCount > 0 ? 15 : 5)
  );

  const remainingKana = Math.max(0, 92 - kanaCount);
  const remainingKanji = Math.max(0, 100 - kanjiCount);
  const remainingVocab = Math.max(0, 800 - starredVocabCount);
  const paceDays = Math.max(1, daysLeft);

  const dailyKana = Math.ceil(remainingKana / paceDays);
  const dailyKanji = Math.ceil(remainingKanji / paceDays);
  const dailyVocab = Math.ceil(remainingVocab / paceDays);

  let statusLabel = 'On Track 🟢';
  let statusBg = 'rgba(16, 185, 129, 0.15)';
  let statusColor = '#10b981';

  if (overallPct < 25 && daysLeft < 15) {
    statusLabel = 'Pace Boost Needed ⚡';
    statusBg = 'rgba(239, 68, 68, 0.15)';
    statusColor = '#ef4444';
  } else if (overallPct >= 80) {
    statusLabel = 'Exam Ready 🎉';
    statusBg = 'rgba(92, 96, 245, 0.15)';
    statusColor = '#5c60f5';
  }

  return {
    daysLeft,
    overallPct,
    dailyKana,
    dailyKanji,
    dailyVocab,
    statusLabel,
    statusBg,
    statusColor,
  };
}
