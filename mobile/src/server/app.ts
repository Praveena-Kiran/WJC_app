import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { auth } from './auth';
import { quizRoute } from './handlers/quiz';
import { securityHeaders } from './middleware/security';
import { strictRateLimit } from './middleware/rate-limit';
import { apiBodyLimit } from './middleware/body-limit';

const app = new Hono();

// Global Security Headers & CORS
app.use('*', securityHeaders);
app.use(
  '*',
  cors({
    origin: ['*'],
    allowHeaders: ['Content-Type', 'Cookie'],
    credentials: true,
  })
);

// Route-specific security middleware
app.use('/api/quiz/*', strictRateLimit, apiBodyLimit);

// Health check endpoint
app.get('/healthz', (c) => c.json({ ok: true }));

// Auth routes
app.mount('/api/auth', auth.handler);

// Quiz API handler
app.route('/api/quiz', quizRoute);

export default app;
