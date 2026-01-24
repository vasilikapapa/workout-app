import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

/**
 * Extended Express Request type.
 * Adds `userId` so authenticated routes can know
 * which user is making the request.
 */
export interface AuthedRequest extends Request {
  userId?: string;
}

/**
 * Authentication middleware.
 *
 * - Expects an Authorization header in the form:
 *   "Authorization: Bearer <JWT>"
 * - Verifies the JWT using JWT_SECRET
 * - Attaches the decoded userId to req.userId
 * - Blocks the request with 401 if anything is invalid
 */
export function requireAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  // Read Authorization header
  const header = req.headers.authorization;

  // No Authorization header provided
  if (!header) {
    return res.status(401).json({ error: "No token" });
  }

  // Extract token from "Bearer <token>"
  const token = header.split(" ")[1];

  // Header exists but token is missing or malformed
  if (!token) {
    return res.status(401).json({ error: "No token" });
  }

  try {
    // Verify and decode JWT
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    // Attach userId to request for downstream handlers
    req.userId = payload.userId;

    // Continue to the next middleware / route handler
    next();
  } catch {
    // Token is invalid or expired
    return res.status(401).json({ error: "Invalid token" });
  }
}
