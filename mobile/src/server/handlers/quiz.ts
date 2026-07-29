import { Hono } from 'hono';
import { auth } from '../auth';
import { prisma } from '../db';

export const quizRoute = new Hono();

quizRoute.post('/', async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });
  if (!session) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const body = await c.req.json();
  const { deck, length, score } = body;

  if (!deck || typeof length !== 'number' || typeof score !== 'number') {
    return c.json({ error: 'Invalid payload: deck, length, and score are required' }, 400);
  }

  const run = await prisma.quizRun.create({
    data: {
      userId: session.user.id,
      deck,
      length,
      score,
    },
  });

  return c.json(run);
});
