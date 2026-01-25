import "dotenv/config";
import { defineConfig, env } from "prisma/config";

/**
 * =========================
 * Prisma configuration
 * =========================
 *
 * This file is required for Prisma v7+
 * to define datasource configuration
 * outside of `schema.prisma`.
 *
 * It allows Prisma CLI commands (migrate, generate)
 * to know how to connect to the database.
 */

export default defineConfig({
  // Path to the Prisma schema file
  schema: "prisma/schema.prisma",

  /**
   * Datasource configuration
   *
   * - The database connection string is read
   *   from the DATABASE_URL environment variable
   * - dotenv/config loads variables from `.env`
   */
  datasource: {
    url: env("DATABASE_URL"),
  },
});
