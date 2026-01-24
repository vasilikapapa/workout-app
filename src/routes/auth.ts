import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma.js";

/**
 * Auth router
 * Handles user registration and login
 */
const router = Router();

/**
 * POST /auth/register
 *
 * Body:
 * {
 *   email: string,
 *   password: string
 * }
 *
 * - Validates input
 * - Normalizes email (trim + lowercase)
 * - Checks for existing user
 * - Hashes password with bcrypt
 * - Creates user in database
 * - Returns JWT + user info
 */
router.post("/auth/register", async (req, res) => {
  // Safely extract body (prevents crash if body is undefined)
  const { email, password } = (req.body ?? {}) as {
    email?: string;
    password?: string;
  };

  // Debug logs (can be removed in production)
  console.log("headers:", req.headers["content-type"]);
  console.log("body:", req.body);

  // Basic type validation
  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "Email and password required" });
  }

  // Normalize and validate values
  const emailNorm = email.trim().toLowerCase();
  if (!emailNorm || !password.trim()) {
    return res.status(400).json({ error: "Email and password required" });
  }

  // Check if user already exists
  const exists = await prisma.user.findUnique({
    where: { email: emailNorm },
  });
  if (exists) {
    return res.status(400).json({ error: "Email already used" });
  }

  // Hash password before saving
  const hash = await bcrypt.hash(password, 10);

  // Create user in database
  const user = await prisma.user.create({
    data: {
      email: emailNorm,
      password: hash,
    },
  });

  // Create JWT token (longer expiry for registration)
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  // Return token and minimal user info
  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
    },
  });
});

/**
 * POST /auth/login
 *
 * Body:
 * {
 *   email: string,
 *   password: string
 * }
 *
 * - Validates input
 * - Normalizes email
 * - Verifies user exists
 * - Compares password hash
 * - Returns JWT + user info
 */
router.post("/auth/login", async (req, res) => {
  // Safely extract body
  const { email, password } = (req.body ?? {}) as {
    email?: string;
    password?: string;
  };

  // Validate input types
  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "Email and password required" });
  }

  // Normalize and validate values
  const emailNorm = email.trim().toLowerCase();
  if (!emailNorm || !password.trim()) {
    return res.status(400).json({ error: "Email and password required" });
  }

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: emailNorm },
  });
  if (!user) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  // Compare password with stored hash
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  // Create JWT token (shorter expiry for login)
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" }
  );

  // Return token and minimal user info
  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
    },
  });
});

export default router;
