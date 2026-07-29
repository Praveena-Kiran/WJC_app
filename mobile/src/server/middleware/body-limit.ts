import { bodyLimit } from 'hono/body-limit';

export const apiBodyLimit = bodyLimit({
  maxSize: 1 * 1024 * 1024, // 1 MB limit
  onError: (c) => c.json({ error: 'Payload too large' }, 413),
});
