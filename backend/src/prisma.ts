import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

/**
 * =========================
 * Database connection setup
 * =========================
 *
 * Prisma v7 requires an adapter when using direct database connections.
 * Here we use the PostgreSQL adapter with a connection pool.
 */

// Create a PostgreSQL connection pool using the DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create a Prisma adapter backed by the PostgreSQL pool
const adapter = new PrismaPg(pool);

/**
 * Prisma client instance
 *
 * This is the single Prisma client used across the app.
 * Import this instance wherever database access is needed.
 */
export const prisma = new PrismaClient({ adapter });
