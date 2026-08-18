import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as { 
  prisma_v2?: PrismaClient;
  pool_v2?: Pool;
};

const connectionString = process.env.DATABASE_URL;

const pool = globalForPrisma.pool_v2 || new Pool({ 
  connectionString,
  max: 2, // Strict limit per serverless function to prevent Supabase connection exhaustion
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 5000,
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.pool_v2 = pool;
}

const adapter = new PrismaPg(pool);

export const prisma = globalForPrisma.prisma_v2 || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma_v2 = prisma;
}
