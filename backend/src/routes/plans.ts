import { Router, type Response } from "express";
import { prisma } from "../prisma";
import { requireAuth } from "../middleware/auth";
import type { AuthedRequest } from "../middleware/auth";

const router = Router();

/**
 * ======================================================
 * Ownership helper methods
 * ======================================================
 * These helpers ensure the authenticated user owns
 * the resource they are trying to access or modify.
 *
 * Why:
 * - Prevents users from reading/updating/deleting other users’ data
 * - Centralizes access control logic (less repetition)
 */

/**
 * Returns true if a plan exists AND belongs to the user.
 */
async function assertPlanOwned(planId: string, userId: string) {
  const plan = await prisma.plan.findFirst({
    where: { id: planId, userId },
  });
  return !!plan;
}

/**
 * Returns a day only if it belongs to a plan owned by the user.
 */
async function getDayIfOwned(dayId: string, userId: string) {
  return prisma.day.findFirst({
    where: { id: dayId, plan: { userId } },
  });
}

/**
 * Returns a section only if it belongs to a day/plan owned by the user.
 */
async function getSectionIfOwned(sectionId: string, userId: string) {
  return prisma.section.findFirst({
    where: { id: sectionId, day: { plan: { userId } } },
  });
}

/**
 * Returns an exercise only if it belongs to a section/day/plan owned by the user.
 */
async function getExerciseIfOwned(exerciseId: string, userId: string) {
  return prisma.exercise.findFirst({
    where: { id: exerciseId, section: { day: { plan: { userId } } } },
  });
}

/**
 * ======================================================
 * DAYS
 * ======================================================
 */

/**
 * GET /plans/:planId/days
 *
 * Returns all days for a plan (ordered by dayOrder).
 * Security: plan must be owned by the authenticated user.
 */
router.get(
  "/plans/:planId/days",
  requireAuth,
  async (req: AuthedRequest<{ planId: string }>, res: Response) => {
    // Extract route param (typed as string)
    const { planId } = req.params;

    // Ensure authenticated user owns the plan
    const ok = await assertPlanOwned(planId, req.userId!);
    if (!ok) return res.status(404).json({ error: "Plan not found" });

    // Return plan days in order
    const days = await prisma.day.findMany({
      where: { planId },
      orderBy: { dayOrder: "asc" },
    });

    res.json(days);
  }
);

/**
 * POST /plans/:planId/days
 *
 * Body: { name?: string }
 *
 * Creates a new day for a plan and auto-creates 3 sections:
 * - warmup
 * - workout
 * - stretch
 *
 * Ordering:
 * - Calculates next dayOrder based on existing max dayOrder
 */
router.post(
  "/plans/:planId/days",
  requireAuth,
  async (req: AuthedRequest<{ planId: string }, any, { name?: string }>, res: Response) => {
    const { planId } = req.params;
    const { name } = (req.body ?? {}) as { name?: string };

    // Ensure user owns the plan
    const ok = await assertPlanOwned(planId, req.userId!);
    if (!ok) return res.status(404).json({ error: "Plan not found" });

    // Determine next day order (max + 1)
    const last = await prisma.day.findFirst({
      where: { planId },
      orderBy: { dayOrder: "desc" },
      select: { dayOrder: true },
    });
    const nextOrder = (last?.dayOrder ?? 0) + 1;

    // Default name if none provided
    const dayName = (name?.trim() || `Day ${nextOrder}`).trim();

    // Create the day and its default sections
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
  }
);

/**
 * PATCH /days/:dayId
 *
 * Body: { name: string }
 *
 * Renames a day (only if owned by user).
 */
router.patch(
  "/days/:dayId",
  requireAuth,
  async (req: AuthedRequest<{ dayId: string }, any, { name?: string }>, res: Response) => {
    const { dayId } = req.params;
    const { name } = (req.body ?? {}) as { name?: string };

    // Validate input
    if (!name?.trim()) return res.status(400).json({ error: "Name required" });

    // Ownership check: day must belong to current user (via plan)
    const day = await getDayIfOwned(dayId, req.userId!);
    if (!day) return res.status(404).json({ error: "Day not found" });

    // Update day name
    const updated = await prisma.day.update({
      where: { id: dayId },
      data: { name: name.trim() },
    });

    res.json(updated);
  }
);

/**
 * DELETE /days/:dayId
 *
 * Deletes a day owned by the user.
 * (Related child records depend on your Prisma schema cascading rules.)
 */
router.delete(
  "/days/:dayId",
  requireAuth,
  async (req: AuthedRequest<{ dayId: string }>, res: Response) => {
    const { dayId } = req.params;

    // Ownership check
    const day = await getDayIfOwned(dayId, req.userId!);
    if (!day) return res.status(404).json({ error: "Day not found" });

    // Delete the day
    await prisma.day.delete({ where: { id: dayId } });

    // 204 = No Content
    res.status(204).send();
  }
);

/**
 * ======================================================
 * SECTIONS
 * ======================================================
 */

/**
 * GET /days/:dayId/sections
 *
 * Returns all sections for a day (ordered by sectionOrder).
 * Security: day must belong to a plan owned by the user.
 */
router.get(
  "/days/:dayId/sections",
  requireAuth,
  async (req: AuthedRequest<{ dayId: string }>, res: Response) => {
    const { dayId } = req.params;

    // Ownership check
    const day = await getDayIfOwned(dayId, req.userId!);
    if (!day) return res.status(404).json({ error: "Day not found" });

    // Return sections in order
    const sections = await prisma.section.findMany({
      where: { dayId },
      orderBy: { sectionOrder: "asc" },
    });

    res.json(sections);
  }
);

