/**
 * auth.ts — Better Auth server instance
 *
 * Configures better-auth with:
 *   - Prisma adapter (Neon Postgres)
 *   - Email/password auth
 *   - Expo plugin (deep-link redirect support for mobile)
 *
 * Server-only — do NOT import from client-side code.
 * Client-side auth lives in src/auth-client.ts (Issue #009).
 *
 * Issue #007: Fixed adapter import path + provider string.
 * Issue #012b: databaseHooks for auto-creating UserProfile/UserProgress on signup.
 */
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { expo } from '@better-auth/expo';
import { prisma } from './db';

// Build trusted origins dynamically so dev localhost works.
const trustedOrigins: string[] = ['zengo://', 'exp://', 'exp://**'];
if (process.env.NODE_ENV === 'development') {
  trustedOrigins.push('http://localhost:8081', 'http://localhost:*');
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),

  secret: process.env.BETTER_AUTH_SECRET!,

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    // Email verification is off for MVP — enable once email transport is configured.
    requireEmailVerification: false,
  },

  trustedOrigins,

  plugins: [
    expo(), // Expo plugin: handles cookie storage via expo-secure-store
  ],

  // Issue #012b: auto-create default UserProfile + UserProgress on every new signup.
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            await prisma.userProfile.create({
              data: {
                userId: user.id,
                role: 'external',
                studyMode: 'zen',
                targetJlptLevel: 'N5',
              },
            });
            await prisma.userProgress.create({
              data: {
                userId: user.id,
                solvedLessons: [1],
                solvedNodes: [1],
                activeLessonId: 1,
                streakCount: 0,
              },
            });
          } catch (err) {
            // Log and re-throw: signup should fail if profile creation fails.
            console.error('[auth] Failed to create default UserProfile/UserProgress:', err);
            throw err;
          }
        },
      },
    },
  },

  // socialProviders: {
  //   google: { clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET! },
  // },
});

export type Auth = typeof auth;
