import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { auth } from '../auth';
import { prisma } from '../db';

export const adminRoute = new Hono<{ Variables: { userId: string } }>();

// Require admin authentication middleware
adminRoute.use('*', async (c, next) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const profile = await prisma.userProfile.findUnique({
    where: { userId: session.user.id },
  });

  const role = profile?.role?.toUpperCase();
  if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
    return c.json({ error: 'Forbidden: Admin access required' }, 403);
  }

  c.set('userId', session.user.id);
  await next();
});

// GET /api/admin/users (paginated & filterable user list)
adminRoute.get('/users', async (c) => {
  const role = c.req.query('role');
  const search = c.req.query('search');
  const page = parseInt(c.req.query('page') || '1', 10);
  const limit = 20;

  const users = await prisma.user.findMany({
    where: {
      ...(search
        ? {
            OR: [
              { email: { contains: search, mode: 'insensitive' } },
              { name: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(role
        ? {
            userProfile: {
              role: { equals: role, mode: 'insensitive' },
            },
          }
        : {}),
    },
    include: {
      userProfile: true,
    },
    take: limit,
    skip: (page - 1) * limit,
    orderBy: { createdAt: 'desc' },
  });

  return c.json({ success: true, data: users });
});

// PATCH /api/admin/users/:id/role (update user role)
const roleUpdateSchema = z.object({
  role: z.enum(['external', 'woxsen-student', 'teacher', 'SUPER_ADMIN', 'ADMIN']),
});

adminRoute.patch('/users/:id/role', zValidator('json', roleUpdateSchema), async (c) => {
  const userId = c.req.param('id');
  const { role } = c.req.valid('json');
  const actorId = c.get('userId');

  const profile = await prisma.userProfile.upsert({
    where: { userId },
    update: { role },
    create: { userId, role },
  });

  await prisma.auditEvent.create({
    data: {
      actorId,
      action: 'USER_ROLE_UPDATE',
      targetId: userId,
      payload: { newRole: role },
    },
  });

  return c.json({ success: true, data: profile });
});

// POST /api/admin/users/batch (bulk account creation)
const batchUsersSchema = z.object({
  users: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      email: z.string().email(),
      role: z.string().default('woxsen-student'),
    })
  ),
});

adminRoute.post('/users/batch', zValidator('json', batchUsersSchema), async (c) => {
  const { users } = c.req.valid('json');
  const actorId = c.get('userId');

  const created = [];
  for (const u of users) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name },
      create: {
        id: u.id,
        name: u.name,
        email: u.email,
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        userProfile: {
          create: { role: u.role },
        },
      },
    });
    created.push(user);
  }

  await prisma.auditEvent.create({
    data: {
      actorId,
      action: 'BATCH_USER_CREATE',
      payload: { count: created.length },
    },
  });

  return c.json({ success: true, data: created });
});

// GET /api/admin/audit (system audit logs)
adminRoute.get('/audit', async (c) => {
  const logs = await prisma.auditEvent.findMany({
    take: 50,
    orderBy: { timestamp: 'desc' },
  });

  return c.json({ success: true, data: logs });
});

// GET /api/admin/health (system health & metrics)
adminRoute.get('/health', async (c) => {
  const startTime = Date.now();
  await prisma.$queryRaw`SELECT 1`;
  const dbLatencyMs = Date.now() - startTime;

  const metrics = {
    status: 'healthy',
    dbLatencyMs,
    uptimeSeconds: process.uptime(),
    memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
  };

  return c.json({ success: true, data: metrics });
});
