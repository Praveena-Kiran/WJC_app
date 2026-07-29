import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { auth } from './auth';
import { quizRoute } from './handlers/quiz';

const app = new Hono();

app.use(
  '*',
  cors({
    origin: ['*'],
    allowHeaders: ['Content-Type', 'Cookie'],
    credentials: true,
  })
);

// Health check endpoint
app.get('/healthz', (c) => c.json({ ok: true }));

// Auth routes
app.mount('/api/auth', auth.handler);

// Quiz API handler
app.route('/api/quiz', quizRoute);

export default app;
