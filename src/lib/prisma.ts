import { PrismaClient } from '@prisma/client';

// One PrismaClient for the whole app. In dev, Next.js hot reload re-runs modules,
// so we park the client on globalThis to avoid opening a new pool every save.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
