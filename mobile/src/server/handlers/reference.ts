import { Hono } from 'hono';
import { prisma } from '../db';

export const referenceRoute = new Hono();

const ETAG_VALUE = process.env.REFERENCE_ETAG || '"ref-v1"';

referenceRoute.get('/', async (c) => {
  const clientEtag = c.req.header('If-None-Match');
  if (clientEtag === ETAG_VALUE) {
    return c.body(null, 304);
  }

  const type = c.req.query('type') || 'all';
  const data: Record<string, any> = {};

  c.header('Cache-Control', 'public, max-age=604800, immutable');
  c.header('ETag', ETAG_VALUE);

  try {
    if (type === 'all' || type === 'kana') {
      data.kana = await prisma.kana.findMany({ include: { strokes: true } });
    }
    if (type === 'all' || type === 'kanji') {
      data.kanji = await prisma.kanji.findMany({ include: { strokes: true } });
    }
    if (type === 'all' || type === 'vocab') {
      data.vocabulary = await prisma.vocabulary.findMany();
    }
    if (type === 'all' || type === 'scenarios') {
      data.scenarios = await prisma.kaiwaScenario.findMany();
    }
    if (type === 'all' || type === 'phrases') {
      data.phrases = await prisma.pronunciationPhrase.findMany();
    }
    if (type === 'all' || type === 'puzzles') {
      data.puzzles = await prisma.radicalPuzzle.findMany();
    }
    if (type === 'all' || type === 'lessons') {
      data.lessons = await prisma.lesson.findMany();
    }
  } catch (err) {
    console.warn('DB query error in reference handler, returning fallback empty lists:', err);
  }

  return c.json({ success: true, data });
});
