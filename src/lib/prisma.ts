import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL, max: 1 });

function isTransientConnectionError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /connect|connection|ECONNRESET|ETIMEDOUT|upstream/i.test(message);
}

function withRetry(client: PrismaClient) {
  return client.$extends({
    query: {
      $allModels: {
        async $allOperations({ args, query }) {
          try {
            return await query(args);
          } catch (error) {
            if (!isTransientConnectionError(error)) throw error;
            await new Promise((resolve) => setTimeout(resolve, 250));
            return await query(args);
          }
        },
      },
    },
  }) as unknown as PrismaClient;
}

export const prisma = globalForPrisma.prisma ?? withRetry(new PrismaClient({ adapter }));

globalForPrisma.prisma = prisma;
