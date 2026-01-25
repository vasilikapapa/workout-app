import { Router } from "express";
import { prisma } from "../prisma";
import { requireAuth } from "../middleware/auth";
import type { AuthedRequest } from "../middleware/auth";

const router = Router();

/**
 * =========================
 * Ownership helper methods
 * =========================
 * These helpers ensure the authenticated user owns
 * the resource they are trying to access or modify.
 */

async function assertPlanOwned(planId: string, userId: string) {
  // Check that the plan exists and belongs to the user
  const plan = await prisma.plan.findFirst({ where: { id: planId, userId } });
  return !!plan;
}

async function getDayIfOwned(dayId: string, userId: string) {
  // Get a day only if its parent plan belongs to the user
  return prisma.day.findFirst({
    where: { id: dayId, plan: { userId } },
  });
}

async function getSectionIfOwned(sectionId: string, userId: string) {
  // Get a section only if its parent day/plan belongs to the user
  return prisma.section.findFirst({
    where: { id: sectionId, day: { plan: { userId } } },
  });
}

async function getExerciseIfOwned(exerciseId: string, userId: string) {
  // Get an exercise only if its full hierarchy belongs to the user
  return prisma.exercise.findFirst({
    where: { id: exerciseId, section: { day: { plan: { userId } } } },
  });
}

/**
 * =========================
 * DAYS
 * =========================
 */

/**
 * GET /plans/:planId/days
 * Returns all days for a plan (ordered)
 */
router.get("/plans/:planId/days", requireAuth, async (req: AuthedRequest, res) => {
  const { planId } = req.params;

  // Ensure user owns the plan
  const ok = await assertPlanOwned(planId, req.userId!);
  if (!ok) return res.status(404).json({ error: "Plan not found" });

  const days = await prisma.day.findMany({
    where: { planId },
    orderBy: { dayOrder: "asc" },
  });

  res.json(days);
});

/**
 * POST /plans/:planId/days
 * body: { name?: string }
 *
 * Creates a new day and auto-creates 3 sections:
 * warmup, workout, stretch
 */
router.post("/plans/:planId/days", requireAuth, async (req: AuthedRequest, res) => {
  const { planId } = req.params;
  const { name } = (req.body ?? {}) as { name?: string };

  const ok = await assertPlanOwned(planId, req.userId!);
  if (!ok) return res.status(404).json({ error: "Plan not found" });

  // Determine next day order
  const last = await prisma.day.findFirst({
    where: { planId },
    orderBy: { dayOrder: "desc" },
    select: { dayOrder: true },
  });
  const nextOrder = (last?.dayOrder ?? 0) + 1;

  const dayName = (name?.trim() || `Day ${nextOrder}`).trim();

  const created = await prisma.day.create({
    data: {
      planId,
      name: dayName,
      dayOrder: nextOrder,
      sections: {
        create: [
          { type: "warmup", sectionOrder: 1 },
          { type: "workout", sectionOrder: 2 },
          { type: "stretch", sectionOrder: 3 },
        ],
      },
    },
    include: { sections: true },
  });

  res.status(201).json(created);
});

/**
 * PATCH /days/:dayId
 * body: { name: string }
 *
 * Renames a day
 */
router.patch("/days/:dayId", requireAuth, async (req: AuthedRequest, res) => {
  const { dayId } = req.params;
  const { name } = (req.body ?? {}) as { name?: string };

  if (!name?.trim()) return res.status(400).json({ error: "Name required" });

  const day = await getDayIfOwned(dayId, req.userId!);
  if (!day) return res.status(404).json({ error: "Day not found" });

  const updated = await prisma.day.update({
    where: { id: dayId },
    data: { name: name.trim() },
  });

  res.json(updated);
});

/**
 * DELETE /days/:dayId
 * Deletes a day and its related data
 */
router.delete("/days/:dayId", requireAuth, async (req: AuthedRequest, res) => {
  const { dayId } = req.params;

  const day = await getDayIfOwned(dayId, req.userId!);
  if (!day) return res.status(404).json({ error: "Day not found" });

  await prisma.day.delete({ where: { id: dayId } });
  res.status(204).send();
});

/**
 * =========================
 * SECTIONS
 * =========================
 */

/**
 * GET /days/:dayId/sections
 * Returns all sections for a day
 */
router.get("/days/:dayId/sections", requireAuth, async (req: AuthedRequest, res) => {
  const { dayId } = req.params;

  const day = await getDayIfOwned(dayId, req.userId!);
  if (!day) return res.status(404).json({ error: "Day not found" });

  const sections = await prisma.section.findMany({
    where: { dayId },
    orderBy: { sectionOrder: "asc" },
  });

  res.json(sections);
});

