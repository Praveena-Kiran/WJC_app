/**
 * progress.ts — /api/progress GET + PUT handler
 *
 * GET /api/progress
 *   Returns merged { profile, progress, srsDue } for the authenticated user.
 *   If UserProfile/UserProgress don't exist (edge case for pre-hook users),
 *   creates them with defaults on first GET.
 *
 * PUT /api/progress
 *   Partial upsert of UserProfile and/or UserProgress.
 *   Body: { profile?: Partial<UserProfile>, progress?: Partial<UserProgress> }
 *   userId is ALWAYS derived from the session — never trusted from client body.
 *
 * Authentication: via better-auth session cookie (Cookie header).
 * Returns 401 if no valid session is found.
 *
 * Closes #012
 */
import { Hono } from 'hono';
import { auth } from '../auth';
import { prisma } from '../db';

export const progressRoute = new Hono();

// ── GET /api/progress ─────────────────────────────────────────────────────────
progressRoute.get('/', async (c) => {
  // Authenticate via better-auth session
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session?.user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  const userId = session.user.id;

  // Fetch profile — create defaults if missing (pre-hook users)
  let profile = await prisma.userProfile.findUnique({ where: { userId } });
  if (!profile) {
    profile = await prisma.userProfile.create({
      data: { userId, role: 'external', studyMode: 'zen', targetJlptLevel: 'N5' },
    });
  }

  // Fetch progress — create defaults if missing
  let progress = await prisma.userProgress.findUnique({ where: { userId } });
  if (!progress) {
    progress = await prisma.userProgress.create({
      data: {
        userId,
        solvedLessons: [1],
        solvedNodes: [1],
        activeLessonId: 1,
        streakCount: 0,
      },
    });
  }

  // SRS cards due now (dueDate <= now)
  const srsDue = await prisma.srsCard.findMany({
    where: { userId, dueDate: { lte: new Date() } },
    orderBy: { dueDate: 'asc' },
  });

  return c.json({ profile, progress, srsDue });
});

// ── PUT /api/progress ─────────────────────────────────────────────────────────
progressRoute.put('/', async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session?.user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  const userId = session.user.id;

  const body = await c.req.json<{
    profile?: Record<string, unknown>;
    progress?: Record<string, unknown>;
  }>();

  let updatedProfile = null;
  let updatedProgress = null;

  if (body.profile && Object.keys(body.profile).length > 0) {
    // Strip userId from the update payload — it must come from the session.
    const { userId: _ignored, ...profileData } = body.profile as Record<string, unknown>;
    updatedProfile = await prisma.userProfile.upsert({
      where: { userId },
      create: { userId, ...(profileData as any) },
      update: profileData as any,
    });
  }

  if (body.progress && Object.keys(body.progress).length > 0) {
    const { userId: _ignored, ...progressData } = body.progress as Record<string, unknown>;
    updatedProgress = await prisma.userProgress.upsert({
      where: { userId },
      create: { userId, ...(progressData as any) },
      update: progressData as any,
    });
  }

  return c.json({ profile: updatedProfile, progress: updatedProgress });
});
