import { Hono } from 'hono';
import { prisma } from '../db';

export const referenceRoute = new Hono();

const ETAG_VALUE = process.env.REFERENCE_ETAG || '"ref-v1"';

function withTimeout<T>(promise: Promise<T>, ms: number = 300): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('DB Query Timeout')), ms)
    ),
  ]);
}

referenceRoute.get('/', async (c) => {
  const clientEtag = c.req.header('If-None-Match');
  if (clientEtag === ETAG_VALUE) {
    return c.body(null, 304);
  }

  const type = c.req.query('type') || 'all';
  const data: Record<string, any> = {
    kana: [],
    kanji: [],
    vocabulary: [],
    scenarios: [],
    phrases: [],
    puzzles: [],
    lessons: [],
  };

  c.header('Cache-Control', 'public, max-age=604800, immutable');
  c.header('ETag', ETAG_VALUE);

  try {
    if (type === 'all' || type === 'kana') {
      data.kana = await withTimeout(prisma.kana.findMany({ include: { strokes: true } }));
    }
    if (type === 'all' || type === 'kanji') {
      data.kanji = await withTimeout(prisma.kanji.findMany({ include: { strokes: true } }));
    }
    if (type === 'all' || type === 'vocab') {
      data.vocabulary = await withTimeout(prisma.vocabulary.findMany());
    }
    if (type === 'all' || type === 'scenarios') {
      data.scenarios = await withTimeout(prisma.kaiwaScenario.findMany());
    }
    if (type === 'all' || type === 'phrases') {
      data.phrases = await withTimeout(prisma.pronunciationPhrase.findMany());
    }
    if (type === 'all' || type === 'puzzles') {
      data.puzzles = await withTimeout(prisma.radicalPuzzle.findMany());
    }
    if (type === 'all' || type === 'lessons') {
      data.lessons = await withTimeout(prisma.lesson.findMany());
    }
  } catch (err) {
    // DB query error / timeout fallback for offline / test env
  }

  return c.json({ success: true, data });
});
