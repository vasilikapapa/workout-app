import "dotenv/config";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";

import authRouter from "./routes/auth.js";
import plans from "./routes/plans.js";
import { prisma } from "./prisma.js";
import { requireAuth } from "./middleware/auth.js";
import type { AuthedRequest } from "./middleware/auth.js";

/**
 * =========================
 * App initialization
 * =========================
 */
const app = express();

/**
 * =========================
 * Global middleware
 * =========================
 */

// Enable CORS so the mobile app / frontend can call the API
app.use(cors());

// Parse incoming JSON bodies
app.use(express.json());

// If you ever want to support form-urlencoded requests,
// uncomment the line below
// app.use(express.urlencoded({ extended: true }));

/**
 * =========================
 * Route mounting
 * =========================
 */

// Authentication routes (register / login)
app.use(authRouter);

// Plans, days, sections, exercises routes
app.use(plans);

/**
 * =========================
 * Utility functions
 * =========================
 */

/**
 * Signs a JWT for a user
 * @param userId - authenticated user ID
 */
function signToken(userId: string) {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "7d" });
}

/**
 * =========================
 * Health check
 * =========================
 */

// Used to verify that the API is running and reachable
app.get("/health", (_req, res) => res.json({ ok: true }));

/**
 * =========================
 * Plans (user-scoped)
 * =========================
 */

/**
 * GET /plans
 * Returns all plans belonging to the authenticated user
 */
app.get("/plans", requireAuth, async (req: AuthedRequest, res) => {
  const plans = await prisma.plan.findMany({
    where: { userId: req.userId! },
    orderBy: { createdAt: "desc" },
  });

  res.json(plans);
});

/**
 * POST /plans
 * body: { title: string }
 *
 * Creates a new plan for the authenticated user
 */
app.post("/plans", requireAuth, async (req: AuthedRequest, res) => {
  const { title } = req.body as { title?: string };

  // Validate input
  if (!title?.trim()) {
    return res.status(400).json({ error: "Title required" });
  }

  const plan = await prisma.plan.create({
    data: {
      title: title.trim(),
      userId: req.userId!,
    },
  });

  res.status(201).json(plan);
});

/**
 * PATCH /plans/:id
 * body: { title: string }
 *
 * Renames an existing plan (only if owned by user)
 */
app.patch("/plans/:id", requireAuth, async (req: AuthedRequest, res) => {
  const { id } = req.params;
  const { title } = req.body as { title?: string };

  if (!title?.trim()) {
    return res.status(400).json({ error: "Title required" });
  }

  // Ensure the plan belongs to the user
  const plan = await prisma.plan.findFirst({
    where: { id, userId: req.userId! },
  });

  if (!plan) {
    return res.status(404).json({ error: "Not found" });
  }

  const updated = await prisma.plan.update({
    where: { id },
    data: { title: title.trim() },
  });

  res.json(updated);
});

/**
 * DELETE /plans/:id
 *
 * Deletes a plan owned by the user
 */
app.delete("/plans/:id", requireAuth, async (req: AuthedRequest, res) => {
  const { id } = req.params;

  // Ensure the plan belongs to the user
  const plan = await prisma.plan.findFirst({
    where: { id, userId: req.userId! },
  });

  if (!plan) {
    return res.status(404).json({ error: "Not found" });
  }

  await prisma.plan.delete({ where: { id } });

  res.status(204).send();
});

/**
 * =========================
 * Server startup
 * =========================
 */

const port = Number(process.env.PORT || 4000);

// Listen on all network interfaces so mobile devices can reach the API
app.listen(port, "0.0.0.0", () => {
  console.log(`API running on http://localhost:${port}`);
});
