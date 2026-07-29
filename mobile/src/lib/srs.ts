/**
 * srs.ts — Spaced Repetition System (SRS) algorithm
 *
 * Exact port of the SRS algorithm from web/src/context/AppContext.tsx lines 377-411.
 * Isolated into a pure function for testability.
 *
 * Algorithm:
 *   again → reset interval to 1, decrease ease by 0.20 (min 1.3)
 *   hard  → slow growth (×1.2), decrease ease by 0.15 (min 1.3)
 *   good  → normal growth (× easeFactor)
 *   easy  → fast growth (× easeFactor × 1.3), increase ease by 0.15
 *
 * dueDate is set to (today + newInterval) days in the future.
 *
 * Closes #013
 */

export interface SrsCardData {
  interval: number;
  easeFactor: number;
  dueDate: string; // ISO string
  reviews: number;
}

export type SrsRating = 'again' | 'hard' | 'good' | 'easy';

/**
 * Compute the next SRS state for a card given a review rating.
 * Returns a new SrsCardData object (immutable).
 */
export function computeSrsUpdate(current: SrsCardData, rating: SrsRating): SrsCardData {
  let newInterval = current.interval;
  let newEase = current.easeFactor;

  if (rating === 'again') {
    newInterval = 1;
    newEase = Math.max(1.3, newEase - 0.2);
  } else if (rating === 'hard') {
    newInterval = Math.max(1, Math.round(newInterval * 1.2));
    newEase = Math.max(1.3, newEase - 0.15);
  } else if (rating === 'good') {
    newInterval = Math.round(newInterval * newEase);
  } else if (rating === 'easy') {
    newInterval = Math.round(newInterval * newEase * 1.3);
    newEase = newEase + 0.15;
  }

  const nextDue = new Date();
  nextDue.setDate(nextDue.getDate() + newInterval);

  return {
    interval: newInterval,
    easeFactor: newEase,
    dueDate: nextDue.toISOString(),
    reviews: current.reviews + 1,
  };
}

/** Create a default SRS card for a kana that has never been reviewed. */
export function defaultSrsCard(): SrsCardData {
  return {
    interval: 1,
    easeFactor: 2.5,
    dueDate: new Date().toISOString(),
    reviews: 0,
  };
}