/**
 * =========================
 * EXERCISES
 * =========================
 */

/**
 * GET /sections/:sectionId/exercises
 * Returns exercises for a section
 */
router.get("/sections/:sectionId/exercises", requireAuth, async (req: AuthedRequest, res) => {
  const { sectionId } = req.params;

  const section = await getSectionIfOwned(sectionId, req.userId!);
  if (!section) return res.status(404).json({ error: "Section not found" });

  const exercises = await prisma.exercise.findMany({
    where: { sectionId },
    orderBy: { exerciseOrder: "asc" },
  });

  res.json(exercises);
});

/**
 * GET /exercises/:exerciseId
 * Returns a single exercise
 */
router.get("/exercises/:exerciseId", requireAuth, async (req: AuthedRequest, res) => {
  const { exerciseId } = req.params;

  const ex = await getExerciseIfOwned(exerciseId, req.userId!);
  if (!ex) return res.status(404).json({ error: "Exercise not found" });

  res.json(ex);
});

/**
 * POST /sections/:sectionId/exercises
 *
 * body:
 * {
 *   name: string,
 *   mode: "reps" | "time",
 *   sets?, reps?,
 *   timeValue?, timeUnit?
 * }
 *
 * Creates an exercise with automatic ordering
 */
router.post("/sections/:sectionId/exercises", requireAuth, async (req: AuthedRequest, res) => {
  const { sectionId } = req.params;

  const body = (req.body ?? {}) as {
    name?: string;
    mode?: "reps" | "time";
    sets?: number;
    reps?: string;
    timeValue?: number;
    timeUnit?: "sec" | "min" | "hour";
  };

  const section = await getSectionIfOwned(sectionId, req.userId!);
  if (!section) return res.status(404).json({ error: "Section not found" });

  const name = body.name?.trim();
  if (!name) return res.status(400).json({ error: "Exercise name required" });

  const mode = body.mode;
  if (mode !== "reps" && mode !== "time") {
    return res.status(400).json({ error: "Mode must be 'reps' or 'time'" });
  }

  // Validate reps mode
  if (mode === "reps") {
    if (!body.sets || body.sets < 1) return res.status(400).json({ error: "Sets required" });
    if (!body.reps?.trim()) return res.status(400).json({ error: "Reps required" });
  }

  // Validate time mode
  if (mode === "time") {
    if (!body.timeValue || body.timeValue < 1) {
      return res.status(400).json({ error: "Time value required" });
    }

    if (!["sec", "min", "hour"].includes(body.timeUnit!)) {
      return res.status(400).json({ error: "Invalid time unit" });
    }
  }

  // Determine next exercise order
  const last = await prisma.exercise.findFirst({
    where: { sectionId },
    orderBy: { exerciseOrder: "desc" },
    select: { exerciseOrder: true },
  });
  const nextOrder = (last?.exerciseOrder ?? 0) + 1;

  const created = await prisma.exercise.create({
    data: {
      sectionId,
      name,
      mode,
      exerciseOrder: nextOrder,
      sets: mode === "reps" ? body.sets : null,
      reps: mode === "reps" ? body.reps!.trim() : null,
      timeValue: mode === "time" ? body.timeValue! : null,
      timeUnit: mode === "time" ? body.timeUnit! : null,
    },
  });

  res.status(201).json(created);
});

/**
 * PATCH /exercises/:exerciseId
 * Updates an existing exercise
 */
router.patch("/exercises/:exerciseId", requireAuth, async (req: AuthedRequest, res) => {
  const { exerciseId } = req.params;
  const body = (req.body ?? {}) as any;

  const ex = await getExerciseIfOwned(exerciseId, req.userId!);
  if (!ex) return res.status(404).json({ error: "Exercise not found" });

  const updated = await prisma.exercise.update({
    where: { id: exerciseId },
    data: body,
  });

  res.json(updated);
});

/**
 * DELETE /exercises/:exerciseId
 * Removes an exercise
 */
router.delete("/exercises/:exerciseId", requireAuth, async (req: AuthedRequest, res) => {
  const { exerciseId } = req.params;

  const ex = await getExerciseIfOwned(exerciseId, req.userId!);
  if (!ex) return res.status(404).json({ error: "Exercise not found" });

  await prisma.exercise.delete({ where: { id: exerciseId } });
  res.status(204).send();
});

export default router;
