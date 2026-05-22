import { PrismaClient } from '@/app/generated/prisma'

// Singleton para evitar múltiples instancias de PrismaClient en desarrollo
const globalParaPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalParaPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalParaPrisma.prisma = prisma
}
