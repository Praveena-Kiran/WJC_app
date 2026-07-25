// Pure React Native / TypeScript Scoring & SRS Logic (No DOM / Browser Dependencies)

export interface SrsItem {
  interval: number;
  easeFactor: number;
  dueDate: string;
  reviews: number;
}

export function calculatePhoneticAccuracy(spoken: string, target: string): number {
  const cleanSpoken = spoken.trim().replace(/\s+/g, "");
  const cleanTarget = target.trim().replace(/\s+/g, "");

  if (!cleanSpoken) return 0;
  if (cleanSpoken === cleanTarget) return 100;

  let matchCount = 0;
  const targetChars = cleanTarget.split("");
  targetChars.forEach((char) => {
    if (cleanSpoken.includes(char)) matchCount++;
  });

  return Math.min(100, Math.round((matchCount / targetChars.length) * 100));
}

export function computeNextSrsState(
  current: SrsItem | undefined,
  rating: "again" | "hard" | "good" | "easy"
): SrsItem {
  const item = current || { interval: 1, easeFactor: 2.5, dueDate: new Date().toISOString(), reviews: 0 };
  let newInterval = item.interval;
  let newEase = item.easeFactor;

  if (rating === "again") {
    newInterval = 1;
    newEase = Math.max(1.3, newEase - 0.2);
  } else if (rating === "hard") {
    newInterval = Math.max(1, Math.round(newInterval * 1.2));
    newEase = Math.max(1.3, newEase - 0.15);
  } else if (rating === "good") {
    newInterval = Math.round(newInterval * newEase);
  } else if (rating === "easy") {
    newInterval = Math.round(newInterval * newEase * 1.3);
    newEase = newEase + 0.15;
  }

  const nextDue = new Date();
  nextDue.setDate(nextDue.getDate() + newInterval);

  return {
    interval: newInterval,
    easeFactor: newEase,
    dueDate: nextDue.toISOString(),
    reviews: item.reviews + 1,
  };
}
