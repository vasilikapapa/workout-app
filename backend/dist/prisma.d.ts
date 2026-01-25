import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
/**
 * Prisma client instance
 *
 * This is the single Prisma client used across the app.
 * Import this instance wherever database access is needed.
 */
export declare const prisma: PrismaClient<{
    adapter: PrismaPg;
}, never, import("@prisma/client/runtime/client").DefaultArgs>;
//# sourceMappingURL=prisma.d.ts.map