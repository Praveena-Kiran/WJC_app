/**
 * auth.ts — Better Auth server instance
 *
 * Configures better-auth with:
 *   - Prisma adapter (Neon Postgres)
 *   - Email/password auth
 *   - Expo plugin (deep-link redirect support for mobile)
 *
 * Server-only — do NOT import from client-side code.
 * Client-side auth lives in src/lib/auth-client.ts (Issue #009).
 */
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { expo } from '@better-auth/expo';
import { prisma } from './db';

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),

  secret: process.env.BETTER_AUTH_SECRET!,

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    // Email verification is off for MVP — enable once email transport is configured.
    // See Issue #009b (email verification flow).
    requireEmailVerification: false,
  },

  // Trusted origins — allows deep-link redirects from the Expo app.
  // 'zengo://' matches the scheme defined in app.json.
  // 'exp://' allows Expo Go dev redirects.
  trustedOrigins: ['zengo://', 'exp://', 'exp://**'],

  plugins: [
    expo(), // Expo plugin: handles cookie storage via expo-secure-store
  ],

  // socialProviders: {
  //   google: { clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET! },
  // },
});

export type Auth = typeof auth;
