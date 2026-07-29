/**
 * db.ts — Prisma client singleton
 *
 * Uses globalThis to prevent multiple PrismaClient instances during
 * hot-reloads in development (Next.js / tsx watch pattern).
 * Server-only — do NOT import from client-side code.
 */
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
