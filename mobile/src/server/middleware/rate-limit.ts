import { rateLimiter } from 'hono-rate-limiter';

export const strictRateLimit = rateLimiter({
  windowMs: 60_000, // 1 minute
  limit: 30,
  keyGenerator: (c) => c.req.header('x-forwarded-for') ?? 'anon',
  message: { error: 'Too many requests. Please wait a moment.' },
});

export const lenientRateLimit = rateLimiter({
  windowMs: 60_000, // 1 minute
  limit: 120,
  keyGenerator: (c) => c.req.header('x-forwarded-for') ?? 'anon',
  message: { error: 'Too many requests.' },
});