/**
 * ======================================================
 * EXERCISES
 * ======================================================
 */

/**
 * GET /sections/:sectionId/exercises
 *
 * Returns exercises for a section (ordered by exerciseOrder).
 * Security: section must belong to a plan owned by the user.
 */
router.get(
  "/sections/:sectionId/exercises",
  requireAuth,
  async (req: AuthedRequest<{ sectionId: string }>, res: Response) => {
    const { sectionId } = req.params;

    // Ownership check
    const section = await getSectionIfOwned(sectionId, req.userId!);
    if (!section) return res.status(404).json({ error: "Section not found" });

    // Return exercises in order
    const exercises = await prisma.exercise.findMany({
      where: { sectionId },
      orderBy: { exerciseOrder: "asc" },
    });

    res.json(exercises);
  }
);

/**
 * GET /exercises/:exerciseId
 *
 * Returns a single exercise.
 * Security: exercise must belong to a plan owned by the user.
 */
router.get(
  "/exercises/:exerciseId",
  requireAuth,
  async (req: AuthedRequest<{ exerciseId: string }>, res: Response) => {
    const { exerciseId } = req.params;

    // Ownership check
    const ex = await getExerciseIfOwned(exerciseId, req.userId!);
    if (!ex) return res.status(404).json({ error: "Exercise not found" });

    res.json(ex);
  }
);

/**
 * POST /sections/:sectionId/exercises
 *
 * Body:
 * {
 *   name: string,
 *   mode: "reps" | "time",
 *   sets?, reps?,
 *   timeValue?, timeUnit?
 * }
 *
 * Creates an exercise and assigns the next exerciseOrder automatically.
 */
router.post(
  "/sections/:sectionId/exercises",
  requireAuth,
  async (
    req: AuthedRequest<
      { sectionId: string },
      any,
      {
        name?: string;
        mode?: "reps" | "time";
        sets?: number;
        reps?: string;
        timeValue?: number;
        timeUnit?: "sec" | "min" | "hour";
      }
    >,
    res: Response
  ) => {
    const { sectionId } = req.params;

    // Read and type request body
    const body = (req.body ?? {}) as {
      name?: string;
      mode?: "reps" | "time";
      sets?: number;
      reps?: string;
      timeValue?: number;
      timeUnit?: "sec" | "min" | "hour";
    };

    // Ownership check
    const section = await getSectionIfOwned(sectionId, req.userId!);
    if (!section) return res.status(404).json({ error: "Section not found" });

    // Validate name
    const name = body.name?.trim();
    if (!name) return res.status(400).json({ error: "Exercise name required" });

    // Validate mode
    const mode = body.mode;
    if (mode !== "reps" && mode !== "time") {
      return res.status(400).json({ error: "Mode must be 'reps' or 'time'" });
    }

    // Validate fields based on mode
    if (mode === "reps") {
      if (!body.sets || body.sets < 1) {
        return res.status(400).json({ error: "Sets required" });
      }
      if (!body.reps?.trim()) {
        return res.status(400).json({ error: "Reps required" });
      }
    }

    if (mode === "time") {
      if (!body.timeValue || body.timeValue < 1) {
        return res.status(400).json({ error: "Time value required" });
      }
      if (!body.timeUnit || !["sec", "min", "hour"].includes(body.timeUnit)) {
        return res.status(400).json({ error: "Invalid time unit" });
      }
    }

    // Determine next exercise order (max + 1 within the section)
    const last = await prisma.exercise.findFirst({
      where: { sectionId },
      orderBy: { exerciseOrder: "desc" },
      select: { exerciseOrder: true },
    });
    const nextOrder = (last?.exerciseOrder ?? 0) + 1;

    // Create exercise
    const created = await prisma.exercise.create({
      data: {
        sectionId,
        name,
        mode,
        exerciseOrder: nextOrder,

        // Store reps fields only if mode is "reps"
        sets: mode === "reps" ? body.sets : null,
        reps: mode === "reps" ? body.reps!.trim() : null,

        // Store time fields only if mode is "time"
        timeValue: mode === "time" ? body.timeValue! : null,
        timeUnit: mode === "time" ? body.timeUnit! : null,
      },
    });

    res.status(201).json(created);
  }
);

/**
 * PATCH /exercises/:exerciseId
 *
 * Updates an existing exercise.
 * Note:
 * - This currently allows any fields in `body`.
 * - If you want stricter validation, define a typed shape and whitelist fields.
 */
router.patch(
  "/exercises/:exerciseId",
  requireAuth,
  async (req: AuthedRequest<{ exerciseId: string }>, res: Response) => {
    const { exerciseId } = req.params;
    const body = (req.body ?? {}) as any;

    // Ownership check
    const ex = await getExerciseIfOwned(exerciseId, req.userId!);
    if (!ex) return res.status(404).json({ error: "Exercise not found" });

    // Update exercise
    const updated = await prisma.exercise.update({
      where: { id: exerciseId },
      data: body,
    });

    res.json(updated);
  }
);

/**
 * DELETE /exercises/:exerciseId
 *
 * Removes an exercise (only if owned by the user).
 */
router.delete(
  "/exercises/:exerciseId",
  requireAuth,
  async (req: AuthedRequest<{ exerciseId: string }>, res: Response) => {
    const { exerciseId } = req.params;

    // Ownership check
    const ex = await getExerciseIfOwned(exerciseId, req.userId!);
    if (!ex) return res.status(404).json({ error: "Exercise not found" });

    // Delete exercise
    await prisma.exercise.delete({ where: { id: exerciseId } });

    res.status(204).send();
  }
);

export default router;
