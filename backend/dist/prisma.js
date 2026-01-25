"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
/**
 * =========================
 * Database connection setup
 * =========================
 *
 * Prisma v7 requires an adapter when using direct database connections.
 * Here we use the PostgreSQL adapter with a connection pool.
 */
// Create a PostgreSQL connection pool using the DATABASE_URL
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
// Create a Prisma adapter backed by the PostgreSQL pool
const adapter = new adapter_pg_1.PrismaPg(pool);
/**
 * Prisma client instance
 *
 * This is the single Prisma client used across the app.
 * Import this instance wherever database access is needed.
 */
exports.prisma = new client_1.PrismaClient({ adapter });
