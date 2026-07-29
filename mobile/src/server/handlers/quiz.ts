import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { auth } from '../auth';
import { prisma } from '../db';

export const quizRoute = new Hono();

const quizSchema = z.object({
  deck: z.string().min(1),
  length: z.number().int().positive(),
  score: z.number().int().min(0),
});

quizRoute.post('/', zValidator('json', quizSchema), async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });
  if (!session) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const { deck, length, score } = c.req.valid('json');

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
