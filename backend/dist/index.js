"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = __importDefault(require("./routes/auth"));
const plans_1 = __importDefault(require("./routes/plans"));
const prisma_1 = require("./prisma");
const auth_2 = require("./middleware/auth");
/**
 * ======================================================
 * App initialization
 * ======================================================
 */
const app = (0, express_1.default)();
/**
 * ======================================================
 * Global middleware
 * ======================================================
 */
// Enable CORS so frontend / mobile clients can access the API
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://workout-k920w7mg3-vasilika-papas-projects.vercel.app",
    ],
    credentials: true,
}));
// Parse incoming JSON request bodies
app.use(express_1.default.json());
// Optional: enable form-urlencoded bodies if needed later
// app.use(express.urlencoded({ extended: true }));
/**
 * ======================================================
 * Route mounting
 * ======================================================
 */
// Authentication routes (register / login)
app.use(auth_1.default);
// Plans, days, sections, exercises routes
app.use(plans_1.default);
/**
 * ======================================================
 * Utility helpers
 * ======================================================
 */
/**
 * Signs a JWT for an authenticated user
 * @param userId - database user ID
 */
function signToken(userId) {
    return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
}
/**
 * ======================================================
 * Health check
 * ======================================================
 */
/**
 * GET /health
 * Used by hosting providers or monitoring tools
 * to verify the API is running.
 */
app.get("/health", (_req, res) => {
    res.json({ ok: true });
});
/**
 * ======================================================
 * Plans (user-scoped)
 * ======================================================
 */
/**
 * GET /plans
 *
 * Returns all plans owned by the authenticated user.
 */
app.get("/plans", auth_2.requireAuth, async (req, res) => {
    const plans = await prisma_1.prisma.plan.findMany({
        where: { userId: req.userId },
        orderBy: { createdAt: "desc" },
    });
    res.json(plans);
});
/**
 * POST /plans
 *
 * Body:
 *   { title: string }
 *
 * Creates a new plan for the authenticated user.
 */
app.post("/plans", auth_2.requireAuth, async (req, res) => {
    const { title } = req.body;
    // Validate input
    if (!title?.trim()) {
        return res.status(400).json({ error: "Title required" });
    }
    const plan = await prisma_1.prisma.plan.create({
        data: {
            title: title.trim(),
            userId: req.userId,
        },
    });
    res.status(201).json(plan);
});
/**
 * PATCH /plans/:id
 *
 * Body:
 *   { title: string }
 *
 * Renames a plan (only if owned by the user).
 */
app.patch("/plans/:id", auth_2.requireAuth, async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    if (!title?.trim()) {
        return res.status(400).json({ error: "Title required" });
    }
    // Verify ownership
    const plan = await prisma_1.prisma.plan.findFirst({
        where: { id, userId: req.userId },
    });
    if (!plan) {
        return res.status(404).json({ error: "Not found" });
    }
    const updated = await prisma_1.prisma.plan.update({
        where: { id },
        data: { title: title.trim() },
    });
    res.json(updated);
});
/**
 * DELETE /plans/:id
 *
 * Deletes a plan owned by the authenticated user.
 */
app.delete("/plans/:id", auth_2.requireAuth, async (req, res) => {
    const { id } = req.params;
    // Verify ownership
    const plan = await prisma_1.prisma.plan.findFirst({
        where: { id, userId: req.userId },
    });
    if (!plan) {
        return res.status(404).json({ error: "Not found" });
    }
    await prisma_1.prisma.plan.delete({ where: { id } });
    // 204 = No Content
    res.status(204).send();
});
/**
 * ======================================================
 * Server startup
 * ======================================================
 */
const port = Number(process.env.PORT || 4000);
// Listen on all interfaces so external clients can connect
app.listen(port, "0.0.0.0", () => {
    console.log(`API running on http://localhost:${port}`);
});
